import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/?oauth_error=no_code', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;

  try {
    // 1. Tukar authorization code dengan access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/?oauth_error=token_exchange_failed', request.url));
    }

    const { access_token } = tokenData;

    // 2. Ambil informasi profile user dari Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Google user info error:', userData);
      return NextResponse.redirect(new URL('/?oauth_error=user_info_failed', request.url));
    }

    const { email, name } = userData;

    if (!email) {
      return NextResponse.redirect(new URL('/?oauth_error=no_email', request.url));
    }

    // 3. Cari atau daftarkan user ke database jika belum terdaftar
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          role: 'Staff',
          status: 'Aktif',
        },
      });
    }

    // 4. Redirect ke halaman utama dengan tanda sukses
    return NextResponse.redirect(new URL('/?oauth_success=true', request.url));
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.redirect(new URL('/?oauth_error=server_error', request.url));
  }
}
