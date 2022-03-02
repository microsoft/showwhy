# Introduction

This repository contains the code for the ShowWhy Backend

# Getting Started

## Using Yarn To Run Locally

This process will get the backend running in your local environment, all the data is stored locally and never leaves your computer.

### Pre-requisites

1. [Yarn](https://yarnpkg.com/getting-started)
2. [Docker](https://docs.docker.com/engine/install)
3. [VSCode](https://code.visualstudio.com)
4. [Python VSCode Setup](https://code.visualstudio.com/docs/languages/python)
5. [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

### Running the backend

1. Clone the repository.
2. Open the repository in VSCode and open a Terminal (Terminal -> New Terminal)
3. Navigate to the functions folder using the command: `cd javascript/functions`
4. Run `yarn build` to create the virtual environment and install dependencies
5. Run `yarn start` to start cosmosdb, azurite and the backend functions (This command will take a while since it will download and run cosmosdb and azurite docker containers)

To stop running the backend hit `Ctrl+c` on your keyboard while focused on the terminal where you run `yarn start` command

### Additional yarn commands

- `yarn stop`: Stops the docker containers
- `yarn clean`: Cleans all the data stored in the docker containers and stops the docker containers

## I don't want docker containers!

You can also run the backend code without using yarn or docker, to do that you will need to use a Windows computer and do the following

### Pre-requisites

To be able to run this code locally you will need to install the following tools:

1. [VSCode](https://code.visualstudio.com/)
2. [Python VSCode Setup](https://code.visualstudio.com/docs/languages/python)
3. [Azurite VSCode Extension](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio-code)
4. [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)
5. [Cosmos DB Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator)
6. Open Powershell as Administrator and run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned` command, more information here: [Powershell Security Set Execution Policy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.1)

### Running the backend

1. Clone the repository
2. Make sure CosmosDB Emulator is running in your computer
3. Open VSCode and hit `Ctrl+Shift+P`, type `azurite: start` and press enter
4. Create a virtual environment to install the dependencies:
   1. Open a Terminal (Terminal -> New Terminal)
   2. Navigate to the functions folder `cd javascript/functions`
   3. Create a virtual environment `python -m venv src/.venv`
   4. Activate the environment `./src/.venv/Scripts/Activate.ps1`
   5. Install the required dependencies `pip install -r requirements.txt`
5. Hit `F5` to start debugging

## Azure Deployment

TODO: Write the Azure Deployment guide

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.
