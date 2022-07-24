FROM node:alpine

WORKDIR /LASTPROJECT

COPY package*.json .

RUN npm install -g

COPY . .

CMD ["npm", "start"]

EXPOSE 80