FROM node:21-alpine3.18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration "production"

FROM httpd:alpine3.18
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /app/dist/*/browser .
EXPOSE 80
