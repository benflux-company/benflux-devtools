FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json turbo.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install

COPY . .

RUN cd apps/api && npx prisma generate
RUN cd apps/api && npm run build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/main"]
