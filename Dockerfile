# syntax=docker/dockerfile:1

FROM denoland/deno:2.9.4 AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/cache/steno-build \
    cp /cache/steno-build/build-cache.json content/.steno/build-cache.json 2>/dev/null || true; \
    deno task build && cp content/.steno/build-cache.json /cache/steno-build/build-cache.json

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
