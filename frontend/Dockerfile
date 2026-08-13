# frontend/Dockerfile

# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies.
# NOTE: We use 'npm install' instead of 'npm ci' because the lockfile is
# generated on Windows and some optional native binaries (@emnapi) resolve
# differently on Linux/Alpine. 'npm install' lets npm resolve the correct
# platform-specific packages inside the container.
COPY package*.json ./
RUN npm install --no-audit --no-fund --loglevel=error

# Copy the rest of the code and build the app
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve the App with NGINX
# ==========================================
FROM nginx:alpine

# Copy the built files from the 'builder' stage to NGINX's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom NGINX configuration (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Default HTTP port)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]