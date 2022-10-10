#!/bin/bash

if [[ -z "${WORKER}" ]]; then
    ./scripts/start_api.sh
else
    ./scripts/start_worker.sh
fi
