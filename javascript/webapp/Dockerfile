FROM mcr.microsoft.com/cbl-mariner/base/nodejs:16

WORKDIR /app
COPY ./build ./build
COPY package.deployed.json package.json
RUN npm install --production
CMD ["npm", "run", "start"]
