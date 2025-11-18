FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend with nodemon (watch mode)
CMD ["npm", "run", "dev"]
