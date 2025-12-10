FROM node:18-alpine

WORKDIR /app

# Copy ONLY package.json first so npm sees the correct type=module
COPY package.json ./
COPY package-lock.json ./   # if exists

# Force Node to treat project as ESM
ENV NODE_OPTIONS="--experimental-modules"

RUN npm install --production

# Copy full app
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
