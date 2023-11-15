FROM node:18-alpine
WORKDIR /app
COPY . .
COPY package.json .
RUN npm ci
RUN npm run build
CMD [ "npm", "run", "preview" ]