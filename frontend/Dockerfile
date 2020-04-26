# pull official base image
FROM node:8.7.0-alpine

# set working directory
WORKDIR /app

# copy all
COPY . ./

#install dependencies
RUN npm install --silent
RUN npm install react-scripts@3.4.1 --silent

# start app
CMD npm start