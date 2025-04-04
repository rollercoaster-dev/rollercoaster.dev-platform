# frontend/Dockerfile (Optimized for pre-built assets)

# --- Production Stage ---
FROM nginx:alpine

# Copy the nginx configuration file from the frontend directory in the build context
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the pre-built static files from the frontend build output directory in the build context
# Assumes the build command (e.g., `pnpm --filter frontend build`) was run before `fly deploy`
COPY frontend/.output/public /usr/share/nginx/html

# Expose port 80 (nginx default). fly.toml maps internal_port 8080 to this.
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 