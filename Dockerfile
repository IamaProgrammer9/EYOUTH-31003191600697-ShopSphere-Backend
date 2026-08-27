# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files from root and backend
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Copy Prisma schema from backend package
COPY packages/backend/prisma ./packages/backend/prisma

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Set working directory to the backend package to build
WORKDIR /app/packages/backend
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy compiled files and dependencies from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/prisma ./prisma
COPY --from=builder /app/packages/backend/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "prod:deploy"]
