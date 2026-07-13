# Dockerfile for CRM Service
FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (only production)
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3001

ENV PORT=3001

CMD ["npm", "start"]
