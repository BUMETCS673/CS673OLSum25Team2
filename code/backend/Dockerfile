FROM node:23-alpine

WORKDIR /app

# Install core dependencies for Alpine
RUN apk add --no-cache bash git

# Copy package.json and package-lock.json first (to optimize Docker caching)
COPY package*.json ./

# Install all dependencies **including devDependencies**
RUN npm install --include=dev

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Ensure Jest is installed properly for test containers
RUN npm list jest || npm install --save-dev jest

# Ensure coverage folder exists
RUN mkdir -p coverage && chmod -R 777 coverage

# Expose the port for API usage
EXPOSE 5500

# Default command for normal backend operations
CMD ["npm", "run", "dev"]