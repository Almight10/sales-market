# Dockerfile for Next.js App
FROM --platform=linux/amd64 node:20-slim AS builder

# Install OpenSSL for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies to run build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Runner stage
FROM --platform=linux/amd64 node:20-slim AS runner

# Install OpenSSL for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/seed.js ./seed.js

EXPOSE 3000

# Script to sync db schema, seed and start Next.js
CMD ["sh", "-c", "npx prisma db push && node seed.js && npm run start"]
