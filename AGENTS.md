# Repository Guidelines

## Project Structure & Module Organization
- `backend/` contains the FastAPI demo backend (`main.py`, `requirements.txt`, `server.py` as shim).
- `frontend/` holds the Single-File React app (`App.jsx`) plus `index.html`.
- `infra/` contains start/ops scripts (e.g., `start.sh`).
- `MVP.md` and `Protokoll_Startup_Kapazitaetsplanung.md` capture product vision and founding meeting context; keep them in sync with any functional changes.
- `Makefile` exposes a convenience `run` target; extend it with new automation (tests, lint) when added.

## Build, Test, and Development Commands
- `./.venv/bin/python -m pip install --upgrade pip` keeps the virtualenv tooling current (run after creating the venv).
- `pip install -r backend/requirements.txt` installs runtime dependencies.
- `make run` (or `./infra/start.sh`) launches backend + frontend together on port 8000.
- `python3 -m compileall backend` is the lightweight smoke check for syntax after edits; use it before pushing.

## Coding Style & Naming Conventions
- Follow PEP 8: 4-space indentation, snake_case for functions/variables, PascalCase for classes. Keep line length ≤ 100 chars.
- Modules should expose explicit `__all__` lists when intended for import; maintain docstrings at the module top explaining purpose.
- When adding assets or configs, keep them inside `frontend/` (e.g., `assets/`, `data/`) or `backend/` as appropriate.

## Testing Guidelines
- No formal test suite exists yet. When introducing logic, add targeted tests (e.g., `tests/test_simulate.py`) using `pytest` and wire them via a `make test` target.
- Document edge cases inside test names (`test_assimilate_weekly_handles_future_dates`) to aid reviewers.
- Until automated tests land, validate changes with `python3 -m compileall` and manual dashboard smoke checks.

## Commit & Pull Request Guidelines
- Use concise, imperative commit messages (`Add weekly assimilation guard`). Group related changes; avoid mixins of feature + formatting.
- PRs should include: summary of changes, testing evidence (commands + results), screenshots/GIFs for UI updates, and references to MVP requirements when relevant.
- Request review when lint/tests pass and reviewers can reproduce via the documented commands.
