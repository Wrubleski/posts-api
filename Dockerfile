# docker build . -t posts-api
# docker run -p 3000:3000 -d posts-api:latest

FROM node:16

WORKDIR /srv/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/server.js"]