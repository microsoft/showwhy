import logging

from fastapi import APIRouter
from tensorflow.python.framework.ops import disable_eager_execution

from backend.discover.algorithms.deci import DeciPayload, DeciRunner
from backend.discover.algorithms.direct_lingam import (
    DirectLiNGAMPayload,
    DirectLiNGAMRunner,
)
from backend.discover.algorithms.notears import NotearsPayload, NotearsRunner
from backend.discover.algorithms.pc import PCPayload, PCRunner
from backend.discover.api.data_prep import prepare_data

disable_eager_execution()

discover_router = APIRouter()


@discover_router.get("/")
def main():
    return {"message": "discover api is healthy"}


@discover_router.post("/notears")
@prepare_data
def run_notears(p: NotearsPayload):
    logging.info("Running NOTEARS Causal Discovery.")
    runner = NotearsRunner(p)
    return runner.do_causal_discovery()


@discover_router.post("/deci")
@prepare_data
def run_deci_hq(p: DeciPayload):
    logging.info("Running DECI Causal Discovery.")
    runner = DeciRunner(p)
    return runner.do_causal_discovery()


@discover_router.post("/directlingam")
@prepare_data
def run_direct_lingam(p: DirectLiNGAMPayload):
    logging.info("Running DirectLiNGAM Causal Discovery.")
    runner = DirectLiNGAMRunner(p)
    return runner.do_causal_discovery()


@discover_router.post("/pc")
@prepare_data
def run_pc(p: PCPayload):
    logging.info("Running PC Causal Discovery.")
    runner = PCRunner(p)
    return runner.do_causal_discovery()
