FROM node:18-alpine

WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the backend source code
COPY backend/. .

EXPOSE 5000

CMD ["node", "server.js"]
