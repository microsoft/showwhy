import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.discover.router import discover_router
from backend.events.router import events_router
from backend.exposure.api.router import exposure_router

app = FastAPI()

enable_cors = os.getenv("ENABLE_CORS", "").strip()

if enable_cors:
    origins = [c.strip() for c in enable_cors.split(",")]
    logging.info(f"Enabling CORS for {origins}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(events_router, prefix="/api/events")
app.include_router(discover_router, prefix="/api/discover")
app.include_router(exposure_router, prefix="/api/exposure")
