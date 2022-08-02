FROM node:16.15.0

WORKDIR /LASTPROJECT

COPY . .

RUN npm install --prod

RUN npm install nodemon -g

EXPOSE 3000 4000

CMD ["npm", "start"] 