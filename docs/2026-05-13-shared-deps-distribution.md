# Shared Deps Distribution

Date: 2026-05-13

## Decision

Consumer apps (`hollis-identity`, `workouts-server`, eventually `hollis-health-app`, `Hollis-Workouts`) take a dependency on `@hollis/contracts`, `@hollis/auth-client`, and other `hollis-shared` packages via `file:../hollis-shared/packages/<pkg>` refs — not from a registry, not from a git tag URL.

For container builds the consumer's `Dockerfile` clones `hollis-shared` at a pinned ref as a build stage, placing it at the sibling path the `file:` refs expect.

## Why not git tags

`npm install "@hollis/contracts": "git+https://.../hollis-shared.git#contracts-vX.Y.Z"` does not work. The repo root's `package.json` is `@hollis/shared` (a private workspaces root), so npm installs the entire monorepo tree under `node_modules/@hollis/contracts/` and the actual contracts package ends up at `node_modules/@hollis/contracts/packages/contracts/`. TypeScript fails to resolve `import from '@hollis/contracts'`.

This was discovered after committing `dist/` into multiple `contracts-v0.2.0-alpha.*` and `auth-client-v0.1.0-alpha.*` tags hoping the installs would succeed. They will not — the problem is structural, not packaging.

Verified 2026-05-13 on npm 11.10.0.

## Why not GitHub Packages or npm

Both work but each consumer environment (every dev laptop, CI runner, prod container) needs an auth token to install. For a small team with few consumers and zero external users today, the auth-token spread is not worth it.

When the suite outgrows option 3 — more consumers, external partners, mature CI artifact caching — revisit publishing to GitHub Packages.

## How option 3 works in containers

```dockerfile
# Stage: clone + build hollis-shared at the sibling path
FROM node:20-alpine AS hollis-shared
RUN apk add --no-cache git
WORKDIR /workspace
ARG HOLLIS_SHARED_REF=main
RUN git clone --depth 1 --branch ${HOLLIS_SHARED_REF} \
      https://github.com/idlandes04/hollis-shared.git hollis-shared
WORKDIR /workspace/hollis-shared
RUN npm ci && npm run build

# Stage: deps / build / runner — all WORKDIR /workspace/<consumer>
FROM node:20-alpine AS deps
WORKDIR /workspace/identity
COPY --from=hollis-shared /workspace/hollis-shared /workspace/hollis-shared
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
# ... subsequent stages
```

Key points:

- The consumer's `WORKDIR` matches its directory name, so `file:../hollis-shared/...` symlinks resolve relative to it. `/workspace/identity/node_modules/@hollis/contracts` → `../../../hollis-shared/packages/contracts` → `/workspace/hollis-shared/packages/contracts`.
- `npm ci` symlinks `file:` deps into `node_modules`, so the runner stage must also have `hollis-shared` on disk — copy it into the final stage too.
- `HOLLIS_SHARED_REF` is a build arg: `main` by default during development, pinned to a release tag for production builds. `docker build --build-arg HOLLIS_SHARED_REF=v0.2.0-alpha.5`.

## How option 3 works locally

`file:../hollis-shared/packages/<pkg>` resolves because every developer has both repos checked out side-by-side under `~/Documents/SRC/`. No tooling required. `npm install` Just Works.

The shared package's `dist/` must be built (`npm run build` in `hollis-shared`) before the consumer's typecheck/build sees the latest changes — symlinked file: deps don't trigger rebuilds.

## Consumer pin convention

All current consumer `package.json` files:

```json
"@hollis/contracts": "file:../hollis-shared/packages/contracts",
"@hollis/auth-client": "file:../hollis-shared/packages/auth-client"
```

Do not switch back to `git+https://...#tag` refs until the structural problem is resolved (per-package release branches via `git subtree split`, or registry publish).

## Related artifacts

- `auth-client-v0.1.0-alpha.{1,2,3}` and `contracts-v0.2.0-alpha.{4,5}` tags committed `dist/` and rewrote `packages/utils/package.json` to remove a stale `git+file://` sibling ref. The fixes are valid; the tags themselves are not directly installable as documented above.
- Future hollis-shared release tags can stop force-adding `dist/` — option 3 builds the dist fresh in the container.
