# Use Node.js for building the app
FROM node:14 AS build

# Set working directory and copy files
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Accept build arguments for environment variables
ARG REACT_APP_WEATHER_API_KEY
ARG REACT_APP_CHATGPT_API_KEY

# Set environment variables for the build process
ENV REACT_APP_WEATHER_API_KEY=$REACT_APP_WEATHER_API_KEY
ENV REACT_APP_CHATGPT_API_KEY=$REACT_APP_CHATGPT_API_KEY

# Build the app
RUN npm run build

# Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
