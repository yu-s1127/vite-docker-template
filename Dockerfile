# nodeのバージョンは適宜変更
FROM node:18-alpine

# install app
RUN apk update \
    && apk upgrade

WORKDIR /app
