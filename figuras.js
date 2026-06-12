const WRB_CLASS_COLORS = {
  Arenosols: '#E67E22',
  Calcisols: '#B39DDB',
  Cambisols: '#2E86C1',
  Fluvisols: '#16A085',
  Luvisols: '#C0392B'
};

const USDA_CLASS_COLORS = {
  Arena: '#E67E22',
  Sand: '#E67E22',
  'Franco Arcillo-Arenoso': '#1F9D8B',
  'Sandy Clay Loam': '#1F9D8B',
  'Franco Arcilloso': '#2C7FB8',
  'Clay Loam': '#2C7FB8'
};

const FALLBACK_COLORS = ['#7f8c8d', '#8e44ad', '#0f766e', '#4f46e5', '#b45309'];

function fallbackPalette(name) {
  const idx = Math.abs(Array.from(String(name)).reduce((a, c) => a + c.charCodeAt(0), 0)) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}

function colorForClass(name) {
  const key = String(name || '').trim();
  if (WRB_CLASS_COLORS[key]) return WRB_CLASS_COLORS[key];
  if (USDA_CLASS_COLORS[key]) return USDA_CLASS_COLORS[key];
  return fallbackPalette(key);
}

function inferUsdaClass(clay, sand, silt) {
  if (![clay, sand, silt].every((v) => Number.isFinite(v))) return 'Sin clase';
  if (sand >= 70 && clay <= 20) return 'Arena';
  if (clay >= 35) return 'Franco Arcilloso';
  return 'Franco Arcillo-Arenoso';
}

const d = window.FIGURAS_DATA;
if (!d || typeof Plotly === 'undefined') {
  throw new Error('FIGURAS_DATA or Plotly not available');
}

const common = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  margin: { l: 46, r: 20, t: 16, b: 56 },
  font: { family: 'Space Grotesk, sans-serif', color: '#1b1d1c' }
};

Plotly.newPlot('fig1', [{
  type: 'bar', x: d.wrb_class_distribution.labels, y: d.wrb_class_distribution.counts,
  marker: { color: d.wrb_class_distribution.labels.map(colorForClass) }
}], { ...common, xaxis: { tickangle: -30 }, yaxis: { title: 'Muestras' } }, { responsive: true, displaylogo: false });

Plotly.newPlot('fig2', [{
  type: 'bar', x: d.wrb_class_distribution.labels, y: d.wrb_class_distribution.counts,
  marker: { color: d.wrb_class_distribution.labels.map(colorForClass) }
}], { ...common, xaxis: { tickangle: -30 }, yaxis: { title: 'Muestras', type: 'log' } }, { responsive: true, displaylogo: false });

Plotly.newPlot('fig3', [{
  type: 'bar', x: d.wrb_missing_top20.labels, y: d.wrb_missing_top20.pct,
  marker: { color: '#b45309' }
}], { ...common, xaxis: { tickangle: -45 }, yaxis: { title: 'Missing %' } }, { responsive: true, displaylogo: false });

Plotly.newPlot('fig4', [
  { type: 'scatter', mode: 'lines+markers', name: 'vwc', x: d.missing_by_depth.vwc.depth, y: d.missing_by_depth.vwc.pct },
  { type: 'scatter', mode: 'lines+markers', name: 'temp', x: d.missing_by_depth.temp.depth, y: d.missing_by_depth.temp.pct },
  { type: 'scatter', mode: 'lines+markers', name: 'vic', x: d.missing_by_depth.vic.depth, y: d.missing_by_depth.vic.pct }
], { ...common, xaxis: { title: 'Depth (cm)' }, yaxis: { title: 'Missing %' } }, { responsive: true, displaylogo: false });

const cls = Object.keys(d.profiles.vwc);
Plotly.newPlot('fig5', cls.map((c) => ({ type: 'scatter', mode: 'lines+markers', name: c, x: d.profiles.depth, y: d.profiles.vwc[c], line: { color: colorForClass(c) } })), { ...common, xaxis: { title: 'Depth (cm)' }, yaxis: { title: 'VWC' } }, { responsive: true, displaylogo: false });
Plotly.newPlot('fig6', cls.map((c) => ({ type: 'scatter', mode: 'lines+markers', name: c, x: d.profiles.depth, y: d.profiles.temp[c], line: { color: colorForClass(c) } })), { ...common, xaxis: { title: 'Depth (cm)' }, yaxis: { title: 'TEMP' } }, { responsive: true, displaylogo: false });

Plotly.newPlot('fig7', [{ type: 'heatmap', x: d.correlation.columns, y: d.correlation.columns, z: d.correlation.values, colorscale: 'RdBu', zmid: 0 }], { ...common, margin: { l: 90, r: 20, t: 16, b: 100 } }, { responsive: true, displaylogo: false });

const wrbHeatmapY = ['Cambisols', 'Luvisols', 'Fluvisols', 'Calcisols', 'Arenosols'];
const wrbHeatmapX = [
  'Hum<br>10 cm',
  'Hum<br>50 cm',
  'Var hum<br>10 cm',
  'Cond elec<br>10 cm',
  'Temp<br>10 cm',
  'Vel secado<br>10 cm'
];
const wrbHeatmapZ = [
  [0.71, 1.23, -0.58, 1.41, -0.34, -0.44],
  [1.62, 0.74, -0.55, 0.00, -1.28, -0.36],
  [-0.93, -0.98, -0.21, -0.69, 0.50, -0.67],
  [-0.56, -0.98, -0.64, -0.73, -0.53, -0.52],
  [-0.84, 0.00, 1.98, 0.00, 1.65, 1.99]
];

Plotly.newPlot('fig7a', [{
  type: 'heatmap',
  x: wrbHeatmapX,
  y: wrbHeatmapY,
  z: wrbHeatmapZ,
  zmin: -2,
  zmax: 2,
  colorscale: [
    [0.0, '#c0392b'],
    [0.5, '#f4e8b2'],
    [1.0, '#2c7fb8']
  ],
  colorbar: { thickness: 12, len: 0.9, x: 1.01, xpad: 2 },
  text: wrbHeatmapZ.map((row) => row.map((v) => v.toFixed(2))),
  texttemplate: '%{text}',
  hovertemplate: '%{y}<br>%{x}<br>Z-score: %{z:.2f}<extra></extra>'
}], {
  ...common,
  dragmode: false,
  hovermode: false,
  margin: { l: 104, r: 8, t: 16, b: 76 },
  xaxis: { tickangle: 0, automargin: true, fixedrange: true, tickfont: { size: 10 } },
  yaxis: { automargin: true, fixedrange: true }
}, { responsive: true, displaylogo: false, staticPlot: true });

Plotly.newPlot('fig7b', [{
  type: 'heatmap',
  x: wrbHeatmapX,
  y: wrbHeatmapY,
  z: wrbHeatmapZ,
  zmin: -2,
  zmax: 2,
  colorscale: [
    [0.0, '#1a9850'],
    [0.5, '#f4e8b2'],
    [1.0, '#b2182b']
  ],
  colorbar: { thickness: 12, len: 0.9, x: 1.01, xpad: 2 },
  text: wrbHeatmapZ.map((row) => row.map((v) => v.toFixed(2))),
  texttemplate: '%{text}',
  hovertemplate: '%{y}<br>%{x}<br>Z-score: %{z:.2f}<extra></extra>'
}], {
  ...common,
  dragmode: false,
  hovermode: false,
  margin: { l: 104, r: 8, t: 16, b: 76 },
  xaxis: { tickangle: 0, automargin: true, fixedrange: true, tickfont: { size: 10 } },
  yaxis: { automargin: true, fixedrange: true }
}, { responsive: true, displaylogo: false, staticPlot: true });

const pcaTraces = [];
for (const c of d.pca.top_classes) {
  const x = [];
  const y = [];
  d.pca.label.forEach((lbl, i) => {
    if (lbl === c) {
      x.push(d.pca.x[i]);
      y.push(d.pca.y[i]);
    }
  });
  pcaTraces.push({ type: 'scattergl', mode: 'markers', name: c, x, y, marker: { size: 9, opacity: 0.9, color: colorForClass(c) } });
}
Plotly.newPlot('fig8', pcaTraces, { ...common, xaxis: { title: 'PC1' }, yaxis: { title: 'PC2' } }, { responsive: true, displaylogo: false });

Plotly.newPlot('fig9', [
  { type: 'histogram', name: 'clay', x: d.usda_hist.clay, opacity: 0.65 },
  { type: 'histogram', name: 'sand', x: d.usda_hist.sand, opacity: 0.65 },
  { type: 'histogram', name: 'silt', x: d.usda_hist.silt, opacity: 0.65 }
], { ...common, barmode: 'overlay', xaxis: { title: 'pct' }, yaxis: { title: 'count' } }, { responsive: true, displaylogo: false });

const usdaPoints = d.usda_scatter.clay.map((clay, i) => ({
  clay,
  sand: d.usda_scatter.sand[i],
  silt: d.usda_scatter.silt[i],
  cls: inferUsdaClass(clay, d.usda_scatter.sand[i], d.usda_scatter.silt[i])
}));
const usdaClassOrder = ['Arena', 'Franco Arcillo-Arenoso', 'Franco Arcilloso'];
const fig10Traces = usdaClassOrder.map((clsName) => {
  const sub = usdaPoints.filter((p) => p.cls === clsName);
  return {
    type: 'scattergl',
    mode: 'markers',
    name: clsName,
    x: sub.map((p) => p.clay),
    y: sub.map((p) => p.sand),
    marker: { size: 8, opacity: 0.8, color: colorForClass(clsName) },
    hovertemplate: `${clsName}<br>clay: %{x:.2f}<br>sand: %{y:.2f}<extra></extra>`
  };
}).filter((t) => t.x.length > 0);
Plotly.newPlot('fig10', fig10Traces, { ...common, xaxis: { title: 'clay_30_60_pct' }, yaxis: { title: 'sand_30_60_pct' }, legend: { orientation: 'h' } }, { responsive: true, displaylogo: false });

const cov = d.label_coverage_breakdown;
const fig11Labels = (cov && Array.isArray(cov.labels) && Array.isArray(cov.values))
  ? cov.labels
  : ['labeled', 'unlabeled'];
const fig11Values = (cov && Array.isArray(cov.labels) && Array.isArray(cov.values))
  ? cov.values
  : [d.label_coverage.known, d.label_coverage.unknown];

Plotly.newPlot('fig11', [{
  type: 'pie', labels: fig11Labels, values: fig11Values
}], { ...common, margin: { l: 10, r: 10, t: 10, b: 10 } }, { responsive: true, displaylogo: false });
