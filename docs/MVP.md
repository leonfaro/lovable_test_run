**Spitalliste & Leistungsauftrag MVP – Architektur und Funktionsumfang (aktuell)**

* **Zielbild:** Präsentationsfähiges Demo-Dashboard (strategischer Blick), keine echten Daten.
* **Stack:** FastAPI-Backend (`backend/main.py`) + React-Single-File-Frontend (`frontend/App.jsx`), ohne Build-Tooling (CDN-React, Inline-SVG).
* **Domain:** Leistungsgruppen nach Spitalliste, Fokus auf Deckungsgrad/Marktanteil, Szenario-Schieberegler (Backend-API).

**Backend (`backend/main.py`)**
* FastAPI, offenes CORS, keine Persistenz/DB, Fake-Daten in-memory.
* Endpunkte (alle GET):
  * `/api/dashboard` – aggregierte KPIs (Deckungsgrad gesamt, Risiko-Gruppen, Auftragsanteil, Volumen-Shift) + Meta (Region/Planperiode).
  * `/api/matrix` – je Leistungsgruppe Bedarf, Fälle gesamt/eigenes Haus, Marktanteil, Deckungsgrad, Status, Leistungsauftrag.
  * `/api/chart` – Balken-Chart-Daten Fälle vs. Bedarf je Leistungsgruppe.
  * `/api/timeseries/{service_group_id}` – synthetische Monatsreihen (Plan/Ist/Forecast + externer Index) für eine Gruppe.
  * `/api/timeseries` – alle Zeitreihen gesammelt.
  * `/health` – `{ "status": "ok" }`.
* Liefert Frontend statisch mit aus `frontend/`: `/`, `/index.html`, `/App.jsx` (korrekte MIME-Types).
* Datenquellen & Logik:
  * Statische Tabellen für Spitäler, Leistungsgruppen, Planbedarf, Fälle (Mock).
  * Kennzahlen für Deckungsgrad/Marktanteil aus In-Memory-Daten; Zeitreihe mit leichter Saisonalität/Rauschen.
  * Coverage-Status-Klassifizierung: under <80 %, balanced ≤110 %, slightly_over ≤120 %, sonst over.

**Frontend (`frontend/App.jsx` + `frontend/index.html`)**
* Single-Page-App (React 18 über CDN, htm), Dark-Theme mit Gradients/Glassmorphism.
* Views:
  * KPI-Leiste (Deckungsgrad gesamt, Risiko-Gruppen, Auftragsanteil, Volumen-Shift).
  * Filter-Panel (Region/Planperiode/Perspektive/Fokus, Auftrag-Only Toggle).
  * Matrix klickbar je Leistungsgruppe (Deckungsgrad/Marktanteil/Status).
  * Balken-Chart „Fälle vs. Bedarf“ (Eigenes Haus vs. andere).
  * Zeitreihen-Panel (Plan/Ist/Forecast, Forecast-Bereich ab 2025).
  * Szenario-Panel (Status-quo/Ausbau/Rückzug Presets, Slider -50 % bis +50 %; rechnet im Backend `/api/scenario/{id}` und verschiebt Forecast-Linie/Volumina).
  * Detailtabelle mit Suche (Bedarf, Fälle, Auftrag).
* `API_BASE` nutzt die aktuelle Origin; bei Ein-Port-Setup keine CORS-Themen.

**Datenfluss**
* Initial: Parallel-GET auf `/api/matrix`, `/api/dashboard`, `/api/chart`.
* Auswahl einer Leistungsgruppe triggert GET `/api/scenario/{id}?delta_percent=...` (liefert Baseline-Row, Szenario-Row, Zeitreihe und verschobene Forecast-Serie).
* Szenario-Rechnung läuft im Backend (API), liefert Volumen/Deckungsgrad/CHF-Demo und passt die Forecast-Serie an; das Frontend nutzt nur diese Antwort.

**Nicht-Ziele**
* Keine echten Spitallisten/Daten, keine Auth, kein Persistenz-Layer, kein Build/Bundler.
* Keine Export-/PDF-/CSV-Wege, kein Role-Based Access, keine Realtime-Feeds.

**Betrieb (Lokal)**
* Start (Ein-Port): `./infra/start.sh` (räumt Port, pip install `backend/requirements.txt`, startet uvicorn, öffnet Browser).
* Manuell: `pip install -r backend/requirements.txt && uvicorn backend.main:app --reload --port 8000`, dann `http://localhost:8000/index.html`.
* Smoke-Test: `PYTHONPYCACHEPREFIX=./__pycache__ python3 -m compileall backend`.

*Hinweis:* Dokument beschreibt den Stand der aktuellen Demo; bei Funktionsänderungen Backend/Frontend synchron pflegen.
