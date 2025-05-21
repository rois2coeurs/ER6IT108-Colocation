FROM ubuntu:latest
LABEL authors="rois2coeurs"

FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:3000/health || exit 1
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
RUN mkdir /usr/src/app/data
RUN chown -R bun:bun /usr/src/app

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]