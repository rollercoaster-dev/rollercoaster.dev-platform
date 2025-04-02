# backend/Dockerfile

# Use the official Bun image
ARG BUN_VERSION=1
FROM oven/bun:${BUN_VERSION} AS base

# Set working directory (monorepo root)
WORKDIR /app

# --- Install Dependencies ---
# Copy all necessary package manifests and lockfiles for the workspace
COPY package.json pnpm-workspace.yaml bun.lock ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/
# Add other workspaces if they exist and are needed for backend build/runtime

# Install ALL workspace dependencies from the root
RUN bun install --frozen-lockfile

# --- Build Backend ---
# Copy the backend source code
COPY backend/src ./backend/src
COPY backend/index.ts ./backend/index.ts
COPY backend/tsconfig.json ./backend/tsconfig.json
# Copy shared source code needed for build time resolution
COPY shared/index.ts ./shared/index.ts
COPY shared/types ./shared/types

# Run the build command specified in backend/package.json, using --cwd
RUN bun run --cwd backend build
# Expected output directory: backend/dist

# --- Setup Production Stage ---
FROM oven/bun:${BUN_VERSION} AS production

WORKDIR /app

# Copy only production artifacts and necessary node_modules
# Need to copy the entire node_modules structure from the root potentially,
# or figure out how bun install --production works with workspaces.
# For now, let's copy the whole node_modules from base and required files.
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/backend/package.json ./backend/package.json
COPY --from=base /app/package.json /app/pnpm-workspace.yaml ./
# Copy shared package.json if needed by runtime
# COPY --from=base /app/shared/package.json ./shared/package.json 

# Define the default port the application listens on
ENV PORT=3000
EXPOSE 3000

# Define the command to run the built application
WORKDIR /app/backend
CMD ["bun", "run", "dist/index.js"] 