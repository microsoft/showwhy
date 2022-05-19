# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/python:3.0-python3.9-appservice
FROM mcr.microsoft.com/azure-functions/python:3.0-python3.9

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY ./showwhy-backend/showwhy_backend/ /home/site/wwwroot/
COPY ./showwhy-backend/pyproject.toml /home/site/wwwroot/
COPY ./showwhy-backend/poetry.lock /home/site/wwwroot/

RUN mkdir /home/site/showwhy-inference/

COPY ./showwhy-inference/ /home/site/showwhy-inference/

RUN mkdir /etc/secrets/
ENV FUNCTIONS_SECRETS_PATH=/etc/secrets
ENV AzureWebJobsSecretStorageType=Files
COPY ./showwhy-backend/host_secrets.json /etc/secrets/host.json

RUN apt-get update && apt-get install -y \
    build-essential \
    git

RUN python -m ensurepip &&\
    python -m pip install --upgrade pip &&\
    python -m pip install poetry==1.1.12

RUN cd /home/site/wwwroot &&\
    python -m poetry config virtualenvs.create false &&\
    python -m poetry install --no-dev --no-interaction --no-ansi
