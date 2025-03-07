# Use Node.js 18 base image
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN ls -l dist

EXPOSE 4444

CMD ["node", "dist/index.js"]
