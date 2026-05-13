/* Main app — assembles design canvas with all elevblad directions */

const ART_W = 880;
const ART_H = 540;
const NOTE_W = 380;
const STUDIO_W = 1100;
const STUDIO_H = 680;

// ── Notes card (sketchy/handwritten) ──────────────────────────────
function NotesCard({ title, tagline, items, footnote, footnoteLabel = "tips", footnoteColor = "#c8462c" }) {
  return (
    <div style={{
      padding: 24,
      height: "100%",
      background: "#fcfaf3",
      fontFamily: "'Patrick Hand', cursive",
      color: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 52,
        fontWeight: 700,
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
        marginBottom: 4,
      }}>{title}</div>
      <div style={{ fontSize: 17, color: "#777", marginBottom: 16, lineHeight: 1.3 }}>{tagline}</div>
      <div style={{ height: 1, background: "#1a1a1a", marginBottom: 14 }}></div>
      <div style={{ fontFamily: "'Inter'", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>
        Vad ändras
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((n, i) => (
          <li key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 16, lineHeight: 1.35 }}>
            <span style={{ fontFamily: "'Caveat'", color: "#c8462c", fontSize: 22, lineHeight: 1, flexShrink: 0 }}>✓</span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
      <div style={{ flex: 1 }}></div>
      {footnote && (
        <div style={{
          marginTop: 14,
          padding: 12,
          border: "1.5px dashed #1a1a1a",
          borderRadius: 6,
        }}>
          <div style={{ fontFamily: "'Caveat'", fontSize: 20, color: footnoteColor, lineHeight: 1, marginBottom: 4 }}>
            {footnoteLabel}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.3 }}>{footnote}</div>
        </div>
      )}
    </div>
  );
}

// ── Implementation card with color swatches + code snippets ────────
function ImplCard({ swatches, code, codeNote }) {
  return (
    <div style={{
      padding: 24,
      height: "100%",
      background: "#1a1d1c",
      color: "#e4e0d4",
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9fff5b", marginBottom: 8 }}>
        // Implementera
      </div>
      <div style={{ fontFamily: "'Inter'", fontSize: 11, color: "#8d918a", marginBottom: 14 }}>
        Färgkoder att klistra in i Apps Script-funktionen <span style={{ color: "#e4e0d4" }}>getFargForProcent</span>:
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap: 6, marginBottom: 16 }}>
        {swatches.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap: 10, fontSize: 11 }}>
            <span style={{ width: 28, height: 28, borderRadius: 6, background: s.hex, flexShrink: 0, border: "1px solid #2a2d2c" }}></span>
            <span style={{ color: "#8d918a", width: 64 }}>{s.range}</span>
            <span style={{ color: "#e4e0d4", flex: 1 }}>{s.hex}</span>
            <span style={{ color: "#8d918a", fontFamily: "'Inter'", fontSize: 10, fontStyle:"italic" }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#8d918a", marginBottom: 6 }}>// Apps Script</div>
      <pre style={{
        background: "#0d0f0e", padding: 12, margin: 0, borderRadius: 4,
        fontSize: 10, lineHeight: 1.5, color: "#e4e0d4", overflow:"auto",
        whiteSpace: "pre-wrap", flex:1,
      }}>{code}</pre>
      {codeNote && (
        <div style={{ fontFamily: "'Inter'", fontSize: 10, color: "#8d918a", marginTop: 10, fontStyle:"italic", lineHeight: 1.5 }}>
          {codeNote}
        </div>
      )}
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────

const REFINED_SWATCHES = [
  { range:"0–49",   hex:"#f1d8cc", label:"behöver träning" },
  { range:"50–74",  hex:"#f4e7c5", label:"godkänt" },
  { range:"75–89",  hex:"#dde7d0", label:"bra" },
  { range:"90–100", hex:"#c4d6bd", label:"mycket bra" },
];

const DASH_SWATCHES = [
  { range:"0–49",   hex:"#fde8e1", label:"behöver träning" },
  { range:"50–74",  hex:"#fdf2d8", label:"godkänt" },
  { range:"75–89",  hex:"#e1ecdb", label:"bra" },
  { range:"90–100", hex:"#cde0c8", label:"mycket bra" },
];

const REFINED_CODE = `function getFargForProcent(procent) {
  if (procent < 50) return "#f1d8cc";  // varm rost
  if (procent < 75) return "#f4e7c5";  // varm sand
  if (procent < 90) return "#dde7d0";  // ljus salvia
  return "#c4d6bd";                    // djup salvia
}`;

const DASH_CODE = `function getFargForProcent(procent) {
  if (procent < 50) return "#fde8e1";
  if (procent < 75) return "#fdf2d8";
  if (procent < 90) return "#e1ecdb";
  return "#cde0c8";
}

// Lägg till sparkline i kolumn M (rad 5–12)
// I mallen, klistra in i M5:
// =SPARKLINE(B5:K5, {"charttype","column";
//   "color1","#3a6b54"; "empty","zero"; "ymin",0; "ymax",100})`;

const HEAT_CODE = `// Heatmap-versionen kräver INGEN \`getFargForProcent\`.
// Använd istället Sheets inbyggda BETINGAD FORMATERING (Färgskala):
//   1. Markera B5:K12
//   2. Format → Betingad formatering → Färgskala
//   3. Min: värde 0  → #f7f5ef
//      Mitt: värde 50 → #a3c1bf
//      Max: värde 100 → #1a4146
//
// Dölj siffrorna med talformat ;;;  (markera samma område,
// Format → Tal → Anpassat talformat → skriv: ;;;)
//
// Behåll vanliga rättningen i onFormSubmit men ta bort
// cell.setBackground(...)-raden — färgen sköts av reglerna.`;

const DIRECTIONS = [
  {
    id: "now",
    num: "00",
    name: "Nuläget",
    title: "Som det ser ut idag",
    tagline: "Pastellfärger, svarta borders, Helvetica Neue.",
    notes: [
      "Bjärt pastell-RGB (#f4cccc / #fff2cc / #d9ead3) — barnsligt intryck",
      "Tjocka svarta borders runt varje cell",
      "Helvetica Neue + Arial mix, allt bold",
      "Total medel-text i en slumpmässig cell (J1)",
      "Tomma celler skiljs inte visuellt från ifyllda",
    ],
    risk: "Påminner om ett kalkylblad från 90-talet. Inte 'fult' — men säger inget om vem appen är till för.",
    risk_label: "vad eleverna ser",
    view: () => <ElevbladNu />,
    no_impl: true,
  },
  {
    id: "refined",
    num: "01",
    name: "Förfinad",
    title: "Samma struktur — vuxnare uttryck",
    tagline: "Minimal ändring, maximal effekt. Varma jordtoner, Inter, luft.",
    notes: [
      "Ny färgskala: dämpade jordtoner i 4 nivåer (inte 3)",
      "Inter font — modern, neutral, fungerar i Google Sheets",
      "Tunna borders (#ecebe6), inga svarta linjer",
      "Totalt medel som tydlig siffra uppe till höger",
      "Tomma celler får ett diskret '—' — visar att de finns",
      "Liten färglegend nederst förklarar nivåerna",
    ],
    risk: "Säkrast valet. Behåller all befintlig logik — bara nya hex-koder + ny font + tunnare borders.",
    risk_label: "ändringsdjup",
    view: () => <ElevbladForfinad />,
    swatches: REFINED_SWATCHES,
    code: REFINED_CODE,
    codeNote: "Plus: ändra typsnitt i mallen till Inter (Format → Typsnitt → Inter). Ta bort de svarta kantlinjerna manuellt i mallen och låt cellfärgen göra jobbet."
  },
  {
    id: "dashboard",
    num: "02",
    name: "Dashboard",
    title: "Statistik på toppen + trend per område",
    tagline: "Eleven får direkt svar på 'hur går det?' utan att läsa hela tabellen.",
    notes: [
      "4 stat-kort högst upp: Totalt medel, Starkast, Träna mer, Områden",
      "SPARKLINE-kolumn visar trend per område — funkar i Sheets!",
      "Färgkodning behållen men mer dämpad",
      "Tabellen får ett 'kort'-utseende med rundade hörn",
      "Tydligare hierarki: ögat går till sammanfattningen först",
    ],
    risk: "Kräver att mallen byggs om: 4 stat-celler högst upp + en M-kolumn för SPARKLINE-formler. Apps Script behöver fylla i stat-cellerna.",
    risk_label: "ändringsdjup",
    view: () => <ElevbladDashboard />,
    swatches: DASH_SWATCHES,
    code: DASH_CODE,
    codeNote: "Stat-korten kan vara formler i mallen — t.ex. =ROUND(AVERAGE(B5:K12),0) i 'Totalt medel'-cellen — och då behöver Apps Script inte ändras alls."
  },
  {
    id: "heatmap",
    num: "03",
    name: "Heatmap",
    title: "Visuell intuition, inga siffror",
    tagline: "Eleven ser HELA sin profil i ett ögonkast — vad behöver tränas?",
    notes: [
      "Inga siffror i cellerna — bara färgintensitet",
      "Färgskala går från off-white (svagt) till djup teal (starkt)",
      "Radmedel visas som horisontell stapel + siffra",
      "Områdes-namn större, mer som dashboard än tabell",
      "Total medel som progressbar uppe till höger",
      "Hover på en ruta → siffran syns (i Sheets: klick på cellen)",
    ],
    risk: "Vågat. Funkar bäst för elever som redan kan systemet. Tappar exakthet — men vinner mycket i läsbarhet.",
    risk_label: "vad du tappar",
    view: () => <ElevbladHeatmap />,
    code: HEAT_CODE,
    codeNote: "Detta är den enklaste att underhålla — använder Sheets inbyggda färgskala istället för Apps Script. Funktionen getFargForProcent kan tas bort helt.",
    no_swatches: true,
  },
];

function DirectionRow({ d }) {
  return (
    <DCSection id={`sec-${d.id}`} title={`${d.num} · ${d.name}`}>
      <DCArtboard id={`${d.id}-notes`} label="Anteckningar" width={NOTE_W} height={ART_H}>
        <NotesCard
          title={d.name}
          tagline={d.tagline}
          items={d.notes}
          footnote={d.risk}
          footnoteLabel={d.risk_label || "risk?"}
        />
      </DCArtboard>

      <DCArtboard id={`${d.id}-view`} label={d.title} width={ART_W} height={ART_H}>
        {d.view()}
      </DCArtboard>

      {!d.no_impl && (
        <DCArtboard id={`${d.id}-impl`} label="Implementera" width={NOTE_W} height={ART_H}>
          <ImplCard
            swatches={d.no_swatches ? [] : d.swatches}
            code={d.code}
            codeNote={d.codeNote}
          />
        </DCArtboard>
      )}
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="sec-studio" title="✓ Vald riktning · Studio" subtitle="Salviagrön + sandgul på varm off-white. Mockup nedan följt av implementationsguide.">
        <DCArtboard id="studio-final" label="Elevbladet · Studio" width={STUDIO_W} height={STUDIO_H}>
          <ElevbladStudio />
        </DCArtboard>

        <DCArtboard id="studio-palette" label="Färgsystem" width={NOTE_W} height={STUDIO_H}>
          <div style={{ padding: 24, height:"100%", background:"#fcfaf3", fontFamily:"'Inter'", fontSize: 13, boxSizing:"border-box", overflow:"auto" }}>
            <div style={{ fontFamily:"'Caveat'", fontSize: 44, fontWeight: 700, lineHeight: 0.95, marginBottom: 4 }}>Färgsystem</div>
            <div style={{ fontFamily:"'Patrick Hand'", fontSize: 16, color:"#777", marginBottom: 18 }}>Hela paletten + var den används.</div>

            <div style={{ fontSize: 10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#888", fontWeight: 500, marginBottom: 8 }}>Grundfärger</div>
            <div style={{ display:"flex", flexDirection:"column", gap: 6, marginBottom: 18 }}>
              {[
                { hex:"#f4f1ea", name:"Bakgrund", use:"hela arket" },
                { hex:"#ffffff", name:"Kort", use:"tabell + stat-kort" },
                { hex:"#1c1f1d", name:"Text mörk", use:"rubriker, områden" },
                { hex:"#3a6b54", name:"Salvia (accent)", use:"höga betyg, totalmedel" },
                { hex:"#c4a578", name:"Sand", use:"sekundär accent" },
                { hex:"#7a7a76", name:"Mut text", use:"etiketter, hjälptext" },
                { hex:"#ece8de", name:"Linje", use:"tunna avskiljare" },
              ].map(c => (
                <div key={c.hex} style={{ display:"flex", alignItems:"center", gap: 10, fontSize: 11 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 5, background: c.hex, border: "1px solid #00000010", flexShrink:0 }}></span>
                  <span style={{ width: 110, fontFamily:"'JetBrains Mono'", fontSize:10 }}>{c.hex}</span>
                  <span style={{ flex:1 }}>
                    <span style={{ fontWeight: 500 }}>{c.name}</span><br/>
                    <span style={{ color:"#888", fontSize: 10 }}>{c.use}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#888", fontWeight: 500, marginBottom: 8 }}>Procentskala (4 nivåer)</div>
            <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
              {[
                { range:"0–49",   bg:"#ecd5c5", text:"#7a3a26", label:"behöver träning" },
                { range:"50–74",  bg:"#efe1c1", text:"#6b5524", label:"godkänt" },
                { range:"75–89",  bg:"#d4e2cc", text:"#2c5a40", label:"bra" },
                { range:"90–100", bg:"#b8cdb4", text:"#1c4030", label:"mycket bra" },
              ].map(c => (
                <div key={c.range} style={{ display:"flex", alignItems:"center", gap: 8, padding: "8px 10px", background: c.bg, borderRadius: 5 }}>
                  <span style={{ fontWeight: 600, fontSize: 12, color: c.text, width: 56 }}>{c.range}</span>
                  <span style={{ fontFamily:"'JetBrains Mono'", fontSize: 10, color: c.text }}>{c.bg}</span>
                  <span style={{ marginLeft:"auto", fontSize: 11, color: c.text, fontStyle:"italic" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="studio-impl" label="Implementationsguide" width={460} height={STUDIO_H}>
          <div style={{ padding: 24, height:"100%", background:"#1a1d1c", color:"#e4e0d4", fontFamily:"'Inter'", fontSize: 12, boxSizing:"border-box", overflow:"auto", lineHeight: 1.5 }}>
            <div style={{ fontSize: 10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#9fff5b", marginBottom: 14, fontWeight: 600 }}>// Implementera i tre steg</div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color:"#e4e0d4", marginBottom: 4 }}>1 · Uppdatera mallen</div>
              <div style={{ fontSize: 11, color:"#9da19a", marginBottom: 8 }}>I dokumentet med ID <span style={{ fontFamily:"'JetBrains Mono'", color:"#e4e0d4" }}>12ukC07Na4s0h…</span>:</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color:"#c8ccc4", lineHeight: 1.7 }}>
                <li>Byt typsnitt på allt till <strong style={{ color:"#e4e0d4" }}>Inter</strong> (Format → Typsnitt → Fler typsnitt → Inter)</li>
                <li>Ta bort alla svarta kantlinjer. Lägg på <strong style={{ color:"#e4e0d4" }}>endast nedre linje #ece8de</strong> mellan raderna</li>
                <li>Sätt arkets bakgrund till <strong style={{ color:"#e4e0d4" }}>#f4f1ea</strong> (Format → Tema → Anpassa)</li>
                <li>Lägg till 4 stat-kort i rad 1–2 (se nedan)</li>
                <li>Lägg till en <strong style={{ color:"#e4e0d4" }}>kolumn M</strong> (Trend) med SPARKLINE-formler</li>
              </ul>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color:"#e4e0d4", marginBottom: 6 }}>2 · Sparkline-formler</div>
              <div style={{ fontSize: 11, color:"#9da19a", marginBottom: 6 }}>Klistra in i <span style={{ fontFamily:"'JetBrains Mono'", color:"#e4e0d4" }}>M5</span> och kopiera ner till M12:</div>
              <pre style={{ background:"#0d0f0e", padding: 10, margin: 0, borderRadius: 4, fontSize: 10, fontFamily:"'JetBrains Mono'", color:"#e4e0d4", whiteSpace:"pre-wrap" }}>
{`=SPARKLINE(B5:K5; {
  "charttype"\\"column";
  "color1"\\"#3a6b54";
  "empty"\\"zero";
  "ymin"\\0; "ymax"\\100
})`}
              </pre>
              <div style={{ fontSize: 10, color:"#9da19a", marginTop: 4, fontStyle:"italic" }}>
                OBS: i svenska Sheets är separatorn <code style={{ background:"#0d0f0e", padding:"1px 4px" }}>\</code> (omvänt snedstreck) inte semikolon för dessa argument.
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color:"#e4e0d4", marginBottom: 6 }}>3 · Apps Script-ändring</div>
              <div style={{ fontSize: 11, color:"#9da19a", marginBottom: 6 }}>Byt ut funktionen <span style={{ fontFamily:"'JetBrains Mono'", color:"#e4e0d4" }}>getFargForProcent</span> mot detta:</div>
              <pre style={{ background:"#0d0f0e", padding: 10, margin: 0, borderRadius: 4, fontSize: 10, fontFamily:"'JetBrains Mono'", color:"#e4e0d4", whiteSpace:"pre-wrap" }}>
{`function getFargForProcent(p) {
  if (p < 50) return "#ecd5c5";  // terracotta
  if (p < 75) return "#efe1c1";  // sand
  if (p < 90) return "#d4e2cc";  // ljus salvia
  return "#b8cdb4";              // djup salvia
}

// Bonus: sätt även text-färg per cell
function getTextForProcent(p) {
  if (p < 50) return "#7a3a26";
  if (p < 75) return "#6b5524";
  if (p < 90) return "#2c5a40";
  return "#1c4030";
}`}
              </pre>
              <div style={{ fontSize: 10, color:"#9da19a", marginTop: 6 }}>
                I <span style={{ fontFamily:"'JetBrains Mono'", color:"#e4e0d4" }}>uppdateraElevblad</span>, byt raden:<br/>
                <code style={{ background:"#0d0f0e", padding:"2px 6px", color:"#e4e0d4", fontFamily:"'JetBrains Mono'", fontSize: 10 }}>cell.setBackground(getFargForProcent(procent));</code><br/>
                mot:<br/>
                <code style={{ background:"#0d0f0e", padding:"2px 6px", color:"#e4e0d4", fontFamily:"'JetBrains Mono'", fontSize: 10 }}>cell.setBackground(getFargForProcent(procent)).setFontColor(getTextForProcent(procent));</code>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color:"#9fff5b", marginBottom: 6 }}>Bonus · stat-kort utan kod</div>
              <div style={{ fontSize: 11, color:"#c8ccc4", lineHeight: 1.6 }}>
                Stat-cellerna kan vara rena formler i mallen — då behöver Apps Script inget extra. Föreslagna celler:
              </div>
              <pre style={{ background:"#0d0f0e", padding: 10, margin: "6px 0 0", borderRadius: 4, fontSize: 10, fontFamily:"'JetBrains Mono'", color:"#e4e0d4", whiteSpace:"pre-wrap" }}>
{`B1:  =ROUND(AVERAGE(B5:K12);0) & "%"   ' totalt medel
B2:  =INDEX(A5:A12; MATCH(MAX(L5:L12); L5:L12; 0)) ' starkast
B3:  =INDEX(A5:A12; MATCH(MIN(L5:L12); L5:L12; 0)) ' träna mer
B4:  =COUNTIF(L5:L12; ">0") & "/8"     ' områden påbörjade`}
              </pre>
            </div>

            <div style={{ marginTop: 14, padding: 10, border:"1px dashed #4a4d4c", borderRadius: 4, fontSize: 11, color:"#c8ccc4", lineHeight: 1.5 }}>
              <strong style={{ color:"#9fff5b" }}>Tips för rollout:</strong> bygg om mallen först, kör <code style={{ background:"#0d0f0e", padding:"1px 4px", color:"#e4e0d4" }}>omrattaAlla()</code> en gång — då regenereras alla befintliga elevblad utifrån den nya mallen.
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="sec-explore" title="Tidigare utforskning" subtitle="De fyra riktningarna som ledde fram till Studio. Sparas som referens.">
      </DCSection>

      {DIRECTIONS.map(d => <DirectionRow key={d.id} d={d} />)}
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
