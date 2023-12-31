# Stage 1: Build image
FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/tour-app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production image with NGINX
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built files from the BUILD_IMAGE stage
COPY --from=BUILD_IMAGE /app/tour-app/dist/ .

# Copy custom NGINX configuration to sites-available
COPY abc.conf /etc/nginx/sites-enabled/default

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
