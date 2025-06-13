FROM node:23-alpine

WORKDIR /app

# Install core dependencies for Alpine
RUN apk add --no-cache bash git

# Copy package.json and package-lock.json first (best for caching layers)
COPY package*.json ./

# Install dependencies, including Jest
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Ensure Jest is installed in the container
RUN npm install --save-dev jest

# Expose the port the API will run on
EXPOSE 5500

# Command to run the API with nodemon for auto-reloading
CMD ["npm", "run", "dev"]