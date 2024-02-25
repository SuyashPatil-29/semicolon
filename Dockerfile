FROM node:20

WORKDIR /src

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]
