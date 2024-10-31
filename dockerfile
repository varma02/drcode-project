# Stage 1: Build the React project using Bun
FROM oven/bun:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the project files
COPY . .

# Install dependencies
RUN bun install

# Build the project
RUN bun run build

# Stage 2: Serve the built project with Nginx
FROM nginx:alpine

# Copy the built project from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose ports to access the application
EXPOSE 80
EXPOSE 443
