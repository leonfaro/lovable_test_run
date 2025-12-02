**Kapazitaetsplanung MVP - Architektur und Funktionsumfang (aktuell)**

* **Zielbild:** Einfaches, strategisch-taktisches Kapazitaetsmanagement (kein Live-System).
* **Stack:** Ein Python-Backend (`server.py`, FastAPI) und ein React-Frontend (`frontend/App.jsx`)
  ohne Build-Tooling (CDN-React, Inline-SVG-Chart).
* **Ressourcen:** Betten, OP, Personal, Sprechstunden, Notfall.

**Backend (`server.py`)**
* FastAPI mit offenem CORS, Endpunkte:
  * `GET /defaults` liefert Default-Konfiguration (Simulation + Ampel-Schwellen).
  * `POST /dashboard` liefert pro Ressource horizon-aggregiertes Risiko, Status
    (GREEN/AMBER/RED/BLUE), Entscheidungstag, Empfehlung, Top-Treiber,
    Alt-Signale und KPI-Aggregate.
  * `POST /timeseries` liefert Zeitreihe fuer eine Ressource + Horizont mit Plan,
    Forecast, Kapazitaet, Gap, Status jetzt/Forecast, Entscheidungstag,
    Empfehlung, Top-Treiber.
* Simulation:
  * `SimulationConfig` (Jahr, Seed, budget_growth, verweildauer_delta, op_zeiten_delta,
    nurse_ratio, abwesenheiten, cluster_anzahl, saisonalitaet_staerke, flu_index_staerke,
    weather_risk_staerke, datenrhythmus, today).
  * Externe Indizes: Saisonalitaet, Flu, Wetter, Events (Gaussian/periodisch + Impulse).
  * Interne Faktoren als Prozent-Modifier per Ressource (Verweildauer, OP-Zeiten,
    Nurse-Ratio, Abwesenheiten, Cluster).
  * Forecast-Assimilation: exponentiell geglaettet (alpha=0.3), Rhythmus woechentlich
    oder monatlich.
* Ampellogik:
  * Schwellen: green/yellow (default 0.05/0.15), Status aus norm_gap.
  * Empfehlungen: heuristisch je Ressource (Betten oeffnen, OP glaetten, Schichten
    umplanen, Ueberkapazitaet vorziehen).
* Aggregationen:
  * Risiko je Horizont: Kurz (max), Mid (0.7*p95+0.3*mean), Lang (0.5/0.5).
  * KPIs: Auslastung (aktuelle Woche), MAPE (Vergangenheit), Wartetage (positiver Gap),
    Stornoquote (aus norm_gap), Pflege-Engpass (Interpol aus norm_gap Personal).
  * Alt-Signale: Flu, Wetter, Events mit 4-stufiger Severity.

**Frontend (`frontend/App.jsx` + `index.html`)**
* Ein React-Component, kein Router, State via `useState`/`useEffect`.
* API-Basis: `API_BASE` global oder default `http://localhost:8000`.
* Views:
  * Steuerleiste: Horizon, Jahr, Seed, Budget, Nurse-Ratio, Flu-Index, Schwellen.
  * Ressourcen-Kacheln: Status, Risk %, Empfehlung; Klick setzt Fokus.
  * KPI-Panel: Auslastung, MAPE, Wartetage, Stornoquote, Pflege-Engpass.
  * Detail: Alert (Status jetzt -> Forecast, Entscheidungstag, Empfehlung), Top-Treiber,
    Inline-SVG-Linienchart (Plan/Forecast/Kapazitaet).
  * Alt-Signal-Chips (Severity-basiert).
* Styling: Inline-CSS (dunkles Panel-Theme), keine externen Assets ausser React CDN.

**Datenfluss**
* Frontend holt Defaults -> setzt State -> POST `/dashboard` mit Config+Horizon ->
  setzt aktive Ressource -> POST `/timeseries` fuer Fokus.
* Backend berechnet alles pro Request (keine Persistenz).

**Nicht-Ziele**
* Kein Streamlit, keine SVG-Exportpfade, keine Spotlight/Overlay-Logik.
* Kein Persistenzlayer, keine Auth, keine Echtzeitfeeds, keine externen Fonts/CDNs
  ausser React.

**Betrieb (Lokal)**
* Backend: `uvicorn server:app --reload --port 8000`
* Frontend: `cd frontend && python3 -m http.server 3000`
* Rauchtest: `PYTHONPYCACHEPREFIX=./__pycache__ python3 -m compileall server.py`

*Hinweis:* Dokument beschreibt den aktuellen Stand nach der Vereinfachung; ergaenze nur,
falls neue Features ins Backend/Frontend kommen. Simplicity > Feature-Ballast.
