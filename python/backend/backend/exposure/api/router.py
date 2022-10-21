#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from uuid import UUID

from fastapi import APIRouter, UploadFile

from backend.exposure.api.confidence_interval_api import confidence_interval_router
from backend.exposure.api.estimate_effect_api import estimate_effect_router
from backend.exposure.api.identify_estimand_api import identify_estimand_router
from backend.exposure.api.notebook_api import notebook_router
from backend.exposure.api.refute_estimate_api import refute_estimate_router
from backend.exposure.api.shap_interpreter_api import shap_interpreter_router
from backend.exposure.api.significance_test_api import significance_test_router
from backend.worker_commons.io.storage import get_storage_client

exposure_router = APIRouter()


routers = [
    identify_estimand_router,
    estimate_effect_router,
    refute_estimate_router,
    confidence_interval_router,
    shap_interpreter_router,
    significance_test_router,
    notebook_router,
]

for router in routers:
    exposure_router.include_router(router)


@exposure_router.get("/")
def health_check():
    return {"message": "exposure api is healthy"}


@exposure_router.post("/upload/{workspace_name}")
async def upload(workspace_name: UUID, file: UploadFile):
    try:
        storage_client = get_storage_client()
        storage_client.save(str(workspace_name), file.filename, file.file.read())
        return {"status": "ok"}
    except Exception as error:
        return {"status": str(error)}
