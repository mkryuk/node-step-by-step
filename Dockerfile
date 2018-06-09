#
# ---- Base Node ----
FROM alpine:3.5 AS base
# install node
RUN apk add --no-cache nodejs-current tini
# set working directory
WORKDIR /root/app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Build ----
# run linters, setup and build
FROM dependencies AS build
COPY . .
RUN  npm run build

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /root/app/prod_node_modules ./node_modules
# copy public folder
COPY --from=build /root/app/public ./public
# copy data
COPY --from=build /root/app/data ./data
# copy compiled dist
COPY --from=build /root/app/dist ./dist
# copy pm2.json file
COPY --from=build /root/app/pm2.json .
# expose port and define CMD
EXPOSE 3000
CMD npm run serve:pm2-runtime
