# Use Node.js for building the app
FROM node:14 AS build

# Set working directory and copy files
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the app
RUN npm run build

# Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
