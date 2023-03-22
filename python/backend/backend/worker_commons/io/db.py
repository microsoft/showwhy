#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import pickle
from abc import ABC, abstractmethod
from typing import Any, Iterator, Union
from urllib.parse import urlparse

import redis
from redis.typing import ExpiryT

from backend.worker_commons import config

logger = logging.getLogger(__name__)


class Storage(ABC):
    @abstractmethod
    def get_value(self, key: str) -> Any:
        """Gets a value from the storage, return value as stored type"""

    @abstractmethod
    def iter_values(self, pattern: str) -> Iterator[Any]:
        """Returns an iterator with the values that match the pattern"""

    @abstractmethod
    def set_value(self, key: str, value: Any) -> None:
        """Sets a value in the storage"""


class LocalDB(Storage):
    def __init__(self):
        self.db = {}

    def get_value(self, key: str) -> Any:
        return self.db.get(key)

    def iter_values(self, pattern: str) -> Iterator[Any]:
        for key, value in self.db.items():
            if key.startswith(pattern):
                yield value

    def set_value(self, key: str, value: Any) -> None:
        self.db[key] = value


class RedisDB(Storage):
    def __init__(self, redis_url):
        self.client = redis.from_url(redis_url)

    def get_value(self, key: str) -> Any:
        value = self.client.get(key)
        if value:
            return pickle.loads(value)
        else:
            return None

    def iter_values(self, pattern: str) -> Iterator[Any]:
        return self.client.scan_iter(f"{pattern}*")

    def set_value(self, key: str, value: Any, expire_after: Union[ExpiryT, None] = None) -> None:
        if expire_after is None:
            expire_after = config.get_default_expires_after()
        self.client.set(key, pickle.dumps(value), ex=expire_after)


def get_db_client():
    try:
        db_connection = config.get_redis_url()
        scheme = urlparse(db_connection).scheme
        if scheme == "redis":
            return RedisDB(db_connection)
    except Exception:
        logger.warning("Could not connect to Redis, using local storage")
        return LocalDB()
