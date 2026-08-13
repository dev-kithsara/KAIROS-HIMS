# frontend/Dockerfile

# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

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