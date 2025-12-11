FROM node:18-alpine

WORKDIR /app

# Copy backend-specific package.json files
COPY backend/package.json backend/package-lock.json* ./

# Install ONLY backend dependencies
RUN npm install --production

# Copy backend source code
COPY backend/ .

EXPOSE 5000

CMD ["node", "server.js"]
