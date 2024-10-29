FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["node", "index.js"]