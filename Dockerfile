# Base image for Node.js
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Build the Quasar project
RUN npm run build

# Expose port 443 for HTTPS
EXPOSE 9050

# Instalar un servidor estático para servir la aplicación
RUN npm install -g http-server

# Command to run the Quasar project with SSL
CMD ["http-server", "dist/spa", "-p", "9050", "--ssl", "--cert", "/app/ssl/fullchain.pem", "--key", "/app/ssl/privkey.pem"]
