#!/bin/sh
custom_docker_registry=$1

if [ -z "$custom_docker_registry" ]; then
	echo "using default registry"
else
	echo "using registry: $custom_docker_registry"
fi

echo "building backend image..."
docker build -t backend python/backend --build-arg REGISTRY=$custom_docker_registry
