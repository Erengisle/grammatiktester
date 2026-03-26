import { useState, useEffect } from "react";
import { BUILT_IN_TESTS, CATEGORIES } from "./questions.js";
import { BUILT_IN_TESTS_ADJ, ADJ_CATEGORIES } from "./questions_adjektiv.js";
import { BUILT_IN_TESTS_VERB, VERB_CATEGORIES } from "./questions_verb.js";
import { VERB_BANK_TESTS } from "./questions_verb_bank.js";
import { ADJ_BANK_TESTS } from "./questions_adj_bank.js";
const ALL_BUILT_IN=[...BUILT_IN_TESTS_VERB,...VERB_BANK_TESTS,...BUILT_IN_TESTS_ADJ,...ADJ_BANK_TESTS,...BUILT_IN_TESTS];
const ALL_CATEGORIES=[...CATEGORIES,...ADJ_CATEGORIES,...VERB_CATEGORIES];

const ADMIN_PIN = "6498";
function load(k){try{const r=localStorage.getItem(k);return r?JSON.parse(r):null}catch{return null}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function pct(s,t){return Math.round(s/t*100)}
function fmtDate(d){return new Date(d).toLocaleDateString("sv-SE",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
function gradeClass(s,t){const p=pct(s,t);return p>=80?"badge-success":p>=50?"badge-warning":"badge-danger"}
function scoreMsg(p){return p===100?"Perfekt – alla rätt!":p>=80?"Mycket bra jobbat!":p>=60?"Bra, fortsätt öva!":p>=40?"Läs igenom och försök igen!":"Läs teorin och försök igen!"}

function QText({text}){
  const parts=text.split("___");
  return(
    <span style={{fontSize:16,fontWeight:500,lineHeight:1.6,color:"var(--color-text-primary)"}}>
      {parts.map((p,i)=>(
        <span key={i}>{p}{i<parts.length-1&&<span style={{display:"inline-block",minWidth:60,borderBottom:"2px solid var(--color-text-primary)",margin:"0 2px",verticalAlign:"bottom"}}>&nbsp;</span>}</span>
      ))}
    </span>
  );
}

const css=`
*{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:var(--color-background-tertiary);padding:2rem 1rem 4rem}
.wrap{max-width:680px;margin:0 auto}
@media(min-width:768px){.app{padding:3rem 2rem 5rem}.wrap{max-width:720px}.logo-title{font-size:26px}.q-text-el{font-size:18px}.ans{font-size:15px;padding:13px 16px}.card{padding:1.5rem}}
.logo{text-align:center;margin-bottom:2.5rem}
.logo-title{font-size:22px;font-weight:500;color:var(--color-text-primary)}
.logo-sub{font-size:13px;color:var(--color-text-secondary);margin-top:3px}
.card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1.25rem}
.card+.card{margin-top:12px}
.hcard{width:100%;text-align:left;cursor:pointer;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1.25rem 1.5rem;display:block;transition:all .12s}
.hcard:hover{border-color:var(--color-border-primary);background:var(--color-background-secondary)}
.hcard+.hcard{margin-top:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:7px 14px;border-radius:var(--border-radius-md);font-size:13px;font-weight:500;cursor:pointer;border:0.5px solid var(--color-border-secondary);background:transparent;color:var(--color-text-primary);font-family:var(--font-sans);transition:background .1s;white-space:nowrap}
.btn:hover{background:var(--color-background-secondary)}
.btn:active{transform:scale(.98)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-p{background:var(--color-text-primary);color:var(--color-background-primary);border-color:var(--color-text-primary)}
.btn-p:hover{opacity:.85;background:var(--color-text-primary)}
.btn-d{color:var(--color-text-danger);border-color:var(--color-border-danger)}
.btn-d:hover{background:var(--color-background-danger)}
.btn-sm{padding:5px 10px;font-size:12px}
.btn-w{width:100%}
.inp{width:100%;padding:8px 12px;border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-secondary);background:var(--color-background-primary);color:var(--color-text-primary);font-size:14px;font-family:var(--font-sans);outline:none}
.inp:focus{border-color:var(--color-border-primary)}
.sel{padding:6px 10px;border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-secondary);background:var(--color-background-primary);color:var(--color-text-primary);font-size:13px;font-family:var(--font-sans);cursor:pointer}
.lbl{font-size:12px;color:var(--color-text-secondary);margin-bottom:5px;display:block;font-weight:500}
.st{font-size:16px;font-weight:500;color:var(--color-text-primary)}
.back{background:none;border:none;cursor:pointer;font-size:13px;color:var(--color-text-secondary);padding:0;font-family:var(--font-sans);display:inline-flex;align-items:center;gap:4px;margin-bottom:1.25rem}
.back:hover{color:var(--color-text-primary)}
.tabs{display:flex;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:1.5rem}
.tab{padding:8px 16px;font-size:13px;cursor:pointer;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;color:var(--color-text-secondary);font-family:var(--font-sans);transition:all .1s}
.tab.on{color:var(--color-text-primary);border-bottom-color:var(--color-text-primary);font-weight:500}
.row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary);gap:12px}
.row:last-child{border-bottom:none}
.rt{font-size:14px;font-weight:500;color:var(--color-text-primary)}
.rm{font-size:12px;color:var(--color-text-secondary);margin-top:2px}
.empty{text-align:center;padding:2.5rem 1rem;color:var(--color-text-secondary);font-size:13px}
.err{font-size:12px;color:var(--color-text-danger);margin-top:5px}
.badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:500}
.badge-success{background:var(--color-background-success);color:var(--color-text-success)}
.badge-warning{background:var(--color-background-warning);color:var(--color-text-warning)}
.badge-danger{background:var(--color-background-danger);color:var(--color-text-danger)}
.badge-lock{background:var(--color-background-secondary);color:var(--color-text-secondary)}
.prog{height:3px;background:var(--color-border-tertiary);border-radius:2px;overflow:hidden;margin-bottom:1.5rem}
.prog-fill{height:100%;background:var(--color-text-primary);border-radius:2px;transition:width .25s}
.ans{width:100%;text-align:left;padding:11px 14px;border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-secondary);background:var(--color-background-primary);color:var(--color-text-primary);font-size:14px;cursor:pointer;display:flex;gap:12px;align-items:flex-start;font-family:var(--font-sans);transition:all .1s}
.ans:hover:not([data-locked]){background:var(--color-background-secondary);border-color:var(--color-border-primary)}
.ans.ok{border-color:var(--color-border-success);background:var(--color-background-success);color:var(--color-text-success)}
.ans.no{border-color:var(--color-border-danger);background:var(--color-background-danger);color:var(--color-text-danger)}
.ring{width:100px;height:100px;border-radius:50%;border:2.5px solid var(--color-text-primary);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 1.25rem}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;font-size:11px;font-weight:500;color:var(--color-text-secondary);padding:6px 8px;border-bottom:0.5px solid var(--color-border-tertiary);text-transform:uppercase;letter-spacing:.03em}
.tbl td{padding:9px 8px;border-bottom:0.5px solid var(--color-border-tertiary);color:var(--color-text-primary)}
.tbl tr:last-child td{border-bottom:none}
.qed{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;margin-bottom:10px}
.g1{margin-top:.75rem}.g2{margin-top:1.25rem}.g3{margin-top:1.75rem}
.fr{display:flex;gap:8px}.f1{flex:1}
.muted{color:var(--color-text-secondary);font-size:13px}
`;

// ── HOME ─────────────────────────────────────────────────────────────────────
function Home({onStudent,onAdmin}){
  return(
    <div>
      <div className="logo">
        <div className="logo-title">Självtestplattform</div>
        <div className="logo-sub">Svensk grammatik · konjunktioner & subjunktioner</div>
      </div>
      <button className="hcard" onClick={onStudent}>
        <div style={{fontSize:22,marginBottom:8}}>📖</div>
        <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>Jag är elev</div>
        <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Välj ett test och träna på egen hand</div>
      </button>
      <button className="hcard" onClick={onAdmin}>
        <div style={{fontSize:22,marginBottom:8}}>🔐</div>
        <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>Lärarpanel</div>
        <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Skapa tester och se elevresultat</div>
      </button>
    </div>
  );
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({onAuth,onBack}){
  const [pin,setPin]=useState(""); const [err,setErr]=useState("");
  function go(){if(pin===ADMIN_PIN)onAuth();else setErr("Fel PIN-kod.")}
  return(
    <div>
      <button className="back" onClick={onBack}>← Tillbaka</button>
      <div className="card" style={{maxWidth:320,margin:"0 auto"}}>
        <div className="st" style={{marginBottom:"1rem"}}>Lärarpanel</div>
        <label className="lbl">PIN-kod</label>
        <input type="password" className="inp" placeholder="Ange PIN" value={pin}
          onChange={e=>{setPin(e.target.value);setErr("")}}
          onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
        {err&&<p className="err">{err}</p>}
        <div className="g1"/>
        <button className="btn btn-p btn-w" onClick={go}>Logga in</button>
        <p style={{fontSize:11,color:"var(--color-text-secondary)",textAlign:"center",marginTop:10}}>Standard PIN: 1234 · Ändra ADMIN_PIN i koden</p>
      </div>
    </div>
  );
}

// ── QUESTION EDITOR ───────────────────────────────────────────────────────────
function QEditor({q,index,onChange,onRemove}){
  return(
    <div className="qed">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)"}}>Fråga {index+1}</span>
        <button className="btn btn-d btn-sm" onClick={onRemove}>Ta bort</button>
      </div>
      <input className="inp" placeholder="Frågetext – använd ___ för blanken" value={q.text}
        onChange={e=>onChange({...q,text:e.target.value})} style={{marginBottom:8}}/>
      {["A","B","C","D"].map(k=>(
        <div key={k} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:500,minWidth:16,color:"var(--color-text-secondary)"}}>{k}</span>
          <input className="inp" placeholder={`Alternativ ${k}...`} value={q.options[k]||""}
            onChange={e=>onChange({...q,options:{...q.options,[k]:e.target.value}})}/>
          <input type="radio" name={`c-${q.id}`} checked={q.correct===k}
            onChange={()=>onChange({...q,correct:k})}
            style={{cursor:"pointer",accentColor:"var(--color-text-primary)"}}/>
        </div>
      ))}
      <p style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:4}}>Markera rätt svar med radioknappen →</p>
    </div>
  );
}

// ── CREATE / EDIT TEST ────────────────────────────────────────────────────────
function CreateTest({existing,onSave,onBack}){
  const [title,setTitle]=useState(existing?.title||"");
  const [cat,setCat]=useState(existing?.category||CATEGORIES[0]);
  const [qs,setQs]=useState(existing?.questions||[]);
  const [err,setErr]=useState("");
  function add(){setQs([...qs,{id:uid(),text:"",options:{A:"",B:"",C:"",D:""},correct:"A"}])}
  function go(){
    if(!title.trim()){setErr("Ange en titel.");return}
    if(qs.length===0){setErr("Lägg till minst en fråga.");return}
    for(const q of qs){
      if(!q.text.trim()){setErr("Alla frågor behöver text.");return}
      if(!q.options.A||!q.options.B||!q.options.C||!q.options.D){setErr("Alla frågor behöver fyra alternativ.");return}
    }
    onSave({id:existing?.id||uid(),title:title.trim(),category:cat,questions:qs});
  }
  return(
    <div>
      <button className="back" onClick={onBack}>← Tillbaka</button>
      <div className="st" style={{marginBottom:"1rem"}}>{existing?"Redigera test":"Skapa nytt test"}</div>
      <div style={{marginBottom:"0.75rem"}}>
        <label className="lbl">Titel</label>
        <input className="inp" placeholder="T.ex. Konjunktioner – övning A" value={title} onChange={e=>setTitle(e.target.value)}/>
      </div>
      <div style={{marginBottom:"1rem"}}>
        <label className="lbl">Kategori</label>
        <select className="sel" style={{width:"100%"}} value={cat} onChange={e=>setCat(e.target.value)}>
          {ALL_CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      {qs.map((q,i)=>(
        <QEditor key={q.id} q={q} index={i}
          onChange={u=>{const a=[...qs];a[i]=u;setQs(a)}}
          onRemove={()=>setQs(qs.filter((_,j)=>j!==i))}/>
      ))}
      <button className="btn btn-w g1" onClick={add} style={{marginBottom:12}}>+ Lägg till fråga</button>
      {err&&<p className="err" style={{marginBottom:8}}>{err}</p>}
      <button className="btn btn-p btn-w" onClick={go}>Spara test</button>
    </div>
  );
}

// ── ADMIN TESTS ───────────────────────────────────────────────────────────────
function AdminTests({custom,onEdit,onCreate,onDelete}){
  const all=[...ALL_BUILT_IN,...custom];
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <span className="st">Tester ({all.length})</span>
        <button className="btn btn-p btn-sm" onClick={onCreate}>+ Nytt test</button>
      </div>
      <div className="card">
        {all.length===0?<div className="empty">Inga tester ännu.</div>
          :all.map(t=>(
            <div key={t.id} className="row">
              <div>
                <div className="rt">{t.title}</div>
                <div className="rm">{t.questions.length} frågor · {t.category}
                  {t.locked&&<span className="badge badge-lock" style={{marginLeft:6}}>inbyggt</span>}
                </div>
              </div>
              {!t.locked&&(
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button className="btn btn-sm" onClick={()=>onEdit(t)}>Redigera</button>
                  <button className="btn btn-d btn-sm" onClick={()=>{if(confirm(`Ta bort "${t.title}"?`))onDelete(t.id)}}>Ta bort</button>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── RESULT DETAIL ─────────────────────────────────────────────────────────────
function ResultDetail({result,allTests,onBack}){
  const test=allTests.find(t=>t.id===result.testId);
  const qs=test?.questions||[];
  return(
    <div>
      <button className="back" onClick={onBack}>← Tillbaka</button>
      <div className="st" style={{marginBottom:4}}>{result.studentName}</div>
      <p className="muted" style={{marginBottom:4}}>{result.testTitle}</p>
      <p className="muted" style={{marginBottom:"1.25rem"}}>
        {fmtDate(result.date)} · <span className={`badge ${gradeClass(result.score,result.total)}`}>{result.score}/{result.total} – {pct(result.score,result.total)}%</span>
      </p>
      <div className="card" style={{overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr><th>#</th><th>Fråga</th><th>Elevens svar</th><th>Rätt svar</th></tr></thead>
          <tbody>
            {qs.map((q,i)=>{
              const a=result.answers?.[q.id]; const ok=a===q.correct;
              return(
                <tr key={q.id}>
                  <td style={{color:"var(--color-text-secondary)"}}>{i+1}</td>
                  <td style={{fontSize:12,maxWidth:200}}>{q.text.length>55?q.text.slice(0,55)+"…":q.text}</td>
                  <td style={{color:ok?"var(--color-text-success)":"var(--color-text-danger)",fontWeight:500}}>
                    {a||"–"}{a&&` (${q.options[a]})`}
                  </td>
                  <td style={{fontSize:12,color:"var(--color-text-secondary)"}}>{q.correct} ({q.options[q.correct]})</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ADMIN RESULTS LIST ────────────────────────────────────────────────────────
function AdminResults({results,allTests}){
  const [filter,setFilter]=useState("all");
  const [detail,setDetail]=useState(null);
  if(detail) return <ResultDetail result={detail} allTests={allTests} onBack={()=>setDetail(null)}/>;
  const shown=[...(filter==="all"?results:results.filter(r=>r.testId===filter))].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <span className="st">Resultat ({shown.length})</span>
        <select className="sel" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">Alla tester</option>
          {allTests.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div className="card" style={{overflowX:"auto"}}>
        {shown.length===0?<div className="empty">Inga resultat ännu.</div>
          :<table className="tbl">
            <thead><tr><th>Elev</th><th>Test</th><th>Poäng</th><th>Datum</th><th></th></tr></thead>
            <tbody>
              {shown.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:500}}>{r.studentName}</td>
                  <td className="muted" style={{fontSize:12}}>{r.testTitle}</td>
                  <td><span className={`badge ${gradeClass(r.score,r.total)}`}>{r.score}/{r.total} · {pct(r.score,r.total)}%</span></td>
                  <td className="muted" style={{fontSize:12}}>{fmtDate(r.date)}</td>
                  <td><button className="btn btn-sm" onClick={()=>setDetail(r)}>Visa svar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({custom,results,allTests,onSave,onDelete,onBack}){
  const [tab,setTab]=useState("tests");
  const [mode,setMode]=useState(null);
  if(mode!==null) return <CreateTest existing={mode==="new"?null:mode} onSave={t=>{onSave(t);setMode(null)}} onBack={()=>setMode(null)}/>;
  return(
    <div>
      <button className="back" onClick={onBack}>← Hem</button>
      <div className="tabs">
        <button className={`tab ${tab==="tests"?"on":""}`} onClick={()=>setTab("tests")}>Tester</button>
        <button className={`tab ${tab==="results"?"on":""}`} onClick={()=>setTab("results")}>
          Resultat{results.length>0&&` (${results.length})`}
        </button>
      </div>
      {tab==="tests"&&<AdminTests custom={custom} onEdit={t=>setMode(t)} onCreate={()=>setMode("new")} onDelete={onDelete}/>}
      {tab==="results"&&<AdminResults results={results} allTests={allTests}/>}
    </div>
  );
}

// ── STUDENT NAME ──────────────────────────────────────────────────────────────
function StudentName({onStart,onBack}){
  const [name,setName]=useState("");
  return(
    <div>
      <button className="back" onClick={onBack}>← Hem</button>
      <div className="card" style={{maxWidth:340,margin:"0 auto"}}>
        <div className="st" style={{marginBottom:"0.75rem"}}>Vad heter du?</div>
        <input className="inp" placeholder="Ditt namn..." value={name}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&name.trim()&&onStart(name.trim())} autoFocus/>
        <div className="g1"/>
        <button className="btn btn-p btn-w" disabled={!name.trim()} onClick={()=>onStart(name.trim())}>Fortsätt</button>
      </div>
    </div>
  );
}

// ── STUDENT TEST LIST ─────────────────────────────────────────────────────────
function StudentTests({name,allTests,results,onSelect,onBack}){
  const mine=results.filter(r=>r.studentName.toLowerCase()===name.toLowerCase());
  function last(id){
    const r=[...mine].filter(r=>r.testId===id).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    return r?`${r.score}/${r.total}`:null;
  }
  return(
    <div>
      <button className="back" onClick={onBack}>← Ändra namn</button>
      <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:"1rem"}}>
        Hej <strong style={{color:"var(--color-text-primary)"}}>{name}</strong>! Välj ett test nedan.
      </p>
      <div className="card">
        {allTests.length===0?<div className="empty">Inga tester tillgängliga.</div>
          :allTests.map(t=>(
            <button key={t.id} className="row" onClick={()=>onSelect(t)}
              style={{width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"10px 0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"var(--font-sans)"}}>
              <div>
                <div className="rt" style={{color:"var(--color-text-primary)"}}>{t.title}</div>
                <div className="rm">{t.questions.length} frågor · {t.category}{last(t.id)?` · Senaste: ${last(t.id)}`:""}</div>
              </div>
              <span style={{color:"var(--color-text-secondary)",fontSize:16,flexShrink:0,marginLeft:8}}>→</span>
            </button>
          ))
        }
      </div>
      {mine.length>0&&(
        <div className="g3">
          <p style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>Din historik</p>
          <div className="card">
            {[...mine].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8).map(r=>(
              <div key={r.id} className="row">
                <div>
                  <div className="rt" style={{fontSize:13}}>{r.testTitle}</div>
                  <div className="rm">{fmtDate(r.date)}</div>
                </div>
                <span className={`badge ${gradeClass(r.score,r.total)}`}>{r.score}/{r.total} · {pct(r.score,r.total)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GROUP INFO (used by two-stage questions) ──────────────────────────────────
const GROUP_INFO={
  "A":{label:"Grupp A",desc:"en, ett, någon/något, ingen/inget/inga, vilken, varje, annan…"},
  "B":{label:"Grupp B",desc:"den, det, de — den här/där, det här/där, de här/där…"},
  "C":{label:"Grupp C",desc:"min/mitt/mina, Evas (genitiv), samma, nästa, följande…"},
  "1":{label:"Grupp 1",desc:"–are, –ast  (de flesta adjektiv: rolig→roligare)"},
  "2":{label:"Grupp 2",desc:"–re, –st med omljud  (hög, ung, tung, låg, lång, stor, grov)"},
  "3":{label:"Grupp 3",desc:"oregelbundna  (gammal, liten, bra, dålig)"},
  "4":{label:"Grupp 4",desc:"mer / mest  (–isk adjektiv, perfekt och presens particip)"},
  "1v":{label:"Grupp 1",desc:"–ar i presens · –ade i preteritum · –at i supinum"},
  "2a":{label:"Grupp 2a",desc:"–er i presens · –de i preteritum · –t i supinum"},
  "2b":{label:"Grupp 2b",desc:"–er i presens · –te i preteritum · –t i supinum (p/t/k/s/x i stammen)"},
  "3v":{label:"Grupp 3",desc:"lång vokal i stammen · –r i presens · –dde i preteritum · –tt i supinum"},
  "4v":{label:"Grupp 4",desc:"stark eller oregelbunden böjning – byter vokal i preteritum, ingen ändelse"},
};

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function Quiz({test,onFinish,onBack}){
  const [cur,setCur]=useState(0);
  const [ans,setAns]=useState({});
  const [done,setDone]=useState(false);
  const [saved,setSaved]=useState(false);
  const [phase,setPhase]=useState(()=>test.questions[0]?.type==="two_stage"?"group":"form");
  const [groupErr,setGroupErr]=useState(false);

  const total=test.questions.length;
  const q=test.questions[cur];
  const isTwoStage=q?.type==="two_stage";
  const sel=ans[q?.id];
  const keys=Object.keys(q?.options||{});

  useEffect(()=>{
    setPhase(test.questions[cur]?.type==="two_stage"?"group":"form");
    setGroupErr(false);
  },[cur]);

  function pickGroup(val){
    if(val===q.correctGroup){setPhase("form");setGroupErr(false);}
    else setGroupErr(true);
  }
  function pick(k){if(!ans[q.id])setAns(p=>({...p,[q.id]:k}))}
  function next(){cur<total-1?setCur(c=>c+1):setDone(true)}

  useEffect(()=>{
    if(done&&!saved){
      const score=test.questions.filter(q=>ans[q.id]===q.correct).length;
      onFinish(score,total,ans);
      setSaved(true);
    }
  },[done]);

  if(done){
    const score=test.questions.filter(q=>ans[q.id]===q.correct).length;
    const p=pct(score,total);
    return(
      <div>
        <div className="st" style={{textAlign:"center",marginBottom:"0.75rem"}}>{test.title}</div>
        <div className="ring">
          <span style={{fontSize:30,fontWeight:500,lineHeight:1}}>{score}</span>
          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>av {total}</span>
        </div>
        <p style={{textAlign:"center",fontSize:15,fontWeight:500,marginBottom:4}}>{p}% rätt</p>
        <p style={{textAlign:"center",fontSize:13,color:"var(--color-text-secondary)",marginBottom:"1.5rem"}}>{scoreMsg(p)}</p>
        <p style={{textAlign:"center",fontSize:13,color:"var(--color-text-secondary)",marginBottom:"1.5rem"}}>
          Du hade <strong>{total-score} fel</strong> av {total} frågor.
        </p>
        <div className="fr">
          <button className="btn f1" onClick={onBack}>← Tillbaka</button>
          <button className="btn btn-p f1" onClick={()=>{setCur(0);setAns({});setDone(false);setSaved(false)}}>Gör om</button>
        </div>
      </div>
    );
  }

  const progBar=(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>
        <span style={{maxWidth:"70%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{test.title}</span>
        <span>Fråga {cur+1} av {total}</span>
      </div>
      <div className="prog"><div className="prog-fill" style={{width:`${(cur/total)*100}%`}}/></div>
    </div>
  );

  // ── STEG 1: Gruppidentifiering ────────────────────────────────────────────
  if(phase==="group"&&isTwoStage){
    const groupChoices=
      q.groupType==="adj_abc"  ? ["A","B","C"] :
      q.groupType==="comp_1234"? ["1","2","3","4"] :
      q.groupType==="verb_1234"? ["1v","2a","2b","3v","4v"] :
      ["A","B","C"];

    const displayToValue={"1v":"1","2a":"2a","2b":"2b","3v":"3","4v":"4"};
    const isVerbGroup=q.groupType==="verb_1234";

    function handleGroupPick(displayKey){
      const val=isVerbGroup?(displayToValue[displayKey]||displayKey):displayKey;
      if(val===q.correctGroup){setPhase("form");setGroupErr(false);}
      else setGroupErr(true);
    }

    // Reference table for verbs – same layout as the laminated card
    const VerbTable=()=>(
      <div style={{overflowX:"auto",marginBottom:"1rem"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:480}}>
          <thead>
            <tr>
              {[["",""],["Grupp 1",""],["Grupp 2a",""],["",""],["Grupp 2b",""],["Grupp 3",""],["Starka verb",""],["",""],["Oregelb.",""],["",""]].map(([h],i)=>(
                <th key={i} style={{padding:"4px 6px",borderBottom:"1.5px solid var(--color-border-primary)",borderRight:i===0?"none":"0.5px solid var(--color-border-tertiary)",textAlign:"center",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>
                  {["","Grupp 1","Grupp 2a","","Grupp 2b","Grupp 3","Starka verb","","Oregelb.",""][i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Infinitiv","måla","bygga","hyra","köpa","tro","binda","sjunga","förstå","ligga"],
              ["Imperativ","måla!","bygg!","hyr!","köp!","tro","bind!","sjung!","förstå!","ligg!"],
              ["Presens","målar","bygger","hyr","köper","tror","binder","sjunger","förstår","ligger"],
              ["Preteritum","målade","byggde","hyrde","köpte","trodde","band","sjöng","förstod","låg"],
              ["Supinum","målat","byggt","hyrt","köpt","trott","bundit","sjungit","förstått","legat"],
            ].map((row,ri)=>(
              <tr key={ri} style={{background:ri%2===0?"var(--color-background-secondary)":"var(--color-background-primary)"}}>
                {row.map((cell,ci)=>(
                  <td key={ci} style={{
                    padding:"5px 6px",
                    borderRight:ci===0?"none":"0.5px solid var(--color-border-tertiary)",
                    fontWeight:ci===0?500:ri===1?600:400,
                    color:ri===1&&ci>0?"var(--color-text-primary)":ci===0?"var(--color-text-secondary)":"var(--color-text-primary)",
                    textAlign:ci===0?"left":"center",
                    fontSize:ri===1&&ci>0?14:13,
                    whiteSpace:"nowrap",
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={10} style={{padding:"3px 6px",fontSize:11,color:"var(--color-text-secondary)"}}>
                * p, t, k, s, x i stammen → Grupp 2b
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    return(
      <div>
        <button className="back" onClick={onBack}>← Avbryt</button>
        {progBar}
        <div className="card" style={{marginBottom:"1rem",textAlign:"center",padding:"1.5rem 1.25rem"}}>
          {isVerbGroup&&<p style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Imperativ</p>}
          <p style={{fontSize:26,fontWeight:500,color:"var(--color-text-primary)"}}>{isVerbGroup?`${q.word}!`:q.word}</p>
          {q.context&&<p style={{fontSize:16,color:"var(--color-text-secondary)",marginTop:8,lineHeight:1.6}}><QText text={q.context}/></p>}
        </div>
        {isVerbGroup&&cur===0&&<VerbTable/>}
        {isVerbGroup&&cur>0&&(
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:".75rem"}}>
            (Referenstabellen visas på första frågan.)
          </p>
        )}
        {!isVerbGroup&&(
          <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:".75rem"}}>
            {q.groupType==="adj_abc"
              ?"Vilken böjningsgrupp (A, B eller C) gäller för adjektivet i frasen?"
              :"Vilken komparationsgrupp (1–4) tillhör adjektivet?"}
          </p>
        )}
        <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:".75rem"}}>
          {isVerbGroup?"Vilken grupp tillhör verbet?":""}
        </p>
        {groupErr&&<p style={{fontSize:13,color:"var(--color-text-danger)",marginBottom:".75rem",fontWeight:500}}>Fel grupp – försök igen!</p>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {groupChoices.map(g=>(
            <button key={g} className="ans" onClick={()=>handleGroupPick(g)}>
              <span className="ans-key" style={{minWidth:72,flexShrink:0,fontWeight:500}}>{GROUP_INFO[g].label}</span>
              {!isVerbGroup&&cur===0&&<span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{GROUP_INFO[g].desc}</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── STEG 2 / Vanlig fråga ─────────────────────────────────────────────────
  return(
    <div>
      <button className="back" onClick={onBack}>← Avbryt</button>
      {progBar}
      {isTwoStage&&(
        <div style={{marginBottom:8}}>
          {(()=>{
            const verbDisplayKey={"1":"1v","2a":"2a","2b":"2b","3":"3v","4":"4v"};
            const key=q.groupType==="verb_1234"
              ?(verbDisplayKey[q.correctGroup]||q.correctGroup)
              :q.correctGroup;
            return(
              <span style={{fontSize:12,padding:"2px 10px",borderRadius:99,background:"var(--color-background-success)",color:"var(--color-text-success)",fontWeight:500}}>
                {GROUP_INFO[key]?.label||key} ✓
              </span>
            );
          })()}
        </div>
      )}
      <div className="card" style={{marginBottom:"1rem"}}>
        {isTwoStage
          ?<>
            <p style={{fontSize:20,fontWeight:500,color:"var(--color-text-primary)",marginBottom:q.context?8:0}}>{q.word}</p>
            {q.context&&<p style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.6,marginTop:4}}><QText text={q.context}/></p>}
          </>
          :<QText text={q.text}/>
        }
      </div>
      {q.stageQ&&<p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:".75rem"}}>{q.stageQ}</p>}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"1rem"}}>
        {keys.map(k=>{
          let cls="ans";
          if(sel){if(k===q.correct)cls+=" ok";else if(k===sel)cls+=" no";}
          return(
            <button key={k} className={cls} data-locked={sel?true:undefined} onClick={()=>pick(k)}>
              <span style={{fontWeight:500,minWidth:18,flexShrink:0}}>{k}</span>
              <span>{q.options[k]}</span>
            </button>
          );
        })}
      </div>
      {sel&&<button className="btn btn-p btn-w" onClick={next}>{cur<total-1?"Nästa fråga →":"Se resultat →"}</button>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [custom,setCustom]=useState([]);
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("home");
  const [adminAuth,setAdminAuth]=useState(false);
  const [name,setName]=useState("");
  const [step,setStep]=useState("name");
  const [activeTest,setActiveTest]=useState(null);

  const allTests=[...ALL_BUILT_IN,...custom];

  useEffect(()=>{
    const c=load("quiz_custom"); const r=load("quiz_results");
    setCustom(c||[]); setResults(r||[]); setLoading(false);
  },[]);

  function saveTest(t){
    const u=custom.some(x=>x.id===t.id)?custom.map(x=>x.id===t.id?t:x):[...custom,t];
    setCustom(u); save("quiz_custom",u);
  }
  function deleteTest(id){
    const u=custom.filter(t=>t.id!==id); setCustom(u); save("quiz_custom",u);
  }
  function handleFinish(score,total,answers){
    const r={id:uid(),studentName:name,testId:activeTest.id,testTitle:activeTest.title,score,total,date:new Date().toISOString(),answers};
    const u=[...results,r]; setResults(u); save("quiz_results",u);
  }

  if(loading) return <div style={{textAlign:"center",padding:"4rem",color:"var(--color-text-secondary)",fontFamily:"var(--font-sans)",fontSize:14}}>Laddar...</div>;

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="wrap">
          {view==="home"&&<Home onStudent={()=>{setView("student");setStep("name")}} onAdmin={()=>setView("admin")}/>}

          {view==="student"&&step==="name"&&<StudentName onStart={n=>{setName(n);setStep("tests")}} onBack={()=>setView("home")}/>}
          {view==="student"&&step==="tests"&&<StudentTests name={name} allTests={allTests} results={results} onSelect={t=>{setActiveTest(t);setStep("quiz")}} onBack={()=>setStep("name")}/>}
          {view==="student"&&step==="quiz"&&<Quiz test={activeTest} onFinish={handleFinish} onBack={()=>setStep("tests")}/>}

          {view==="admin"&&!adminAuth&&<AdminLogin onAuth={()=>setAdminAuth(true)} onBack={()=>setView("home")}/>}
          {view==="admin"&&adminAuth&&<AdminPanel custom={custom} results={results} allTests={allTests} onSave={saveTest} onDelete={deleteTest} onBack={()=>{setView("home");setAdminAuth(false)}}/>}
        </div>
      </div>
    </>
  );
}
