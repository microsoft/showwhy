# Step 1
FROM node:14 as build-step
WORKDIR /usr/src/app
COPY package.json .
COPY .yarnrc.yml .
COPY yarn.lock .
COPY .yarn/ .yarn/
COPY javascript/api-client/ ./javascript/api-client/
COPY javascript/builders/ ./javascript/builders/
COPY javascript/components/ ./javascript/components/
COPY javascript/types/ ./javascript/types/
COPY javascript/webapp/ ./javascript/webapp/
COPY javascript/webapp/.env ./javascript/webapp/.env.docker
RUN yarn install 
RUN yarn run build
FROM nginx:1.21
COPY --from=build-step /usr/src/app/javascript/webapp/dist /usr/share/nginx/html