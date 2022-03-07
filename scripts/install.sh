#!/bin/bash

if ! command -v yarn &> /dev/null
then
    echo "You must install yarn to run this script."
    echo "See: https://yarnpkg.com/ for more information"
    exit
fi

if ! command -v poetry &> /dev/null
then
    echo "You must install poetry to run this script."
    echo "See: https://python-poetry.org/ for more information"
    exit
fi

yarn install

(cd ./python/showwhy-backend && poetry install)
(cd ./python/showwhy-inference && poetry install)