# backend/Dockerfile

# 1. Base Image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Install OpenSSL (v3.x) — Alpine 3.20 ships OpenSSL 3 by default.
#    Prisma's query engine needs libssl to detect the OpenSSL version at runtime.
#    Without this, Prisma can't detect the version and defaults to OpenSSL 1.1
#    binaries which don't exist on Alpine 3.18+, causing startup crashes.
RUN apk add --no-cache openssl

# 3. Copy package.json and package-lock.json first
# This is a Docker caching trick. If dependencies haven't changed, Docker won't reinstall them.
COPY package*.json ./

# 4. Install dependencies (with network resilience for Docker Desktop on Windows)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --ignore-scripts --no-audit --no-fund --loglevel=error

# 5. Copy the rest of the application code
COPY . .

# 6. Generate Prisma Client at BUILD TIME.
# The binaryTargets in schema.prisma already includes "linux-musl-openssl-3.0.x"
# so Prisma will use the pre-downloaded binary from node_modules (no network needed).
RUN npx prisma generate --no-hints

# 7. Build the TypeScript code into JavaScript
RUN npm run build

# 8. Expose the port the app runs on
EXPOSE 5000

# 9. The command to start the application
CMD ["npm", "start"]