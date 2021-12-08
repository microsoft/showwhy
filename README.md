# ShowWhy

ShowWhy is an interactive application that guides users through the process of answering a causal question using observational data.

In use, it has the potential to empower domain experts (who may not be data scientists) to develop a higher standard of evidence than could be achieved using conventional forms of exploratory data analysis (since correlation does not imply causation).

In other words, ShowWhy enables emulation of randomized controlled trials that produce a high standard of real-world evidence.

## Packages

- [client](packages/client/README.md)
- [functions](packages/functions/README.md)

## Getting Started

### Installation process

- Windows Subsystem for Linux (WSL): https://docs.microsoft.com/en-us/windows/wsl/setup/environment (Only for Windows users)

- Docker (For all platforms):

  - Windows: https://docs.docker.com/desktop/windows/install/
  - MAC: https://docs.docker.com/desktop/mac/install/
  - Ubuntu: https://docs.docker.com/engine/install/ubuntu/

- Docker Compose (For Linux Users):
  - Docker Compose: https://docs.docker.com/compose/install/ (look at the correct tab depending on your Operating System)

## Build and Test

### Windows

Open a Poweshell terminal, [navigate to the directory](https://docs.microsoft.com/en-us/powershell/scripting/samples/managing-current-location?view=powershell-7.2) where this project is located and run one of the commands at the `Commands` section of this README.

### MAC/LINUX:

Open a terminal, navigate to the directory where this project is located and run.

**NOTE:** For linux you will need to replace the `-` in `docker-compose` for a space in order for the commands to work, for example: `docker-compose up --build -d` in linux should be `docker compose up --build -d`

### Commands

- `docker-compose up --build -d`: Start all the containers (UI and Backend with all the dependencies) - Useful for users to start using ShowWhy
- `docker-compose up --build -d client`: Start only the UI container
- `docker-compose up --build -d reverseproxy`: Start all the containers needed for the backend and proxy for UI (the UI is excluded) - Useful for UI development
- `docker-compose up --build -d functions`: Start all the containers needed for the backend except the proxy - Useful for backend development

To stop using showwhy you can run these commands on the same powershell terminal:

- `docker-compose stop`: Stops the containers without removing anything
- `docker-compose down -v`: Stops and removes all the containers and volumes used - Use when you stop using ShowWhy
- `docker-compose rm --force`: Use after `docker-compose down -v` to delete all the data used in previous ShowWhy runs

## License

Code licensed under the [MIT License](LICENSE).

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
