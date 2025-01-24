# Stage 1: Build the Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the Angular app with NGINX
FROM nginx:alpine

# Copy the Angular build output to the NGINX directory
COPY --from=build /app/dist/workstation-app/browser /usr/share/nginx/html

# Add the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]



## APPENDIX
# docker build -t workstation-app-nginx . 
