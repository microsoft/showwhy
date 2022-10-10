#!/bin/sh
registry=$1

docker tag backend $registry/backend
docker push $registry/backend

docker tag app-shell $registry/app-shell
docker push $registry/app-shell