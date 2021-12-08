# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/python:3.0-python3.9-appservice
FROM mcr.microsoft.com/azure-functions/python:3.0-python3.9

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY . /home/site/wwwroot

RUN mkdir /etc/secrets/
ENV FUNCTIONS_SECRETS_PATH=/etc/secrets
ENV AzureWebJobsSecretStorageType=Files
COPY host_secrets.json /etc/secrets/host.json

RUN apt-get update && apt-get install -y \
    build-essential \
    git

RUN pip install --upgrade pip 

RUN cd /home/site/wwwroot && pip install -r requirements.txt