#pull base images and requirements
FROM node:16.20.2-alpine

#creating app folder
WORKDIR /myapp

#copy all files and folder in app folder
COPY . .

#Downloading all requirements
RUN npm init -y
RUN npm install express ejs axios
EXPOSE 3000

#run the app
CMD ["node","server.js"]
