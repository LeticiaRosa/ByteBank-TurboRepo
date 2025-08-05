# Multi-stage Dockerfile para desenvolvimento
# Base image com Node.js 20
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy all workspace files (simplified approach)
COPY . .

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Development stage
FROM base AS development
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy everything from deps stage
COPY --from=deps /app ./

# Expose ports for development
EXPOSE 3001 3002

# Default command for development
CMD ["pnpm", "dev"]


