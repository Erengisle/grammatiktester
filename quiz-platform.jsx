import { useState, useEffect } from "react";

const ADMIN_PIN = "1234";

async function loadData(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function saveData(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

const DEMO_TEST = {
  id: "demo",
  title: "Exempeltest – Geografi",
  questions: [
    { id: "q1", text: "Vilken är Sveriges huvudstad?", options: { A: "Göteborg", B: "Malmö", C: "Stockholm", D: "Uppsala" }, correct: "C" },
    { id: "q2", text: "Vilket hav ligger norr om Europa?", options: { A: "Stilla havet", B: "Atlanten", C: "Indiska oceanen", D: "Arktiska oceanen" }, correct: "D" },
    { id: "q3", text: "Vilket land är störst till ytan?", options: { A: "USA", B: "Kanada", C: "Ryssland", D: "Kina" }, correct: "C" },
  ]
};

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.app { min-height: 100vh; background: var(--color-background-tertiary); padding: 2rem 1rem 4rem; }
.wrap { max-width: 600px; margin: 0 auto; }
.logo { text-align: center; margin-bottom: 2.5rem; }
.logo-title { font-size: 22px; font-weight: 500; color: var(--color-text-primary); letter-spacing: -0.3px; }
.logo-sub { font-size: 13px; color: var(--color-text-secondary); margin-top: 3px; }
.card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem; }
.card + .card { margin-top: 12px; }
.home-card { width: 100%; text-align: left; cursor: pointer; background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; transition: all 0.12s; }
.home-card:hover { border-color: var(--color-border-primary); background: var(--color-background-secondary); }
.home-card + .home-card { margin-top: 10px; }
.home-card-title { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 3px; }
.home-card-desc { font-size: 13px; color: var(--color-text-secondary); }
.home-card-icon { font-size: 22px; margin-bottom: 8px; display: block; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 14px; border-radius: var(--border-radius-md); font-size: 13px; font-weight: 500; cursor: pointer; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-family: var(--font-sans); transition: background 0.1s; white-space: nowrap; }
.btn:hover { background: var(--color-background-secondary); }
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: var(--color-text-primary); }
.btn-primary:hover { opacity: 0.85; background: var(--color-text-primary); }
.btn-danger { color: var(--color-text-danger); border-color: var(--color-border-danger); }
.btn-danger:hover { background: var(--color-background-danger); }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.btn-full { width: 100%; }
.input { width: 100%; padding: 8px 12px; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); font-size: 14px; font-family: var(--font-sans); outline: none; }
.input:focus { border-color: var(--color-border-primary); }
.label { font-size: 12px; color: var(--color-text-secondary); margin-bottom: 5px; display: block; font-weight: 500; }
.section-title { font-size: 16px; font-weight: 500; color: var(--color-text-primary); }
.divider { border: none; border-top: 0.5px solid var(--color-border-tertiary); margin: 1rem 0; }
.back-btn { background: none; border: none; cursor: pointer; font-size: 13px; color: var(--color-text-secondary); padding: 0; font-family: var(--font-sans); display: inline-flex; align-items: center; gap: 4px; margin-bottom: 1.25rem; }
.back-btn:hover { color: var(--color-text-primary); }
.tabs { display: flex; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 1.5rem; }
.tab { padding: 8px 16px; font-size: 13px; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -1px; color: var(--color-text-secondary); font-family: var(--font-sans); transition: all 0.1s; }
.tab.active { color: var(--color-text-primary); border-bottom-color: var(--color-text-primary); font-weight: 500; }
.tab:hover:not(.active) { color: var(--color-text-primary); }
.row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); gap: 12px; }
.row:last-child { border-bottom: none; }
.row-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
.row-meta { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }
.row-actions { display: flex; gap: 6px; flex-shrink: 0; }
.empty { text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); font-size: 13px; }
.error { font-size: 12px; color: var(--color-text-danger); margin-top: 5px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 12px; font-weight: 500; }
.badge-success { background: var(--color-background-success); color: var(--color-text-success); }
.badge-warning { background: var(--color-background-warning); color: var(--color-text-warning); }
.badge-danger { background: var(--color-background-danger); color: var(--color-text-danger); }
.badge-info { background: var(--color-background-info); color: var(--color-text-info); }
.progress-track { height: 3px; background: var(--color-border-tertiary); border-radius: 2px; overflow: hidden; margin-bottom: 1.5rem; }
.progress-fill { height: 100%; background: var(--color-text-primary); border-radius: 2px; transition: width 0.25s ease; }
.q-text { font-size: 16px; font-weight: 500; line-height: 1.5; color: var(--color-text-primary); }
.ans-btn { width: 100%; text-align: left; padding: 11px 14px; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); font-size: 14px; cursor: pointer; display: flex; gap: 12px; align-items: flex-start; font-family: var(--font-sans); transition: all 0.1s; }
.ans-btn:hover:not([data-locked="true"]) { background: var(--color-background-secondary); border-color: var(--color-border-primary); }
.ans-btn.correct { border-color: var(--color-border-success); background: var(--color-background-success); color: var(--color-text-success); }
.ans-btn.wrong { border-color: var(--color-border-danger); background: var(--color-background-danger); color: var(--color-text-danger); }
.ans-key { font-weight: 500; min-width: 18px; flex-shrink: 0; }
.score-ring { width: 96px; height: 96px; border-radius: 50%; border: 2.5px solid var(--color-text-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
.score-big { font-size: 28px; font-weight: 500; line-height: 1; }
.score-small { font-size: 12px; color: var(--color-text-secondary); }
.res-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
.res-row:last-child { border-bottom: none; }
.res-icon { min-width: 16px; font-size: 13px; font-weight: 500; margin-top: 1px; }
.q-editor { background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem; margin-bottom: 10px; }
.q-editor-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.q-num { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); }
.select { padding: 6px 10px; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); font-size: 13px; font-family: var(--font-sans); cursor: pointer; }
.results-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.results-tbl th { text-align: left; font-size: 11px; font-weight: 500; color: var(--color-text-secondary); padding: 6px 8px; border-bottom: 0.5px solid var(--color-border-tertiary); text-transform: uppercase; letter-spacing: 0.03em; }
.results-tbl td { padding: 9px 8px; border-bottom: 0.5px solid var(--color-border-tertiary); color: var(--color-text-primary); }
.results-tbl tr:last-child td { border-bottom: none; }
.gap-1 { margin-top: 0.75rem; }
.gap-2 { margin-top: 1.25rem; }
.gap-3 { margin-top: 1.75rem; }
.flex-row { display: flex; gap: 8px; }
.flex-1 { flex: 1; }
`;

function HomeView({ onStudent, onAdmin }) {
  return (
    <div>
      <div className="logo">
        <div className="logo-title">Självtestplattform</div>
        <div className="logo-sub">Välj hur du vill fortsätta</div>
      </div>
      <button className="home-card" onClick={onStudent}>
        <span className="home-card-icon">📖</span>
        <div className="home-card-title">Jag är elev</div>
        <div className="home-card-desc">Gör ett test och se ditt resultat direkt</div>
      </button>
      <button className="home-card" onClick={onAdmin}>
        <span className="home-card-icon">🔐</span>
        <div className="home-card-title">Lärarpanel</div>
        <div className="home-card-desc">Skapa tester och se elevresultat</div>
      </button>
    </div>
  );
}

function AdminLogin({ onAuth, onBack }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  function login() {
    if (pin === ADMIN_PIN) onAuth();
    else setError("Fel PIN-kod. Försök igen.");
  }
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Tillbaka</button>
      <div className="card" style={{ maxWidth: 320, margin: "0 auto" }}>
        <div className="section-title" style={{ marginBottom: "1rem" }}>Lärarpanel</div>
        <div>
          <label className="label">PIN-kod</label>
          <input type="password" className="input" placeholder="Ange PIN" value={pin}
            onChange={e => { setPin(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && login()} autoFocus />
          {error && <p className="error">{error}</p>}
        </div>
        <div className="gap-1" />
        <button className="btn btn-primary btn-full" onClick={login}>Logga in</button>
        <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", textAlign: "center", marginTop: 10 }}>
          Standard PIN: 1234 · Ändra i koden (ADMIN_PIN)
        </p>
      </div>
    </div>
  );
}

function QuestionEditor({ q, index, onChange, onRemove }) {
  return (
    <div className="q-editor">
      <div className="q-editor-head">
        <span className="q-num">Fråga {index + 1}</span>
        <button className="btn btn-danger btn-sm" onClick={onRemove}>Ta bort</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <input className="input" placeholder="Frågetext..." value={q.text}
          onChange={e => onChange({ ...q, text: e.target.value })} />
      </div>
      {["A","B","C","D"].map(key => (
        <div key={key} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16, color: "var(--color-text-secondary)" }}>{key}</span>
          <input className="input" placeholder={`Alternativ ${key}...`} value={q.options[key] || ""}
            onChange={e => onChange({ ...q, options: { ...q.options, [key]: e.target.value } })} />
          <input type="radio" name={`c-${q.id}`} checked={q.correct === key}
            onChange={() => onChange({ ...q, correct: key })} style={{ cursor: "pointer", accentColor: "var(--color-text-primary)" }} />
        </div>
      ))}
      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>Markera rätt svar med radioknappen →</p>
    </div>
  );
}

function CreateTest({ existing, onSave, onBack }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [questions, setQuestions] = useState(existing?.questions || []);
  const [error, setError] = useState("");

  function addQ() {
    setQuestions([...questions, { id: uid(), text: "", options: { A:"", B:"", C:"", D:"" }, correct:"A" }]);
  }

  function handleSave() {
    if (!title.trim()) { setError("Ange en titel för testet."); return; }
    if (questions.length === 0) { setError("Lägg till minst en fråga."); return; }
    for (const q of questions) {
      if (!q.text.trim()) { setError("Alla frågor behöver en frågetext."); return; }
      if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
        setError("Alla frågor behöver fyra svarsalternativ."); return;
      }
    }
    onSave({ id: existing?.id || uid(), title: title.trim(), questions });
  }

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Tillbaka</button>
      <div className="section-title" style={{ marginBottom: "1rem" }}>
        {existing ? "Redigera test" : "Skapa nytt test"}
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label className="label">Testets titel</label>
        <input className="input" placeholder="T.ex. Kapitel 4 – Fotosyntesen" value={title}
          onChange={e => setTitle(e.target.value)} />
      </div>
      {questions.map((q, i) => (
        <QuestionEditor key={q.id} q={q} index={i}
          onChange={updated => { const a = [...questions]; a[i] = updated; setQuestions(a); }}
          onRemove={() => setQuestions(questions.filter((_, j) => j !== i))} />
      ))}
      <button className="btn btn-full gap-1" onClick={addQ} style={{ marginBottom: 12 }}>+ Lägg till fråga</button>
      {error && <p className="error" style={{ marginBottom: 8 }}>{error}</p>}
      <button className="btn btn-primary btn-full" onClick={handleSave}>Spara test</button>
    </div>
  );
}

function AdminTests({ tests, onEdit, onCreate, onDelete }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <span className="section-title">Tester ({tests.length})</span>
        <button className="btn btn-primary btn-sm" onClick={onCreate}>+ Nytt test</button>
      </div>
      <div className="card">
        {tests.length === 0
          ? <div className="empty">Inga tester ännu. Skapa ditt första test!</div>
          : tests.map(t => (
            <div key={t.id} className="row">
              <div>
                <div className="row-title">{t.title}</div>
                <div className="row-meta">{t.questions.length} frågor</div>
              </div>
              <div className="row-actions">
                <button className="btn btn-sm" onClick={() => onEdit(t)}>Redigera</button>
                <button className="btn btn-danger btn-sm" onClick={() => {
                  if (confirm(`Ta bort "${t.title}"?`)) onDelete(t.id);
                }}>Ta bort</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function AdminResults({ results, tests }) {
  const [filter, setFilter] = useState("all");
  const shown = [...(filter === "all" ? results : results.filter(r => r.testId === filter))]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function fmt(d) {
    return new Date(d).toLocaleDateString("sv-SE", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
  }
  function pct(r) { return Math.round((r.score / r.total) * 100); }
  function grade(r) {
    const p = pct(r);
    if (p >= 80) return "badge-success";
    if (p >= 50) return "badge-warning";
    return "badge-danger";
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <span className="section-title">Resultat ({shown.length})</span>
        <select className="select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Alla tester</option>
          {tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div className="card" style={{ overflowX:"auto" }}>
        {shown.length === 0
          ? <div className="empty">Inga resultat ännu.</div>
          : <table className="results-tbl">
              <thead>
                <tr>
                  <th>Elev</th>
                  <th>Test</th>
                  <th>Poäng</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.studentName}</td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{r.testTitle}</td>
                    <td><span className={`badge ${grade(r)}`}>{r.score}/{r.total} · {pct(r)}%</span></td>
                    <td style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{fmt(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
}

function AdminPanel({ tests, results, onSaveTest, onDeleteTest, onBack }) {
  const [tab, setTab] = useState("tests");
  const [mode, setMode] = useState(null); // null | "create" | test-object
  if (mode !== null) {
    return (
      <CreateTest
        existing={mode === "create" ? null : mode}
        onSave={t => { onSaveTest(t); setMode(null); }}
        onBack={() => setMode(null)}
      />
    );
  }
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Hem</button>
      <div className="tabs">
        <button className={`tab ${tab === "tests" ? "active" : ""}`} onClick={() => setTab("tests")}>Tester</button>
        <button className={`tab ${tab === "results" ? "active" : ""}`} onClick={() => setTab("results")}>
          Resultat {results.length > 0 && `(${results.length})`}
        </button>
      </div>
      {tab === "tests" && <AdminTests tests={tests} onEdit={t => setMode(t)} onCreate={() => setMode("create")} onDelete={onDeleteTest} />}
      {tab === "results" && <AdminResults results={results} tests={tests} />}
    </div>
  );
}

function StudentName({ onStart, onBack }) {
  const [name, setName] = useState("");
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Hem</button>
      <div className="card" style={{ maxWidth: 340, margin: "0 auto" }}>
        <div className="section-title" style={{ marginBottom: "0.75rem" }}>Vad heter du?</div>
        <input className="input" placeholder="Ditt namn..." value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onStart(name.trim())} autoFocus />
        <div className="gap-1" />
        <button className="btn btn-primary btn-full" disabled={!name.trim()} onClick={() => onStart(name.trim())}>
          Fortsätt
        </button>
      </div>
    </div>
  );
}

function StudentTests({ name, tests, results, onSelect, onBack }) {
  const mine = results.filter(r => r.studentName.toLowerCase() === name.toLowerCase());
  function last(testId) {
    const r = mine.filter(r => r.testId === testId).sort((a,b) => new Date(b.date)-new Date(a.date))[0];
    return r ? `${r.score}/${r.total}` : null;
  }
  function fmt(d) {
    return new Date(d).toLocaleDateString("sv-SE", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
  }
  function grade(r) {
    const p = r.score / r.total;
    if (p >= 0.8) return "badge-success";
    if (p >= 0.5) return "badge-warning";
    return "badge-danger";
  }
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Ändra namn</button>
      <p style={{ fontSize:14, color:"var(--color-text-secondary)", marginBottom:"1rem" }}>
        Hej <strong style={{ color:"var(--color-text-primary)" }}>{name}</strong>! Välj ett test nedan.
      </p>
      <div className="card">
        {tests.length === 0
          ? <div className="empty">Inga tester tillgängliga ännu.</div>
          : tests.map(t => (
            <div key={t.id} className="row">
              <div>
                <div className="row-title">{t.title}</div>
                <div className="row-meta">
                  {t.questions.length} frågor{last(t.id) ? ` · Senaste: ${last(t.id)}` : ""}
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => onSelect(t)}>Starta</button>
            </div>
          ))}
      </div>
      {mine.length > 0 && (
        <div className="gap-3">
          <p style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>
            Din historik
          </p>
          <div className="card">
            {[...mine].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,8).map(r => (
              <div key={r.id} className="row">
                <div>
                  <div className="row-title" style={{ fontSize:13 }}>{r.testTitle}</div>
                  <div className="row-meta">{fmt(r.date)}</div>
                </div>
                <span className={`badge ${grade(r)}`}>{r.score}/{r.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizView({ test, onFinish, onBack }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = test.questions.length;
  const q = test.questions[current];
  const selected = answers[q?.id];

  function pick(key) {
    if (answers[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: key }));
  }

  function next() {
    if (current < total - 1) {
      setCurrent(c => c + 1);
    } else {
      setShowResult(true);
    }
  }

  useEffect(() => {
    if (showResult && !saved) {
      const score = test.questions.filter(q => answers[q.id] === q.correct).length;
      onFinish(score, total, answers);
      setSaved(true);
    }
  }, [showResult]);

  if (showResult) {
    const score = test.questions.filter(q => answers[q.id] === q.correct).length;
    const pct = Math.round((score / total) * 100);
    const msg = pct === 100 ? "Perfekt resultat!" : pct >= 80 ? "Mycket bra jobbat!" : pct >= 50 ? "Bra försök, fortsätt öva!" : "Läs igenom och försök igen!";
    return (
      <div>
        <p className="section-title" style={{ textAlign:"center", marginBottom:"0.5rem" }}>{test.title}</p>
        <div className="score-ring">
          <span className="score-big">{score}</span>
          <span className="score-small">av {total}</span>
        </div>
        <p style={{ textAlign:"center", fontSize:14, color:"var(--color-text-secondary)", marginBottom:"1.5rem" }}>
          {pct}% rätt – {msg}
        </p>
        <div className="card" style={{ marginBottom:"1rem" }}>
          {test.questions.map(q => {
            const a = answers[q.id];
            const ok = a === q.correct;
            return (
              <div key={q.id} className="res-row">
                <span className="res-icon" style={{ color: ok ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
                  {ok ? "✓" : "✗"}
                </span>
                <div>
                  <div style={{ fontSize:13, marginBottom:2 }}>{q.text}</div>
                  {!ok && <div style={{ fontSize:12, color:"var(--color-text-secondary)" }}>
                    Ditt svar: {a} ({q.options[a]}) · Rätt: {q.correct} ({q.options[q.correct]})
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-row">
          <button className="btn flex-1" onClick={onBack}>← Tillbaka</button>
          <button className="btn btn-primary flex-1" onClick={() => {
            setCurrent(0); setAnswers({}); setShowResult(false); setSaved(false);
          }}>Gör om</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Avbryt</button>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--color-text-secondary)", marginBottom:6 }}>
        <span>{test.title}</span>
        <span>Fråga {current + 1} av {total}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <div className="card" style={{ marginBottom:"1rem" }}>
        <p className="q-text">{q.text}</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:"1rem" }}>
        {["A","B","C","D"].map(key => {
          let cls = "ans-btn";
          if (selected) {
            if (key === q.correct) cls += " correct";
            else if (key === selected) cls += " wrong";
          }
          return (
            <button key={key} className={cls} data-locked={!!selected} onClick={() => pick(key)}>
              <span className="ans-key">{key}</span>
              <span>{q.options[key]}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <button className="btn btn-primary btn-full" onClick={next}>
          {current < total - 1 ? "Nästa fråga →" : "Se resultat →"}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [adminAuth, setAdminAuth] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [step, setStep] = useState("name");
  const [activeTest, setActiveTest] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await loadData("quiz_tests");
      const r = await loadData("quiz_results");
      const initTests = t || [DEMO_TEST];
      setTests(initTests);
      setResults(r || []);
      if (!t) await saveData("quiz_tests", initTests);
      setLoading(false);
    })();
  }, []);

  async function handleSaveTest(test) {
    const updated = tests.some(t => t.id === test.id)
      ? tests.map(t => t.id === test.id ? test : t)
      : [...tests, test];
    setTests(updated);
    await saveData("quiz_tests", updated);
  }

  async function handleDeleteTest(id) {
    const updated = tests.filter(t => t.id !== id);
    setTests(updated);
    await saveData("quiz_tests", updated);
  }

  async function handleFinish(score, total, answers) {
    const r = {
      id: uid(),
      studentName,
      testId: activeTest.id,
      testTitle: activeTest.title,
      score, total,
      date: new Date().toISOString(),
      answers
    };
    const updated = [...results, r];
    setResults(updated);
    await saveData("quiz_results", updated);
  }

  if (loading) return (
    <div style={{ textAlign:"center", padding:"4rem", color:"var(--color-text-secondary)", fontFamily:"var(--font-sans)", fontSize:14 }}>
      Laddar...
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="wrap">
          {view === "home" && (
            <HomeView
              onStudent={() => { setView("student"); setStep("name"); }}
              onAdmin={() => setView("admin")}
            />
          )}

          {view === "student" && step === "name" && (
            <StudentName onStart={n => { setStudentName(n); setStep("tests"); }} onBack={() => setView("home")} />
          )}
          {view === "student" && step === "tests" && (
            <StudentTests
              name={studentName} tests={tests} results={results}
              onSelect={t => { setActiveTest(t); setStep("quiz"); }}
              onBack={() => setStep("name")}
            />
          )}
          {view === "student" && step === "quiz" && (
            <QuizView
              test={activeTest}
              onFinish={handleFinish}
              onBack={() => setStep("tests")}
            />
          )}

          {view === "admin" && !adminAuth && (
            <AdminLogin onAuth={() => setAdminAuth(true)} onBack={() => setView("home")} />
          )}
          {view === "admin" && adminAuth && (
            <AdminPanel
              tests={tests} results={results}
              onSaveTest={handleSaveTest}
              onDeleteTest={handleDeleteTest}
              onBack={() => { setView("home"); setAdminAuth(false); }}
            />
          )}
        </div>
      </div>
    </>
  );
}
