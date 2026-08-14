# frontend/Dockerfile
#
# ARCHITECTURE DECISION:
# We pre-build the React app locally (outside Docker) and only use Docker
# to serve the compiled static files via NGINX. This avoids:
#   1. Downloading 300+ npm packages inside the container (slow, network timeouts)
#   2. Platform-specific native binary issues (rolldown, @emnapi)
#
# Build flow:
#   1. Developer runs: cd frontend && npm install && npm run build
#   2. Docker copies the generated 'dist/' folder into NGINX
#   3. docker-compose up serves the pre-built app instantly

FROM nginx:alpine

# Copy the pre-built static files from the local 'dist/' folder
COPY dist/ /usr/share/nginx/html

# Copy NGINX routing config (handles React Router client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]