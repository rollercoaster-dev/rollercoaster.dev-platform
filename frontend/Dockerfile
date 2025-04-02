# frontend/Dockerfile

# Use an official Node.js LTS image
# Check Nuxt 3 documentation for recommended Node version if needed
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

# Install pnpm globally
ARG PNPM_VERSION=9
RUN npm install -g pnpm@${PNPM_VERSION}

# Set working directory
WORKDIR /app

# Copy manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/ # Needed for install if it resolves workspaces
COPY shared/package.json ./shared/

# Copy all source code
COPY frontend ./frontend
COPY backend ./backend
COPY shared ./shared

# Install ALL dependencies at the root
RUN pnpm install --frozen-lockfile --prod=false

# Build the frontend package from the root
RUN pnpm --filter=frontend run build
# Expected output: /app/frontend/.output

# --- Setup Production Stage ---
FROM node:${NODE_VERSION}-slim AS production

WORKDIR /app/frontend

# Copy frontend build artifacts
COPY --from=base /app/frontend/.output ./.output

# Copy hoisted node_modules and necessary package files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/frontend/package.json ./package.json

# Define the default port the application listens on (Nuxt default is 3000)
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Define the command to run the built Nuxt application
# Path is relative to the WORKDIR /app/frontend
CMD ["node", ".output/server/index.mjs"] 