const form = document.getElementById('calc-form');
const resetButton = document.getElementById('reset-example');
const unitSystem = document.getElementById('unit-system');
const valveType = document.getElementById('valve-type');
const valvePosition = document.getElementById('valve-position');
const positionValue = document.getElementById('position-value');
const flowInput = document.getElementById('flow');
const flowUnit = document.getElementById('flow-unit');
const puInput = document.getElementById('pu');
const pdInput = document.getElementById('pd');
const pbInput = document.getElementById('pb');
const pvaInput = document.getElementById('pva');
const sgInput = document.getElementById('sg');
const fluidSelect = document.getElementById('fluid');

const sigmaValue = document.getElementById('sigma-value');
const deltaPValue = document.getElementById('delta-p-value');
const cvValue = document.getElementById('cv-value');
const noiseValue = document.getElementById('noise-value');
const summaryTitle = document.getElementById('summary-title');
const summaryText = document.getElementById('summary-text');
const recommendationText = document.getElementById('recommendation-text');
const statusPill = document.getElementById('status-pill');

const example = {
  unitSystem: 'US',
  valveType: 'butterfly',
  valvePosition: 55,
  flow: 1250,
  flowUnit: 'gpm',
  pu: 200,
  pd: 35,
  pb: 0,
  pva: 0.5,
  sg: 1,
  fluid: 'water'
};

const typeFactors = {
  butterfly: 0.92,
  globe: 1.12,
  cone: 0.85,
  ball: 0.98
};

function assignExample() {
  unitSystem.value = example.unitSystem;
  valveType.value = example.valveType;
  valvePosition.value = example.valvePosition;
  flowInput.value = example.flow;
  flowUnit.value = example.flowUnit;
  puInput.value = example.pu;
  pdInput.value = example.pd;
  pbInput.value = example.pb;
  pvaInput.value = example.pva;
  sgInput.value = example.sg;
  fluidSelect.value = example.fluid;
  updateRangeLabel();
  calculate();
}

function updateRangeLabel() {
  positionValue.textContent = `${valvePosition.value}%`;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function conversionMap(flowValue, fromUnit) {
  const gpm = {
    gpm: flowValue,
    cfs: flowValue * 448.831,
    Lps: flowValue * 0.264172,
    m3s: flowValue * 15850.323
  };

  const valueInGpm = gpm[fromUnit] ?? flowValue;
  return {
    gpm: valueInGpm,
    cfs: valueInGpm / 448.831,
    Lps: valueInGpm / 3.78541,
    m3s: valueInGpm / 15850.323
  };
}

function calculate() {
  const flowValue = Number(flowInput.value || 0);
  const pu = Number(puInput.value || 0);
  const pd = Number(pdInput.value || 0);
  const pb = Number(pbInput.value || 0);
  const pva = Number(pvaInput.value || 0);
  const sg = Number(sgInput.value || 1);
  const position = Number(valvePosition.value || 0);
  const flowInGpm = conversionMap(flowValue, flowUnit.value).gpm;
  const deltaP = Math.max(pu - pd, 0.01);

  const sigma = (pd + pb - pva) / deltaP;
  const cv = flowInGpm / (19.63 * Math.sqrt(Math.max(deltaP / sg, 0.01)));
  const positionFactor = 0.55 + (position / 100) * 0.8;
  const valveFactor = typeFactors[valveType.value] || 1;
  const effectiveCv = cv * valveFactor * positionFactor;

  let status = 'Low';
  let summary = 'No cavitation risk';
  let text = 'The valve is operating above the cavitation threshold for a screening assessment.';
  let recommendation = 'Proceed with a normal design review and validate with manufacturer data for the selected valve and trim.';
  let pillClass = 'good';

  if (sigma < 0.6) {
    status = 'High';
    summary = 'Severe cavitation likely';
    text = 'The cavitation index is low enough to suggest strong vapor formation, choked flow behavior and likely mechanical damage risk.';
    recommendation = 'Reduce the pressure drop, increase downstream pressure, or use a valve trim designed for cavitation service with anti-cavitation modifications.';
    pillClass = 'danger';
  } else if (sigma < 1.0) {
    status = 'Moderate';
    summary = 'Cavitating conditions';
    text = 'The valve is near the cavitation boundary and should be reviewed for performance and noise risk.';
    recommendation = 'Consider a more suitable trim, larger downstream recovery, or staged pressure reduction to keep operation away from onset.';
    pillClass = 'warn';
  } else if (sigma < 1.3) {
    status = 'Low to moderate';
    summary = 'Transition zone';
    text = 'The valve is in a marginal zone where cavitation may begin under transient or off-design conditions.';
    recommendation = 'Monitor operating range and check field test data at the expected minimum upstream pressure and maximum flow.';
    pillClass = 'warn';
  }

  const noise = sigma < 0.75 ? 'High' : sigma < 1.2 ? 'Moderate' : 'Low';

  sigmaValue.textContent = formatNumber(sigma, 2);
  deltaPValue.textContent = `${formatNumber(deltaP, 1)} ${unitSystem.value === 'US' ? 'psi' : 'kPa'}`;
  cvValue.textContent = formatNumber(effectiveCv, 1);
  noiseValue.textContent = noise;
  summaryTitle.textContent = summary;
  summaryText.textContent = text;
  recommendationText.textContent = recommendation;
  statusPill.textContent = status;
  statusPill.style.background = pillClass === 'danger' ? 'rgba(239, 68, 68, 0.14)' : pillClass === 'warn' ? 'rgba(251, 191, 36, 0.14)' : 'rgba(34, 197, 94, 0.14)';
  statusPill.style.color = pillClass === 'danger' ? '#fecaca' : pillClass === 'warn' ? '#fef3c7' : '#bbf7d0';
  statusPill.style.borderColor = pillClass === 'danger' ? 'rgba(239, 68, 68, 0.5)' : pillClass === 'warn' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(34, 197, 94, 0.5)';

  const summaryBox = document.querySelector('.summary');
  summaryBox.style.borderColor = pillClass === 'danger' ? 'rgba(239, 68, 68, 0.35)' : pillClass === 'warn' ? 'rgba(251, 191, 36, 0.35)' : 'rgba(34, 197, 94, 0.35)';
  summaryBox.style.background = pillClass === 'danger' ? 'rgba(127, 29, 29, 0.12)' : pillClass === 'warn' ? 'rgba(120, 53, 15, 0.12)' : 'rgba(15, 118, 110, 0.12)';
}

flowInput.addEventListener('input', calculate);
unitSystem.addEventListener('change', () => {
  if (unitSystem.value === 'SI') {
    flowUnit.innerHTML = '<option value="Lps">L/s</option><option value="m3s">m³/s</option><option value="gpm">gpm</option><option value="cfs">cfs</option>';
    puInput.value = 1378;
    pdInput.value = 241;
    pvaInput.value = 3.5;
  } else {
    flowUnit.innerHTML = '<option value="gpm">gpm</option><option value="cfs">cfs</option><option value="Lps">L/s</option><option value="m3s">m³/s</option>';
    puInput.value = 200;
    pdInput.value = 35;
    pvaInput.value = 0.5;
  }
  calculate();
});

valveType.addEventListener('change', calculate);
valvePosition.addEventListener('input', () => {
  updateRangeLabel();
  calculate();
});

Array.from(form.querySelectorAll('input, select')).forEach((field) => {
  field.addEventListener('input', calculate);
  field.addEventListener('change', calculate);
});

resetButton.addEventListener('click', assignExample);

updateRangeLabel();
assignExample();
