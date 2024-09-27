FROM node:18-alpine
WORKDIR /server
COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "start"]