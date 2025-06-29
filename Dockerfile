# Food Store Ecommerce Platform - Docker Configuration
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    sqlite

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy application code
COPY . .

# Build the Next.js application
WORKDIR /app/client
RUN npm run build

# Go back to app directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/server/uploads
RUN mkdir -p /app/server/data

# Set permissions
RUN chmod +x /app/start.sh
RUN chmod +x /app/setup-categories.js
RUN chmod +x /app/docker_run.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3000 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV NEXT_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start command
CMD ["bash", "./start.sh"]
