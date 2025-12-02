# Protokoll des Gründungs-Meetings: Start‑up für Kapazitätsplanung im Gesundheitswesen

**Datum:** (bitte ergänzen) &nbsp;&nbsp;|&nbsp;&nbsp; **Ort:** Zürich  
**Teilnehmende:** Dr. med. Selina Schwegler (Vetterli, Roth & Partner, VRP), Léon Kia Faro (Statistiker), Stephan Nef (Informatiker, IBM)  
**Ziel des Meetings:** Abklärung der Gründung eines Start‑ups im Bereich **Kapazitäts‑/Ressourcenplanung** für Krankenhäuser: Produktidee, Wettbewerb, MVP‑Plan, Go‑to‑Market, USP, technische Machbarkeit, nächste Schritte.

---

## 1) Einleitung & Zielsetzung

- **Anlass & Timing:** Möglichkeit eines Auftritts/Anschlussprojekts im **März** → **Zeitkritik**. Ziel: kurzfristig Entscheide fällen und Arbeitspakete starten (kein reines Brainstorming).
- **Sofort‑Ergebnisse benötigt:**
  1) **Pitch‑Deck** (Produktidee, Mehrwert, Markt, Team, Plan) zur Einholung von **Mentor/Investor‑Feedback** (u. a. „Andy/Tom“).  
  2) **MVP/Demo** (klickbare Simulation/Prototyp mit synthetischen Daten) zur **Machbarkeits‑ und Nutzen‑Demonstration**.
- **These:** Wir bauen **kein „reines“ Startup um eine Idee**, sondern liefern **schnell ein klar umrissenes Produkt**, das es in Teilen schon gibt – **nur besser, fokussierter und moderner**.

---

## 2) Produktidee: Integrales Kapazitätsmanagement entlang des Patientenpfads

**Problemkern:** Hohe **Variabilität** der Patientennachfrage erschwert die Planung von **Betten**, **OP‑Sälen**, **Diagnostik** und **Personal** → Unter‑/Überauslastung, Wartezeiten, Mehrkosten.  
**Zielbild:** Eine Software, die
- **Transparenz** über aktuelle Kapazitäten und Belegungen schafft (Near‑Realtime‑Sicht).
- **Prognosen** der Patientenzahlen/Belegungen (täglich/stündlich, 1–14 Tage) liefert.
- **Simulationen** („Digitaler Zwilling“) erlaubt: *Was wäre wenn?* (z. B. Station schließen, OP‑Mixe ändern, Behandlungspfade anpassen).
- **Planungslogiken/Regeln** unterstützt (z. B. Zuteilung von Betten/Slots, saisonale Verteilung).
- **Jahres‑/Monats‑/Wochen‑Kapazitätsplanung** aus Top‑Down‑Zielen (Fälle, Erlöse) in konkrete **Bedarfe** (Betten, OP‑Minuten, Personalstunden) übersetzt, inkl. **Saisonalität**.

**Organisationsbezug:** Reine Software genügt nicht. Wirkung entsteht erst mit
- klaren **Rollen/Verantwortungen** (Strategie, Taktik, Operative),
- **Steuerungsgefäßen** (Kapazitäts‑Runden/Meetings),
- verbindlichen **Planungsregeln** und
- **Change‑Begleitung** (z. B. durch VRP).

---

## 3) Wettbewerb & Marktüberblick (Kurzfassung)

- **SimBox.Ai** (breit im DACH/Europa eingesetzt): Prognosen (Betten/Ein‑/Austritte), OP‑Plan‑Abstimmung, Digitaler Zwilling, Slot‑Optimierung, Ressourcen‑/Personalrechner; Integration in BI/„Command Center“.  
- **VRP‑Bezug:** VRP setzt Simbox in IKM‑Projekten ein; Rückmeldungen aus der Praxis zeigen **Stärken**, aber auch **Verbesserungswünsche** (Pain Points).  
- **Marktchancen:** Viele Häuser planen noch **retrospektiv/manuell** → Bedarf an **datenbasierter** Steuerung steigt (Kostendruck, Personalmangel, Nach‑Pandemie‑Lehren). Dominanter Anbieter + weiße Flecken ⇒ **Eintrittsfenster** für fokussierte, differenzierte Lösungen.

---

## 4) USP & Positionierung

**Kern‑USP: Alternative Daten (externe Einflussfaktoren) systematisch nutzen**  
Beispiele: **Wetter/Schnee** (Unfallrisiko), **Grippe‑/Epidemietrends** (Suchanfragen, Surveillance), **Medikamentenabsatz** (Proxy für Krankheitswellen), **Saisonalität** (auch hemisphärische Phasenverschiebung), **Mobilitäts‑/Eventdaten** u. a.  
→ **Frühindikatoren** für Kurzfrist‑Prognosen, **neue Transparenz** und **klarer Mehrwert** gegenüber rein internen Zeitreihen.

**Erklärbarkeit & Akzeptanz:** Hochdimensionale Modelle werden **in verständliche Signale** übersetzt (z. B. **Ampelsystem** + Top‑Faktoren). **Mensch‑in‑der‑Schleife** bleibt Entscheider → höhere **Akzeptanz** & geringeres **Haftungsrisiko**.

**Einstiegsstrategie (komplementär):** Kein 1:1‑Ersatz bestehender Tools, sondern **Add‑on/Co‑Pilot**, der bestehende Planung **unterstützt** und **kritisch anreichert**. Vorteile:
- entzieht sich dem direkten **Benchmark‑Duell**,
- **risikoärmere Einführung** für Spitäler,
- **Kooperationsfähigkeit** (z. B. mit VRP).

**Kosten/Nutzen‑Fokus:** Schlanker **Kern‑Funktionsumfang** (die 20 % Features, die 80 % Nutzen liefern) ⇒ **attraktives Preis‑Leistungs‑Verhältnis**.

---

## 5) MVP – Scope & Architektur (Welle 0)

### 5.1 Ziel des MVP
- **Nutzen demonstrieren** (nicht Perfektion): *„Warum sollte ein Spital das haben wollen?“*
- **Technische Machbarkeit** zeigen: Datenfluss → Features → Modell → **visuelles Dashboard**.
- **Story für Investoren/Mentoren**: Klarer USP, schneller Lernzyklus, Skalierbarkeit.

### 5.2 Funktionsumfang (Minimalset)
- **Dashboard:** Kapazitäts‑Übersicht (Betten/OP), **7–14 Tage‑Prognose**, **Unsicherheitsband**, **Ampeln/Alerts** (z. B. „Schneefallwarnung → ↑ Ortho‑Notfälle“).
- **Szenario‑Karten:** 1–2 Beispiel‑„Was‑wäre‑wenn“ (z. B. OP‑Mix‑Änderung um +/‑ x %).
- **Datenquellen (synthetisch in MVP):** Mini‑Zeitreihen für interne Kennzahlen + 1–2 **externe Feeds** (z. B. Wetter‑API, Public Flu‑Index) → Feature‑Engineering‑Pipeline.
- **Modell‑Prototyp:** Einfache, robuste Basis (z. B. Gradient Boosting/GLM + saisonale Komponenten) mit plug‑in‑Fähigkeit für LSTM/Transformer später.
- **Erklärbarkeit:** Top‑3 Treiber pro Prognose (SHAP/Feature‑Importances) + Ampel.

### 5.3 Nicht‑Ziele (Welle 0)
- Kein KIS‑Deep‑Integration, keine Klinik‑Zertifizierung, kein komplexes Benutzer‑/Rollen‑System.  
- Keine Live‑Produktivdaten; MVP arbeitet mit **synthetischen** oder **öffentlichen** Daten.

### 5.4 Technische Eckpunkte
- **Web‑App** (Browser), Cloud‑fähig, Schweiz/EU‑Hosting‑Option; REST‑API; spätere **On‑Prem**‑Variante möglich.  
- **Standards:** spätere Anbindung an HL7/FHIR bzw. BI‑Connectors.  
- **Security/Compliance (Grundlage):** DSG/DSGVO‑konformes Design, Pseudonymisierung, Logs, später ISO 27001/Pentest.  
- **Architekturprinzip:** *Data → Features → Model → Explain → UI*, modular, austauschbare Modell‑Backends.

---

## 6) Go‑to‑Market & Zielgruppen‑Nutzen

| Zielgruppe | Primärer Nutzen | Kaufargumente / Botschaften |
|---|---|---|
| **Investoren/Mentoren** | Schnelle Validierung eines **klaren Problem‑Lösungs‑Fits** | Großer, wachsender Markt; **Differenzierung** (Alternative Daten + Explainability + Praxiseinbettung); **Team** (Medizin/DS/IT); schneller MVP/Traction; kapitalleichte Skalierung |
| **Spitäler** | **Frühwarnungen**, bessere Auslastung, weniger Engpässe, Personalentlastung | **Add‑on statt Umsturz**, einfache Einführung, integrierbar, **transparente** Empfehlungen statt Black‑Box‑Vorgaben |
| **Kantone/Behörden** | Regionale **Gesamttransparenz**, bessere Spitalplanung | Aggregierte Sicht, saisonale/epidemische **Frühindikatoren**, Beitrag zu Kosteneffizienz |

**Kooperationspfade:** Pilot‑Spital (Co‑Creation), Datenpartner (z. B. Wetter, Apotheken, Versicherer), Beratungs‑Partner (z. B. VRP) für Zugang & Change.

---

## 7) Risiken & Gegenmaßnahmen (Auszug)

- **Datenqualität/‑zugang**: Schlechte interne Daten; externe Datenlizenzen. → **Pilot** mit Daten‑Audit; **synthetische** Daten im MVP; frühzeitige **Daten‑Partnerschaften**.  
- **Akzeptanz**: Skepsis ggü. Black Boxes. → **Explainability**, Mensch‑in‑Loop, **komplementärer** Start.  
- **Regulatorik/Security**: Datenschutzanforderungen, Klinik‑IT‑Policies. → Privacy‑by‑Design, EU/CH‑Hosting, ISO‑Roadmap, frühe **IT‑Abstimmung**.  
- **Wettbewerbsreaktion**: Feature‑Nachzug durch Etablierte. → **Fokus** + **Speed**, Differenzierung über Datenzugang/Partnerschaften und UX.

---

## 8) Ergebnisse des Meetings (Beschlüsse)

1. **Produkt‑Stoßrichtung bestätigt:** Kapazitäts‑Co‑Pilot mit **alternativen Daten** als USP; **komplementärer Markteintritt**.  
2. **Zwei Sofortartefakte:** **Pitch‑Deck** + **MVP/Demo** (synthetische Daten, klare Story).  
3. **Pilot‑/Partnerpfad:** Anbahnung eines **Pilotspitals** (VRP‑Netzwerk/Uni‑Kontakt) und Sondierung **Datenpartner** (Wetter, Apotheke etc.).  
4. **Teamrollen (vorläufig):** Léon = Tech/Analytics & MVP, Stephan = Orga/Partner/Mentoren, Selina Schwegler = Klinik‑Use‑Cases/VRP‑Brücke.  

---

## 9) Nächste Schritte / To‑Dos

| Nr. | Aufgabe | Ergebnis | Verantw. | Frist |
|---:|---|---|---|---|
| 1 | **Pitch‑Deck** (Problem, Lösung/USP, Markt, Team, Plan) | v1‑Deck (10–14 Slides) | Stephan (Koord.), alle | **T+7–10 Tage** |
| 2 | **MVP/Demo bauen** | Klick‑Demo: Prognose + Ampel + 1–2 Szenarien | Léon (Lead), Stephan | **v0 in T+2 Tagen**, v1 in **T+2–3 Wo.** |
| 3 | **Mentor‑Termin (Andy/Tom)** | Feedback, Messe‑Teilnahme klären | Stephan | nach Deck v1 |
| 4 | **Pilotspital sondieren** | Gespräch/Letter of Intent | Selina Schwegler (+ Stephan Nef) | **T+4–6 Wo.** |
| 5 | **Datenpartner anfragen** | Machbarkeits‑/Lizenz‑Klarheit | Léon | **parallel ab sofort** |
| 6 | **Firmengründung vorbereiten** | Rechtsform, Cap‑Table, Basic Ops | Stephan | **T+3–4 Wo.** |
| 7 | **Regulatorik‑Vorcheck** | Datenschutz, IT‑Policies, ISO‑Roadmap | Stephan (mit Experten) | **T+6–8 Wo.** |

*Hinweis:* „T“ = heutiges Datum. Fristen bitte nach tatsächlichem Startdatum kalibrieren.

---

## 10) Offene Fragen

- **Brand/Name** & Branding‑Leitidee.  
- **VRP‑Rolle**: Investor? Vertriebspartner? (strategische Kompatibilität mit Simbox).  
- **Preis-/Lizenzmodell** (Abo je Haus, Modulpreise, Daten‑Add‑ons).  
- **Medizinprodukterecht?** Ist Einstufung relevant? (juristisch klären).  
- **IP/Patent**: Schutzfähigkeit von Feature‑Engineering/Methodik prüfen.

---

## 11) Anhang – Begriffserläuterungen (Auszug)

- **MVP (Minimum Viable Product):** Minimaler, aber nutzbarer Prototyp zur schnellen Validierung beim Nutzer/Investor.  
- **Digitaler Zwilling:** Simulation des Krankenhauses, um Maßnahmen/Lasten vorab zu testen.  
- **Jahreskapazitätsplanung:** Top‑Down‑Übersetzung von Budget/Fallzielen in konkrete Kapazitäten (Betten/OP/Personal) inkl. **Saisonalität** und laufendem **Soll‑Ist‑Tracking**.  
- **Alternative Daten:** Externe, nicht‑klinische Indikatoren mit Relevanz für Nachfrage (Wetter, Absatz, Mobilität, Websignale …).  
- **Explainability (Erklärbarkeit):** Nachvollziehbare Darstellung, *warum* das Modell einen Hinweis gibt (Top‑Treiber, Ampel).

---

**Kontakt & Verantwortlichkeiten (aktuell):**  
- **Léon Kia Faro** – Tech/Analytics & MVP (E2E‑Prototyping)  
- **Stephan Nef** – Organisation/Partner/Mentoren/Operations  
- **Dr. med. Selina Schwegler (VRP)** – Klinische Use‑Cases, Change & Zugang Spitäler

