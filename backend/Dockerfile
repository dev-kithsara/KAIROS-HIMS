# backend/Dockerfile

# 1. Base Image: We use a lightweight version of Node.js 18
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
# This is a Docker caching trick. If dependencies haven't changed, Docker won't reinstall them.
COPY package*.json ./

# 4. Install dependencies
RUN npm ci --no-audit --no-fund --loglevel=error

# 5. Copy the rest of the application code
COPY . .

# 6. Generate Prisma Client (Required for database access)
RUN npx prisma generate

# 7. Build the TypeScript code into JavaScript
RUN npm run build

# 8. Expose the port the app runs on
EXPOSE 5000

# 9. The command to start the application
CMD ["npm", "start"]