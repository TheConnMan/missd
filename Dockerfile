FROM alpine

RUN apk add --no-cache nodejs git

WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --production

COPY . /usr/src/app

EXPOSE 1337

CMD npm start
