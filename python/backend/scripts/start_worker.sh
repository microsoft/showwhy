#!/bin/bash

if [[ -z "${DEBUG}" ]]; then
    # worker debug disabled
    echo "Starting backend workers with debug disabled"
    poetry run python -m celery -A backend.worker_main worker -l info
else
    # worker debug enabled
    echo "Starting backend worker with debug enabled"
    poetry run python -m debugpy --listen 0.0.0.0:6901 -m celery -A backend.worker_main worker -l info
fi
