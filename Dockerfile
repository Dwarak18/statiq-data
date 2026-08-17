# ==============================================================================
# STATIQONE Backend Production Dockerfile
# Base Image: Node.js 20 Alpine Linux
# ==============================================================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

# Install build dependencies for native compilation (Argon2, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency specifications
COPY authsystem/backend/package*.json ./
RUN npm ci

# Copy backend source code and migrations
COPY authsystem/backend/ ./

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for container health check probes
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=4000

# Run container as non-root user
USER node

# Copy built application and node_modules from builder
COPY --chown=node:node --from=builder /app /app

EXPOSE 4000

# Health check probe against Express /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

CMD ["node", "src/server.js"]
