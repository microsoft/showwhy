import os
from datetime import timedelta


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
    expires_after = os.environ.get("DEFAULT_EXPIRES_AFTER_HOURS")
    if expires_after:
        return timedelta(hours=int(expires_after))
    else:
        return timedelta(hours=8)
