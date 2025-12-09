FROM node:18-alpine

WORKDIR /app

# Copy backend package.json
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
