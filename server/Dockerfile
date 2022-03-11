#STEP 1
# docker buildx build --platform linux/arm/v7 -t kallakukku/mastermind-api:latest --push .
FROM node:14-alpine AS build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]