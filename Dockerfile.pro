# start the first build stage
# use a node image and name the build stage as "build"
FROM node:20.13.1-alpine AS build

# switch to the /app directory in the image 
WORKDIR /app

# copy into the /app directory package.json
COPY package*.json ./

# install packages
RUN npm install

# copy everything else from outside into the /app
COPY . .

# run the build operation
RUN npm run build

# start the second build stage
# use a node image and name the build stage as "production"
FROM node:20.13.1-alpine AS production

# in this image use the /app folder
WORKDIR /app

# copy from build image into this image
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# copy package.json into this image
COPY package*.json ./

# expose 3000 port
EXPOSE 3000

# run application
CMD ["npm", "run", "start"]