FROM node:18-alpine

WORKDIR /app

# Copy root workspace files (needed for npm workspaces)
COPY ../package.json ../package-lock.json* ./

# Copy only backend package.json into a folder named backend/
COPY package.json backend/package.json

# Install only backend workspace dependencies
RUN npm install --production --workspace backend

# Now copy backend source code
COPY . backend/

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]
