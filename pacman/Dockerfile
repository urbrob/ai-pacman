# pull official base image
FROM node:8.7.0-alpine

# set working directory
WORKDIR /app

# copy all
COPY . ./

#install dependencies
RUN npm install --save-dev nodemon --silent
RUN npm install express --save --silent

# start app
CMD npm run start