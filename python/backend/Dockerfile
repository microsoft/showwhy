# The base image to use
ARG BASE_IMAGE=python:3.9-slim

FROM ${BASE_IMAGE} AS builder

# If set to anything other than empty will start the backend in worker mode
# Otherwise, will start in API mode
ENV WORKER=''
# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install necessary dependencies to compile
RUN apt-get update -y \
    && apt-get install -y r-base git gcc g++ \
    && apt-get install -y --no-install-recommends graphviz \
    && apt-get install -y --no-install-recommends libgraphviz-dev \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python - --version 1.3.2
ENV PATH="${PATH}:/root/.local/bin"

WORKDIR /backend

# Copy python dependencies
COPY ./scripts ./scripts
COPY ./poetry.toml .
COPY ./poetry.lock .
COPY ./pyproject.toml .

# Install python denpendencies
RUN ./scripts/install_python_deps.sh

# Copy remaining files
COPY . .

# Check formatting, lint and tests
RUN poetry run poe verify


FROM ${BASE_IMAGE}

# If set to anything other than empty will start the backend in worker mode
# Otherwise, will start in API mode
ENV WORKER=''
# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install necessary dependencies to compile
RUN apt-get update -y \
    && apt-get install -y r-base git \
    && apt-get install -y --no-install-recommends graphviz \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# Copy R dependencies
COPY ./requirements.r .

# Install R dependencies
RUN Rscript requirements.r

# Copy remaining files
COPY --from=builder /backend .

# Start backend either in API or worker mode, depending on the WORKER env var
ENTRYPOINT [ "./scripts/start.sh" ]
