from fastapi import APIRouter
from tensorflow.python.framework.ops import disable_eager_execution

from backend.discover.algorithms.deci import deci_router
from backend.discover.algorithms.direct_lingam import direct_lingam_router
from backend.discover.algorithms.notears import notears_router
from backend.discover.algorithms.pc import pc_router

disable_eager_execution()

discover_router = APIRouter()


@discover_router.get("/")
def main():
    return {"message": "discover api is healthy"}


discover_router.include_router(notears_router, prefix="/notears")
discover_router.include_router(deci_router, prefix="/deci")
discover_router.include_router(direct_lingam_router, prefix="/directlingam")
discover_router.include_router(pc_router, prefix="/pc")
