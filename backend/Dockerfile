# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# ---------- FINAL STAGE ----------
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000

CMD ["node", "index.js"]