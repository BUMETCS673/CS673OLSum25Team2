FROM node:23-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 5173

# Command to run the app in development mode with hot reloading
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "5173"]
