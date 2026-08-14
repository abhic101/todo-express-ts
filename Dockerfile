# STAGE 1: Dependencies installation
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json .

RUN npm ci

# STAGE 2: Building project and pruning dev dependencies
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules /node_modules
COPY . .

RUN npm run builder
RUN npm prune --production

# STAGE 3: Server with production code
FROM node:22-alpine AS server
WORKDIR /app

COPY --from=builder /app/node_modules /node_modules
COPY --from=builder /app/dist/ /dist
COPY --from=builder /app/package*.json .

CMD ["npm", "run", "start;"]