FROM node:18

WORKDIR /usr/src/app

# Копируем и устанавливаем зависимости бэкенда
COPY package*.json ./
RUN npm install

# Копируем и собираем фронтенд
COPY frontend/package*.json frontend/
RUN cd frontend && npm install
COPY frontend/public frontend/public
COPY frontend/src frontend/src
RUN cd frontend && npm run build

# Копируем бэкенд
COPY src/ src/

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src/ src/
COPY frontend/build/ public/

CMD ["node", "src/server.js"]
