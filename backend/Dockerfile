# backend/Dockerfile

# Use the official Bun image
ARG BUN_VERSION=1
FROM oven/bun:${BUN_VERSION} AS base

# Set working directory (monorepo root)
WORKDIR /app

# --- Install Dependencies ---
# Copy all necessary package manifests and lockfiles for the workspace
COPY package.json bun.lock pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/

# Install ALL workspace dependencies from the root
RUN bun install

# --- Build Shared Package ---
COPY shared/index.ts ./shared/index.ts
COPY shared/types ./shared/types
COPY shared/tsconfig.json ./shared/tsconfig.json
RUN cd shared && bun run build

# --- Build Backend ---
# Copy the backend source code
COPY backend/src ./backend/src
COPY backend/index.ts ./backend/index.ts
COPY backend/tsconfig.json ./backend/tsconfig.json

# Run the build command specified in backend/package.json
RUN cd backend && bun run build
# Expected output directory: backend/dist

# --- Setup Production Stage ---
FROM oven/bun:${BUN_VERSION} AS production

WORKDIR /app

# Create a production-specific workspace configuration
RUN echo '{"packages": ["backend", "shared"]}' > pnpm-workspace.yaml

# Create a production-specific package.json
RUN echo '{"name": "atbadges","version": "0.1.0","private": true,"workspaces": ["backend", "shared"]}' > package.json

# Copy package.json files
COPY --from=base /app/backend/package.json ./backend/package.json
COPY --from=base /app/shared/package.json ./shared/package.json

# Copy built files
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/shared/dist ./shared/dist

# Install only production dependencies
RUN bun install

# Define the default port the application listens on
ENV PORT=3000
EXPOSE 3000

# Define the command to run the built application
WORKDIR /app/backend
CMD ["bun", "run", "dist/index.js"] 