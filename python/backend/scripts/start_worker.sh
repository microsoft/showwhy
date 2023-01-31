#!/bin/bash

if [[ -z "$N_PARALLEL_JOBS" ]]; then
    extra_params=""
else
    extra_params="--concurrency $N_PARALLEL_JOBS"
fi

if [[ -z "${DEBUG}" ]]; then
    # worker debug disabled
    echo "Starting backend worker with debug disabled (extra_params=$extra_params)"
    ./.venv/bin/python -m celery -A backend.worker_main worker -l info $extra_params
else
    # worker debug enabled
    echo "Starting backend worker with debug enabled (extra_params=$extra_params)"
    ./.venv/bin/python -m debugpy --listen 0.0.0.0:6901 -m celery -A backend.worker_main worker -l info $extra_params
fi
