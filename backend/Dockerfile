FROM node:18-alpine

WORKDIR /app

# Copy only backend package files
COPY package.json package-lock.json* ./

# Install backend dependencies
RUN npm install --production

# Copy backend source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
