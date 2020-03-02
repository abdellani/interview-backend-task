FROM node:10-alpine
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install
COPY ./src ./src
COPY ./webpack.config.js .
COPY ./config/docker.json ./config/production.json
RUN mkdir -p public/thumbnails
EXPOSE 3000
ENV NODE_ENV='production'
CMD npm start