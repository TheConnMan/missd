FROM alpine

ENV PORT 80

RUN apk add --no-cache nodejs

WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --production

COPY . /usr/src/app

EXPOSE 80

CMD node node_modules/sails/bin/sails.js lift
