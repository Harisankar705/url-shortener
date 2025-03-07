# Use Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN ls -l dist

EXPOSE 4444

# Start the application
CMD ["node", "dist/index.js"]
