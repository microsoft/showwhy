import logging
import os


def get_redis_url():
    redis_url = os.environ.get("REDIS_URL")
    if redis_url:
        return redis_url
    else:
        raise Exception("REDIS_URL configuration missing in environment")


def get_storage_url():
    storage_location = os.environ.get("STORAGE")
    if storage_location:
        return storage_location
    else:
        raise Exception("STORAGE configuration missing in environment")


def get_default_expires_after():
    storage_location = os.environ.get("DEFAULT_EXPIRES_AFTER")
    if storage_location:
        return int(storage_location)
    else:
        logging.info("Using default of 2 hours for DEFAULT_EXPIRES_AFTER")
        return 2 * 60 * 60
