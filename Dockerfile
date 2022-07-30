FROM node:16.15.0

WORKDIR /LASTPROJECT

COPY . .

RUN npm install --prod

EXPOSE 3000 4000

CMD ["npm", "start"] 
