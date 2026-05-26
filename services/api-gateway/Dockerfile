# ── Stage 1: Builder ──────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Kopier package files lwwl (cache optimization)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# ── Stage 2: Production ───────────────────
FROM node:20-alpine AS production

# Security: makhddmsh root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Kopier mn builder ghir node_modules
COPY --from=builder /app/node_modules ./node_modules

# Kopier source code
COPY --chown=nodeuser:nodejs . .

# Switch lal non-root user
USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]