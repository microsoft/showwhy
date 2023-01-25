import os


def get_intervention_model_expires_after():
    storage_location = os.environ.get("INTERVENTION_MODEL_EXPIRES_AFTER")
    if storage_location:
        return int(storage_location)
    else:
        return 24 * 60 * 60
