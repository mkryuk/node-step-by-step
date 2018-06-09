# An example on how to use Node.js with Typescript and [InversifyJS](https://github.com/inversify/InversifyJS) as IoC container

## Run:
```
npm start
```
## Build
```
npm run bild
```
## Cleanup
```
npm run clean
```
## Test: 
```
npm run build && npm run test
```
## Test using typescript: 
```
npm run test:ts
```
## [Vs Code](https://code.visualstudio.com/)
```
Ctrl+Shift+B for run
```
# Docker

## Build a server image
```
docker build --rm -t node-step-by-step .
```

## Build an nginx image
```
cd ./nginx-ha
docker build --rm -t node-ha .
```

## Create a network
```
docker network create netha
```

## Run mongo container
```
docker run --name=mongo -d --net=netha mongo
```

## Run server containers
### In case of ``` CMD npm run serve ``` in Dockerfile
```
docker run --name=node1 --env NODE_ENV=production --env MONGO_CONNECTION_STRING=mongodb://mongo:27017/node_step_by_step -d --net=netha node-step-by-step
docker run --name=node2 --env NODE_ENV=production --env MONGO_CONNECTION_STRING=mongodb://mongo:27017/node_step_by_step -d --net=netha node-step-by-step
docker run --name=node3 --env NODE_ENV=production --env MONGO_CONNECTION_STRING=mongodb://mongo:27017/node_step_by_step -d --net=netha node-step-by-step
```

### In case of ``` CMD npm run serve:pm2-runtime ``` in Dockerfile
```
docker run --name=node1 -d --net=netha node-step-by-step
docker run --name=node2 -d --net=netha node-step-by-step
docker run --name=node3 -d --net=netha node-step-by-step
```

## Run nginx container
```
docker run --name=node-ha -d --net=netha -p 80:80 node-ha
```

# Docker compose

## Run
```
docker-compose up
```
## Stop 
```
docker-compose down
```
