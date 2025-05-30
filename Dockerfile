FROM node:18 as builder

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

# Финальный образ
FROM node:18
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/frontend/build ./public

# Устанавливаем serve для статики
RUN npm install -g serve

CMD ["node", "src/server.js"]
