FROM node:16.15.0

ARG ENV_FILE=.env
WORKDIR /LASTPROJECT

COPY ${ENV_FILE} /LASTPROJECT/.env
COPY .eslintrc .eslintignore .prettierrc package.json package-lock.json /LASTPROJECT/
ADD src /LASTPROJECT/src
RUN npm install --prod


FROM node:16-alpine

WORKDIR /LASTPROJECT
COPY nginx/nginx.conf /LASTPROJECT/
ENV PORT 3000
CMD switchServer.sh