FROM node:18

COPY . .

RUN npm install

EXPOSE 9200

CMD [ "node", "app.js" ]