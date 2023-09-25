FROM node:20
WORKDIR /usr/app

COPY ./package.json .
RUN npm install --omit=dev

COPY ./dist ./dist

EXPOSE 5050
CMD npm start