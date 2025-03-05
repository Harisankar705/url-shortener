# Use Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files into the container
COPY . .

# Build TypeScript files
RUN npm run build

# Ensure dist folder is included
RUN ls -l dist

# Expose the correct port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
