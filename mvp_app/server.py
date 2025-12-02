"""
Deprecated shim.

The demo backend now lives in `backend.py` (FastAPI app = `backend.app`).
This file is kept only for backwards compatibility and should not be used
as the main entrypoint anymore.
"""
from backend import app  # noqa: F401

__all__ = ["app"]
