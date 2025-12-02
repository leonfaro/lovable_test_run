#!/usr/bin/env bash
set -euo pipefail

# Simple launcher for the landing page + embedded MVP (v2.0)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKEND_PORT="${BACKEND_PORT:-8000}"

cd "${ROOT_DIR}"
if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "python3 not found. Please install Python 3.x." >&2
  exit 1
fi

if [ -x "${ROOT_DIR}/.venv/bin/python" ]; then
  PYTHON="${ROOT_DIR}/.venv/bin/python"
fi

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo "Freeing port ${port}: ${pids}" >&2
    kill -9 ${pids} >/dev/null 2>&1 || true
  fi
}

# Ensure dependencies are present (uvicorn in particular)
if ! "${PYTHON}" - <<'PY' >/dev/null 2>&1; then
import uvicorn  # noqa: F401
PY
  echo "Installing backend dependencies..."
  "${PYTHON}" -m pip install --upgrade pip
  "${PYTHON}" -m pip install -r "${ROOT_DIR}/backend/requirements.txt"
fi

# Sync marketing landing page into the served frontend path
cp "${ROOT_DIR}/website/index.html" "${ROOT_DIR}/frontend/index.html"

kill_port "${BACKEND_PORT}"

echo "Starting FastAPI backend on http://localhost:${BACKEND_PORT}"

"${PYTHON}" -m uvicorn backend.main:app --reload --port "${BACKEND_PORT}"
