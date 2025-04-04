# frontend/Dockerfile

# --- Build Stage ---
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS build

# Install pnpm globally
ARG PNPM_VERSION=9
RUN npm install -g pnpm@${PNPM_VERSION}

# Set working directory
WORKDIR /app

# Copy manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
# Copy other workspace manifests needed for install resolution
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Copy all source code (needed for build)
COPY frontend ./frontend
COPY backend ./backend
COPY shared ./shared

# Install ALL dependencies at the root
RUN pnpm install --frozen-lockfile --prod=false

# Build the frontend static site
RUN cd frontend && pnpm exec nuxt generate

# --- Production Stage ---
FROM nginx:alpine

# Copy the nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files
COPY --from=build /app/frontend/.output/public /usr/share/nginx/html

# Expose port 8080 (standard for Fly.io)
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -qO- http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 