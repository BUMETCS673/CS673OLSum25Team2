FROM node:23-alpine

WORKDIR /app

# Install core dependencies for Alpine
RUN apk add --no-cache bash git

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies, including Jest
RUN npm install --save-dev jest

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Ensure coverage folder exists
RUN mkdir -p coverage && chmod -R 777 coverage

# Expose the port the API will run on
EXPOSE 5500

# Command to run the API with nodemon for auto-reloading
CMD ["npm", "run", "dev"]