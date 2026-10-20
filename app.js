* {
  box-sizing: border-box;
}

:root {
  --bg: #0f172a;
  --bg-alt: #111827;
  --panel: rgba(15, 23, 42, 0.9);
  --panel-soft: rgba(30, 41, 59, 0.95);
  --card: rgba(15, 23, 42, 0.88);
  --border: rgba(148, 163, 184, 0.25);
  --text: #e2e8f0;
  --muted: #cbd5e1;
  --accent: #38bdf8;
  --accent-strong: #0ea5e9;
  --good: #22c55e;
  --warn: #fbbf24;
  --danger: #ef4444;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: radial-gradient(circle at top, #172554 0%, var(--bg) 40%, #020817 100%);
  color: var(--text);
}

body {
  padding: 24px;
}

.app-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  line-height: 1.2;
}

h2 {
  margin: 0 0 18px;
  font-size: 1.5rem;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
}

.option-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.tab {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: 12px;
  padding: 0.72rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.tab.active {
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.5);
  color: var(--accent);
}

.layout {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(340px, 1.1fr);
  gap: 22px;
}

.panel {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.28);
  padding: 22px;
  backdrop-filter: blur(8px);
}

.option-form {
  display: none;
}

.option-form.active {
  display: block;
}

.field-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-weight: 600;
}

input, select, button, textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  padding: 0.8rem 0.9rem;
  font: inherit;
}

input[type="range"] {
  padding: 0;
  accent-color: var(--accent);
}

textarea {
  resize: vertical;
  min-height: 84px;
}

.range-readout {
  margin-top: 8px;
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 700;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.secondary-btn {
  width: auto;
  border-color: rgba(56, 189, 248, 0.65);
  color: var(--accent);
  background: rgba(8, 47, 73, 0.45);
  cursor: pointer;
}

.secondary-btn.small {
  padding: 0.55rem 0.8rem;
  font-size: 0.8rem;
}

.summary {
  background: rgba(15, 118, 110, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  padding: 18px 18px 16px;
  margin-bottom: 24px;
}

.status-pill {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
}

.summary h3 {
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.summary p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 14px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card.accent {
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.18), rgba(14, 165, 233, 0.08));
  border-color: rgba(56, 189, 248, 0.3);
}

.label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: clamp(1.2rem, 2vw, 1.9rem);
  line-height: 1.2;
}

.breakdown, .recommendation, .scenario-panel, .notes-panel {
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  margin-top: 18px;
}

.breakdown ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.8;
}

.recommendation p {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.7;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.scenario-list {
  display: grid;
  gap: 10px;
}

.scenario-item {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--border);
  padding: 12px 14px;
  border-radius: 12px;
}

.scenario-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.scenario-name {
  font-weight: 700;
}

.scenario-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--muted);
  font-size: 0.85rem;
}

.notes-panel label {
  margin-bottom: 10px;
}

@media (max-width: 860px) {
  body {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .layout {
    grid-template-columns: 1fr;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}
