FROM mcr.microsoft.com/cbl-mariner/base/nodejs:16

RUN npm i -g yarn
WORKDIR /app

CMD ["./scripts/start-frontend.sh"]
