FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Install deps (ignoring scripts to avoid postinstall prisma generate failure)
RUN npm ci --ignore-scripts
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build TS
RUN npm run build

# Runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production

# Add Args for Vertex AI
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
# Install only prod deps (ignore scripts to avoid prisma generate)
RUN npm ci --only=production --ignore-scripts
# Copy built dist
COPY --from=builder /app/dist ./dist
# Copy prisma schema/client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3001
CMD ["./start.sh"]
