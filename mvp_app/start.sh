#!/usr/bin/env bash
set -euo pipefail

BACKEND_PORT=8000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo "Killing processes on port ${port}: ${pids}" >&2
    kill -9 ${pids} >/dev/null 2>&1 || true
  fi
}

# Nur Backend-Port freiräumen
kill_port "${BACKEND_PORT}"

echo "Installing dependencies..."
python3 -m pip install -r "${SCRIPT_DIR}/requirements.txt"

echo "Starting backend (API + Frontend) on http://localhost:${BACKEND_PORT}..."
python3 -m uvicorn backend:app --reload --port "${BACKEND_PORT}" &
BACK_PID=$!

cleanup() {
  echo "Stopping backend (pid ${BACK_PID})..."
  kill "${BACK_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

if command -v open >/dev/null 2>&1; then
  open "http://localhost:${BACKEND_PORT}"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:${BACKEND_PORT}"
fi

echo "Open http://localhost:${BACKEND_PORT} (API + Frontend). Press Ctrl+C to stop."
wait
