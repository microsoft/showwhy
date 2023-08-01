#!/bin/bash

if [[ -z "${DEBUG}" ]]; then
    # API debug disabled
    echo "Starting backend api with debug disabled"
    ./.venv/bin/python -m uvicorn backend.api_main:app --host 0.0.0.0 --port 8081
else
    # API debug enabled
    echo "Starting backend api with debug enabled"
    ./.venv/bin/python -m debugpy --listen 0.0.0.0:6900 -m uvicorn backend.api_main:app --host 0.0.0.0 --port 8081
fi
