const tabs = Array.from(document.querySelectorAll('.tab'));
const optionPanels = Array.from(document.querySelectorAll('[data-option-panel]'));
const resetButton = document.getElementById('reset-example');

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
  deltaPValue.textContent = `${formatNumber(deltaP, 1)} ${color === 'pressure' ? 'psi' : 'kPa'}`;
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

function calculate() {
  const active = document.querySelector('.tab.active')?.dataset.option || 'option1';

  if (active === 'option1') {
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

    return;
  }

  if (active === 'option2') {
    const headUp = Number(document.getElementById('head-up-2').value || 0);
    const headDown = Number(document.getElementById('head-down-2').value || 0);
    const pipeLength = Number(document.getElementById('pipe-length-2').value || 0);
    const pipeDia = Number(document.getElementById('pipe-dia-2').value || 0);
    const roughness = Number(document.getElementById('roughness-2').value || 0.00015);
    const fittings = Number(document.getElementById('fittings-2').value || 0);
    const elevRise = Number(document.getElementById('elev-rise-2').value || 0);
    const opening = Number(document.getElementById('opening-2').value || 50) / 100;
    const sg = Number(document.getElementById('sg-2').value || 1);
    const valveType = document.getElementById('valve-type-2').value;

    const diaFt = pipeDia / 12;
    const area = Math.PI * (diaFt * diaFt) / 4;
    const velocityHead = Math.max((headUp - headDown - elevRise) / 2.31, 0.1);
    const flowCfs = Math.sqrt(Math.max((headUp - headDown - elevRise) * 2.31 / (1 + fittings * 0.8), 0.1)) * area * 0.8;
    const flowGpm = flowCfs * 448.831;
    const deltaP = Math.max((headUp - headDown) * 2.31, 0.1);
    const sigma = Math.max((deltaP * 0.5 - 0.4) / (deltaP * 0.7 + 0.1), 0.1);
    const effectiveCv = flowGpm / (19.63 * Math.sqrt(Math.max(deltaP / sg, 0.01))) * (typeFactors[valveType] || 1) * (0.55 + opening * 0.8);

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

    return;
  }

  if (active === 'option3') {
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
    const effectiveCv = flowGpm / (19.63 * Math.sqrt(Math.max(deltaP / sg, 0.01))) * (typeFactors[valveType] || 1) * (0.55 + opening * 0.8);

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
  }
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
  document.getElementById('unit-system-1').value = exampleValues.option1.unitSystem;
  document.getElementById('flow-1').value = exampleValues.option1.flow;
  document.getElementById('flow-unit-1').value = exampleValues.option1.flowUnit;
  document.getElementById('pu-1').value = exampleValues.option1.pu;
  document.getElementById('pd-1').value = exampleValues.option1.pd;
  document.getElementById('pb-1').value = exampleValues.option1.pb;
  document.getElementById('pva-1').value = exampleValues.option1.pva;
  document.getElementById('opening-1').value = exampleValues.option1.opening;
  document.getElementById('opening-value-1').textContent = `${exampleValues.option1.opening}%`;
  document.getElementById('valve-type-1').value = exampleValues.option1.valveType;
  document.getElementById('sg-1').value = exampleValues.option1.sg;

  document.getElementById('head-up-2').value = exampleValues.option2.headUp;
  document.getElementById('head-down-2').value = exampleValues.option2.headDown;
  document.getElementById('pipe-length-2').value = exampleValues.option2.pipeLength;
  document.getElementById('pipe-dia-2').value = exampleValues.option2.pipeDia;
  document.getElementById('roughness-2').value = exampleValues.option2.roughness;
  document.getElementById('fittings-2').value = exampleValues.option2.fittings;
  document.getElementById('elev-rise-2').value = exampleValues.option2.elevRise;
  document.getElementById('opening-2').value = exampleValues.option2.opening;
  document.getElementById('opening-value-2').textContent = `${exampleValues.option2.opening}%`;
  document.getElementById('valve-type-2').value = exampleValues.option2.valveType;
  document.getElementById('sg-2').value = exampleValues.option2.sg;

  document.getElementById('flow-3').value = exampleValues.option3.flow;
  document.getElementById('flow-unit-3').value = exampleValues.option3.flowUnit;
  document.getElementById('shutoff-3').value = exampleValues.option3.shutoff;
  document.getElementById('pd-3').value = exampleValues.option3.pd;
  document.getElementById('pva-3').value = exampleValues.option3.pva;
  document.getElementById('opening-3').value = exampleValues.option3.opening;
  document.getElementById('opening-value-3').textContent = `${exampleValues.option3.opening}%`;
  document.getElementById('sg-3').value = exampleValues.option3.sg;
  document.getElementById('valve-type-3').value = exampleValues.option3.valveType;

  calculate();
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveOption(tab.dataset.option));
});

syncRange('opening-1', 'opening-value-1');
syncRange('opening-2', 'opening-value-2');
syncRange('opening-3', 'opening-value-3');

document.querySelectorAll('input, select').forEach((node) => {
  node.addEventListener('input', calculate);
  node.addEventListener('change', calculate);
});

resetButton.addEventListener('click', setExample);

setExample();
setActiveOption('option1');
