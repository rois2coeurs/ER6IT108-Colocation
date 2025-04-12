# Build Stage 1

FROM oven/bun:1 AS build
WORKDIR /app

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package.json bun.lock ./

# Install dependencies
RUN bun i

# Copy the entire project
COPY . ./

# Build the project
RUN bun run generate

# Build Stage 2

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/public/ ./
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY config-prod.json /usr/share/nginx/html/config.json
