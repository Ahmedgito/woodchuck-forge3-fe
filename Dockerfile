# Stage 1: Base
FROM node:20-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
RUN npm config set legacy-peer-deps true
WORKDIR /app
COPY package*.json ./
ENV NODE_OPTIONS=--max_old_space_size=4096
EXPOSE 3000


# Stage 2: Builder
FROM base as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Stage 3: Production
FROM base as production
ENV NODE_ENV=production
WORKDIR /app

# Create non-root user FIRST
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copy built app
COPY --from=builder /app ./

# Ensure proper permissions for Next.js cache
RUN mkdir -p /app/.next/cache/images && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
