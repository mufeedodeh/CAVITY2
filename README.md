const tabs = Array.from(document.querySelectorAll('.tab'));
const optionPanels = Array.from(document.querySelectorAll('[data-option-panel]'));
const resetButton = document.getElementById('reset-example');
const saveButton = document.getElementById('save-project');
const loadButton = document.getElementById('load-project');
const exportButton = document.getElementById('export-project');
const printButton = document.getElementById('print-report');
const addScenarioButton = document.getElementById('add-scenario');
const notesArea = document.getElementById('project-notes');
const scenarioList = document.getElementById('scenario-list');

const sigmaValue = document.getElementById('sigma-value');
const deltaPValue = document.getElementById('delta-p-value');
const flowValue = document.getElementById('flow-value');
const noiseValue = document.getElementById('noise-value');
const summaryTitle = document.getElementById('summary-title');
const summaryText = document.getElementById('summary-text');
const recommendationText = document.getElementById('recommendation-text');
const statusPill = document.getElementById('status-pill');
const summaryBox = document.getElementById('summary-box');

const typeFactors = {
  butterfly: 0.92,
  globe: 1.12,
  cone: 0.85,
  ball: 0.98
};

const STORAGE_KEY = 'cavity2-project-v1';

const exampleValues = {
  option1: {
    unitSystem: 'US',
    flow: 1250,
    flowUnit: 'gpm',
    pu: 200,
    pd: 35,
    pb: 0,
    pva: 0.5,
    opening: 55,
    valveType: 'butterfly',
    sg: 1
  },
  option2: {
    headUp: 220,
    headDown: 90,
    pipeLength: 250,
    pipeDia: 12,
    roughness: 0.00015,
    fittings: 8,
    elevRise: 30,
    opening: 60,
    valveType: 'globe',
    sg: 1
  },
  option3: {
    flow: 980,
    flowUnit: 'gpm',
    shutoff: 245,
    pd: 42,
    pva: 0.5,
    opening: 50,
    valveType: 'ball',
    sg: 1
  }
};

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function getFormState() {
  const active = document.querySelector('.tab.active')?.dataset.option || 'option1';
  return {
    activeOption: active,
    notes: notesArea.value,
    option1: {
      unitSystem: document.getElementById('unit-system-1').value,
      flow: document.getElementById('flow-1').value,
      flowUnit: document.getElementById('flow-unit-1').value,
      pu: document.getElementById('pu-1').value,
      pd: document.getElementById('pd-1').value,
      pb: document.getElementById('pb-1').value,
      pva: document.getElementById('pva-1').value,
      opening: document.getElementById('opening-1').value,
      valveType: document.getElementById('valve-type-1').value,
      sg: document.getElementById('sg-1').value
    },
    option2: {
      headUp: document.getElementById('head-up-2').value,
      headDown: document.getElementById('head-down-2').value,
      pipeLength: document.getElementById('pipe-length-2').value,
      pipeDia: document.getElementById('pipe-dia-2').value,
      roughness: document.getElementById('roughness-2').value,
      fittings: document.getElementById('fittings-2').value,
      elevRise: document.getElementById('elev-rise-2').value,
      opening: document.getElementById('opening-2').value,
      valveType: document.getElementById('valve-type-2').value,
      sg: document.getElementById('sg-2').value
    },
    option3: {
      flow: document.getElementById('flow-3').value,
      flowUnit: document.getElementById('flow-unit-3').value,
      shutoff: document.getElementById('shutoff-3').value,
      pd: document.getElementById('pd-3').value,
      pva: document.getElementById('pva-3').value,
      opening: document.getElementById('opening-3').value,
      valveType: document.getElementById('valve-type-3').value,
      sg: document.getElementById('sg-3').value
    }
  };
}

function setFormState(state) {
  if (!state) return;

  const projectState = state;
  const option1 = projectState.option1 || {};
  const option2 = projectState.option2 || {};
  const option3 = projectState.option3 || {};

  document.getElementById('unit-system-1').value = option1.unitSystem || 'US';
  document.getElementById('flow-1').value = option1.flow || 1250;
  document.getElementById('flow-unit-1').value = option1.flowUnit || 'gpm';
  document.getElementById('pu-1').value = option1.pu || 200;
  document.getElementById('pd-1').value = option1.pd || 35;
  document.getElementById('pb-1').value = option1.pb || 0;
  document.getElementById('pva-1').value = option1.pva || 0.5;
  document.getElementById('opening-1').value = option1.opening || 55;
  document.getElementById('opening-value-1').textContent = `${document.getElementById('opening-1').value}%`;
  document.getElementById('valve-type-1').value = option1.valveType || 'butterfly';
  document.getElementById('sg-1').value = option1.sg || 1;

  document.getElementById('head-up-2').value = option2.headUp || 220;
  document.getElementById('head-down-2').value = option2.headDown || 90;
  document.getElementById('pipe-length-2').value = option2.pipeLength || 250;
  document.getElementById('pipe-dia-2').value = option2.pipeDia || 12;
  document.getElementById('roughness-2').value = option2.roughness || 0.00015;
  document.getElementById('fittings-2').value = option2.fittings || 8;
  document.getElementById('elev-rise-2').value = option2.elevRise || 30;
  document.getElementById('opening-2').value = option2.opening || 60;
  document.getElementById('opening-value-2').textContent = `${document.getElementById('opening-2').value}%`;
  document.getElementById('valve-type-2').value = option2.valveType || 'globe';
  document.getElementById('sg-2').value = option2.sg || 1;

  document.getElementById('flow-3').value = option3.flow || 980;
  document.getElementById('flow-unit-3').value = option3.flowUnit || 'gpm';
  document.getElementById('shutoff-3').value = option3.shutoff || 245;
  document.getElementById('pd-3').value = option3.pd || 42;
  document.getElementById('pva-3').value = option3.pva || 0.5;
  document.getElementById('opening-3').value = option3.opening || 50;
  document.getElementById('opening-value-3').textContent = `${document.getElementById('opening-3').value}%`;
  document.getElementById('sg-3').value = option3.sg || 1;
  document.getElementById('valve-type-3').value = option3.valveType || 'ball';

  notesArea.value = projectState.notes || '';
  setActiveOption(projectState.activeOption || 'option1');
  calculate();
}

function saveProject() {
  const state = getFormState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  alert('Project saved in this browser.');
}

function loadProject() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert('No saved project found in this browser.');
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    setFormState(parsed);
    alert('Project loaded.');
  } catch (error) {
    alert('Saved project could not be loaded.');
  }
}

function exportProject() {
  const state = getFormState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cavity2-project.json';
  link.click();
  URL.revokeObjectURL(url);
}

function printReport() {
  window.print();
}

function setActiveOption(optionKey) {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.option === optionKey);
  });

  optionPanels.forEach((panel) => {
    const isActive = panel.dataset.optionPanel === optionKey;
    panel.classList.toggle('active', isActive);
  });

  calculate();
}

function emitResult(params) {
  const {
    sigma,
    deltaP,
    flowDisplay,
    noiseLevel,
    title,
    text,
    recommendation,
    color
  } = params;

  sigmaValue.textContent = formatNumber(sigma, 2);
  deltaPValue.textContent = `${formatNumber(deltaP, 1)} psi`;
  flowValue.textContent = flowDisplay;
  noiseValue.textContent = noiseLevel;
  summaryTitle.textContent = title;
  summaryText.textContent = text;
  recommendationText.textContent = recommendation;

  const statusMap = {
    good: {
      label: 'Low',
      bg: 'rgba(34, 197, 94, 0.14)',
      border: 'rgba(34, 197, 94, 0.5)',
      color: '#bbf7d0'
    },
    warn: {
      label: 'Moderate',
      bg: 'rgba(251, 191, 36, 0.14)',
      border: 'rgba(251, 191, 36, 0.5)',
      color: '#fef3c7'
    },
    danger: {
      label: 'High',
      bg: 'rgba(239, 68, 68, 0.14)',
      border: 'rgba(239, 68, 68, 0.5)',
      color: '#fecaca'
    }
  };

  const mapped = statusMap[color] || statusMap.good;
  statusPill.textContent = mapped.label;
  statusPill.style.background = mapped.bg;
  statusPill.style.borderColor = mapped.border;
  statusPill.style.color = mapped.color;
  summaryBox.style.background = color === 'danger' ? 'rgba(127, 29, 29, 0.12)' : color === 'warn' ? 'rgba(120, 53, 15, 0.12)' : 'rgba(15, 118, 110, 0.12)';
  summaryBox.style.borderColor = mapped.border;
}

function conversionMap(flowValue, fromUnit) {
  const map = {
    gpm: flowValue,
    cfs: flowValue * 448.831,
    Lps: flowValue * 0.264172,
    m3s: flowValue * 15850.323
  };

  return map[fromUnit] ?? flowValue;
}

function evaluateOption1() {
  const flow = Number(document.getElementById('flow-1').value || 0);
  const flowUnit = document.getElementById('flow-unit-1').value;
  const pu = Number(document.getElementById('pu-1').value || 0);
  const pd = Number(document.getElementById('pd-1').value || 0);
  const pb = Number(document.getElementById('pb-1').value || 0);
  const pva = Number(document.getElementById('pva-1').value || 0);
  const sg = Number(document.getElementById('sg-1').value || 1);
  const deltaP = Math.max(pu - pd, 0.01);
  const sigma = (pd + pb - pva) / deltaP;
  const flowGpm = conversionMap(flow, flowUnit);
  const cv = flowGpm / (19.63 * Math.sqrt(Math.max(deltaP / sg, 0.01)));
  const opening = Number(document.getElementById('opening-1').value || 50) / 100;
  const valveType = document.getElementById('valve-type-1').value;
  const effectiveCv = cv * (typeFactors[valveType] || 1) * (0.55 + opening * 0.8);

  let title = 'No cavitation risk';
  let text = 'The valve is operating above the cavitation threshold for a screening assessment.';
  let recommendation = 'Proceed with a normal design review and validate with manufacturer data for the selected valve and trim.';
  let color = 'good';
  let noiseLevel = 'Low';

  if (sigma < 0.6) {
    title = 'Severe cavitation likely';
    text = 'The cavitation index is low enough to suggest strong vapor formation and likely trim damage risk.';
    recommendation = 'Reduce pressure drop, increase downstream pressure, or use anti-cavitation trim in a staged pressure-reduction arrangement.';
    color = 'danger';
    noiseLevel = 'High';
  } else if (sigma < 1.0) {
    title = 'Cavitating conditions';
    text = 'The valve is near the cavitation boundary and should be reviewed for performance and noise risk.';
    recommendation = 'Consider a more suitable trim, increase downstream recovery, or reduce operating flow to stay outside the cavitation zone.';
    color = 'warn';
    noiseLevel = 'Moderate';
  } else if (sigma < 1.3) {
    title = 'Transition zone';
    text = 'The valve is in a marginal region where cavitation may begin under transient or off-design conditions.';
    recommendation = 'Monitor the operating range and confirm the valve behavior during peak flow and minimum downstream pressure conditions.';
    color = 'warn';
    noiseLevel = 'Moderate';
  }

  emitResult({
    sigma,
    deltaP,
    flowDisplay: `${formatNumber(flowGpm, 0)} gpm`,
    noiseLevel,
    title,
    text,
    recommendation,
    color
  });

  return { sigma, deltaP, flow: flowGpm, noise: noiseLevel, title, recommendation, effectiveCv };
}

function evaluateOption2() {
  const headUp = Number(document.getElementById('head-up-2').value || 0);
  const headDown = Number(document.getElementById('head-down-2').value || 0);
  const pipeDia = Number(document.getElementById('pipe-dia-2').value || 0);
  const fittings = Number(document.getElementById('fittings-2').value || 0);
  const elevRise = Number(document.getElementById('elev-rise-2').value || 0);
  const opening = Number(document.getElementById('opening-2').value || 50) / 100;
  const sg = Number(document.getElementById('sg-2').value || 1);
  const valveType = document.getElementById('valve-type-2').value;
  const deltaP = Math.max((headUp - headDown) * 2.31, 0.1);
  const sigma = Math.max((deltaP * 0.5 - 0.4) / (deltaP * 0.7 + 0.1), 0.1);
  const diaFt = pipeDia / 12;
  const area = Math.PI * (diaFt * diaFt) / 4;
  const flowCfs = Math.sqrt(Math.max((headUp - headDown - elevRise) * 2.31 / (1 + fittings * 0.8), 0.1)) * area * 0.8;
  const flowGpm = flowCfs * 448.831;

  let title = 'System check acceptable';
  let text = 'The hydraulic system is producing a moderate pressure drop with acceptable screening margins.';
  let recommendation = 'Keep an eye on the worst-case operating condition and check the actual valve manufacturer curve before final design.';
  let color = 'good';
  let noiseLevel = 'Low';

  if (sigma < 0.6) {
    title = 'System cavitation risk';
    text = 'The current system allows low sigma values across the valve, which may trigger cavitation and associated damage.';
    recommendation = 'Increase upstream pressure margin, reduce valve pressure drop, or split the total pressure loss between stages.';
    color = 'danger';
    noiseLevel = 'High';
  } else if (sigma < 1.0) {
    title = 'System near cavitation threshold';
    text = 'The system is nearing a cavitation threshold and may experience transient damage or noise under operation changes.';
    recommendation = 'Calibrate the design for a wider operating margin and review valve trim and piping details.';
    color = 'warn';
    noiseLevel = 'Moderate';
  }

  emitResult({
    sigma,
    deltaP,
    flowDisplay: `${formatNumber(flowGpm, 0)} gpm`,
    noiseLevel,
    title,
    text,
    recommendation,
    color
  });

  return { sigma, deltaP, flow: flowGpm, noise: noiseLevel, title, recommendation, valveType, opening, sg };
}

function evaluateOption3() {
  const flow = Number(document.getElementById('flow-3').value || 0);
  const flowUnit = document.getElementById('flow-unit-3').value;
  const shutoff = Number(document.getElementById('shutoff-3').value || 0);
  const pd = Number(document.getElementById('pd-3').value || 0);
  const pva = Number(document.getElementById('pva-3').value || 0);
  const sg = Number(document.getElementById('sg-3').value || 1);
  const valveType = document.getElementById('valve-type-3').value;
  const opening = Number(document.getElementById('opening-3').value || 50) / 100;
  const flowGpm = conversionMap(flow, flowUnit);
  const deltaP = Math.max(shutoff - pd, 0.01);
  const sigma = ((pd - pva) / deltaP) + 0.35;

  let title = 'Field data indicates safe operation';
  let text = 'The shutoff-to-test-point relationship suggests a healthy pressure margin for the valve opening.';
  let recommendation = 'Validate with manufacturer data at the actual installed trim and field conditions for final confirmation.';
  let color = 'good';
  let noiseLevel = 'Low';

  if (sigma < 0.6) {
    title = 'Field cavitation risk';
    text = 'The measured shutoff and flow relationship indicates cavitation is likely under current operating conditions.';
    recommendation = 'Reduce pressure drop, increase downstream recovery, or reselect the valve trim to keep sigma above the cavitation threshold.';
    color = 'danger';
    noiseLevel = 'High';
  } else if (sigma < 1.0) {
    title = 'Field transition condition';
    text = 'This data set sits close to the onset of cavitation and should be treated as a cautionary condition.';
    recommendation = 'Compare against the valve curve and run additional field points to determine whether tuning or trim changes are necessary.';
    color = 'warn';
    noiseLevel = 'Moderate';
  }

  emitResult({
    sigma,
    deltaP,
    flowDisplay: `${formatNumber(flowGpm, 0)} gpm`,
    noiseLevel,
    title,
    text,
    recommendation,
    color
  });

  return { sigma, deltaP, flow: flowGpm, noise: noiseLevel, title, recommendation, valveType, opening, sg };
}

function calculate() {
  const active = document.querySelector('.tab.active')?.dataset.option || 'option1';

  if (active === 'option1') {
    evaluateOption1();
    return;
  }
  if (active === 'option2') {
    evaluateOption2();
    return;
  }
  evaluateOption3();
}

function syncRange(idRange, idValue) {
  const range = document.getElementById(idRange);
  const value = document.getElementById(idValue);
  range.addEventListener('input', () => {
    value.textContent = `${range.value}%`;
    calculate();
  });
}

function setExample() {
  const state = { ...exampleValues, activeOption: 'option1', notes: '' };
  setFormState(state);
}

function getScenarioLabel(optionName) {
  const map = {
    option1: 'Single valve opening',
    option2: 'Hydraulic system',
    option3: 'Shutoff + test point'
  };
  return map[optionName] || 'Scenario';
}

function addCurrentScenario() {
  const active = document.querySelector('.tab.active')?.dataset.option || 'option1';
  const result = active === 'option1' ? evaluateOption1() : active === 'option2' ? evaluateOption2() : evaluateOption3();
  const scenarioName = `${getScenarioLabel(active)} ${scenarioList.children.length + 1}`;

  const item = document.createElement('div');
  item.className = 'scenario-item';
  item.innerHTML = `
    <div class="scenario-top">
      <span class="scenario-name">${scenarioName}</span>
      <span class="status-pill" style="font-size:0.64rem; padding:4px 6px;">${result.noise}</span>
    </div>
    <div class="scenario-metrics">
      <span>σ: ${formatNumber(result.sigma, 2)}</span>
      <span>ΔP: ${formatNumber(result.deltaP, 1)} psi</span>
      <span>Flow: ${formatNumber(result.flow, 0)} gpm</span>
    </div>
  `;
  scenarioList.prepend(item);
}

function prepareProjectButtons() {
  saveButton.addEventListener('click', saveProject);
  loadButton.addEventListener('click', loadProject);
  exportButton.addEventListener('click', exportProject);
  printButton.addEventListener('click', printReport);
  resetButton.addEventListener('click', setExample);
  addScenarioButton.addEventListener('click', addCurrentScenario);
}

function bindInputs() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveOption(tab.dataset.option));
  });

  syncRange('opening-1', 'opening-value-1');
  syncRange('opening-2', 'opening-value-2');
  syncRange('opening-3', 'opening-value-3');

  document.querySelectorAll('input, select, textarea').forEach((node) => {
    node.addEventListener('input', calculate);
    node.addEventListener('change', calculate);
  });
}

prepareProjectButtons();
bindInputs();
setExample();
setActiveOption('option1');

if (scenarioList) {
  scenarioList.innerHTML = '<div class="scenario-item"><div class="scenario-top"><span class="scenario-name">Baseline</span></div><div class="scenario-metrics"><span>σ: 1.42</span><span>ΔP: 165 psi</span><span>Flow: 1,250 gpm</span></div></div>';
}
