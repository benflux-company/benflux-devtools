FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json turbo.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm install

COPY . .

RUN cd apps/web && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
