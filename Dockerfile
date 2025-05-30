FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN cd frontend && npm install && npm run build

CMD ["node", "src/server.js"]
