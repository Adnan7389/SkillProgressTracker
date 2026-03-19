# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
RUN npm run build

# Stage 2: Production NGINX
FROM nginx:alpine

# Copy built application to NGINX serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
