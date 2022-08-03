FROM node:16.15.0 as build

ARG ENV_FILE=.env
WORKDIR /LASTPROJECT

COPY . . 
ADD src /LASTPROJECT/src
RUN npm install --prod


FROM node:16-alpine

WORKDIR /LASTPROJECT
COPY package.json app.js server.js socket.js /LASTPROJECT/
# COPY .env /LASTPROJECT/.env 
ADD src /LASTPROJECT/src
COPY --from=build /LASTPROJECT/node_modules /LASTPROJECT/node_modules
ENV PORT 3000
CMD ["node", "server.js"]
