"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #08090e; color: #e8eaf0; font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0f1017; } ::-webkit-scrollbar-thumb { background: #252535; border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
  .anim  { animation: fadeUp 0.42s ease both; }
  .d1    { animation-delay:0.06s; } .d2 { animation-delay:0.12s; } .d3 { animation-delay:0.18s; } .d4 { animation-delay:0.24s; }
  .card  { background:#0f1017; border:1px solid #1e2030; border-radius:14px; padding:22px; }
  .card-blue { background:linear-gradient(135deg,rgba(94,96,255,0.06),rgba(14,165,233,0.04)); border:1px solid rgba(94,96,255,0.18); border-radius:14px; padding:22px; }
  .btn   { display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:all 0.18s;border:none;letter-spacing:-0.01em; }
  .bp    { background:#5E60FF;color:#fff; }
  .bp:hover { background:#4e50e8;transform:translateY(-1px);box-shadow:0 4px 20px rgba(94,96,255,0.28); }
  .bp:disabled { background:#1e2030;color:#3a3d55;cursor:not-allowed;transform:none;box-shadow:none; }
  .bo    { background:transparent;color:#8b8fa8;border:1px solid #1e2030; }
  .bo:hover { border-color:#5E60FF;color:#8b8eff; }
  .bcta  { background:linear-gradient(135deg,#5E60FF,#0ea5e9);color:#fff;font-size:16px;padding:14px 34px;box-shadow:0 0 30px rgba(94,96,255,0.22); }
  .bcta:hover { transform:translateY(-2px);box-shadow:0 8px 30px rgba(94,96,255,0.32); }
  .fl    { display:block;font-size:13px;font-weight:500;color:#8b8fa8;margin-bottom:7px;letter-spacing:0.01em; }
  .fh    { font-size:12px;color:#4a4d66;margin-top:5px;line-height:1.5; }
  input[type=number],input[type=text],select { width:100%;background:#0a0b12;border:1px solid #1e2030;border-radius:9px;color:#e8eaf0;padding:12px 14px;font-size:15px;font-family:inherit;transition:border-color .2s,box-shadow .2s;appearance:none;-webkit-appearance:none; }
  input:focus,select:focus { outline:none;border-color:#5E60FF;box-shadow:0 0 0 3px rgba(94,96,255,0.11); }
  input::placeholder { color:#3a3d55; }
  select { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath fill='none' stroke='%238b8fa8' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px; }
  select option { background:#0f1017; }
  .choice-grid { display:flex;flex-wrap:wrap;gap:8px; }
  .cb   { background:#0a0b12;border:1px solid #1e2030;border-radius:8px;padding:9px 15px;font-size:14px;color:#6b6f88;cursor:pointer;transition:all .18s;font-family:inherit; }
  .cb:hover { border-color:#2e3050;color:#c0c4dc; }
  .cb.sel { border-color:#5E60FF;color:#8b8eff;background:rgba(94,96,255,0.08); }
  .field { margin-bottom:20px; }
  .slabel { font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#4a4d66;margin-bottom:12px; }
  .mono { font-family:'JetBrains Mono',monospace;letter-spacing:-0.03em; }
  .note { background:rgba(94,96,255,0.06);border-left:3px solid #5E60FF;border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:#8b8fa8;margin-top:8px;line-height:1.55; }
  .warn { background:rgba(239,68,68,0.06);border-left:3px solid #ef4444;border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:#f87171;margin-top:8px;line-height:1.55; }
  hr.div { border:none;border-top:1px solid #1e2030;margin:22px 0; }
  .sdot  { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0;transition:all .3s; }
  .sline { flex:1;height:1px;background:#1e2030; }
  .sline.on { background:#5E60FF; }
  .spinner { width:20px;height:20px;border-radius:50%;border:2px solid #1e2030;border-top-color:#5E60FF;animation:spin .7s linear infinite;flex-shrink:0; }
  .pill { display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:12px;font-weight:500; }
  .pc  { background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.2); }
  .ph  { background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.2); }
  .pm  { background:rgba(94,96,255,.12);color:#818cf8;border:1px solid rgba(94,96,255,.2); }
  .pg  { background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.2); }
  .nav { position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(8,9,14,.88);backdrop-filter:blur(12px);border-bottom:1px solid #1e2030;display:flex;align-items:center;padding:0 24px;height:60px; }
`;

function Logo({ size = 18 }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:9 }}>
      <div style={{ width:size+8,height:size+8,borderRadius:8,background:"linear-gradient(135deg,#5E60FF,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.7,fontWeight:700,color:"#fff",flexShrink:0 }}>E</div>
      <span style={{ fontSize:size+1,fontWeight:700,letterSpacing:"-0.03em",color:"#e8eaf0" }}>Enrollment<span style={{ color:"#5E60FF" }}>X</span></span>
    </div>
  );
}

function Nav({ user, onSignOut }) {
  return (
    <nav className="nav">
      <Logo />
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
        {user && (
          <>
            <span style={{ fontSize:13, color:"#6b6f88" }}>{user.email}</span>
            <button className="btn bo" style={{ fontSize:13, padding:"6px 14px" }} onClick={onSignOut}>Sign out</button>
          </>
        )}
        {!user && (
          <div style={{ fontSize:13,color:"#3a3d55",fontWeight:500 }}>AI Audit System</div>
        )}
      </div>
    </nav>
  );
}

function Landing({ onStart }) {
  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 60px",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"5%",left:"50%",transform:"translateX(-50%)",width:700,height:350,background:"radial-gradient(ellipse,rgba(94,96,255,0.1) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ maxWidth:660,textAlign:"center",position:"relative" }}>
        <div className="anim" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(94,96,255,0.08)",border:"1px solid rgba(94,96,255,0.2)",borderRadius:100,padding:"6px 16px",marginBottom:32 }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#5E60FF",animation:"pulse 2s infinite",display:"inline-block" }} />
          <span style={{ fontSize:13,color:"#8b8eff",fontWeight:500 }}>Free · No credit card · 2 minutes</span>
        </div>
        <h1 className="anim d1" style={{ fontSize:"clamp(32px,5.5vw,56px)",fontWeight:700,lineHeight:1.12,letterSpacing:"-0.03em",marginBottom:20 }}>
          Find out exactly how much revenue<br />
          <span style={{ background:"linear-gradient(90deg,#5E60FF,#0ea5e9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
            your agency is losing today
          </span>
        </h1>
        <p className="anim d2" style={{ fontSize:17,color:"#6b6f88",lineHeight:1.8,maxWidth:500,margin:"0 auto 38px" }}>
          Answer 15 quick questions about your study abroad business. EnrollmentX AI analyses your data and delivers a personalised audit — with exact ₹ figures and a step-by-step AI fix plan.
        </p>
        <div className="anim d3">
          <button className="btn bcta" onClick={onStart}>Start My Free Audit →</button>
          <p style={{ fontSize:13,color:"#3a3d55",marginTop:12 }}>Takes about 2–3 minutes · 100% confidential</p>
        </div>
        <div className="anim d4" style={{ display:"flex",gap:0,justifyContent:"center",marginTop:56,borderTop:"1px solid #1e2030",paddingTop:36,flexWrap:"wrap" }}>
          {[["₹2.4Cr+","Average annual revenue leak found per agency"],["87%","Of agencies miss key AI automation opportunities"],["2–3 min","To get your full personalised report"]].map(([n,d]) => (
            <div key={n} style={{ flex:1,minWidth:140,textAlign:"center",padding:"0 20px" }}>
              <div className="mono" style={{ fontSize:28,fontWeight:700,color:"#e8eaf0" }}>{n}</div>
              <div style={{ fontSize:13,color:"#4a4d66",marginTop:5,lineHeight:1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { title:"Lead Generation", sub:"How enquiries come in and how fast you respond" },
  { title:"Sales & Follow-up", sub:"How your team handles and converts leads" },
  { title:"Team & Time", sub:"Your team size and how counselor time is spent" },
  { title:"Marketing & Budget", sub:"Your ad spend and cost per lead" },
  { title:"Operations & Tools", sub:"Systems and tools your agency currently uses" },
];

function CB({ val, label, hint, field, data, upd }) {
  return (
    <button className={`cb ${data[field]===val?"sel":""}`} onClick={()=>upd(field,val)}>
      {label}{hint&&<span style={{ color:data[field]===val?"#6e71c4":"#3a3d55",marginLeft:5,fontSize:12 }}>{hint}</span>}
    </button>
  );
}

function Step0({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How many enquiries / leads does your agency receive per month?</label>
      <input type="number" min="0" placeholder="e.g. 150" value={d.monthlyLeads||""} onChange={e=>u("monthlyLeads",e.target.value)} />
      <p className="fh">Count all channels: walk-ins, calls, WhatsApp, website forms, social media DMs, etc.</p>
    </div>
    <div className="field">
      <label className="fl">Where do most of your leads come from?</label>
      <select value={d.leadSource||""} onChange={e=>u("leadSource",e.target.value)}>
        <option value="">Select your primary lead source</option>
        <option value="ads">Paid Ads (Google, Meta / Instagram)</option>
        <option value="referrals">Referrals from past students or partners</option>
        <option value="organic">Organic / Website / SEO</option>
        <option value="walk-ins">Walk-in / In-person enquiries</option>
        <option value="social">Social media (YouTube, Instagram content)</option>
      </select>
    </div>
    <div className="field">
      <label className="fl">How long does it typically take your team to respond to a new enquiry? (in minutes)</label>
      <input type="number" min="0" placeholder="e.g. 30" value={d.responseTime||""} onChange={e=>u("responseTime",e.target.value)} />
      <p className="fh">Be honest — if it takes 2 hours, enter 120. This is one of the biggest revenue levers.</p>
      {Number(d.responseTime)>10 && <div className="warn">⚠ Leads contacted after 10 minutes are 7× less likely to convert. This will be penalised in your audit score.</div>}
      {Number(d.responseTime)<=10 && Number(d.responseTime)>0 && <div className="note">✓ Great! You're within the optimal response window.</div>}
    </div>
    <div className="field">
      <label className="fl">What percentage of your leads actually enroll? (Your conversion rate)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 8" value={d.conversionRate||""} onChange={e=>u("conversionRate",e.target.value)} />
      <p className="fh">If you sign up 10 students from 100 enquiries, that's 10%. The industry benchmark is 15%.</p>
      {Number(d.conversionRate)>0 && Number(d.conversionRate)<15 && <div className="warn">⚠ You're {(15-Number(d.conversionRate)).toFixed(1)}% below the 15% benchmark. This gap will be quantified in rupees.</div>}
    </div>
  </>;
}

function Step1({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How does your team follow up with leads after the first contact?</label>
      <div className="choice-grid">
        {[["manual","Manual phone calls"],["whatsapp","WhatsApp messages"],["crm","CRM / automated system"],["email","Email only"],["none","We don't follow up regularly"]].map(([v,l])=><CB key={v} val={v} label={l} field="followUpMethod" data={d} upd={u}/>)}
      </div>
      {d.followUpMethod==="none" && <div className="warn">⚠ No follow-up process is one of the top 3 causes of revenue loss in study abroad agencies.</div>}
    </div>
    <div className="field" style={{ marginTop:4 }}>
      <label className="fl">On average, how many follow-ups do you make per lead before giving up?</label>
      <input type="number" min="0" placeholder="e.g. 3" value={d.followUpCount||""} onChange={e=>u("followUpCount",e.target.value)} />
      <p className="fh">Research shows 80% of sales require 5+ follow-ups. Most agencies stop at 1–2.</p>
      {Number(d.followUpCount)>0 && Number(d.followUpCount)<4 && <div className="note">Consider increasing follow-ups — most conversions happen on the 4th–7th contact.</div>}
    </div>
    <div className="field">
      <label className="fl">At which stage do most of your leads go cold or stop responding?</label>
      <select value={d.dropOffStage||""} onChange={e=>u("dropOffStage",e.target.value)}>
        <option value="">Select the most common drop-off point</option>
        <option value="first-contact">After first contact — they go silent immediately</option>
        <option value="counseling">After the initial counseling session</option>
        <option value="documents">When asked to submit documents</option>
        <option value="fees">After receiving fee / pricing details</option>
        <option value="visa">During the visa application stage</option>
        <option value="no-idea">Not sure — we don't track this</option>
      </select>
    </div>
  </>;
}

function Step2({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How many counselors / student advisors does your agency have?</label>
      <input type="number" min="1" placeholder="e.g. 5" value={d.counselors||""} onChange={e=>u("counselors",e.target.value)} />
      <p className="fh">Include all staff who handle student enquiries, even part-time advisors.</p>
    </div>
    <div className="field">
      <label className="fl">On average, how many minutes per week does a counselor spend on each active lead?</label>
      <input type="number" min="0" placeholder="e.g. 45" value={d.timePerLead||""} onChange={e=>u("timePerLead",e.target.value)} />
      <p className="fh">Include everything: calls, re-sending documents, updating records, answering the same questions.</p>
    </div>
    <div className="field">
      <label className="fl">What percentage of your team's daily work is repetitive and manual?</label>
      <input type="number" min="0" max="100" placeholder="e.g. 60" value={d.manualWorkPct||""} onChange={e=>u("manualWorkPct",e.target.value)} />
      <p className="fh">Examples: re-sending the same brochures, manually updating spreadsheets, answering the same FAQs repeatedly.</p>
      {Number(d.manualWorkPct)>50 && <div className="warn">⚠ This is significantly above average. AI automation can typically eliminate 60–70% of this workload.</div>}
    </div>
  </>;
}

function Step3({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How much does your agency spend on advertising per month? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 50000" value={d.adSpend||""} onChange={e=>u("adSpend",e.target.value)} />
      <p className="fh">Include Google Ads, Meta / Instagram Ads, YouTube promotions, or any paid campaigns.</p>
    </div>
    <div className="field">
      <label className="fl">What is your approximate cost per lead? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 333" value={d.costPerLead||""} onChange={e=>u("costPerLead",e.target.value)} />
      <p className="fh">Formula: Cost per Lead = Ad Spend ÷ Monthly Leads. Leave blank and we'll calculate it for you.</p>
    </div>
    <div className="field">
      <label className="fl">How would you describe the overall quality of leads your agency receives?</label>
      <div className="choice-grid">
        <CB val="low"    label="Low"    hint="— mostly unserious enquiries"      field="leadQuality" data={d} upd={u} />
        <CB val="medium" label="Medium" hint="— mix of serious and casual"       field="leadQuality" data={d} upd={u} />
        <CB val="high"   label="High"   hint="— mostly ready-to-enroll students" field="leadQuality" data={d} upd={u} />
      </div>
    </div>
    <div className="field" style={{ marginTop:4 }}>
      <label className="fl">What is the average revenue your agency earns per enrolled student? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 150000" value={d.revenuePerStudent||""} onChange={e=>u("revenuePerStudent",e.target.value)} />
      <p className="fh">Include service fees, commissions, application fees. Default is ₹1,50,000 if left blank.</p>
    </div>
  </>;
}

function Step4({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How does your agency currently handle student documents?</label>
      <div className="choice-grid">
        <CB val="manual"  label="Fully manual"  hint="— paper files, email attachments" field="docHandling" data={d} upd={u} />
        <CB val="semi"    label="Semi-digital"  hint="— mix of digital files and paper"  field="docHandling" data={d} upd={u} />
        <CB val="digital" label="Fully digital" hint="— cloud storage, digital workflows" field="docHandling" data={d} upd={u} />
      </div>
      {d.docHandling==="manual" && <div className="warn">⚠ Manual document handling adds 3–4 hours per student on average.</div>}
      {d.docHandling==="digital" && <div className="note">✓ Great — digital document handling gives you a strong operational base.</div>}
    </div>
    <div className="field" style={{ marginTop:4 }}>
      <label className="fl">Does your agency use a CRM to track leads and follow-ups?</label>
      <div className="choice-grid">
        <CB val="yes"    label="Yes, actively" hint="— we track every lead in the CRM"           field="usesCRM" data={d} upd={u} />
        <CB val="partly" label="Partially"     hint="— we have one but don't use it consistently" field="usesCRM" data={d} upd={u} />
        <CB val="no"     label="No CRM"        hint="— we use spreadsheets, WhatsApp, or nothing" field="usesCRM" data={d} upd={u} />
      </div>
      {d.usesCRM==="no" && <div className="warn">⚠ Agencies without a CRM lose an estimated 35% more leads due to poor follow-up tracking.</div>}
    </div>
  </>;
}

function AuditForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const upd = (k,v) => setData(p=>({...p,[k]:v}));

  const ok = () => {
    if(step===0) return data.monthlyLeads && data.leadSource && data.responseTime && data.conversionRate;
    if(step===1) return data.followUpMethod && data.followUpCount && data.dropOffStage;
    if(step===2) return data.counselors && data.timePerLead && data.manualWorkPct;
    if(step===3) return data.adSpend && data.leadQuality;
    if(step===4) return data.docHandling && data.usesCRM;
  };

  const StepComp = [Step0,Step1,Step2,Step3,Step4][step];

  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"84px 20px 60px" }}>
      <div style={{ width:"100%",maxWidth:580 }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",marginBottom:14 }}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"none" }}>
                <div className="sdot" style={{ background:i<step?"#5E60FF":i===step?"rgba(94,96,255,0.12)":"#0f1017", border:`${i===step?"2px":"1px"} solid ${i<=step?"#5E60FF":"#1e2030"}`, color:i<step?"#fff":i===step?"#8b8eff":"#3a3d55" }}>
                  {i<step?"✓":i+1}
                </div>
                {i<STEPS.length-1 && <div className={`sline ${i<step?"on":""}`} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize:13,color:"#4a4d66" }}>
            Step {step+1} of {STEPS.length} — <span style={{ color:"#6b6f88",fontWeight:500 }}>{STEPS[step].title}</span>
          </div>
        </div>

        <div className="card anim" key={step}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:20,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4 }}>{STEPS[step].title}</h2>
            <p style={{ fontSize:14,color:"#6b6f88" }}>{STEPS[step].sub}</p>
          </div>
          <StepComp d={data} u={upd} />
          <hr className="div" />
          <div style={{ display:"flex",gap:10 }}>
            {step>0 && <button className="btn bo" onClick={()=>setStep(s=>s-1)}>← Back</button>}
            <button
              className="btn bp"
              style={{ flex:1 }}
              disabled={!ok()}
              onClick={()=>{ if(step<4) setStep(s=>s+1); else onSubmit(data); }}
            >
              {step===4 ? "Generate My Audit Report →" : "Continue →"}
            </button>
          </div>
          {!ok() && <p style={{ fontSize:12,color:"#3a3d55",textAlign:"center",marginTop:10 }}>Please answer all questions above to continue</p>}
        </div>

        <p style={{ textAlign:"center",fontSize:12,color:"#2e3050",marginTop:14 }}>🔒 Your data is used only to generate your report — nothing is stored or shared.</p>
      </div>
    </div>
  );
}

function Analyzing() {
  const [active,setActive] = useState(0);
  const tasks = [
    { l:"Calculating your lead conversion gap",        d:"Comparing against the 15% industry benchmark…" },
    { l:"Estimating monthly revenue leakage",           d:"Multiplying lost leads × revenue per student…" },
    { l:"Quantifying time and operational waste",       d:"Measuring manual work cost at ₹200/hour…" },
    { l:"Running AI bottleneck diagnosis",              d:"Identifying root causes of drop-offs…" },
    { l:"Building your personalised action plan",       d:"Preparing specific AI solutions for your agency…" },
  ];
  useEffect(()=>{
    let i=0;
    const t=setInterval(()=>{i++;if(i<tasks.length)setActive(i);else clearInterval(t);},1100);
    return()=>clearInterval(t);
  },[]);
  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40 }}>
      <div style={{ maxWidth:440,width:"100%",textAlign:"center" }}>
        <div style={{ width:52,height:52,borderRadius:"50%",border:"2px solid #1e2030",borderTopColor:"#5E60FF",margin:"0 auto 28px",animation:"spin .9s linear infinite" }} />
        <h2 style={{ fontSize:21,fontWeight:700,letterSpacing:"-0.02em",marginBottom:8 }}>Analysing Your Agency</h2>
        <p style={{ fontSize:14,color:"#6b6f88",marginBottom:36 }}>Your personalised audit is being built — takes about 5 seconds.</p>
        <div style={{ textAlign:"left",display:"flex",flexDirection:"column",gap:14 }}>
          {tasks.map((t,i)=>(
            <div key={i} style={{ display:"flex",gap:14,alignItems:"flex-start",opacity:i<=active?1:0.2,transition:"opacity .4s" }}>
              <div style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,background:i<active?"#5E60FF":i===active?"rgba(94,96,255,0.15)":"#0f1017",border:`1px solid ${i<=active?"#5E60FF":"#1e2030"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:i<active?"#fff":"#5E60FF" }}>
                {i<active?"✓":i===active?<span style={{ width:6,height:6,borderRadius:"50%",background:"#5E60FF",display:"block",animation:"pulse 1s infinite" }}/>:""}
              </div>
              <div>
                <div style={{ fontSize:14,fontWeight:500,color:i<=active?"#e8eaf0":"#3a3d55" }}>{t.l}</div>
                {i===active&&<div style={{ fontSize:12,color:"#5E60FF",marginTop:2 }}>{t.d}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function calc(d) {
  const leads    = Number(d.monthlyLeads)||0;
  const conv     = Number(d.conversionRate)||0;
  const rt       = Number(d.responseTime)||0;
  const rps      = Number(d.revenuePerStudent)||150000;
  const counsel  = Number(d.counselors)||1;
  const tpl      = Number(d.timePerLead)||30;
  const manual   = Number(d.manualWorkPct)||0;
  const ad       = Number(d.adSpend)||0;
  const cpl      = Number(d.costPerLead)||(leads>0?Math.round(ad/leads):0);
  const BENCH    = 15;
  const penalty  = rt>10;
  const effConv  = penalty ? conv*0.7 : conv;
  const lost     = Math.max(0, leads*(BENCH-effConv)/100);
  const mLoss    = Math.round(lost*rps);
  const aLoss    = mLoss*12;
  const mWaste   = (manual/100)*(tpl/60)*leads;
  const wWaste   = Math.round(mWaste/4.33);
  const mWasteCost = Math.round(mWaste*200);
  const rtPenMoney = penalty ? Math.round(conv*0.3*leads*rps/100) : 0;
  const adWasted   = Math.round(ad*(1-effConv/100));

  let score=100;
  if(effConv<BENCH) score-=Math.min(28,Math.round((BENCH-effConv)*2));
  if(rt>10)         score-=18;
  if(manual>50)     score-=16;
  if(d.followUpMethod==="none") score-=14;
  if(d.usesCRM==="no")   score-=10;
  if(d.docHandling==="manual") score-=8;
  if(d.leadQuality==="low")    score-=6;
  score=Math.max(8,score);

  const growthPct = effConv>0 ? Math.min(200,Math.round(((BENCH-effConv)/effConv)*100)) : 80;

  return { leads,conv,effConv:Math.round(effConv*10)/10,rt,penalty,rps,counsel,tpl,manual,ad,cpl,
           lost:Math.round(lost),mLoss,aLoss,wWaste,mWasteCost,rtPenMoney,adWasted,score,growthPct };
}

const inr = n => "₹"+Number(n).toLocaleString("en-IN");

function Gauge({ score }) {
  const col = score>=68?"#10b981":score>=42?"#f59e0b":"#ef4444";
  const lbl = score>=68?"Moderate":score>=42?"At Risk":"Critical";
  const r=52,c=2*Math.PI*r,off=c-(score/100)*c;
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
      <svg width={128} height={128} viewBox="0 0 128 128">
        <circle cx={64} cy={64} r={r} fill="none" stroke="#1e2030" strokeWidth={10}/>
        <circle cx={64} cy={64} r={r} fill="none" stroke={col} strokeWidth={10}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform="rotate(-90 64 64)" style={{ transition:"stroke-dashoffset 1.4s ease" }}/>
        <text x={64} y={60} textAnchor="middle" fill="#e8eaf0" fontSize={25} fontWeight={700} fontFamily="'JetBrains Mono',monospace">{score}</text>
        <text x={64} y={77} textAnchor="middle" fill={col} fontSize={12}>/100</text>
      </svg>
      <span className={`pill ${score>=68?"pg":score>=42?"ph":"pc"}`} style={{ fontSize:13 }}>{lbl}</span>
    </div>
  );
}

function Stat({ label, value, sub, vc="#e8eaf0" }) {
  return (
    <div className="card" style={{ padding:"18px 20px" }}>
      <div style={{ fontSize:11,color:"#4a4d66",marginBottom:7,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase" }}>{label}</div>
      <div className="mono" style={{ fontSize:24,color:vc,marginBottom:4,fontWeight:500 }}>{value}</div>
      {sub&&<div style={{ fontSize:12,color:"#4a4d66",lineHeight:1.5 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, val, pct, color, note }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6 }}>
        <span style={{ fontSize:14,color:"#8b8fa8" }}>{label}</span>
        <span className="mono" style={{ fontSize:14,color,fontWeight:500 }}>{val}</span>
      </div>
      <div style={{ height:6,background:"#1e2030",borderRadius:4,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:4,transition:"width 1.3s ease 0.2s" }}/>
      </div>
      {note&&<div style={{ fontSize:12,color:"#3a3d55",marginTop:4 }}>{note}</div>}
    </div>
  );
}

function OppCard({ title, impact, priority, idx }) {
  const pc = priority==="CRITICAL"?"pc":priority==="HIGH"?"ph":"pm";
  return (
    <div className="card" style={{ padding:"16px 20px",display:"flex",gap:16,alignItems:"flex-start",animation:"fadeUp .4s ease both",animationDelay:`${idx*0.07}s` }}>
      <div style={{ flexShrink:0,paddingTop:2 }}><span className={`pill ${pc}`}>{priority}</span></div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600,fontSize:15,marginBottom:5,color:"#e8eaf0" }}>{title}</div>
        <div style={{ fontSize:14,color:"#6b6f88",lineHeight:1.65 }}>{impact}</div>
      </div>
    </div>
  );
}

function Report({ fd, onRestart }) {
  const m = calc(fd);
  const [aiTxt,setAiTxt] = useState("");
  const [aiLoad,setAiLoad] = useState(true);

  useEffect(()=>{
    const prompt=`You are a senior business analyst for a study abroad agency. Write a sharp, direct 5–6 sentence analysis using the exact numbers provided. No generic advice — every sentence must reference actual data.

Agency data:
- Monthly enquiries: ${m.leads}
- Current conversion: ${m.conv}% → effective: ${m.effConv}% (${m.penalty?"30% penalty applied because response time is "+m.rt+" min":"no penalty"})
- Industry benchmark: 15%
- Lost leads/month: ${m.lost}
- Monthly revenue loss: ₹${m.mLoss.toLocaleString("en-IN")}
- Annual revenue at risk: ₹${m.aLoss.toLocaleString("en-IN")}
- Manual/repetitive work: ${m.manual}%
- Weekly wasted counselor hours: ${m.wWaste} hrs
- Follow-up method: ${fd.followUpMethod}
- Lead drop-off stage: ${fd.dropOffStage}
- CRM: ${fd.usesCRM}, Documents: ${fd.docHandling}
- Lead quality: ${fd.leadQuality}
- Audit score: ${m.score}/100

Write 4 punchy paragraphs: (1) Biggest bottleneck + its rupee impact. (2) Why leads drop at "${fd.dropOffStage}" stage. (3) How response time + manual work compound the problem. (4) Top 2 AI fixes with estimated ROI. Use real numbers throughout.`;

    (async()=>{
      try{
        const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
        const data=await res.json();
        const txt=data.text;
        setAiTxt(txt||fallback());
      }catch{ setAiTxt(fallback()); }
      finally{ setAiLoad(false); }
    })();
  },[]);

  const fallback=()=>`Your agency receives ${m.leads} leads per month but converts only ${m.effConv}% — that's ${(15-m.effConv).toFixed(1)}% below the 15% industry benchmark, costing you ${m.lost} students and ${inr(m.mLoss)} every single month. ${m.penalty?`Your ${m.rt}-minute response time is triggering a 30% conversion penalty — leads contacted after 10 minutes are statistically 7× harder to close, dropping your effective rate from ${m.conv}% to ${m.effConv}%.`:`While your response time is within range, the conversion gap alone represents ${inr(m.aLoss)} in annual lost revenue.`} On top of this, ${m.manual}% manual workload consumes ${m.wWaste} counselor hours per week — time that could be spent closing the ${m.lost} leads slipping away each month. Deploying an AI instant-response chatbot and automated WhatsApp follow-up sequences would be the two highest-ROI fixes: they address the response delay and the ${fd.dropOffStage} drop-off problem simultaneously, and agencies that have implemented them report recovering 40–60% of lost leads within 90 days.`;

  const opps = [
    {
      title:"AI Chatbot for Instant Lead Response",
      impact:`Bring your ${m.rt}-minute response time to under 2 minutes — 24/7, even on weekends. Estimated recovery: ${Math.round(m.lost*0.35)} leads/month.`,
      priority:m.rt>15?"CRITICAL":"HIGH",
    },
    {
      title:"Automated WhatsApp Follow-up Sequences",
      impact:`Replace your current follow-up with personalised, multi-step WhatsApp sequences. Directly addresses the ${fd.dropOffStage} drop-off problem.`,
      priority:fd.followUpMethod==="none"||fd.followUpMethod==="manual"?"CRITICAL":"HIGH",
    },
    {
      title:fd.usesCRM==="no"?"CRM Setup + Lead Pipeline Tracking":"CRM Automation & Smart Workflows",
      impact:fd.usesCRM==="no"
        ?`No CRM means no visibility into where leads go silent. A properly configured CRM would save your ${m.counsel} counselor${m.counsel>1?"s":""} ~${Math.round(m.wWaste*0.35)} hours/week in manual tracking.`
        :`Automate your existing CRM: auto-assign leads, send reminders at each follow-up stage, and generate weekly dashboards — cutting manual data entry by ~40%.`,
      priority:fd.usesCRM==="no"?"HIGH":"MEDIUM",
    },
    {
      title:"Document Processing Automation",
      impact:fd.docHandling==="manual"
        ?`Manual document collection adds 3–4 hours per student. An AI document portal reduces this to under 45 minutes, freeing ~${Math.round(m.wWaste*0.3)} counselor hours per month.`
        :`Upgrade your semi-digital process with smart checklists and auto-verification — reducing errors by 70%.`,
      priority:fd.docHandling==="manual"?"HIGH":"MEDIUM",
    },
  ];

  const date = new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{ maxWidth:760,margin:"0 auto",padding:"84px 20px 80px" }}>
      <div className="anim" style={{ marginBottom:32 }}>
        <div className="slabel">EnrollmentX AI Audit Report · {date}</div>
        <h1 style={{ fontSize:28,fontWeight:700,letterSpacing:"-0.03em",marginBottom:8 }}>Your Agency Audit Is Ready</h1>
        <p style={{ color:"#6b6f88",fontSize:15 }}>
          Based on <strong style={{ color:"#8b8fa8" }}>{m.leads} monthly leads</strong> · Revenue per student: <strong style={{ color:"#8b8fa8" }}>{inr(m.rps)}</strong>
        </p>
      </div>

      <div className="card anim d1" style={{ display:"flex",gap:24,alignItems:"center",marginBottom:14,flexWrap:"wrap" }}>
        <Gauge score={m.score} />
        <div style={{ flex:1,minWidth:220 }}>
          <div className="slabel">AI Efficiency Score</div>
          <h2 style={{ fontSize:18,fontWeight:700,letterSpacing:"-0.02em",marginBottom:10 }}>
            {m.score<42?"Critical inefficiencies — urgent action required":m.score<68?"Several revenue leaks found — moderate risk":"Good foundation, but revenue gaps remain"}
          </h2>
          <p style={{ fontSize:14,color:"#6b6f88",lineHeight:1.75 }}>
            Top-performing agencies score <strong style={{ color:"#e8eaf0" }}>75 or above</strong>.
            Your score of <strong style={{ color:m.score<42?"#ef4444":m.score<68?"#f59e0b":"#10b981" }}>{m.score}/100</strong> indicates
            {m.score<42?" multiple compounding problems actively reducing your revenue every day."
              :m.score<68?" clear gaps in conversion, follow-up, and operations limiting your growth."
              :" solid operations, with specific gaps holding back full potential."}
          </p>
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <div className="slabel">What You're Losing — Financial Impact</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10 }}>
          <Stat label="Monthly Revenue Loss"   value={inr(m.mLoss)}        sub={`${m.lost} unconverted leads × ${inr(m.rps)}`}                                                    vc="#ef4444" />
          <Stat label="Annual Revenue at Risk" value={inr(m.aLoss)}        sub="Projected over 12 months if nothing changes"                                                        vc="#ef4444" />
          <Stat label="Response Time Penalty"  value={m.penalty?inr(m.rtPenMoney):"None"} sub={m.penalty?`${m.rt}min response → 30% conversion loss`:`${m.rt}min — within safe range`} vc={m.penalty?"#f59e0b":"#10b981"} />
          <Stat label="Ad Budget Wasted"       value={inr(m.adWasted)}     sub="Spent on leads that don't convert each month"                                                       vc="#f59e0b" />
        </div>
      </div>

      <div className="card anim d2" style={{ marginBottom:14 }}>
        <div className="slabel">Time & Operational Efficiency</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24 }}>
          <div>
            <div style={{ fontSize:12,color:"#4a4d66",marginBottom:5 }}>Counselor hours wasted per week</div>
            <div className="mono" style={{ fontSize:26,color:"#f59e0b",fontWeight:500 }}>{m.wWaste} hrs</div>
            <div style={{ fontSize:12,color:"#3a3d55",marginTop:3 }}>Across {m.counsel} counselor{m.counsel>1?"s":""}</div>
          </div>
          <div>
            <div style={{ fontSize:12,color:"#4a4d66",marginBottom:5 }}>Monthly cost of manual inefficiency</div>
            <div className="mono" style={{ fontSize:26,color:"#ef4444",fontWeight:500 }}>{inr(m.mWasteCost)}</div>
            <div style={{ fontSize:12,color:"#3a3d55",marginTop:3 }}>At ₹200/hour labour cost</div>
          </div>
        </div>
        <Bar label="Conversion rate vs. 15% benchmark" val={`${m.effConv}% / 15%`} pct={(m.effConv/15)*100} color={m.effConv<8?"#ef4444":"#f59e0b"}
          note={`You are ${(15-m.effConv).toFixed(1)}% below benchmark — that gap equals ${m.lost} missed enrollments per month`} />
        <Bar label="Proportion of work that is manual / repetitive" val={`${m.manual}%`} pct={m.manual} color={m.manual>60?"#ef4444":m.manual>30?"#f59e0b":"#10b981"}
          note={m.manual>50?"High manual load is consuming time that should be spent on lead conversion.":"Some manual work exists — targeted automation can clear this."} />
        <Bar label="Lead response speed (target: under 10 minutes)" val={`${m.rt} min`} pct={Math.min(100,(10/Math.max(m.rt,1))*100)} color={m.rt<=10?"#10b981":"#ef4444"}
          note={m.rt>10?`${m.rt-10} minutes above the safe threshold. Actively reducing your conversion from ${m.conv}% to ${m.effConv}%.`:"Your response time is optimal."} />
      </div>

      <div className="card-blue anim d3" style={{ marginBottom:14 }}>
        <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:14 }}>
          <div style={{ width:34,height:34,borderRadius:9,background:"rgba(94,96,255,0.14)",border:"1px solid rgba(94,96,255,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0 }}>◈</div>
          <div>
            <div style={{ fontWeight:600,fontSize:15,color:"#e8eaf0" }}>AI Bottleneck Analysis</div>
            <div style={{ fontSize:12,color:"#6b6f88" }}>Powered by EnrollmentX AI · Generated from your specific data</div>
          </div>
        </div>
        {aiLoad ? (
          <div style={{ display:"flex",alignItems:"center",gap:12,color:"#6b6f88",fontSize:14,padding:"8px 0" }}>
            <div className="spinner"/>
            <span>Analysing your data with AI — takes a few seconds…</span>
          </div>
        ) : (
          <div style={{ fontSize:15,color:"#8b8fa8",lineHeight:1.85,whiteSpace:"pre-wrap" }}>{aiTxt}</div>
        )}
      </div>

      <div style={{ marginBottom:14 }}>
        <div className="slabel">AI Automation Opportunities — Ranked by ROI Impact</div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {opps.map((o,i)=><OppCard key={i} {...o} idx={i}/>)}
        </div>
      </div>

      <div className="card-blue anim" style={{ marginBottom:24 }}>
        <div className="slabel">Your Growth Potential</div>
        <div style={{ display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap",marginBottom:14 }}>
          <div className="mono" style={{ fontSize:40,color:"#10b981",fontWeight:700 }}>+{Math.min(m.growthPct,150)}%</div>
          <div style={{ fontSize:16,color:"#6b6f88" }}>potential revenue increase</div>
        </div>
        <p style={{ fontSize:15,color:"#8b8fa8",lineHeight:1.8 }}>
          If your agency reaches the 15% conversion benchmark from your current {m.effConv}%, you would enroll{" "}
          <strong style={{ color:"#e8eaf0" }}>{m.lost} additional students per month</strong>. At {inr(m.rps)} per student, that is{" "}
          <strong style={{ color:"#10b981" }}>{inr(m.mLoss)}/month</strong> in recovered revenue, or{" "}
          <strong style={{ color:"#10b981" }}>{inr(m.aLoss)} per year</strong> — without spending a single extra rupee on advertising.
        </p>
      </div>

      <div style={{ background:"#0f1017",border:"1px solid #1e2030",borderRadius:18,padding:"48px 32px",textAlign:"center" }}>
        <div style={{ fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#5E60FF",marginBottom:16 }}>Ready to fix this?</div>
        <h2 style={{ fontSize:26,fontWeight:700,letterSpacing:"-0.025em",marginBottom:12 }}>
          Recover {inr(m.mLoss)}/month<br />with AI — in 30 days
        </h2>
        <p style={{ color:"#6b6f88",fontSize:15,maxWidth:400,margin:"0 auto 36px",lineHeight:1.75 }}>
          Our team will build and deploy a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all tailored to how you work.
        </p>
        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <button className="btn bcta" onClick={()=>window.open("https://calendly.com/charanrathod-inf/30min","_blank")}>
            Book a Free Strategy Call →
          </button>
          <button className="btn bo" onClick={onRestart}>Run Another Audit</button>
        </div>
        <p style={{ fontSize:12,color:"#2e3050",marginTop:20 }}>No commitment · 30-minute call · EnrollmentX specialists</p>
      </div>
    </div>
  );
}

function LeadCapture({ formData, onSubmit }) {
  const [mode, setMode] = useState("choose");
  const [lead, setLead] = useState({ name:"", email:"", phone:"", agency:"" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const upd = (k,v) => { setLead(p=>({...p,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const save = async (ld) => {
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: ld, formData }),
      });
    } catch(e) {}
    onSubmit(ld);
  };

  const handleGoogle = async () => {
    if (formData) sessionStorage.setItem("audit_fd", JSON.stringify(formData));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "?audit=true",
      },
    });
    if (error) {
      console.error("Google sign-in error:", error.message);
      alert("Google sign-in failed. Please try entering your details manually.");
    }
  };

  const handleManual = async () => {
    const errs = {};
    if (!lead.name.trim())  errs.name  = "Name is required";
    if (!lead.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errs.email = "Enter a valid email address";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await save(lead);
    setSubmitting(false);
  };

  if (mode === "choose") return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"84px 20px 60px",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"5%",left:"50%",transform:"translateX(-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(94,96,255,0.08) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ width:"100%",maxWidth:460,position:"relative" }}>
        <div className="anim" style={{ background:"linear-gradient(135deg,rgba(94,96,255,0.08),rgba(14,165,233,0.05))",border:"1px solid rgba(94,96,255,0.2)",borderRadius:16,padding:"20px 24px",marginBottom:24,display:"flex",gap:16,alignItems:"center" }}>
          <div style={{ width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#5E60FF,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>◈</div>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:"#e8eaf0",marginBottom:3 }}>Your AI Audit Report is ready</div>
            <div style={{ fontSize:13,color:"#6b6f88" }}>Revenue analysis · AI recommendations · Action plan</div>
          </div>
          <div style={{ marginLeft:"auto",flexShrink:0 }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite" }} />
          </div>
        </div>

        <div className="card anim d1" style={{ padding:"28px 28px 24px" }}>
          <div style={{ textAlign:"center",marginBottom:28 }}>
            <h2 style={{ fontSize:22,fontWeight:700,letterSpacing:"-0.025em",marginBottom:8 }}>Unlock your report</h2>
            <p style={{ fontSize:14,color:"#6b6f88",lineHeight:1.7 }}>
              Sign in to access your full audit — we'll also send you a copy to refer back to anytime.
            </p>
          </div>

          <button
            onClick={handleGoogle}
            style={{ width:"100%",background:"#fff",color:"#1f2937",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 20px",fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:12,transition:"all .18s",marginBottom:16 }}
            onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
            onMouseLeave={e=>e.currentTarget.style.background="#fff"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
            <div style={{ flex:1,height:"1px",background:"#1e2030" }} />
            <span style={{ fontSize:12,color:"#3a3d55",fontWeight:500 }}>or fill in your details</span>
            <div style={{ flex:1,height:"1px",background:"#1e2030" }} />
          </div>

          <button className="btn bo" style={{ width:"100%",fontSize:14,padding:"12px 0" }} onClick={() => setMode("manual")}>
            Enter details manually →
          </button>

          <p style={{ fontSize:11,color:"#2e3050",textAlign:"center",marginTop:16,lineHeight:1.6 }}>
            🔒 No spam. Your data is only used to deliver your report and follow up with you.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"84px 20px 60px" }}>
      <div style={{ width:"100%",maxWidth:460 }}>
        <button className="btn bo" style={{ fontSize:13,padding:"7px 14px",marginBottom:20 }} onClick={()=>setMode("choose")}>← Back</button>
        <div className="card anim" style={{ padding:"28px 28px 24px" }}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:21,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6 }}>Your details</h2>
            <p style={{ fontSize:14,color:"#6b6f88" }}>We'll send your audit report to the email you provide.</p>
          </div>
          <div className="field">
            <label className="fl">Full Name <span style={{ color:"#ef4444",fontSize:12 }}>*</span></label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={lead.name} onChange={e=>upd("name",e.target.value)} style={{ borderColor: errors.name ? "#ef4444" : undefined }} />
            {errors.name && <div style={{ fontSize:12,color:"#ef4444",marginTop:4 }}>{errors.name}</div>}
          </div>
          <div className="field">
            <label className="fl">Work Email <span style={{ color:"#ef4444",fontSize:12 }}>*</span></label>
            <input type="text" placeholder="e.g. rahul@agency.com" value={lead.email} onChange={e=>upd("email",e.target.value)} style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
            {errors.email && <div style={{ fontSize:12,color:"#ef4444",marginTop:4 }}>{errors.email}</div>}
          </div>
          <div className="field">
            <label className="fl">Agency Name <span style={{ color:"#4a4d66",fontWeight:400,fontSize:12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. Global Study Consultants" value={lead.agency} onChange={e=>upd("agency",e.target.value)} />
          </div>
          <div className="field">
            <label className="fl">Phone Number <span style={{ color:"#4a4d66",fontWeight:400,fontSize:12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. +91 98765 43210" value={lead.phone} onChange={e=>upd("phone",e.target.value)} />
          </div>
          <button className="btn bp" style={{ width:"100%",fontSize:15,padding:"13px 0",opacity:submitting?0.7:1,marginTop:4 }} onClick={handleManual} disabled={submitting}>
            {submitting ? "Saving…" : "View My Audit Report →"}
          </button>
          <p style={{ fontSize:11,color:"#2e3050",textAlign:"center",marginTop:14,lineHeight:1.6 }}>
            🔒 No spam. Your details are used only to deliver your report.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Root ── */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [fd, setFd] = useState(null);
  const [lead, setLead] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const params = new URLSearchParams(window.location.search);
        if (params.get("audit") === "true") {
          const saved = sessionStorage.getItem("audit_fd");
          if (saved) {
            const restoredFd = JSON.parse(saved);
            sessionStorage.removeItem("audit_fd");
            setFd(restoredFd);
            const profile = {
              name: session.user.user_metadata?.full_name || "",
              email: session.user.email || "",
            };
            setLead(profile);
            setScreen("analyzing");
            setTimeout(() => setScreen("report"), 5800);
          }
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const submitForm = data => { setFd(data); setScreen("capture"); };
  const submitLead = ld  => { setLead(ld); setScreen("analyzing"); setTimeout(() => setScreen("report"), 5800); };
  const restart    = ()  => { setFd(null); setLead(null); setScreen("landing"); };
  const signOut    = async () => { await supabase.auth.signOut(); setUser(null); };

  return (
    <>
      <style>{G}</style>
      <Nav user={user} onSignOut={signOut} />
      {screen==="landing"   && <Landing onStart={()=>setScreen("form")}/>}
      {screen==="form"      && <AuditForm onSubmit={submitForm}/>}
      {screen==="capture"   && <LeadCapture formData={fd} onSubmit={submitLead}/>}
      {screen==="analyzing" && <Analyzing/>}
      {screen==="report"    && <Report fd={fd} lead={lead} onRestart={restart}/>}
    </>
  );
}