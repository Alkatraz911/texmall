FROM node:20.5.0-slim
WORKDIR /user/tecmoll
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE ${PORT}
CMD ["npm","run", "start"]