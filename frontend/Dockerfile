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
# Copy other workspace manifests needed for install resolution
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Copy all source code (needed for build and deploy steps)
COPY frontend ./frontend
COPY backend ./backend
COPY shared ./shared

# Install ALL dependencies at the root
RUN pnpm install --frozen-lockfile --prod=false

# Build the frontend package from the root
RUN cd frontend && pnpm exec nuxt build
# Expected output: /app/frontend/.output

# --- Setup Production Stage ---
FROM node:${NODE_VERSION}-slim AS production

# Install pnpm globally
RUN npm install -g pnpm@9

# Set WORKDIR for the final application
WORKDIR /app

# Copy workspace files
COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=base /app/frontend/package.json ./frontend/
COPY --from=base /app/shared/package.json ./shared/

# Copy the built application files
COPY --from=base /app/frontend/.nuxt ./frontend/.nuxt
COPY --from=base /app/frontend/.output ./frontend/.output
COPY --from=base /app/shared ./shared

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/frontend

# Define the default port the application listens on (Nuxt default is 3000)
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Define the command to run the built Nuxt application
CMD ["node", ".output/server/index.mjs"] 