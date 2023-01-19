# https://eng.ms/docs/more/containers-secure-supply-chain/approved-images
FROM mcr.microsoft.com/oryx/python:3.9

# If set to anything other than empty will start the backend in worker mode
# Otherwise, will start in API mode
ENV WORKER=''
# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install necessary dependencies to compile
RUN apt-get update -y \
    && apt-get install -y r-base \
    && apt-get install -y git \
    && apt-get install -y gcc \
    && apt-get install -y --no-install-recommends graphviz \
    && apt-get install -y --no-install-recommends libgraphviz-dev \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python - --version 1.2.1
ENV PATH="${PATH}:/root/.local/bin"

WORKDIR /backend

# Copy R dependencies
COPY ./requirements.r .

# Install R dependencies
RUN Rscript requirements.r

# Copy python dependencies
COPY ./scripts ./scripts
COPY ./poetry.toml .
COPY ./poetry.lock .
COPY ./pyproject.toml .

# Install python denpendencies
RUN poetry config virtualenvs.create false \
    && ./scripts/install_python_deps.sh

# Copy remaining files
COPY . .

# Start backend either in API or worker mode, depending on the WORKER env var
ENTRYPOINT [ "./scripts/start.sh" ]
