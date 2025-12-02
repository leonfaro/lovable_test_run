"""Statische Demo-Daten fuer das Spitalliste & Leistungsauftrag-Cockpit."""
from typing import Dict, List

HOSPITALS = [
    {"id": "H1", "name": "Kantonsspital Beispiel", "type": "own", "region": "Kanton X"},
    {"id": "H2", "name": "Regionales Spital A", "type": "other", "region": "Kanton X"},
    {"id": "H3", "name": "Privatklinik B", "type": "other", "region": "Kanton X"},
]

SERVICE_GROUPS = [
    {
        "id": "LG1",
        "name": "Orthopaedie elektiv",
        "category": "Orthopaedie",
        "has_assignment": True,
    },
    {
        "id": "LG2",
        "name": "Kardiologie akut",
        "category": "Kardiologie",
        "has_assignment": True,
    },
    {
        "id": "LG3",
        "name": "Allgemeine Innere Medizin",
        "category": "Medizin",
        "has_assignment": True,
    },
    {
        "id": "LG4",
        "name": "Onkologie",
        "category": "Onkologie",
        "has_assignment": False,
    },
    {
        "id": "LG5",
        "name": "Neurorehab",
        "category": "Neurologie",
        "has_assignment": False,
    },
]

PLANNING_RECORDS = [
    {"service_group_id": "LG1", "hospital_id": "H1", "cases_per_year": 420},
    {"service_group_id": "LG1", "hospital_id": "H2", "cases_per_year": 200},
    {"service_group_id": "LG1", "hospital_id": "H3", "cases_per_year": 60},
    {"service_group_id": "LG2", "hospital_id": "H1", "cases_per_year": 310},
    {"service_group_id": "LG2", "hospital_id": "H3", "cases_per_year": 90},
    {"service_group_id": "LG3", "hospital_id": "H1", "cases_per_year": 520},
    {"service_group_id": "LG3", "hospital_id": "H2", "cases_per_year": 260},
    {"service_group_id": "LG3", "hospital_id": "H3", "cases_per_year": 140},
    {"service_group_id": "LG4", "hospital_id": "H1", "cases_per_year": 110},
    {"service_group_id": "LG4", "hospital_id": "H2", "cases_per_year": 180},
    {"service_group_id": "LG5", "hospital_id": "H1", "cases_per_year": 75},
    {"service_group_id": "LG5", "hospital_id": "H3", "cases_per_year": 95},
]

DEMAND_PER_SERVICE_GROUP = [
    {"service_group_id": "LG1", "planned_cases_per_year": 600},
    {"service_group_id": "LG2", "planned_cases_per_year": 380},
    {"service_group_id": "LG3", "planned_cases_per_year": 900},
    {"service_group_id": "LG4", "planned_cases_per_year": 250},
    {"service_group_id": "LG5", "planned_cases_per_year": 180},
]


def get_service_group_map() -> Dict[str, Dict]:
    return {sg["id"]: sg for sg in SERVICE_GROUPS}


def get_demand_map() -> Dict[str, int]:
    return {
        entry["service_group_id"]: entry["planned_cases_per_year"]
        for entry in DEMAND_PER_SERVICE_GROUP
    }


def get_own_hospital_id() -> str:
    for hospital in HOSPITALS:
        if hospital.get("type") == "own":
            return hospital["id"]
    return HOSPITALS[0]["id"]


__all__ = [
    "HOSPITALS",
    "SERVICE_GROUPS",
    "PLANNING_RECORDS",
    "DEMAND_PER_SERVICE_GROUP",
    "get_service_group_map",
    "get_demand_map",
    "get_own_hospital_id",
]
