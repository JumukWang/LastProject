FROM node:16.15.0

WORKDIR /LASTPROJECT

COPY package*.json .

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000 4000

CMD ["npm", "start"]