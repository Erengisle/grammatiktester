/* Elevblad redesign — 4 versions (current + 3 directions) */

// Sample data: Maja Nilsson, 8 områden × 10 tester (varierad)
const AREAS = [
  { name: "Verb",                tests: [85, 70, 92, 88, 95, null, null, null, null, null] },
  { name: "Pronomen",            tests: [60, 75, 80, null, null, null, null, null, null, null] },
  { name: "Adjektiv",            tests: [90, 95, 100, 85, null, null, null, null, null, null] },
  { name: "Adverb",              tests: [40, 55, null, null, null, null, null, null, null, null] },
  { name: "Konjunktioner",       tests: [80, 90, 85, 95, 90, 100, null, null, null, null] },
  { name: "Subjunktioner",       tests: [70, 65, 75, null, null, null, null, null, null, null] },
  { name: "Ordföljd huvudsats",  tests: [85, 90, null, null, null, null, null, null, null, null] },
  { name: "Ordföljd bisats",     tests: [null, null, null, null, null, null, null, null, null, null] },
];

function rowMedel(tests) {
  const v = tests.filter(t => t !== null);
  if (v.length === 0) return null;
  return Math.round(v.reduce((a,b) => a+b, 0) / v.length);
}
function totalMedel() {
  const all = AREAS.flatMap(a => a.tests).filter(t => t !== null);
  return Math.round(all.reduce((a,b) => a+b, 0) / all.length);
}

// =============== 0. NULÄGET — Recreate current template ================
const currentColors = {
  red: "#f4cccc", yellow: "#fff2cc", green: "#d9ead3",
};
function currentColor(p) {
  if (p === null) return null;
  if (p < 50) return currentColors.red;
  if (p < 75) return currentColors.yellow;
  return currentColors.green;
}

function ElevbladNu() {
  const total = totalMedel();
  return (
    <div className="sheet">
      <div className="sheet-chrome">
        <span className="dot"></span>
        <span style={{ fontWeight:500, color:"#3c4043" }}>Maja Nilsson</span>
        <span style={{ color:"#80868b" }}>· Google Kalkylark</span>
        <span style={{ marginLeft:"auto", color:"#80868b" }}>Arkiv · Redigera · Visa · Infoga …</span>
      </div>
      <div className="sheet-body" style={{ fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", padding:"18px 26px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18 }}>
          <h1 style={{ fontSize:16, fontWeight:700, margin:0, color:"#000" }}>Mina resultat på grammatiktester</h1>
          <span style={{ fontSize:11, fontWeight:700, color:"#000" }}>Totalt medel: {total}</span>
        </div>
        <table className="gs" style={{ width:"100%" }}>
          <thead>
            <tr>
              <th className="area" style={{ border:"2px solid #000", background:"#fff", fontWeight:700, fontSize:11, padding:"5px 8px" }}>Område</th>
              {Array.from({length:10}).map((_,i)=>(
                <th key={i} style={{ border:"1px solid #000", borderTop:"2px solid #000", background:"#fff", fontWeight:700, fontSize:10, padding:"5px 4px", width: 38 }}>
                  Test {i+1}
                </th>
              ))}
              <th style={{ border:"2px solid #000", background:"#fff", fontWeight:700, fontSize:11, padding:"5px 4px", width: 48 }}>Medel</th>
            </tr>
          </thead>
          <tbody>
            {AREAS.map((a, i) => {
              const last = i === AREAS.length - 1;
              const med = rowMedel(a.tests);
              return (
                <tr key={a.name}>
                  <td className="area" style={{ border:"2px solid #000", borderTop: i===0?"2px solid #000":"1px solid #000", borderBottom: last?"2px solid #000":"1px solid #000", padding:"6px 8px", fontWeight:700, fontSize:11, textAlign:"left" }}>
                    {a.name}
                  </td>
                  {a.tests.map((t, j) => {
                    const bg = currentColor(t);
                    return (
                      <td key={j} style={{
                        border:"1px solid #000",
                        background: bg || "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        padding: "6px 0",
                        color: "#000",
                      }}>{t ?? ""}</td>
                    );
                  })}
                  <td style={{ border:"2px solid #000", borderTop: i===0?"2px solid #000":"1px solid #000", borderBottom: last?"2px solid #000":"1px solid #000", fontWeight:700, fontSize:11 }}>
                    {med ?? ""}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={11} style={{ borderTop:"2px solid #000", padding:0, height: 8 }}></td>
              <td style={{ border:"2px solid #000", borderTop:"2px solid #000", padding:"5px 4px", fontWeight:700, fontSize:11 }}>Medel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============== 1. FÖRFINAD — refined warm earth palette ================
const refinedPalette = [
  { min: 0,  max: 49,  bg: "#f1d8cc", text: "#7a3528", label: "behöver träning" },
  { min: 50, max: 74,  bg: "#f4e7c5", text: "#6a5520", label: "godkänt" },
  { min: 75, max: 89,  bg: "#dde7d0", text: "#3f5a30", label: "bra" },
  { min: 90, max: 100, bg: "#c4d6bd", text: "#1f3a1f", label: "mycket bra" },
];
function refinedColor(p) {
  if (p === null) return null;
  return refinedPalette.find(s => p >= s.min && p <= s.max);
}

function ElevbladForfinad() {
  const total = totalMedel();
  return (
    <div className="sheet">
      <div className="sheet-chrome">
        <span className="dot"></span>
        <span style={{ fontWeight:500, color:"#3c4043" }}>Maja Nilsson</span>
        <span style={{ color:"#80868b" }}>· Google Kalkylark</span>
        <span style={{ marginLeft:"auto", color:"#80868b" }}>Arkiv · Redigera · Visa · Infoga …</span>
      </div>
      <div className="sheet-body" style={{ fontFamily:"'Inter', sans-serif", padding:"26px 32px", background:"#fafaf7" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8a8780", fontWeight:500 }}>Grammatik · hösttermin 2026</div>
            <h1 style={{ fontSize:22, fontWeight:500, margin:"4px 0 0", color:"#1c1c1a", letterSpacing:"-0.02em" }}>Mina resultat</h1>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8a8780", fontWeight:500 }}>Totalt medel</div>
            <div style={{ fontSize:34, fontWeight:500, lineHeight:1, marginTop:2, color:"#3f5a30", letterSpacing:"-0.03em" }}>{total}<span style={{ fontSize:18, color:"#8a8780" }}>%</span></div>
          </div>
        </div>
        <table className="gs" style={{ width:"100%", borderCollapse:"separate", borderSpacing:0 }}>
          <thead>
            <tr>
              <th className="area" style={{ borderBottom:"1px solid #d9d5cc", padding:"8px 8px", fontWeight:500, fontSize:10, color:"#8a8780", letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"left" }}>Område</th>
              {Array.from({length:10}).map((_,i)=>(
                <th key={i} style={{ borderBottom:"1px solid #d9d5cc", padding:"8px 0", fontWeight:500, fontSize:10, color:"#8a8780", width: 38 }}>{i+1}</th>
              ))}
              <th style={{ borderBottom:"1px solid #d9d5cc", padding:"8px 6px", fontWeight:500, fontSize:10, color:"#8a8780", letterSpacing:"0.08em", textTransform:"uppercase", width: 56 }}>Medel</th>
            </tr>
          </thead>
          <tbody>
            {AREAS.map((a, i) => {
              const med = rowMedel(a.tests);
              const medColor = refinedColor(med);
              return (
                <tr key={a.name}>
                  <td className="area" style={{ padding:"10px 8px", fontWeight:500, fontSize:12, textAlign:"left", color:"#1c1c1a", borderBottom:"1px solid #ecebe6" }}>
                    {a.name}
                  </td>
                  {a.tests.map((t, j) => {
                    const s = refinedColor(t);
                    return (
                      <td key={j} style={{
                        borderBottom:"1px solid #ecebe6",
                        background: s ? s.bg : "transparent",
                        fontWeight: 500, fontSize: 11,
                        padding: "10px 0",
                        color: s ? s.text : "#cdcabf",
                      }}>{t ?? "—"}</td>
                    );
                  })}
                  <td style={{ borderBottom:"1px solid #ecebe6", padding:"10px 6px", fontWeight:600, fontSize:13, color: medColor ? medColor.text : "#cdcabf" }}>
                    {med ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop:18, display:"flex", gap:14, fontSize:11, color:"#8a8780", flexWrap:"wrap" }}>
          {refinedPalette.map(s => (
            <div key={s.min} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:12, height:12, background:s.bg, borderRadius:3, display:"inline-block" }}></span>
              <span>{s.min}–{s.max}%  ·  {s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============== 2. DASHBOARD — stats + sparklines ================
const dashColors = {
  bg:"#fafaf7", ink:"#1a1d1c", mute:"#7a7a76", accent:"#3a6b54", warn:"#c66a3e",
  scale: [
    { min:0,  max:49,  bg:"#fde8e1", bar:"#c66a3e" },
    { min:50, max:74,  bg:"#fdf2d8", bar:"#c4a050" },
    { min:75, max:89,  bg:"#e1ecdb", bar:"#5a8567" },
    { min:90, max:100, bg:"#cde0c8", bar:"#3a6b54" },
  ],
};
function dashColor(p) {
  if (p === null) return null;
  return dashColors.scale.find(s => p >= s.min && p <= s.max);
}

// Tiny inline "sparkline" for the dashboard (SVG)
function SparklineBars({ tests }) {
  const max = 100;
  return (
    <svg width="60" height="18" viewBox="0 0 60 18">
      {tests.map((t, i) => {
        const h = t === null ? 2 : (t/max) * 16;
        const s = dashColor(t);
        return <rect key={i} x={i*6} y={18-h} width="4" height={h} rx="1"
          fill={t === null ? "#e6e3da" : s.bar} />;
      })}
    </svg>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ flex:1, padding:"14px 16px", background:"#fff", borderRadius:10, border:"1px solid #ecebe6" }}>
      <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8a8780", fontWeight:500 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:500, marginTop:4, color: color || "#1a1d1c", letterSpacing:"-0.02em", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#8a8780", marginTop:6 }}>{sub}</div>}
    </div>
  );
}

function ElevbladDashboard() {
  const total = totalMedel();
  // strongest / weakest
  const meds = AREAS.map(a => ({ ...a, med: rowMedel(a.tests) })).filter(a => a.med !== null);
  const strongest = meds.reduce((a,b) => a.med > b.med ? a : b);
  const weakest = meds.reduce((a,b) => a.med < b.med ? a : b);
  const totalTests = AREAS.flatMap(a => a.tests).filter(t => t !== null).length;
  return (
    <div className="sheet">
      <div className="sheet-chrome">
        <span className="dot"></span>
        <span style={{ fontWeight:500, color:"#3c4043" }}>Maja Nilsson</span>
        <span style={{ color:"#80868b" }}>· Google Kalkylark</span>
        <span style={{ marginLeft:"auto", color:"#80868b" }}>Arkiv · Redigera · Visa · Infoga …</span>
      </div>
      <div className="sheet-body" style={{ fontFamily:"'Inter', sans-serif", padding:"22px 28px", background: dashColors.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color: dashColors.mute, fontWeight:500 }}>Hej Maja —</div>
            <h1 style={{ fontSize:22, fontWeight:500, margin:"2px 0 0", color: dashColors.ink, letterSpacing:"-0.02em" }}>Så går det för dig.</h1>
          </div>
          <div style={{ fontSize:11, color: dashColors.mute }}>Hösttermin 2026 · uppdaterat just nu</div>
        </div>
        {/* Stat cards */}
        <div style={{ display:"flex", gap:10, marginBottom:18 }}>
          <StatCard label="Totalt medel" value={total + "%"} sub={`Baserat på ${totalTests} test`} color={dashColors.accent} />
          <StatCard label="Starkast" value={strongest.med + "%"} sub={strongest.name} color={dashColors.accent} />
          <StatCard label="Träna mer" value={weakest.med + "%"} sub={weakest.name} color={dashColors.warn} />
          <StatCard label="Områden" value="7/8" sub="ett kvar att börja" color={dashColors.ink} />
        </div>
        {/* Table */}
        <table className="gs" style={{ width:"100%", borderCollapse:"separate", borderSpacing:0, background:"#fff", borderRadius:10, overflow:"hidden", border:"1px solid #ecebe6" }}>
          <thead>
            <tr style={{ background:"#fafaf7" }}>
              <th className="area" style={{ padding:"10px 12px", fontWeight:500, fontSize:10, color: dashColors.mute, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"left" }}>Område</th>
              {Array.from({length:10}).map((_,i)=>(
                <th key={i} style={{ padding:"10px 0", fontWeight:500, fontSize:10, color: dashColors.mute, width: 34 }}>{i+1}</th>
              ))}
              <th style={{ padding:"10px 8px", fontWeight:500, fontSize:10, color: dashColors.mute, letterSpacing:"0.08em", textTransform:"uppercase", width: 72 }}>Trend</th>
              <th style={{ padding:"10px 8px", fontWeight:500, fontSize:10, color: dashColors.mute, letterSpacing:"0.08em", textTransform:"uppercase", width: 56 }}>Medel</th>
            </tr>
          </thead>
          <tbody>
            {AREAS.map((a, i) => {
              const med = rowMedel(a.tests);
              const medColor = dashColor(med);
              return (
                <tr key={a.name} style={{ borderTop:"1px solid #ecebe6" }}>
                  <td className="area" style={{ padding:"9px 12px", fontWeight:500, fontSize:12, textAlign:"left", color: dashColors.ink, borderTop:"1px solid #ecebe6" }}>
                    {a.name}
                  </td>
                  {a.tests.map((t, j) => {
                    const s = dashColor(t);
                    return (
                      <td key={j} style={{
                        borderTop:"1px solid #ecebe6",
                        background: s ? s.bg : "transparent",
                        fontWeight: 500, fontSize: 10,
                        padding: "9px 0",
                        color: s ? "#1a1d1c" : "#cdcabf",
                      }}>{t ?? ""}</td>
                    );
                  })}
                  <td style={{ borderTop:"1px solid #ecebe6", padding:"6px 8px", textAlign:"center" }}>
                    <SparklineBars tests={a.tests} />
                  </td>
                  <td style={{ borderTop:"1px solid #ecebe6", padding:"9px 8px", fontWeight:600, fontSize:13, color: medColor ? medColor.bar : "#cdcabf" }}>
                    {med ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============== 3. HEATMAP — minimalist, no numbers ================
const heatPalette = (p) => {
  if (p === null) return { bg: "#f7f5ef", border: "1px solid #ecebe6" };
  // Map 0..100 → gradient from soft to deep teal
  const t = p/100;
  // off-white → deep teal
  const r = Math.round(247 - (247-26) * t);
  const g = Math.round(245 - (245-65) * t);
  const b = Math.round(239 - (239-70) * t);
  return { bg: `rgb(${r},${g},${b})`, border: "none" };
};

function HeatBar({ pct, color }) {
  return (
    <div style={{ position:"relative", height:18, background:"#ecebe6", borderRadius:99, overflow:"hidden" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width: pct+"%", background: color, borderRadius:99 }}></div>
    </div>
  );
}

function ElevbladHeatmap() {
  const total = totalMedel();
  return (
    <div className="sheet">
      <div className="sheet-chrome">
        <span className="dot"></span>
        <span style={{ fontWeight:500, color:"#3c4043" }}>Maja Nilsson</span>
        <span style={{ color:"#80868b" }}>· Google Kalkylark</span>
        <span style={{ marginLeft:"auto", color:"#80868b" }}>Arkiv · Redigera · Visa · Infoga …</span>
      </div>
      <div className="sheet-body" style={{ fontFamily:"'Inter', sans-serif", padding:"30px 36px", background:"#fbfaf6" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom: 30 }}>
          <h1 style={{ fontSize:32, fontWeight:400, margin:0, color:"#1a3d3a", letterSpacing:"-0.03em", lineHeight:1 }}>
            Maja
          </h1>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8a8780", fontWeight:500 }}>Totalt {total}%</div>
            <div style={{ width:160, marginTop:6 }}>
              <HeatBar pct={total} color="#1a4146" />
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"160px 1fr 100px", columnGap:18, rowGap:12, alignItems:"center" }}>
          {/* Header */}
          <div></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#8a8780", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            <span>Test 1</span><span>5</span><span>10</span>
          </div>
          <div style={{ fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8a8780", textAlign:"right" }}>Medel</div>
          {AREAS.map((a, i) => {
            const med = rowMedel(a.tests);
            const medColor = med !== null ? heatPalette(Math.min(100, med+10)).bg : "#ecebe6";
            return (
              <React.Fragment key={a.name}>
                <div style={{ fontSize:13, fontWeight:500, color:"#1a3d3a", letterSpacing:"-0.01em" }}>{a.name}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(10, 1fr)", gap:3 }}>
                  {a.tests.map((t, j) => {
                    const c = heatPalette(t);
                    return (
                      <div key={j} style={{
                        height: 22,
                        background: c.bg,
                        border: c.border,
                        borderRadius: 3,
                      }} title={t !== null ? `${t}%` : "ej gjort"}></div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
                  <div style={{ width:54 }}>
                    {med !== null && <HeatBar pct={med} color={heatPalette(Math.min(100, med+15)).bg === "#f7f5ef" ? "#bbb" : `rgb(${Math.round(247-(247-26)*med/100)},${Math.round(245-(245-65)*med/100)},${Math.round(239-(239-70)*med/100)})`} />}
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color: med !== null ? "#1a3d3a" : "#cdcabf", minWidth:30, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                    {med ?? "—"}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, color:"#8a8780" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span>0%</span>
            <div style={{ width: 120, height: 8, borderRadius: 99, background:"linear-gradient(to right, #f7f5ef, #1a4146)" }}></div>
            <span>100%</span>
          </div>
          <span style={{ fontStyle:"italic" }}>Hovra över rutorna för att se siffran.</span>
        </div>
      </div>
    </div>
  );
}

// =============== STUDIO — Final pick: sage + sand on warm white ================
const studioPalette = {
  bg:      "#f4f1ea",  // app bg (warm off-white)
  paper:   "#ffffff",  // cards
  ink:     "#1c1f1d",
  sage:    "#3a6b54",  // primary accent
  sand:    "#c4a578",  // secondary accent
  mute:    "#7a7a76",
  hair:    "#ece8de",  // hairline borders
  scale: [
    { min: 0,  max: 49,  bg: "#ecd5c5", text: "#7a3a26", label: "behöver träning" },
    { min: 50, max: 74,  bg: "#efe1c1", text: "#6b5524", label: "godkänt" },
    { min: 75, max: 89,  bg: "#d4e2cc", text: "#2c5a40", label: "bra" },
    { min: 90, max: 100, bg: "#b8cdb4", text: "#1c4030", label: "mycket bra" },
  ],
};
function studioColor(p) {
  if (p === null) return null;
  return studioPalette.scale.find(s => p >= s.min && p <= s.max);
}

function StudioSpark({ tests }) {
  return (
    <svg width="64" height="20" viewBox="0 0 64 20">
      {tests.map((t, i) => {
        const h = t === null ? 2 : (t/100) * 16 + 2;
        const s = studioColor(t);
        return <rect key={i} x={i*6.4 + 0.5} y={20-h} width="5" height={h} rx="1.5"
          fill={t === null ? "#e6e1d4" : s.bg} />;
      })}
    </svg>
  );
}

function StudioStatCard({ label, value, sub, accent, big }) {
  const P = studioPalette;
  return (
    <div style={{
      flex: big ? 1.5 : 1,
      padding: "16px 18px",
      background: P.paper,
      borderRadius: 12,
      border: `1px solid ${P.hair}`,
    }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: P.mute, fontWeight: 500 }}>
        {label}
      </div>
      <div style={{
        fontSize: big ? 38 : 26,
        fontWeight: 500,
        marginTop: 4,
        color: accent || P.ink,
        letterSpacing: "-0.025em",
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: P.mute, marginTop: 6 }}>{sub}</div>
      )}
    </div>
  );
}

function ElevbladStudio() {
  const P = studioPalette;
  const total = totalMedel();
  const meds = AREAS.map(a => ({ ...a, med: rowMedel(a.tests) })).filter(a => a.med !== null);
  const strongest = meds.reduce((a, b) => a.med > b.med ? a : b);
  const weakest = meds.reduce((a, b) => a.med < b.med ? a : b);
  const totalTests = AREAS.flatMap(a => a.tests).filter(t => t !== null).length;
  const omradenStartade = AREAS.filter(a => a.tests.some(t => t !== null)).length;
  return (
    <div className="sheet">
      <div className="sheet-chrome">
        <span className="dot"></span>
        <span style={{ fontWeight: 500, color: "#3c4043" }}>Maja Nilsson — grammatikresultat</span>
        <span style={{ color: "#80868b" }}>· Google Kalkylark</span>
        <span style={{ marginLeft: "auto", color: "#80868b" }}>Arkiv · Redigera · Visa · Infoga …</span>
      </div>
      <div className="sheet-body" style={{
        fontFamily: "'Inter', sans-serif",
        padding: "28px 36px 24px",
        background: P.bg,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: P.mute, fontWeight: 500 }}>
              Grammatik · hösttermin 2026
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 500, margin: "4px 0 0", color: P.ink, letterSpacing: "-0.025em" }}>
              Hej Maja — så går det.
            </h1>
          </div>
          <div style={{ fontSize: 11, color: P.mute, textAlign: "right" }}>
            Senast uppdaterat<br />
            <span style={{ color: P.ink, fontWeight: 500 }}>14 nov, 09:42</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <StudioStatCard
            big
            label="Totalt medel"
            value={<>{total}<span style={{ fontSize: 22, color: P.mute, marginLeft: 2 }}>%</span></>}
            sub={`Baserat på ${totalTests} avklarade test`}
            accent={P.sage}
          />
          <StudioStatCard
            label="Starkast"
            value={strongest.med + "%"}
            sub={strongest.name}
            accent={P.sage}
          />
          <StudioStatCard
            label="Träna mer"
            value={weakest.med + "%"}
            sub={weakest.name}
            accent={"#a86a3e"}
          />
          <StudioStatCard
            label="Områden påbörjade"
            value={`${omradenStartade}/8`}
            sub={omradenStartade < 8 ? "ett kvar att börja" : "alla är igång"}
            accent={P.ink}
          />
        </div>

        {/* Table card */}
        <div style={{
          background: P.paper,
          borderRadius: 12,
          border: `1px solid ${P.hair}`,
          overflow: "hidden",
        }}>
          <table className="gs" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#fafaf6" }}>
                <th className="area" style={{ padding: "11px 14px", fontWeight: 500, fontSize: 10, color: P.mute, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left", borderBottom: `1px solid ${P.hair}` }}>
                  Område
                </th>
                {Array.from({length: 10}).map((_, i) => (
                  <th key={i} style={{ padding: "11px 0", fontWeight: 500, fontSize: 10, color: P.mute, width: 32, borderBottom: `1px solid ${P.hair}` }}>
                    {i + 1}
                  </th>
                ))}
                <th style={{ padding: "11px 8px", fontWeight: 500, fontSize: 10, color: P.mute, letterSpacing: "0.08em", textTransform: "uppercase", width: 78, borderBottom: `1px solid ${P.hair}` }}>
                  Trend
                </th>
                <th style={{ padding: "11px 12px 11px 8px", fontWeight: 500, fontSize: 10, color: P.mute, letterSpacing: "0.08em", textTransform: "uppercase", width: 58, borderBottom: `1px solid ${P.hair}` }}>
                  Medel
                </th>
              </tr>
            </thead>
            <tbody>
              {AREAS.map((a, i) => {
                const med = rowMedel(a.tests);
                const medColor = studioColor(med);
                const isLast = i === AREAS.length - 1;
                return (
                  <tr key={a.name}>
                    <td className="area" style={{
                      padding: "10px 14px",
                      fontWeight: 500, fontSize: 12.5,
                      textAlign: "left", color: P.ink,
                      borderBottom: isLast ? "none" : `1px solid ${P.hair}`,
                      letterSpacing: "-0.005em",
                    }}>
                      {a.name}
                    </td>
                    {a.tests.map((t, j) => {
                      const s = studioColor(t);
                      return (
                        <td key={j} style={{
                          borderBottom: isLast ? "none" : `1px solid ${P.hair}`,
                          background: s ? s.bg : "transparent",
                          fontWeight: 500, fontSize: 11,
                          padding: "10px 0",
                          color: s ? s.text : "#c9c5b8",
                          width: 32,
                        }}>{t ?? "·"}</td>
                      );
                    })}
                    <td style={{
                      borderBottom: isLast ? "none" : `1px solid ${P.hair}`,
                      padding: "8px 8px",
                      textAlign: "center",
                    }}>
                      <StudioSpark tests={a.tests} />
                    </td>
                    <td style={{
                      borderBottom: isLast ? "none" : `1px solid ${P.hair}`,
                      padding: "10px 12px 10px 8px",
                      fontWeight: 600, fontSize: 14,
                      color: medColor ? medColor.text : "#c9c5b8",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {med ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 14, fontSize: 10.5, color: P.mute }}>
            {studioPalette.scale.map(s => (
              <div key={s.min} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, background: s.bg, borderRadius: 2, display: "inline-block" }}></span>
                <span>{s.min}–{s.max}  ·  {s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10.5, color: P.mute, fontStyle: "italic" }}>
            Endast bästa resultatet per test sparas.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ElevbladNu, ElevbladForfinad, ElevbladDashboard, ElevbladHeatmap, ElevbladStudio,
});
