#STEP 1
# docker buildx build --platform linux/arm/v7 -t kallakukku/mastermind-api:latest --push .
FROM node:14-alpine AS build

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]