# Use official Playwright image with all browsers preinstalled
FROM mcr.microsoft.com/playwright:v1.55.0-focal

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose your backend port
EXPOSE 3001

# Start the backend
CMD ["node", "server.js"]