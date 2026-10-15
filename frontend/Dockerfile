# ==============================================================================
# ChennaiNest Frontend - Multi-Stage Production Dockerfile
# Stage 1: Build static React / Vite bundle
# Stage 2: Serve with Nginx Alpine + Reverse Proxy to Backend
# ==============================================================================

# Stage 1: Build React/Vite bundle
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Clean install dependencies
RUN npm ci

# Copy source files
COPY . ./

# Set environment variable for reverse proxy API routing
ENV VITE_API_BASE_URL=/api

# Build production bundle
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration with reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check verifying Nginx is responding via 127.0.0.1
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
