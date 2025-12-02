import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const API_BASE = window.API_BASE || window.location.origin;
const DEMO_DECKUNGSBEITRAG = 4500;

const STYLES = `
* { box-sizing: border-box; }
:root {
  --bg: #060b1a;
  --panel: rgba(15,23,42,0.85);
  --card: rgba(17,24,39,0.7);
  --border: rgba(148,163,184,0.35);
  --text: #e5e7eb;
  --muted: #94a3b8;
  --accent: #38bdf8;
  --green: #22c55e;
  --amber: #f59e0b;
  --red: #ef4444;
  --blue: #60a5fa;
}
body {
  margin: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(56,189,248,0.08), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(34,197,94,0.08), transparent 35%),
    radial-gradient(circle at 10% 70%, rgba(99,102,241,0.07), transparent 35%),
    var(--bg);
  color: var(--text);
  font-family: "Inter", "Manrope", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}
a { color: var(--accent); }
.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}
.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}
.eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  font-weight: 700;
}
h1 { margin: 4px 0 6px; font-size: 28px; }
.subtitle { color: var(--muted); margin: 0; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.chip {
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}
.chip:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 10px 24px rgba(0,0,0,0.25); }
.chip.accent {
  border-color: rgba(56,189,248,0.6);
  background: rgba(56,189,248,0.12);
  color: var(--accent);
}
.chip.muted { color: var(--muted); }
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.25);
  backdrop-filter: blur(20px);
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.18);
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}
.card:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 18px 42px rgba(0,0,0,0.25); }
.grid { display: grid; gap: 12px; }
.grid.four { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.grid.two { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.kpi { display: flex; flex-direction: column; gap: 6px; }
.kpi-label { color: var(--muted); font-size: 13px; }
.kpi-value { font-size: 22px; font-weight: 800; }
.kpi-hint { color: var(--muted); font-size: 12px; }
.controls { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.controls label {
  font-size: 13px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.controls select,
.controls input,
.controls .toggle {
  background: rgba(15,23,42,0.6);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  min-width: 120px;
}
.button {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #0b1220;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(56,189,248,0.25);
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, opacity 150ms ease;
}
.button:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 14px 32px rgba(56,189,248,0.32); }
.button.ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: none;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.muted { color: var(--muted); }
.matrix { display: grid; gap: 10px; }
.matrix-row {
  display: grid;
  grid-template-columns: 1.2fr 0.6fr 0.6fr 0.5fr 0.5fr;
  gap: 8px;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}
.matrix-row:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 10px 24px rgba(0,0,0,0.22); }
.matrix-row.active {
  border-color: rgba(56,189,248,0.6);
  box-shadow: 0 10px 22px rgba(56,189,248,0.18);
}
.status-pill {
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  width: fit-content;
}
.status-under {
  background: rgba(239,68,68,0.15);
  color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.4);
}
.status-balanced {
  background: rgba(34,197,94,0.16);
  color: #bbf7d0;
  border: 1px solid rgba(34,197,94,0.4);
}
.status-slightly_over {
  background: rgba(245,158,11,0.15);
  color: #fcd34d;
  border: 1px solid rgba(245,158,11,0.4);
}
.status-over {
  background: rgba(248,113,113,0.18);
  color: #fecdd3;
  border: 1px solid rgba(248,113,113,0.45);
}
.bar-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #1f2937;
  overflow: hidden;
}
.bar-fill { height: 100%; border-radius: 999px; }
.chart-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.chart-row:last-child { border-bottom: none; }
.legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--muted); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.scenario {
  background: linear-gradient(160deg, rgba(56,189,248,0.08), rgba(14,165,233,0.03));
  border: 1px solid rgba(56,189,248,0.3);
}
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 10px;
}
.scenario-metric {
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 10px;
}
.table { width: 100%; border-collapse: collapse; }
.table th,
.table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}
.table th { color: var(--muted); font-weight: 600; }
.table tr:hover { background: rgba(255,255,255,0.02); }
.error {
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.4);
  color: #fecdd3;
  padding: 12px;
  border-radius: 10px;
  margin: 12px 0;
}
.loading { color: var(--muted); }
.timeseries-panel {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(0,0,0,0.12);
}
.timeseries-panel h3 { color: #0f172a; }
.timeseries-panel .muted,
.timeseries-panel .timeseries-hint,
.timeseries-panel .timeseries-legend { color: #475569; }
.timeseries-panel .chip {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
}
.timeseries-surface {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 12px 8px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}
.timeseries-legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: #475569; margin-top: 8px; }
.timeseries-legend span { display: inline-flex; align-items: center; gap: 6px; }
.timeseries-separator { fill: rgba(56,189,248,0.06); }
.timeseries-separator-line { stroke: rgba(56,189,248,0.3); stroke-dasharray: 4 4; }
.timeseries-axis-label { fill: #64748b; font-size: 10px; }
.timeseries-hint { color: var(--muted); font-size: 12px; margin-top: 8px; }
`;

console.log("[MVP] App module loaded");

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return Math.round(value).toLocaleString("de-DE");
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(value);
}

function coverageStatusFromPercent(coveragePercent) {
  if (coveragePercent < 80) return "under";
  if (coveragePercent <= 110) return "balanced";
  if (coveragePercent <= 120) return "slightly_over";
  return "over";
}

function computeScenario(row, deltaPercent) {
  if (!row) return null;
  const factor = 1 + deltaPercent / 100;
  const ownCases = row.own_hospital_cases * factor;
  const otherCases =
    row.other_hospitals_cases != null
      ? row.other_hospitals_cases
      : Math.max(row.total_cases_all_hospitals - row.own_hospital_cases, 0);
  const totalCases = ownCases + otherCases;
  const coveragePercent = row.planned_demand_cases
    ? (totalCases / row.planned_demand_cases) * 100
    : 0;
  const ownSharePercent = totalCases ? (ownCases / totalCases) * 100 : 0;
  const deltaCases = ownCases - row.own_hospital_cases;
  return {
    ...row,
    adjusted_own_cases: ownCases,
    adjusted_total_cases: totalCases,
    adjusted_coverage_percent: coveragePercent,
    adjusted_coverage_status: coverageStatusFromPercent(coveragePercent),
    adjusted_own_share_percent: ownSharePercent,
    delta_cases: deltaCases,
    delta_eur: deltaCases * DEMO_DECKUNGSBEITRAG,
  };
}

function computeTimeseriesScenario(baseSeries, deltaPercent) {
  if (!Array.isArray(baseSeries) || !baseSeries.length) return [];
  const factor = 1 + deltaPercent / 100;
  return baseSeries.map((point) => ({
    ...point,
    scenario_forecast: point.phase === "forecast" ? (point.forecast || 0) * factor : point.forecast,
  }));
}

function KpiCard({ label, value, hint }) {
  return html`
    <div className="panel kpi">
      <div className="kpi-label">${label}</div>
      <div className="kpi-value">${value}</div>
      ${hint ? html`<div className="kpi-hint">${hint}</div>` : null}
    </div>
  `;
}

function CoveragePill({ status, value }) {
  if (!status) return null;
  const cls = `status-pill status-${status}`;
  return html`<span className=${cls}>${value || status}</span>`;
}

function MatrixRow({ row, active, onSelect }) {
  return html`
    <div className=${`matrix-row ${active ? "active" : ""}`} onClick=${onSelect}>
      <div>
        <div style=${{ fontWeight: 800 }}>${row.service_group_name}</div>
        <div className="muted">${row.category}</div>
      </div>
      <div>
        <div className="muted">Deckungsgrad</div>
        <div style=${{ fontWeight: 700 }}>${formatPercent(row.coverage_percent)}</div>
      </div>
      <div>
        <div className="muted">Marktanteil</div>
        <div style=${{ fontWeight: 700 }}>${formatPercent(row.own_share_percent)}</div>
      </div>
      <div>
        <div className="muted">Fälle</div>
        <div style=${{ fontWeight: 700 }}>${formatNumber(row.total_cases_all_hospitals)}</div>
      </div>
      <div><${CoveragePill} status=${row.coverage_status} /></div>
    </div>
  `;
}

function BarChart({ data }) {
  if (!data || !data.service_groups || !data.service_groups.length) {
    return html`<div className="muted">Keine Chart-Daten vorhanden.</div>`;
  }
  const maxCases = Math.max(
    ...data.service_groups.map((g) => {
      const planned = g.planned_demand_cases || 0;
      const total = (g.own_hospital_cases || 0) + (g.other_hospitals_cases || 0);
      return Math.max(planned, total);
    })
  );

  return html`
    <div className="legend" style=${{ marginBottom: 8 }}>
      <span>
        <span className="dot" style=${{ background: "var(--amber)" }}></span>Bedarf (Plan)
      </span>
      <span>
        <span className="dot" style=${{ background: "var(--blue)" }}></span>Eigenes Haus
      </span>
      <span>
        <span className="dot" style=${{ background: "var(--green)" }}></span>Andere Häuser
      </span>
    </div>
    ${data.service_groups.map((g) => {
      const total = (g.own_hospital_cases || 0) + (g.other_hospitals_cases || 0);
      const plannedWidth = maxCases ? (g.planned_demand_cases / maxCases) * 100 : 0;
      const ownWidth = maxCases ? (g.own_hospital_cases / maxCases) * 100 : 0;
      const otherWidth = maxCases ? (g.other_hospitals_cases / maxCases) * 100 : 0;
      const plannedStyle = {
        width: `${plannedWidth}%`,
        background: "rgba(245,158,11,0.35)",
      };
      const ownStyle = {
        width: `${ownWidth}%`,
        background: "rgba(96,165,250,0.9)",
      };
      const otherStyle = {
        width: `${otherWidth}%`,
        background: "rgba(34,197,94,0.75)",
        marginTop: 4,
      };
      return html`
        <div key=${g.service_group_id} className="chart-row">
          <div style=${{ display: "flex", justifyContent: "space-between" }}>
            <div style=${{ fontWeight: 700 }}>${g.name}</div>
            <div className="muted">${formatNumber(total)} Fälle</div>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style=${plannedStyle}></div>
          </div>
          <div className="bar-track" style=${{ marginTop: 6 }}>
            <div className="bar-fill" style=${ownStyle}></div>
            <div className="bar-fill" style=${otherStyle}></div>
          </div>
        </div>
      `;
    })}
  `;
}

function TimeseriesChart({ data, scenarioSeries, height = 260 }) {
  if (!data || !data.series || !data.series.length) {
    return html`<div className="muted">Keine Zeitreihen-Daten vorhanden.</div>`;
  }

  const series = data.series;
  const hasScenario =
    Array.isArray(scenarioSeries) && scenarioSeries.length === series.length;

  const values = [];
  series.forEach((point, idx) => {
    if (Number.isFinite(point.planned)) values.push(point.planned);
    if (Number.isFinite(point.actual)) values.push(point.actual);
    if (Number.isFinite(point.forecast)) values.push(point.forecast);
    if (hasScenario) {
      const sc = scenarioSeries[idx];
      if (sc && Number.isFinite(sc.scenario_forecast)) values.push(sc.scenario_forecast);
    }
  });

  if (!values.length) {
    return html`<div className="muted">Keine Zeitreihen-Daten vorhanden.</div>`;
  }

  const rawMax = Math.max(...values);
  const paddedMax = rawMax * 1.12 || 1;
  const niceStep = paddedMax > 50 ? 20 : 10;
  const yMax = Math.max(niceStep, Math.ceil(paddedMax / niceStep) * niceStep);
  const yMin = 0;

  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = typeof height === "number" ? height : 260;
  const MARGIN_LEFT = 48;
  const MARGIN_RIGHT = 16;
  const MARGIN_TOP = 24;
  const MARGIN_BOTTOM = 36;
  const plotWidth = SVG_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  const plotHeight = SVG_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

  const xFor = (idx) =>
    MARGIN_LEFT + (series.length > 1 ? (idx / (series.length - 1)) * plotWidth : 0);
  const yFor = (val) => {
    const safeVal = Number.isFinite(val) ? val : 0;
    const clamped = Math.min(Math.max(safeVal, yMin), yMax);
    return MARGIN_TOP + (1 - clamped / yMax) * plotHeight;
  };

  const pathFor = (accessor) => {
    return series.reduce((acc, point, idx) => {
      const val = accessor(point, idx);
      if (!Number.isFinite(val)) return acc;
      const cmd = acc ? "L" : "M";
      return `${acc}${cmd}${xFor(idx)},${yFor(val)}`;
    }, "");
  };

  const forecastIndex = series.findIndex((p) => p.phase === "forecast");
  const hasForecastBand = forecastIndex >= 0;
  const forecastStartX = hasForecastBand
    ? Math.max(
        MARGIN_LEFT,
        forecastIndex === 0
          ? MARGIN_LEFT
          : (xFor(forecastIndex - 1) + xFor(forecastIndex)) / 2
      )
    : 0;
  const forecastWidth = hasForecastBand
    ? MARGIN_LEFT + plotWidth - forecastStartX
    : 0;

  const yGrid = Array.from({ length: 5 }, (_, i) => (i / 4) * yMax);
  const yearLabels = series
    .map((point, idx) => {
      const [year, month] = point.month.split("-");
      if (month === "01") return { x: xFor(idx), label: year };
      return null;
    })
    .filter(Boolean);

  return html`
    <div className="timeseries-surface">
      <svg
        viewBox=${`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style=${{ width: "100%", height }}
      >
        ${hasForecastBand
          ? html`
              <rect
                x=${forecastStartX}
                y=${MARGIN_TOP}
                width=${forecastWidth}
                height=${plotHeight}
                className="timeseries-separator"
              />
              <line
                x1=${forecastStartX}
                x2=${forecastStartX}
                y1=${MARGIN_TOP}
                y2=${MARGIN_TOP + plotHeight}
                className="timeseries-separator-line"
              />
              <text
                x=${forecastStartX + 6}
                y=${MARGIN_TOP + 12}
                className="timeseries-axis-label"
                fill="var(--accent)"
              >
                Forecast
              </text>
            `
          : null}

        ${yGrid.map(
          (val) => html`
            <g key=${`y-${val}`}>
              <line
                x1=${MARGIN_LEFT}
                x2=${SVG_WIDTH - MARGIN_RIGHT}
                y1=${yFor(val)}
                y2=${yFor(val)}
                stroke="#e2e8f0"
                stroke-width="0.5"
              />
              <text
                x=${MARGIN_LEFT - 6}
                y=${yFor(val) - 2}
                className="timeseries-axis-label"
                text-anchor="end"
              >
                ${formatNumber(val)}
              </text>
            </g>
          `
        )}

        <path
          d=${pathFor((point) => point.planned)}
          fill="none"
          stroke="var(--amber)"
          stroke-width="1.4"
          stroke-dasharray="4 3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d=${pathFor((point) => point.actual)}
          fill="none"
          stroke="var(--blue)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d=${pathFor((point) => point.forecast)}
          fill="none"
          stroke="var(--accent)"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="5 3"
          opacity="0.9"
        />
        ${hasScenario
          ? html`
              <path
                d=${pathFor((_, idx) => {
                  const sc = scenarioSeries[idx];
                  if (sc && Number.isFinite(sc.scenario_forecast)) return sc.scenario_forecast;
                  return null;
                })}
                fill="none"
                stroke="var(--green)"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.9"
              />
            `
          : null}

        ${series.map((point, idx) =>
          point.phase === "historical"
            ? html`
                <circle
                  key=${point.month}
                  cx=${xFor(idx)}
                  cy=${yFor(point.actual || 0)}
                  r="1.5"
                  fill="var(--blue)"
                />
              `
            : null
        )}

        ${yearLabels.map(
          (label) => html`
            <text
              key=${`x-${label.label}`}
              x=${label.x}
              y=${SVG_HEIGHT - MARGIN_BOTTOM / 2}
              className="timeseries-axis-label"
              text-anchor="middle"
            >
              ${label.label}
            </text>
          `
        )}
      </svg>
      <div className="timeseries-legend">
        <span><span className="dot" style=${{ background: "var(--amber)" }}></span>Bedarf (Plan)</span>
        <span><span className="dot" style=${{ background: "var(--blue)" }}></span>Ist-Volumen</span>
        <span><span className="dot" style=${{ background: "var(--accent)" }}></span>Forecast</span>
        ${hasScenario
          ? html`
              <span><span className="dot" style=${{ background: "var(--green)" }}></span>Szenario</span>
            `
          : null}
      </div>
    </div>
  `;
}

function DetailTable({ rows, query, onQuery }) {
  const filtered = useMemo(() => {
    if (!query) return rows;
    const term = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.service_group_name.toLowerCase().includes(term) ||
        (r.category || "").toLowerCase().includes(term)
    );
  }, [rows, query]);

  if (!filtered || !filtered.length) return html`<div className="muted">Keine Einträge.</div>`;
  return html`
    <div style=${{ overflowX: "auto" }}>
      <div style=${{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Suche Leistungsgruppe..."
          value=${query}
          onChange=${(e) => onQuery(e.target.value)}
          className="controls input"
          style=${{ width: "100%", maxWidth: 320 }}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Leistungsgruppe</th>
            <th>Bedarf (Plan)</th>
            <th>Fälle gesamt</th>
            <th>Eigenes Haus</th>
            <th>Marktanteil</th>
            <th>Deckungsgrad</th>
            <th>Leistungsauftrag</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(
            (row) => html`
              <tr key=${row.service_group_id}>
                <td>
                  <div style=${{ fontWeight: 700 }}>${row.service_group_name}</div>
                  <div className="muted">${row.category}</div>
                </td>
                <td>${formatNumber(row.planned_demand_cases)}</td>
                <td>${formatNumber(row.total_cases_all_hospitals)}</td>
                <td>${formatNumber(row.own_hospital_cases)}</td>
                <td>${formatPercent(row.own_share_percent)}</td>
                <td>
                  ${formatPercent(row.coverage_percent)}
                  <${CoveragePill} status=${row.coverage_status} />
                </td>
                <td>${row.has_assignment ? "Ja" : "Nein"}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    </div>
  `;
}

function ScenarioPanel({ row, scenarioRow, delta, setDelta, mode, setMode, horizon, setHorizon }) {
  const modeButtons = [
    { id: "statusquo", label: "Status quo", preset: 0 },
    { id: "ausbau", label: "Ausbau", preset: 15 },
    { id: "rueckzug", label: "Rückzug", preset: -15 },
  ];
  const sliderDisabled = mode === "statusquo";

  return html`
    <div className="panel scenario">
      <div className="section-title">
        <div>
          <div className="muted">2 - Strategie-Szenario</div>
          <h3 style=${{ margin: "6px 0" }}>
            Fokus: ${row && row.service_group_name ? row.service_group_name : "Gesamthaus"}
          </h3>
        </div>
        <div className="chips">
          ${modeButtons.map(
            (btn) => html`
              <button
                key=${btn.id}
                className=${`button ${mode === btn.id ? "" : "ghost"}`}
                onClick=${() => {
                  setMode(btn.id);
                  setDelta(btn.preset);
                }}
              >
                ${btn.label}
              </button>
            `
          )}
        </div>
      </div>

      <div className="controls" style=${{ marginTop: 12 }}>
        <label style=${{ flex: 1 }}>
          Volumenänderung (${delta}%)
          <div className="muted">-50% bis +50%, Frontend-Demo</div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value=${sliderDisabled ? 0 : delta}
            disabled=${sliderDisabled}
            onChange=${(e) => setDelta(Number(e.target.value))}
            style=${{ width: "100%" }}
          />
        </label>
        <label>
          Zeithorizont
          <select value=${horizon} onChange=${(e) => setHorizon(e.target.value)}>
            <option value="3">3 Jahre</option>
            <option value="5">5 Jahre</option>
          </select>
        </label>
      </div>

      ${row && scenarioRow
        ? html`
            <div className="scenario-grid">
              <div className="scenario-metric">
                <div className="muted">Deckungsgrad</div>
                <div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style=${{ fontWeight: 800 }}>
                    ${formatPercent(row.coverage_percent)} ->
                    ${formatPercent(scenarioRow.adjusted_coverage_percent)}
                  </div>
                  <${CoveragePill} status=${scenarioRow.adjusted_coverage_status} />
                </div>
              </div>
              <div className="scenario-metric">
                <div className="muted">Eigenes Volumen</div>
                <div style=${{ fontWeight: 800 }}>
                  ${formatNumber(row.own_hospital_cases)} ->
                  ${formatNumber(scenarioRow.adjusted_own_cases)}
                </div>
                <div className="muted">Delta ${formatNumber(scenarioRow.delta_cases)} Fälle</div>
              </div>
              <div className="scenario-metric">
                <div className="muted">Grobe EUR / CHF-Wirkung (p.a.)</div>
                <div style=${{ fontWeight: 800 }}>${formatCurrency(scenarioRow.delta_eur)}</div>
                <div className="muted">
                  Annahme: Deckungsbeitrag ca. CHF ${formatNumber(DEMO_DECKUNGSBEITRAG)} pro Fall
                </div>
              </div>
            </div>
            <div className="muted" style=${{ marginTop: 8 }}>
              Szenario wird nur im Frontend gerechnet (Demo), verschiebt auch die Forecast-Linie
              im Zeitverlauf. Reload setzt alles zurück.
            </div>
          `
        : html`<div className="muted">Leistungsgruppe auswählen, um ein Szenario zu sehen.</div>`}
    </div>
  `;
}

function App() {
  console.log("[MVP] App render start");
  const [dashboardData, setDashboardData] = useState(null);
  const [matrixData, setMatrixData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [timeseriesData, setTimeseriesData] = useState(null);
  const [timeseriesLoading, setTimeseriesLoading] = useState(false);
  const [timeseriesError, setTimeseriesError] = useState("");
  const [selectedServiceGroupId, setSelectedServiceGroupId] = useState(null);
  const [filters, setFilters] = useState({
    region: "Kanton X",
    period: "2025-2029",
    perspective: "Deckungsgrad",
    coverage: "all",
    showOnlyAssignment: false,
  });
  const [scenarioDelta, setScenarioDelta] = useState(0);
  const [scenarioMode, setScenarioMode] = useState("statusquo");
  const [scenarioHorizon, setScenarioHorizon] = useState("3");
  const [detailQuery, setDetailQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    injectStyles();
    loadData();
  }, []);

  useEffect(() => {
    if (scenarioMode === "statusquo") setScenarioDelta(0);
    if (scenarioMode === "ausbau") setScenarioDelta(15);
    if (scenarioMode === "rueckzug") setScenarioDelta(-15);
  }, [scenarioMode]);

  useEffect(() => {
    if (matrixData.length && !selectedServiceGroupId) {
      setSelectedServiceGroupId(matrixData[0].service_group_id);
    }
  }, [matrixData, selectedServiceGroupId]);

  useEffect(() => {
    if (!selectedServiceGroupId) {
      setTimeseriesData(null);
      setTimeseriesError("");
      setTimeseriesLoading(false);
      return;
    }
    let active = true;
    const fetchTimeseries = async () => {
      setTimeseriesLoading(true);
      setTimeseriesError("");
      try {
        const res = await fetch(`${API_BASE}/api/timeseries/${selectedServiceGroupId}`);
        if (!res.ok) throw new Error("timeseries failed");
        const json = await res.json();
        if (active) {
          setTimeseriesData(json);
          setTimeseriesError("");
        }
      } catch (err) {
        if (!active) return;
        console.error("timeseries fetch failed", err);
        setTimeseriesData(null);
        setTimeseriesError("Konnte Zeitreihe nicht laden.");
      } finally {
        if (active) setTimeseriesLoading(false);
      }
    };
    fetchTimeseries();
    return () => {
      active = false;
    };
  }, [selectedServiceGroupId, API_BASE]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [matrixRes, dashboardRes, chartRes] = await Promise.all([
        fetch(`${API_BASE}/api/matrix`),
        fetch(`${API_BASE}/api/dashboard`),
        fetch(`${API_BASE}/api/chart`),
      ]);
      if (!matrixRes.ok || !dashboardRes.ok || !chartRes.ok) throw new Error("API call failed");
      const [matrixJson, dashboardJson, chartJson] = await Promise.all([
        matrixRes.json(),
        dashboardRes.json(),
        chartRes.json(),
      ]);
      setMatrixData(matrixJson);
      setDashboardData(dashboardJson);
      setChartData(chartJson);
      setSelectedServiceGroupId((prev) => {
        const firstId = matrixJson && matrixJson[0] ? matrixJson[0].service_group_id : null;
        return prev || firstId || null;
      });
    } catch (err) {
      console.error("loadData failed", err);
      setError("Konnte Demo-Daten nicht laden.");
    } finally {
      setLoading(false);
    }
  }

  const filteredRows = useMemo(() => {
    let rows = matrixData;
    if (filters.coverage === "risk") {
      rows = rows.filter((r) => r.coverage_status === "under" || r.coverage_status === "over");
    } else if (filters.coverage !== "all") {
      rows = rows.filter((r) => r.coverage_status === filters.coverage);
    }
    if (filters.showOnlyAssignment) {
      rows = rows.filter((r) => r.has_assignment);
    }
    return rows;
  }, [matrixData, filters.coverage, filters.showOnlyAssignment]);

  const selectedRow =
    matrixData.find((r) => r.service_group_id === selectedServiceGroupId) || null;
  const scenarioRow = useMemo(
    () => computeScenario(selectedRow, scenarioDelta),
    [selectedRow, scenarioDelta]
  );
  const scenarioTimeseries = useMemo(() => {
    if (!timeseriesData || !timeseriesData.series || !timeseriesData.series.length) return null;
    return {
      ...timeseriesData,
      series: computeTimeseriesScenario(timeseriesData.series, scenarioDelta),
    };
  }, [timeseriesData, scenarioDelta]);
  const filteredChartData = useMemo(() => {
    if (!chartData || !chartData.service_groups) return chartData;
    const ids = new Set(filteredRows.map((r) => r.service_group_id));
    return { service_groups: chartData.service_groups.filter((g) => ids.has(g.service_group_id)) };
  }, [chartData, filteredRows]);
  const regionLabel = dashboardData && dashboardData.meta ? dashboardData.meta.region : null;
  const planningPeriodLabel =
    dashboardData && dashboardData.meta ? dashboardData.meta.planning_period : null;

  return html`
    <div className="app-shell">
      <div className="topbar">
        <div>
          <div className="eyebrow">Rang 5 - MVP Demo</div>
          <h1>Spitalliste & Leistungsauftrag-Cockpit</h1>
          <p className="subtitle">Strategischer Fit vs. kantonaler Bedarf - Demo-Daten</p>
        </div>
        <div className="chips">
          <span className="chip accent">Demo-Frontend</span>
          <span className="chip muted">${regionLabel || filters.region}</span>
          <span className="chip muted">${planningPeriodLabel || filters.period}</span>
          <button className="button ghost" onClick=${loadData} disabled=${loading}>
            ${loading ? "Laden..." : "Refresh"}
          </button>
        </div>
      </div>

      ${error ? html`<div className="error">${error}</div>` : null}
      ${loading && !dashboardData ? html`<div className="loading">Lade Demo-Daten...</div>` : null}

      <div className="grid four" style=${{ marginTop: 16 }}>
        <${KpiCard}
          label="Deckungsgrad gesamt"
          value=${dashboardData ? formatPercent(dashboardData.total_coverage_percent) : "-"}
          hint="Alle Leistungsgruppen, aggregiert"
        />
        <${KpiCard}
          label="Risikobehaftete Gruppen"
          value=${dashboardData ? formatNumber(dashboardData.risky_service_groups_count) : "-"}
          hint="<80% oder >120% Deckungsgrad"
        />
        <${KpiCard}
          label="Anteil Fälle im Leistungsauftrag"
          value=${dashboardData
            ? formatPercent(dashboardData.cases_in_assignment_share_percent)
            : "-"}
          hint="Eigenes Haus, nur Gruppen mit Auftrag"
        />
        <${KpiCard}
          label="Volumen-Shift Potenzial"
          value=${dashboardData
            ? formatNumber(dashboardData.volume_shift_potential_cases) + " Fälle"
            : "-"}
          hint="Einfacher Demo-Schätzer"
        />
      </div>

      <div className="panel" style=${{ marginTop: 14 }}>
        <div className="section-title">
          <div>
            <div className="muted">Filter (Storytelling, kein Persist)</div>
            <h3 style=${{ margin: 0 }}>1 - Versorgungsbild</h3>
          </div>
        </div>
        <div className="controls" style=${{ marginTop: 8 }}>
          <label>
            Region
            <select
              value=${filters.region}
              onChange=${(e) => setFilters((p) => ({ ...p, region: e.target.value }))}
            >
              ${["Kanton X", "Kanton Y", "Demo-CH"].map(
                (r) => html`<option key=${r} value=${r}>${r}</option>`
              )}
            </select>
          </label>
          <label>
            Planperiode
            <select
              value=${filters.period}
              onChange=${(e) => setFilters((p) => ({ ...p, period: e.target.value }))}
            >
              ${["2025-2029", "2024-2028", "2023-2027"].map(
                (p) => html`<option key=${p} value=${p}>${p}</option>`
              )}
            </select>
          </label>
          <label>
            Perspektive
            <select
              value=${filters.perspective}
              onChange=${(e) => setFilters((p) => ({ ...p, perspective: e.target.value }))}
            >
              ${["Deckungsgrad", "Marktanteil", "Leistungsauftrag"].map(
                (p) => html`<option key=${p} value=${p}>${p}</option>`
              )}
            </select>
          </label>
          <label>
            Fokus
            <select
              value=${filters.coverage}
              onChange=${(e) => setFilters((p) => ({ ...p, coverage: e.target.value }))}
            >
              <option value="all">Alle Gruppen</option>
              <option value="risk">Nur Risiko (&lt;80%, &gt;120%)</option>
              <option value="under">Unterversorgung</option>
              <option value="balanced">Balanciert</option>
              <option value="slightly_over">Leicht über</option>
              <option value="over">Überversorgung</option>
            </select>
          </label>
          <label className="toggle">
            <span>Nur mit Auftrag</span>
            <input
              type="checkbox"
              checked=${filters.showOnlyAssignment}
              onChange=${(e) => setFilters((p) => ({ ...p, showOnlyAssignment: e.target.checked }))}
            />
          </label>
        </div>
      </div>

      <div className="grid two" style=${{ marginTop: 14, alignItems: "start" }}>
        <div className="panel">
          <div className="section-title">
            <h3 style=${{ margin: 0 }}>Matrix der Leistungsgruppen</h3>
            <div className="muted">Heat/Status je Gruppe, klickbar</div>
          </div>
          <div className="matrix" style=${{ marginTop: 10 }}>
            ${filteredRows.map(
              (row) =>
                html`<${MatrixRow}
                  key=${row.service_group_id}
                  row=${row}
                  active=${row.service_group_id === selectedServiceGroupId}
                  onSelect=${() => setSelectedServiceGroupId(row.service_group_id)}
                />`
            )}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h3 style=${{ margin: 0 }}>Balken-Chart: Fälle vs. Bedarf</h3>
            <div className="muted">Eigenes Haus vs. andere Häuser</div>
          </div>
          <div style=${{ marginTop: 10 }}>
            <${BarChart} data=${filteredChartData} />
          </div>
        </div>
      </div>

      <div className="panel timeseries-panel" style=${{ marginTop: 12 }}>
        <div className="section-title">
          <div>
            <div className="muted">Zeitverlauf & Forecast</div>
            <h3 style=${{ margin: 0 }}>
              ${selectedRow
                ? `${selectedRow.service_group_name} (${selectedRow.category})`
                : "Leistungsgruppe wählen"}
            </h3>
          </div>
          <div className="chips">
            <span className="chip muted">Monatlich</span>
            <span className="chip muted">Synthetic</span>
          </div>
        </div>
        <div className="timeseries-hint">
          Historie 2022-2024, Forecast 2025. Slider im Szenario-Panel verschiebt die
          Forecast-Linie.
        </div>
        <div style=${{ marginTop: 10 }}>
          ${timeseriesLoading
            ? html`<div className="loading">Lade Zeitreihe...</div>`
            : timeseriesError
            ? html`<div className="error">${timeseriesError}</div>`
            : timeseriesData
            ? html`
                <${TimeseriesChart}
                  data=${timeseriesData}
                  scenarioSeries=${scenarioTimeseries && scenarioTimeseries.series}
                  height=${260}
                />
              `
                : html`<div className="muted">
                Leistungsgruppe auswählen, um den Zeitverlauf zu sehen.
              </div>`}
        </div>
      </div>

      <div style=${{ marginTop: 14 }}>
        <${ScenarioPanel}
          row=${selectedRow}
          scenarioRow=${scenarioRow}
          delta=${scenarioDelta}
          setDelta=${setScenarioDelta}
          mode=${scenarioMode}
          setMode=${setScenarioMode}
          horizon=${scenarioHorizon}
          setHorizon=${setScenarioHorizon}
        />
      </div>

      <div className="panel" style=${{ marginTop: 14 }}>
        <div className="section-title">
          <h3 style=${{ margin: 0 }}>Detailtabelle (Spital x Leistungsgruppe)</h3>
          <div className="muted">Demo-Daten, kein Export</div>
        </div>
        <div style=${{ marginTop: 10 }}>
          <${DetailTable} rows=${matrixData} query=${detailQuery} onQuery=${setDetailQuery} />
        </div>
      </div>
    </div>
  `;
}

const host =
  document.getElementById("root") ||
  (() => {
    const el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
    return el;
  })();

createRoot(host).render(html`<${App} />`);
