# Step 1
FROM node:14 as build-step
WORKDIR /usr/src/app
COPY javascript/client/package.json .
RUN yarn install 
COPY javascript/client .
COPY javascript/client/.env ./.env.docker
RUN yarn run build --mode docker
FROM nginx:1.21
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html