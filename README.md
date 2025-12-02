# Spitalliste & Leistungsauftrag-Cockpit  
## MVP DEMO – Architektur & UI-Spezifikation (Single Python / Single React)

> **Ziel:** Ein visuell starkes, „fertig wirkendes“ Demo-MVP für GL/CEO.  
> Look & Feel wie ein modernes SaaS-Produkt (Dark Mode, Micro-Interactions).  
> Technisch minimal: **1 Python-File, 1 React-File, Fake-Daten.**

## Scope & Prinzipien
- Verkaufsdemo, kein PoC, keine echten Daten.
- Architektur:
  - `backend/main.py` – Python Mini-API mit statischen JSON-Daten, liefert auch das Frontend aus.
  - `frontend/App.jsx` – Single-File-React-App (alle Komponenten in einer Datei).
  - `infra/start.sh` – Ein-Port-Startskript (pip install, uvicorn, Browser-Open).
- UX-Fokus: Dark Mode, weiche Gradients, Glassmorphism-Cards, klarer Story-Flow („Wo sind wir über/unterversorgt?“ → „Wie groß ist das Problem?“).

## Projektstruktur
```
project-root/
  backend/
    main.py
    requirements.txt
    server.py  # Shim auf main.app
  frontend/
    App.jsx
    index.html
  infra/
    start.sh
  README.md
```

## Backend (`backend/main.py`)
- FastAPI, in-memory Demo-Daten, keine DB, keine echten Spitallisten.
- Endpunkte (alle GET):
  - `/api/dashboard` – KPI-Ebene + Meta (Region, Planperiode).
  - `/api/matrix` – Matrix je Leistungsgruppe (Bedarf, Fälle, Marktanteil, Deckungsgrad, Status, Auftrag).
  - `/api/chart` – Daten für Balken-Chart „Fälle vs. Bedarf“ (Plan vs. eigenes Haus vs. andere Häuser).
  - `/api/scenario/{service_group_id}?delta_percent=` – berechnet Szenario-Delta (Volumen/Deckungsgrad/CHF) und liefert Zeitreihe + verschobene Forecast-Serie.
  - `/health` – einfacher Healthcheck `{ "status": "ok" }`.
- Liefert auch das Frontend aus `frontend/`:
  - `/` und `/index.html` -> `frontend/index.html`
  - `/App.jsx` -> `frontend/App.jsx` (MIME: application/javascript)

## Frontend (`frontend/App.jsx`)
- Dark-Mode SPA mit KPI-Leiste, Matrix, Balken-Chart, Szenario-Panel, Detailtabelle.
- Alle Komponenten und State in einer Datei; keine Bundler, kein Routing.
- Szenario-Logik per Backend-Endpoint (Volumen-Slider, Deckungsgrad/Marktanteil/CHF-Impact, verschobene Forecast-Linie).
- `API_BASE` folgt automatisch der aktuellen Origin (`window.location.origin`), ein Port (8000) genügt.

## UI-Flow (High-Level)
- 1. Versorgungsbild: KPI-Karten & Matrix zeigen Unter-/Überversorgung & Marktanteile.
- 2. Struktur: Balken-Chart „Fälle vs. Bedarf“ macht das Volumenbild sichtbar.
- 3. Szenario: Slider Ausbau/Rückzug, Impact auf Deckungsgrad & CHF sehen.
- 4. Detail: Tabelle mit allen Leistungsgruppen im Überblick.

## Setup & Start (Ein-Port)
1) Anforderungen: Python >= 3.10 (Node optional, React per ES-Module/CDN).

2) Start per Skript:
```bash
./infra/start.sh
```
Das Skript räumt Port 8000 frei, installiert `backend/requirements.txt`, startet uvicorn und öffnet (auf macOS, falls `open` vorhanden) den Browser. Frontend + API unter `http://localhost:8000` erreichbar.

3) Alternativ manuell:
```bash
pip install -r backend/requirements.txt
python3 -m uvicorn backend.main:app --reload --port 8000
```
Dann im Browser `http://localhost:8000/index.html` aufrufen.

## Debugging / Fehlersuche
- **Server startet nicht / Port blockiert:**
  - Prüfen: `lsof -i :8000`
  - `start.sh` räumt Port 8000 vor dem Start; falls nötig, Prozesse manuell killen: `kill -9 <PID>`.
- **Weiße Seite im Browser:**
  - DevTools öffnen (Chrome: Cmd+Option+I / Ctrl+Shift+I).
  - Console-Tab: Fehlermeldungen zu `App.jsx` oder JS-Modul?
  - Network-Tab: Laden `index.html` / `App.jsx` erfolgreich (200, `application/javascript`)? API-Calls zu `/api/dashboard`, `/api/matrix`, `/api/chart` mit 200?
- **API-Fehler / 4xx / 5xx:**
  - Uvicorn-Konsole prüfen auf Tracebacks.
  - Endpunkte testen:
    ```bash
    curl http://localhost:8000/api/dashboard
    curl http://localhost:8000/api/matrix
    curl http://localhost:8000/api/chart
    curl http://localhost:8000/health
    ```
- **Typische Fehlerbilder:**
  - UI zeigt „Lade Demo-Daten…“ dauerhaft: API nicht erreichbar (Server nicht gestartet, falscher Port, CORS-Problem).
  - HTTP-Fehler beim Laden von `App.jsx` / `index.html`: Routen prüfen (`/App.jsx`, `/index.html`), MIME-Type `application/javascript` für `.jsx`.
  - CORS-Fehler: API auf anderer Origin; im Ein-Port-Setup sollte das nicht auftreten.
- **Healthcheck / Smoke-Test:**
  - `curl http://localhost:8000/health` sollte `{ "status": "ok" }` liefern.

## API
- `GET /api/dashboard` – liefert oberste KPI-Ebene und Meta (z. B. Region, Planperiode).
- `GET /api/matrix` – pro Leistungsgruppe: geplanter Bedarf, Fälle aller Häuser, Fälle eigenes Haus, Marktanteil, Deckungsgrad, Status (`under/balanced/over`), `has_assignment`.
- `GET /api/chart` – Daten für das Balken-Chart: je Leistungsgruppe `planned_demand_cases`, `own_hospital_cases`, `other_hospitals_cases`.

## Entwicklungshinweise
- Backend-Logik und Demo-Daten liegen in `backend/main.py`.
- Szenario-Logik und Visualisierung liegen komplett in `frontend/App.jsx`.
- CORS offen für lokale Frontend-Hosts.
- MVP-Charakter: bewusste Vereinfachungen, Fokus auf Storytelling und UI-Flow.
