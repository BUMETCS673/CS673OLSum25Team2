RUN npm install --save-dev jest

FROM node:23-alpine

WORKDIR /app

# Add essential Alpine tools for builds and debugging
RUN apk add --no-cache bash git

# Copy both dependency files first (preserve cache layer)
COPY package.json package-lock.json ./

# Ensure dev dependencies (like Jest) are installed
RUN npm install --include=dev

# Install nodemon globally for development use
RUN npm install -g nodemon

# Copy in the rest of the application source
COPY . .

# Sanity check: confirm Jest is present
RUN npx jest --version || echo "❌ Jest still not installed"

# Set coverage directory permissions just in case
RUN mkdir -p coverage && chmod -R 777 coverage

EXPOSE 5500

CMD ["npm", "run", "dev"]