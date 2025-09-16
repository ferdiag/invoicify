# ---stage 1: create React build
FROM node:20-alpine AS build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

# Code kopieren
COPY client ./
COPY shared /app/shared

RUN npm run build

# --stage 2: serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/client/dist ./
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
