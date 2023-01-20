#!/bin/bash

#
# Partition the instal by group, so
# it won't run out of memory
#

echo "Installing common dependencies..."
poetry install --no-interaction --no-ansi --only main,dev

echo "Installing discover dependencies..."
poetry install --no-interaction --no-ansi --only discover

echo "Installing events dependencies..."
poetry install --no-interaction --no-ansi --only events

echo "Installing exposure dependencies..."
poetry install --no-interaction --no-ansi --only exposure

echo "Removing cache..."
rm -rf .cache