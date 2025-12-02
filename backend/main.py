"""Demo backend fuer das Rang 5 Spitalliste & Leistungsauftrag-Cockpit."""
from pathlib import Path
import math
import random
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .demo_data import (
    HOSPITALS,
    PLANNING_RECORDS,
    SERVICE_GROUPS,
    get_demand_map,
    get_own_hospital_id,
    get_service_group_map,
)

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

__all__ = ["app"]

DEMO_DECKUNGSBEITRAG_CHF = 4500


app = FastAPI(title="Spitalliste & Leistungsauftrag Demo", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def categorize_coverage(coverage_percent: float) -> str:
    if coverage_percent < 80.0:
        return "under"
    if coverage_percent <= 110.0:
        return "balanced"
    if coverage_percent <= 120.0:
        return "slightly_over"
    return "over"


def build_matrix_rows() -> List[Dict]:
    service_map = get_service_group_map()
    demand_map = get_demand_map()
    own_hospital_id = get_own_hospital_id()

    rows: List[Dict] = []
    for service_group_id, service_group in service_map.items():
        planned = float(demand_map.get(service_group_id, 0))
        records = [r for r in PLANNING_RECORDS if r["service_group_id"] == service_group_id]
        total_cases = float(sum(r["cases_per_year"] for r in records))
        own_cases = float(
            sum(r["cases_per_year"] for r in records if r["hospital_id"] == own_hospital_id)
        )
        other_cases = max(total_cases - own_cases, 0.0)
        coverage_percent = (total_cases / planned * 100.0) if planned else 0.0
        own_share_percent = (own_cases / total_cases * 100.0) if total_cases else 0.0

        rows.append(
            {
                "service_group_id": service_group_id,
                "service_group_name": service_group["name"],
                "category": service_group["category"],
                "planned_demand_cases": planned,
                "total_cases_all_hospitals": total_cases,
                "own_hospital_cases": own_cases,
                "other_hospitals_cases": other_cases,
                "own_share_percent": round(own_share_percent, 1),
                "coverage_percent": round(coverage_percent, 1),
                "coverage_status": categorize_coverage(coverage_percent),
                "has_assignment": bool(service_group["has_assignment"]),
            }
        )
    return rows


def build_dashboard_payload(matrix_rows: List[Dict]) -> Dict:
    total_planned = sum(row["planned_demand_cases"] for row in matrix_rows)
    total_cases = sum(row["total_cases_all_hospitals"] for row in matrix_rows)
    total_coverage_percent = (total_cases / total_planned * 100.0) if total_planned else 0.0

    risky_service_groups_count = sum(
        1
        for row in matrix_rows
        if row["coverage_percent"] < 80.0 or row["coverage_percent"] > 120.0
    )

    own_cases_total = sum(row["own_hospital_cases"] for row in matrix_rows)
    own_cases_in_assignment = sum(
        row["own_hospital_cases"] for row in matrix_rows if row["has_assignment"]
    )
    cases_in_assignment_share_percent = (
        own_cases_in_assignment / own_cases_total * 100.0 if own_cases_total else 0.0
    )

    volume_shift_potential_cases = sum(
        abs(row["planned_demand_cases"] - row["total_cases_all_hospitals"])
        for row in matrix_rows
        if row["coverage_status"] in {"under", "over"}
    )

    return {
        "total_coverage_percent": round(total_coverage_percent, 1),
        "risky_service_groups_count": risky_service_groups_count,
        "cases_in_assignment_share_percent": round(cases_in_assignment_share_percent, 1),
        "volume_shift_potential_cases": round(volume_shift_potential_cases),
        "meta": {"region": "Kanton X", "planning_period": "2025-2029"},
    }


def build_chart_payload(matrix_rows: List[Dict]) -> Dict:
    return {
        "service_groups": [
            {
                "service_group_id": row["service_group_id"],
                "name": row["service_group_name"],
                "planned_demand_cases": row["planned_demand_cases"],
                "own_hospital_cases": row["own_hospital_cases"],
                "other_hospitals_cases": row["other_hospitals_cases"],
            }
            for row in matrix_rows
        ]
    }


def build_timeseries_for_service_group(service_group_id: str) -> Dict:
    service_map = get_service_group_map()
    demand_map = get_demand_map()
    if service_group_id not in service_map:
        raise ValueError(f"Service group {service_group_id} not found")

    service_group = service_map[service_group_id]
    annual_planned = float(demand_map.get(service_group_id, 0))
    monthly_baseline = annual_planned / 12.0 if annual_planned else 0.0
    rng = random.Random(service_group_id)

    def seasonal_factor(month: int, category: str) -> float:
        """Very light seasonality, slightly tweaked per category."""
        winter_boost = 1.25 if month in {12, 1, 2} else 1.0
        summer_dip = 0.88 if month in {7, 8} else 1.0
        shoulder = 1.05 if month in {3, 11} else 1.0
        category_adjust = {
            "Orthopaedie": 0.98,
            "Kardiologie": 1.05,
            "Onkologie": 1.02,
            "Neurologie": 1.0,
            "Medizin": 1.0,
        }.get(category, 1.0)
        return winter_boost * summer_dip * shoulder * category_adjust

    def external_index(month: int) -> float:
        # Simple sinus to mimic flu/weather impact: peak in January, trough in July.
        rad = (month - 1) / 12.0 * 2 * math.pi
        return round(0.55 + 0.25 * math.cos(rad), 3)

    series: List[Dict] = []
    start_year, start_month = 2022, 1
    total_months = 48
    for idx in range(total_months):
        year = start_year + (start_month - 1 + idx) // 12
        month = ((start_month - 1 + idx) % 12) + 1
        phase = "historical" if year <= 2024 else "forecast"

        base = monthly_baseline * seasonal_factor(month, service_group["category"])
        drift = 1.0 + 0.01 * ((year - start_year) / 3.0)

        if phase == "historical":
            noise = rng.uniform(-0.12, 0.12)
            actual = max(base * (1 + noise), 0.0)
            forecast_val = max(actual * 0.98 + base * 0.02, 0.0)
        else:
            growth_years = year - 2024
            growth = 0.015 * growth_years
            noise = rng.uniform(-0.05, 0.05)
            forecast_val = max(base * drift * (1 + growth) * (1 + noise), 0.0)
            actual = forecast_val

        planned = max(base, 0.0)
        series.append(
            {
                "month": f"{year:04d}-{month:02d}",
                "phase": phase,
                "planned": round(planned, 1),
                "actual": round(actual, 1),
                "forecast": round(forecast_val, 1),
                "external_index": max(0.0, min(1.0, external_index(month))),
            }
        )

    return {
        "service_group_id": service_group_id,
        "name": service_group["name"],
        "category": service_group["category"],
        "series": series,
    }


def apply_scenario_to_row(row: Dict, delta_percent: float) -> Dict:
    factor = 1 + delta_percent / 100.0
    own_cases = row["own_hospital_cases"] * factor
    other_cases = (
        row.get("other_hospitals_cases")
        if row.get("other_hospitals_cases") is not None
        else max(row["total_cases_all_hospitals"] - row["own_hospital_cases"], 0.0)
    )
    total_cases = own_cases + other_cases
    planned_cases = row["planned_demand_cases"]
    coverage_percent = (total_cases / planned_cases * 100.0) if planned_cases else 0.0
    own_share_percent = (own_cases / total_cases * 100.0) if total_cases else 0.0
    delta_cases = own_cases - row["own_hospital_cases"]
    return {
        **row,
        "adjusted_own_cases": round(own_cases, 1),
        "adjusted_total_cases": round(total_cases, 1),
        "adjusted_coverage_percent": round(coverage_percent, 1),
        "adjusted_coverage_status": categorize_coverage(coverage_percent),
        "adjusted_own_share_percent": round(own_share_percent, 1),
        "delta_cases": round(delta_cases, 1),
        "delta_eur": round(delta_cases * DEMO_DECKUNGSBEITRAG_CHF, 1),
    }


def apply_scenario_to_timeseries(series: List[Dict], delta_percent: float) -> List[Dict]:
    factor = 1 + delta_percent / 100.0
    scenario_series: List[Dict] = []
    for point in series:
        scenario_val: Optional[float]
        if point.get("phase") == "forecast" and point.get("forecast") is not None:
            scenario_val = point["forecast"] * factor
        else:
            scenario_val = point.get("forecast")
        scenario_series.append(
            {
                **point,
                "scenario_forecast": round(scenario_val, 1) if scenario_val is not None else None,
            }
        )
    return scenario_series


def _frontend_file(filename: str, media_type: str) -> FileResponse:
    """Serve files from the colocated frontend folder."""
    path = FRONTEND_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    return FileResponse(path, media_type=media_type)


@app.get("/")
def root() -> FileResponse:
    return get_index()


@app.get("/api/matrix")
def get_matrix() -> List[Dict]:
    return build_matrix_rows()


@app.get("/api/dashboard")
def get_dashboard() -> Dict:
    matrix_rows = build_matrix_rows()
    return build_dashboard_payload(matrix_rows)


@app.get("/api/chart")
def get_chart() -> Dict:
    matrix_rows = build_matrix_rows()
    return build_chart_payload(matrix_rows)


@app.get("/api/timeseries/{service_group_id}")
def get_timeseries(service_group_id: str) -> Dict:
    try:
        return build_timeseries_for_service_group(service_group_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/timeseries")
def get_all_timeseries() -> Dict[str, Dict]:
    return {
        service_group["id"]: build_timeseries_for_service_group(service_group["id"])
        for service_group in SERVICE_GROUPS
    }


@app.get("/api/scenario/{service_group_id}")
def get_scenario(
    service_group_id: str, delta_percent: float = 0.0, include_timeseries: bool = True
) -> Dict:
    matrix_rows = build_matrix_rows()
    base_row = next(
        (row for row in matrix_rows if row["service_group_id"] == service_group_id), None
    )
    if not base_row:
        raise HTTPException(status_code=404, detail=f"Service group {service_group_id} not found")

    payload: Dict = {
        "delta_percent": delta_percent,
        "service_group": base_row,
        "scenario": apply_scenario_to_row(base_row, delta_percent),
    }
    if include_timeseries:
        timeseries = build_timeseries_for_service_group(service_group_id)
        payload["timeseries"] = timeseries
        payload["scenario_timeseries"] = {
            **timeseries,
            "series": apply_scenario_to_timeseries(timeseries["series"], delta_percent),
        }
    return payload


@app.get("/App.jsx")
def get_frontend_bundle() -> FileResponse:
    """Serve the frontend SPA file with proper JS MIME."""
    return _frontend_file("App.jsx", media_type="application/javascript")


@app.get("/index.html")
def get_index() -> FileResponse:
    return _frontend_file("index.html", media_type="text/html")


@app.get("/frontend")
def fallback_frontend() -> FileResponse:
    return get_index()


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}
