FROM oven/bun:latest as builder

WORKDIR /app

COPY --exclude=shared --exclude=server . .

RUN bun install

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY shared/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80