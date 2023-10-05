FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

# Don't run production as root
# In the context of running processes in a Docker container, it's a security best practice to avoid running applications as the root user. Running applications as a non-root user minimizes the potential damage that could be done if there's a security breach or an application vulnerability. 
# The lines RUN addgroup ... and RUN adduser ... create a non-root group (nodejs) and a non-root user (nextjs) within the container.

# --gid stands for "group identifier" and --uid stands for "user identifier." 
# These flags allow you to specify the numeric identifiers for the group and user, respectively. 
# In this case, 1001 is chosen as the identifier for both the group and user. 
# These IDs are generally chosen in a way that they do not collide with system users or groups.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# copying from a specific stage of the build pipeline:
#When you use COPY without the --from flag, Docker would expect the files to be present 
# in the context of the Docker build, which might include a lot of unnecessary files. 
# Using COPY --from=stage, you can selectively copy files from a previous stage, ensuring that 
# only the relevant files are included in the current stage.
COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
