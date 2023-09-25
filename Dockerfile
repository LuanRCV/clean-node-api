FROM node:20 as build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20 as production
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 5050
CMD npm start