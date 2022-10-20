import celery.states as states
from fastapi import APIRouter
from tensorflow.python.framework.ops import disable_eager_execution

from backend.discover.algorithms.deci import DeciPayload, DeciRunner
from backend.discover.algorithms.direct_lingam import (
    DirectLiNGAMPayload,
    DirectLiNGAMRunner,
)
from backend.discover.algorithms.notears import NotearsPayload, NotearsRunner
from backend.discover.algorithms.pc import PCPayload, PCRunner
from backend.discover.worker.causal_discovery_task import causal_discovery_task

disable_eager_execution()

discover_router = APIRouter()


@discover_router.get("/")
def main():
    return {"message": "discover api is healthy"}


@discover_router.get("/{task_id}")
def get_results(task_id: str):
    async_task = causal_discovery_task.AsyncResult(task_id)
    if async_task.status == states.SUCCESS:
        return {"status": async_task.status, "result": async_task.get()}
    else:
        return {
            "status": async_task.status,
            "progress": async_task.info["progress"] if async_task.info else 0.0,
        }


@discover_router.post("/notears")
def run_notears(p: NotearsPayload):
    async_task = causal_discovery_task.delay(NotearsRunner, p)
    return {"id": async_task.id}


@discover_router.post("/deci")
def run_deci_hq(p: DeciPayload):
    async_task = causal_discovery_task.delay(DeciRunner, p)
    return {"id": async_task.id}


@discover_router.post("/directlingam")
def run_direct_lingam(p: DirectLiNGAMPayload):
    async_task = causal_discovery_task.delay(DirectLiNGAMRunner, p)
    return {"id": async_task.id}


@discover_router.post("/pc")
def run_pc(p: PCPayload):
    async_task = causal_discovery_task.delay(PCRunner, p)
    return {"id": async_task.id}
