# FROM node:22.19.0-alpine3.22 AS build
FROM node:22.18.0 AS build

WORKDIR /app

COPY package*.json ./

# RUN npm install -g npm@latest
RUN npm ci

COPY . .
RUN mkdir -p /app/logs
RUN mkdir -p /app/uploads
RUN npm run build


# FROM node:22.19.0-alpine3.22 AS production
FROM node:22.18.0 AS production

WORKDIR /app

COPY package*.json ./

# RUN npm install -g npm@latest
RUN npm ci --omit=dev

COPY --from=build /app/dist ./

COPY --from=build /app/uploads ./uploads
COPY --from=build /app/logs ./logs

CMD ["node", "app.js"]
