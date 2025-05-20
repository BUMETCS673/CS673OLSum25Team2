FROM node:23-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose the port the API will run on
EXPOSE 5000

# Command to run the API with nodemon for auto-reloading
CMD ["npm", "dev"]