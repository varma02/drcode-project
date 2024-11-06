FROM oven/bun:latest as builder

WORKDIR /app

COPY ./package.json ./package.json
COPY ./server/package.json ./server/package.json

RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY shared/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80