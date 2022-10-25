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


def get_progress(async_task):
    try:
        return async_task.info["progress"]
    except:  # noqa: E722
        return 0.0


@discover_router.get("/")
def main():
    return {"message": "discover api is healthy"}


@discover_router.get("/{task_id}")
def get_discover_results(task_id: str):
    async_task = causal_discovery_task.AsyncResult(task_id)
    if async_task.status == states.SUCCESS:
        return {"status": async_task.status, "result": async_task.get()}
    elif async_task.status == states.FAILURE:
        try:
            return {"status": async_task.status, "result": async_task.get()}
        except Exception as err:
            return {"status": async_task.status, "result": str(err)}
    else:
        return {"status": async_task.status, "progress": get_progress(async_task)}


@discover_router.delete("/{task_id}")
def cancel_discover(task_id: str):
    causal_discovery_task.AsyncResult(task_id).revoke(terminate=True)
    return {"status": states.REVOKED}


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
