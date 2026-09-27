# ritsuki.dev: adapter-node, so `?screen=…` deep links are rendered per request.
# Built and deployed by the `image` and `deploy` jobs in .github/workflows/ci.yml.

# ── Build ───────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
# pnpm version comes from `packageManager` in package.json
RUN corepack enable

# Manifests first so the install layer is cached until dependencies change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Run ─────────────────────────────────────────────────────
# The build bundles every dependency, so the runtime needs no node_modules.
FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000

COPY --from=build --chown=root:root /app/build ./build
COPY --from=build --chown=root:root /app/package.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
	CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "build"]
