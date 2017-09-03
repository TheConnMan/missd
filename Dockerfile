FROM node:8-alpine

RUN apk add --no-cache git

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install --production

COPY . /usr/src/app

EXPOSE 1337

CMD if [[ -z "${MYSQL_HOST}" ]]; then npm start; else npm run migrate && npm start; fi
