import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Dashboard - Load Balanced',
  description: 'Enterprise ready robust and scalable Next.js application dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-[hsl(var(--background))] text-[hsl(var(--foreground))] selection:bg-primary selection:text-primary-foreground`}>
        {children}
      </body>
    </html>
  );
}
