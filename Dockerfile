# syntax=docker/dockerfile:1

FROM denoland/deno:2.9.4 AS build
WORKDIR /app
COPY . .
RUN deno task build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
