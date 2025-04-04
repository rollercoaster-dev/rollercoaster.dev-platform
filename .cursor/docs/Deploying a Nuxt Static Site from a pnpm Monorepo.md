<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Deploying a Nuxt Static Site from a pnpm Monorepo to Fly.io

This report examines best practices for deploying a static Nuxt 3 site from a pnpm monorepo to Fly.io. The focus is on achieving minimal Docker images while properly handling workspace dependencies, build contexts, and deployment configurations. The primary challenge involves correctly structuring multi-stage Docker builds within a monorepo architecture to ensure efficient, independent deployments.

## Understanding pnpm Dependency Management in Monorepos

The first key to optimizing your deployment is understanding why pnpm requires access to all workspace packages even when building just one component.

### Why All package.json Files Are Needed

When you run `pnpm install` at the root of a monorepo, pnpm needs access to all package.json files to correctly resolve the dependency graph. This happens because:

1. Workspace packages may depend on each other (even if they're currently placeholders)[^2]
2. pnpm uses a symlink-based approach for workspace packages, creating a virtual structure that requires awareness of all packages[^2]
3. The resolution of transitive dependencies requires knowledge of the entire workspace structure[^2]

Even if your frontend doesn't explicitly list backend as a dependency, pnpm needs to scan all workspace packages to ensure proper installation and linking. This explains why your Docker build requires copying the package.json files from all packages, even if they're just placeholders[^5].

### Workspace Package Resolution

In a pnpm monorepo, dependencies between workspace packages are resolved through internal links. When your frontend package has `shared` listed in its dependencies, pnpm doesn't actually install it from npm, but instead creates a link to the local package[^2]. This workspace-aware resolution is why pnpm needs access to all package.json files during installation.

## Optimal Docker Strategies for Nuxt Static Sites in Monorepos

Several strategies can help achieve minimal Docker images for your Nuxt static site deployment.

### Multi-Stage Build Approach

The multi-stage build approach remains the most efficient way to produce minimal Docker images. It allows you to:

1. Use a Node.js image for building
2. Use a lightweight nginx image for serving
3. Only copy the necessary files between stages[^4][^5]

This approach is particularly well-suited for static sites because the build artifacts are completely separate from the build environment[^4].

### Leveraging BuildKit Cache Mounts

To optimize build time and avoid unnecessary reinstallation of dependencies, use BuildKit cache mounts:

```dockerfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
```

This caches the pnpm store between builds, significantly speeding up the build process when dependencies haven't changed[^5].

### Alternative: Pre-Built Assets Strategy

An alternative approach is to build assets locally before Docker:

1. Run `pnpm install` and `nuxt generate` on your local machine or CI
2. Create a simpler Dockerfile that only copies the pre-built static files to an nginx container
3. Deploy this minimal container to Fly.io

This approach results in smaller images and faster builds but requires additional CI setup to ensure consistent builds[^1].

## Example Dockerfile Implementations

Here are optimized Dockerfile examples for both approaches.

### Optimized Multi-Stage Build for Nuxt in a Monorepo

```dockerfile
# Build stage
FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy only the files needed for installation
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY **/package.json ./

# Create necessary directories structure for workspace packages
RUN mkdir -p frontend backend shared
COPY frontend/package.json frontend/
COPY backend/package.json backend/
COPY shared/package.json shared/

# Install dependencies using cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source files for frontend only
COPY frontend frontend/

# Build the frontend
WORKDIR /app/frontend
RUN pnpm exec nuxt generate

# Production nginx stage
FROM nginx:alpine

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the generated static files
COPY --from=build /app/frontend/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

This Dockerfile optimizes the build by:

1. Only copying necessary files for dependency installation first
2. Using BuildKit cache for faster dependency installation
3. Only copying frontend source code (not backend or shared source)
4. Only copying the final built assets to the nginx container[^5][^4]

### Pre-Built Assets Approach

```dockerfile
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-built static files
COPY .output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

This approach assumes you've already run `pnpm install` and `nuxt generate` locally or in your CI pipeline, and are building the Docker image from within the frontend directory[^4].

## Managing Build Context and .dockerignore Files

The build context is crucial when working with monorepos, especially with Fly.io deployments.

### Setting the Correct Build Context

When deploying from a monorepo root with a Dockerfile in a subdirectory:

1. Run `fly deploy` from the monorepo root
2. Specify the config file: `-c frontend/fly.toml`
3. Specify the build context if needed: `--build-context ./`[^3]

This ensures the Docker build has access to all necessary files while using the correct Dockerfile and fly.toml.

### Optimizing .dockerignore

Place your .dockerignore file at the root of your build context (typically the repository root). A well-optimized .dockerignore should include:

```
node_modules
.git
.gitignore
*.md
**/dist
**/node_modules
**/.nuxt
!frontend/.output
```

This prevents copying unnecessary files while ensuring the build output is included[^5][^1].

### Resolving "File Not Found" Errors

The "file not found" errors you're experiencing likely stem from an incorrect build context. When you run `fly deploy -c frontend/fly.toml` from the root, the build context is still the root directory, but Docker is looking for files relative to the Dockerfile location. To fix this, ensure paths in your Dockerfile are relative to the build context (root), not the Dockerfile location[^3].

For example, instead of:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Use:

```dockerfile
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
```


## Fly.io Deployment Configuration

Your fly.toml file needs minimal configuration for a static site deployment.

### Essential fly.toml Configuration

```toml
app = "rollercoaster-dev-frontend"
primary_region = "your-preferred-region"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[build]
  dockerfile = "frontend/Dockerfile"
```

This configuration tells Fly.io to:

1. Use the specified Dockerfile
2. Forward external traffic to port 80 (nginx default)
3. Enable HTTPS automatically[^3]

### Deployment Command

The correct deployment command is:

```sh
flyctl deploy -c frontend/fly.toml -a rollercoaster-dev-frontend
```

This specifies both the configuration file and the app name[^3].

## Conclusion and Recommendations

Based on the analysis of your monorepo deployment needs, here are the key recommendations:

1. **Use a multi-stage Docker build** with BuildKit cache mounts to optimize build times
2. **Structure your Dockerfile paths** relative to the build context (repository root)
3. **Implement a comprehensive .dockerignore** file to minimize unnecessary file copying
4. **Consider the pre-built assets approach** for the smallest possible production images
5. **Ensure your fly.toml configuration** properly specifies the internal port and Dockerfile location

If you're experiencing persistent issues with file paths, consider moving to the pre-built assets approach, which simplifies the Docker build significantly by separating the build process from containerization. This can be easily integrated into a CI/CD pipeline for consistent deployments.

For the most efficient monorepo-to-Fly.io pipeline, consider implementing a GitHub Action that handles the build process separately, then builds and deploys a minimal Docker image containing only the static output. This approach gives you the benefits of monorepo development while maintaining lightweight, independent deployments.

<div>⁂</div>

[^1]: https://dev.to/jonlauridsen/exploring-the-monorepo-5-perfect-docker-52aj

[^2]: https://dev.to/adamgoth/understanding-package-dependencies-within-a-pnpm-monorepo-19ge

[^3]: https://community.fly.io/t/flyctl-deploy-with-nx-monorepo/7668

[^4]: https://hashinteractive.com/blog/docker-multi-stage-build-for-nuxt-generate/

[^5]: https://pnpm.io/docker

[^6]: https://community.fly.io/t/deploying-a-pnpm-monorepo/15167

[^7]: https://fly.io/docs/launch/monorepo/

[^8]: https://adamcoster.com/blog/pnpm-config

[^9]: https://www.reddit.com/r/docker/comments/1hc0ith/pnpm_monorepo_pnpm_deploy_and_docker_with/

[^10]: https://blog.logrocket.com/managing-full-stack-monorepo-pnpm/

[^11]: https://community.fly.io/t/module-express-not-found-when-trying-to-deploy-express-application/12758

[^12]: https://github.com/potato4d/docker-multi-stage-build-on-nuxt

[^13]: https://pnpm.io/8.x/docker

[^14]: https://github.com/superfly/flyctl/issues/46

[^15]: https://pnpm.io/workspaces

[^16]: https://www.reddit.com/r/docker/comments/12jmolt/need_some_help_setting_up_a_monorepo_with_pnpm/

[^17]: https://www.reddit.com/r/docker/comments/i4d02n/docker_monorepo_setup/

[^18]: https://pnpm.io/next/settings

[^19]: https://www.reddit.com/r/node/comments/1ighmem/question_about_shared_dependencies_in_monorepos/

[^20]: https://nx.dev/blog/setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx

[^21]: https://community.fly.io/t/support-for-multiple-docker-build-contexts/20877

[^22]: https://markus.oberlehner.net/blog/running-nuxt-3-in-a-docker-container

[^23]: https://github.com/pnpm/pnpm/issues/3114

[^24]: https://pnpm.io/package_json

[^25]: https://www.restack.io/p/nuxt-answer-docker-vue-nginx-setup

[^26]: https://fly.io/docs/reference/configuration/

[^27]: https://stackoverflow.com/questions/51253987/building-a-multi-stage-dockerfile-with-target-flag-builds-all-stages-instead-o

[^28]: https://github.com/pnpm/pnpm/issues/1637

[^29]: https://github.com/vercel/turbo/issues/5462

[^30]: https://blog.stackademic.com/creating-a-simple-full-stack-application-with-monorepo-using-pnpm-react-express-and-docker-6346c08f8188

[^31]: https://stackoverflow.com/questions/79469871/building-applications-monorepo-turborepo-dockerfile-next-js-pnpm

[^32]: https://dev.to/jonlauridsen/attempt-2-workspaces-npm-pnpm-336a

[^33]: https://github.com/superfly/flyctl/issues/58

[^34]: https://www.captaincodeman.com/build-a-docker-container-from-a-pnpm-monorepo

[^35]: https://tedspence.com/building-applications-on-a-monorepo-with-docker-containers-ae47a3bf847b

[^36]: https://www.amazeelabs.com/blog/dx-win-achieving-better-docker-build-and-deploy-times/

[^37]: https://ajcwebdev.com/first-look-fly/

[^38]: https://github.com/orgs/pnpm/discussions/4735

[^39]: https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn

[^40]: https://github.com/pnpm/pnpm/issues/7257

