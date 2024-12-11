FROM oven/bun:latest as builder

WORKDIR /app

COPY ./web/package.json ./package.json

RUN bun install

COPY ./web/* ./

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/dist /app/www

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443