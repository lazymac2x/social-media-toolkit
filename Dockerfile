FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3500

ENV NODE_ENV=production
ENV PORT=3500

CMD ["node", "src/server.js"]
