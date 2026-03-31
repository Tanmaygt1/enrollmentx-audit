"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #07080f;
    --bg-card:   #0d0f1a;
    --bg-card2:  #0a0c16;
    --border:    #1a1d2e;
    --border-hi: rgba(99,102,241,0.45);
    --t1:        #eceef8;
    --t2:        #7b80a0;
    --t3:        #3a3e58;
    --accent:    #6366f1;
    --accent2:   #06b6d4;
    --green:     #10b981;
    --yellow:    #f59e0b;
    --red:       #ef4444;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --r-sm:  8px;
    --r-md: 12px;
    --r-lg: 16px;
    --r-xl: 22px;
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--t1);
    font-family: var(--font-body);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e2140; border-radius: 4px; }

  /* ── Keyframes ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes scanline { 0%{top:0;opacity:.7;} 100%{top:100%;opacity:0;} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 18px rgba(99,102,241,0.22);} 50%{box-shadow:0 0 32px rgba(99,102,241,0.42);} }
  @keyframes shimmer  {
    0%   { background-position:-600px 0; }
    100% { background-position:600px 0; }
  }
  @keyframes countUp  { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
  @keyframes borderPulse { 0%,100%{border-color:rgba(99,102,241,0.2);} 50%{border-color:rgba(99,102,241,0.55);} }

  .anim    { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .d1      { animation-delay: 0.07s; }
  .d2      { animation-delay: 0.14s; }
  .d3      { animation-delay: 0.21s; }
  .d4      { animation-delay: 0.28s; }
  .d5      { animation-delay: 0.35s; }

  /* ── Cards ── */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 22px;
  }
  .card-accent {
    background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(6,182,212,0.04) 100%);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: var(--r-lg);
    padding: 22px;
  }
  .card-glow {
    background: var(--bg-card);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: var(--r-lg);
    padding: 22px;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.08), 0 8px 32px rgba(0,0,0,0.35);
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 12px 22px; border-radius: var(--r-md);
    font-size: 15px; font-weight: 500; cursor: pointer;
    font-family: var(--font-body); transition: all 0.18s; border: none;
    letter-spacing: -0.01em; white-space: nowrap;
  }
  .bp {
    background: var(--accent); color: #fff;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.4);
  }
  .bp:hover {
    background: #5254cc; transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 6px 24px rgba(99,102,241,0.3);
  }
  .bp:active { transform: translateY(0) scale(0.99); }
  .bp:disabled {
    background: #1a1d2e; color: var(--t3);
    cursor: not-allowed; transform: none; box-shadow: none;
  }
  .bo {
    background: transparent; color: var(--t2);
    border: 1px solid var(--border);
  }
  .bo:hover { border-color: var(--accent); color: #a5b4fc; }
  .bcta {
    background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
    color: #fff; font-family: var(--font-head);
    font-size: 16px; padding: 15px 36px;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.4), 0 4px 24px rgba(99,102,241,0.25);
    font-weight: 700; letter-spacing: -0.01em;
  }
  .bcta:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 10px 36px rgba(99,102,241,0.35);
  }
  .bcta:active { transform: translateY(0) scale(0.99); }

  /* ── Form elements ── */
  .fl  { display:block; font-size:13px; font-weight:500; color:var(--t2); margin-bottom:7px; letter-spacing:0.01em; }
  .fh  { font-size:12px; color:var(--t3); margin-top:5px; line-height:1.55; }

  input[type=number], input[type=text], select {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    color: var(--t1);
    padding: 12px 14px;
    font-size: 15px;
    font-family: var(--font-body);
    transition: border-color .2s, box-shadow .2s, background .2s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    background: rgba(99,102,241,0.04);
  }
  input::placeholder { color: var(--t3); }
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath fill='none' stroke='%237b80a0' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  select option { background: #0d0f1a; }

  /* ── Choice buttons ── */
  .choice-grid { display:flex; flex-wrap:wrap; gap:8px; }
  .cb {
    background: rgba(255,255,255,0.025);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 9px 15px;
    font-size: 14px; color: var(--t3);
    cursor: pointer; transition: all .18s;
    font-family: var(--font-body);
  }
  .cb:hover { border-color: #2a2e4a; color: var(--t2); background: rgba(255,255,255,0.04); }
  .cb.sel {
    border-color: var(--accent);
    color: #a5b4fc;
    background: rgba(99,102,241,0.09);
  }
  .multi-hint { font-size:11px; color:var(--t3); margin-bottom:8px; display:flex; align-items:center; gap:5px; }

  /* ── Layout helpers ── */
  .field   { margin-bottom: 20px; }
  .slabel  { font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); margin-bottom:12px; }
  .mono    { font-family: var(--font-mono); letter-spacing:-0.03em; }

  /* ── Alerts ── */
  .note {
    background: rgba(99,102,241,0.07);
    border-left: 3px solid var(--accent);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    padding: 10px 14px; font-size:13px; color:#a5b4fc;
    margin-top: 8px; line-height: 1.55;
  }
  .warn {
    background: rgba(239,68,68,0.07);
    border-left: 3px solid var(--red);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    padding: 10px 14px; font-size:13px; color:#fca5a5;
    margin-top: 8px; line-height: 1.55;
    display: flex; align-items: flex-start; gap: 10px;
  }

  hr.div { border:none; border-top:1px solid var(--border); margin:22px 0; }

  /* ── Step indicator ── */
  .sdot  { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; flex-shrink:0; transition:all .3s; }
  .sline { flex:1; height:1px; background:var(--border); }
  .sline.on { background: linear-gradient(90deg, var(--green), var(--accent)); }

  /* ── Spinner ── */
  .spinner { width:20px; height:20px; border-radius:50%; border:2px solid #1e2140; border-top-color:var(--accent); animation:spin .7s linear infinite; flex-shrink:0; }

  /* ── Pills ── */
  .pill { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:100px; font-size:12px; font-weight:500; }
  .pc  { background:rgba(239,68,68,.12);  color:#fca5a5; border:1px solid rgba(239,68,68,.22); }
  .ph  { background:rgba(245,158,11,.12); color:#fcd34d; border:1px solid rgba(245,158,11,.22); }
  .pm  { background:rgba(99,102,241,.12); color:#a5b4fc; border:1px solid rgba(99,102,241,.22); }
  .pg  { background:rgba(16,185,129,.12); color:#6ee7b7; border:1px solid rgba(16,185,129,.22); }

  /* ── Nav ── */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    background: rgba(7,8,15,0.82);
    backdrop-filter: blur(16px) saturate(1.6);
    -webkit-backdrop-filter: blur(16px) saturate(1.6);
    border-bottom: 1px solid var(--border);
    display:flex; align-items:center;
    padding: 0 28px; height:60px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function toggleMulti(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}
function hasVal(data, field, val) {
  return (Array.isArray(data[field]) ? data[field] : []).includes(val);
}
function joinField(data, field) {
  const arr = Array.isArray(data[field]) ? data[field] : data[field] ? [data[field]] : [];
  return arr.join(", ") || "not specified";
}
const inr = n => "₹" + Number(n).toLocaleString("en-IN");

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function CB({ val, label, hint, field, data, upd }) {
  return (
    <button className={`cb ${data[field] === val ? "sel" : ""}`} onClick={() => upd(field, val)}>
      {label}
      {hint && <span style={{ color: data[field] === val ? "#6e71c4" : "var(--t3)", marginLeft: 5, fontSize: 12 }}>{hint}</span>}
    </button>
  );
}

function MCB({ val, label, hint, field, data, upd }) {
  const selected = hasVal(data, field, val);
  return (
    <button
      className={`cb ${selected ? "sel" : ""}`}
      onClick={() => upd(field, toggleMulti(data, field, val))}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{
          width: 13, height: 13, borderRadius: 3, flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${selected ? "var(--accent)" : "#2a2e4a"}`,
          background: selected ? "var(--accent)" : "transparent",
          transition: "all .15s",
        }}>
          {selected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
        {label}
      </span>
      {hint && <span style={{ color: selected ? "#6e71c4" : "var(--t3)", marginLeft: 5, fontSize: 12 }}>{hint}</span>}
    </button>
  );
}

function Logo({ size = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: size + 10, height: size + 10, borderRadius: 9,
        background: "linear-gradient(135deg, #6366f1, #06b6d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.72, fontWeight: 800, color: "#fff", flexShrink: 0,
        fontFamily: "'Syne', sans-serif",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 0 18px rgba(99,102,241,0.28)",
      }}>E</div>
      <span style={{ fontSize: size + 1, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--t1)", fontFamily: "'Syne', sans-serif" }}>
        Enrollment<span style={{ color: "var(--accent)" }}>X</span>
      </span>
    </div>
  );
}

function Nav({ user, onSignOut }) {
  return (
    <nav className="nav">
      <Logo />
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <>
            <span style={{ fontSize: 13, color: "var(--t3)" }}>{user.email}</span>
            <button className="btn bo" style={{ fontSize: 13, padding: "6px 14px" }} onClick={onSignOut}>Sign out</button>
          </>
        )}
        {!user && (
          <div style={{
            fontSize: 12, color: "var(--t3)", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>AI Audit System</div>
        )}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING
// ─────────────────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "100px 24px 60px", position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow blobs */}
      <div style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)", width:800, height:400, background:"radial-gradient(ellipse,rgba(99,102,241,0.11) 0%,transparent 68%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"15%", left:"15%", width:300, height:300, background:"radial-gradient(ellipse,rgba(6,182,212,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"20%", right:"10%", width:260, height:260, background:"radial-gradient(ellipse,rgba(239,68,68,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />

      {/* Subtle grid overlay */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", opacity:0.025,
        backgroundImage:"linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
        backgroundSize:"48px 48px",
      }} />

      <div style={{ maxWidth: 680, textAlign: "center", position: "relative" }}>

        {/* Badge */}
        <div className="anim" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(99,102,241,0.09)", border: "1px solid rgba(99,102,241,0.22)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          animation: "borderPulse 3s ease infinite",
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--accent)", animation:"pulse 2s infinite", display:"inline-block" }} />
          <span style={{ fontSize:13, color:"#a5b4fc", fontWeight:500 }}>Free · No credit card · 2 minutes</span>
        </div>

        {/* Headline */}
        <h1 className="anim d1" style={{
          fontSize: "clamp(30px,5.2vw,58px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.035em",
          marginBottom: 22,
          fontFamily: "'Syne', sans-serif",
        }}>
          Most study abroad agencies<br />lose ₹2Cr+ a year.
          <br />
          <span style={{ background:"linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            We'll show you exactly where yours goes.
          </span>
        </h1>

        {/* Sub */}
        <p className="anim d2" style={{ fontSize:17, color:"var(--t2)", lineHeight:1.85, maxWidth:510, margin:"0 auto 42px" }}>
          Answer 12 questions. Get a ₹-specific breakdown of every revenue leak, every wasted hour, and a ranked AI fix plan — built for your agency, not a template.
        </p>

        {/* CTA */}
        <div className="anim d3" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
          <button className="btn bcta" onClick={onStart}>Start My Free Audit →</button>
          <p style={{ fontSize:13, color:"var(--t3)" }}>Takes 2–3 minutes · 100% confidential · Instant results</p>
        </div>

        {/* Stats bar */}
        <div className="anim d4" style={{
          display:"flex", gap:0, justifyContent:"center",
          marginTop:60, borderTop:"1px solid var(--border)", paddingTop:40, flexWrap:"wrap",
        }}>
          {[
            ["₹2.4Cr+", "Average leak found in first 200 audits"],
            ["87%",     "Of agencies miss key AI opportunities"],
            ["2–3 min", "To get your full personalised report"],
          ].map(([n, d]) => (
            <div key={n} style={{ flex:1, minWidth:150, textAlign:"center", padding:"0 20px" }}>
              <div className="mono" style={{ fontSize:28, fontWeight:500, color:"var(--t1)", fontFamily:"var(--font-head)" }}>{n}</div>
              <div style={{ fontSize:13, color:"var(--t3)", marginTop:6, lineHeight:1.55 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT FORM — Steps
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { title: "Lead Generation",    sub: "How enquiries come in and how fast you respond" },
  { title: "Sales & Follow-up",  sub: "How your team handles and converts leads" },
  { title: "Team & Time",        sub: "Your team size and how counselor time is spent" },
  { title: "Marketing & Budget", sub: "Your ad spend and cost per lead" },
  { title: "Operations & Tools", sub: "Systems and tools your agency currently uses" },
];

function WarnBox({ children }) {
  return (
    <div className="warn">
      <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--red)", marginTop:5, flexShrink:0, animation:"pulse 1.5s infinite" }} />
      <span>{children}</span>
    </div>
  );
}

function Step0({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How many enquiries / leads does your agency receive per month?</label>
      <input type="number" min="0" placeholder="e.g. 150" value={d.monthlyLeads || ""} onChange={e => u("monthlyLeads", e.target.value)} />
      <p className="fh">Count all channels: walk-ins, calls, WhatsApp, website forms, social media DMs, etc.</p>
    </div>

    <div className="field">
      <label className="fl">Where do most of your leads come from?</label>
      <p className="multi-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="#3a3e58" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="#3a3e58" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        {[
          ["ads",      "Paid Ads",     "— Google, Meta / Instagram"],
          ["referrals","Referrals",    "— past students or partners"],
          ["organic",  "Organic / SEO","— website & search"],
          ["walk-ins", "Walk-ins",     "— in-person enquiries"],
          ["social",   "Social Media", "— YouTube, Instagram content"],
        ].map(([v, l, h]) => <MCB key={v} val={v} label={l} hint={h} field="leadSource" data={d} upd={u} />)}
      </div>
    </div>

    <div className="field">
      <label className="fl">How long does it typically take to respond to a new enquiry? (minutes)</label>
      <input type="number" min="0" placeholder="e.g. 30" value={d.responseTime || ""} onChange={e => u("responseTime", e.target.value)} />
      <p className="fh">Be honest — if it takes 2 hours, enter 120. This is one of the biggest revenue levers.</p>
      {Number(d.responseTime) > 10 && (
        <WarnBox>
          <strong style={{ color:"#fca5a5" }}>7× harder to close.</strong> Leads contacted after 10 minutes are statistically 7× less likely to convert. Every minute costs real money.
        </WarnBox>
      )}
      {Number(d.responseTime) <= 10 && Number(d.responseTime) > 0 && (
        <div className="note">✓ You're within the optimal response window. This will boost your audit score.</div>
      )}
    </div>

    <div className="field">
      <label className="fl">What percentage of your leads actually enroll? (Conversion rate)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 8" value={d.conversionRate || ""} onChange={e => u("conversionRate", e.target.value)} />
      <p className="fh">If you sign up 10 students from 100 enquiries, that's 10%. Industry benchmark is 15%.</p>
      {Number(d.conversionRate) > 0 && Number(d.conversionRate) < 15 && (
        <WarnBox>
          You're <strong style={{ color:"#fca5a5" }}>{(15 - Number(d.conversionRate)).toFixed(1)}% below the 15% benchmark.</strong> This gap will be quantified in exact rupees in your report.
        </WarnBox>
      )}
    </div>
  </>;
}

function Step1({ d, u }) {
  const methods = Array.isArray(d.followUpMethod) ? d.followUpMethod : [];
  const noneSelected = methods.includes("none");

  return <>
    <div className="field">
      <label className="fl">How does your team follow up with leads after first contact?</label>
      <p className="multi-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="#3a3e58" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="#3a3e58" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        {[
          ["manual",   "Phone calls",       "— manual outreach"],
          ["whatsapp", "WhatsApp",          "— messages & follow-ups"],
          ["crm",      "CRM / Automation",  "— automated sequences"],
          ["email",    "Email",             "— campaigns or one-off"],
          ["none",     "No regular follow-up", ""],
        ].map(([v, l, h]) => <MCB key={v} val={v} label={l} hint={h} field="followUpMethod" data={d} upd={u} />)}
      </div>
      {noneSelected && <WarnBox>No follow-up process is one of the top 3 causes of revenue loss in study abroad agencies.</WarnBox>}
      {!noneSelected && methods.length >= 2 && (
        <div className="note">✓ Good — using {methods.length} follow-up channels increases your lead reach significantly.</div>
      )}
    </div>

    <div className="field">
      <label className="fl">On average, how many follow-ups do you make per lead before giving up?</label>
      <input type="number" min="0" placeholder="e.g. 3" value={d.followUpCount || ""} onChange={e => u("followUpCount", e.target.value)} />
      <p className="fh">Research shows 80% of sales require 5+ follow-ups. Most agencies stop at 1–2.</p>
      {Number(d.followUpCount) > 0 && Number(d.followUpCount) < 4 && (
        <div className="note">Most conversions happen on the 4th–7th contact. Increasing this is a quick win.</div>
      )}
    </div>

    <div className="field">
      <label className="fl">At which stage do most of your leads go cold?</label>
      <select value={d.dropOffStage || ""} onChange={e => u("dropOffStage", e.target.value)}>
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
      <input type="number" min="1" placeholder="e.g. 5" value={d.counselors || ""} onChange={e => u("counselors", e.target.value)} />
      <p className="fh">Include all staff who handle student enquiries, even part-time advisors.</p>
    </div>
    <div className="field">
      <label className="fl">On average, how many minutes per week does a counselor spend per active lead?</label>
      <input type="number" min="0" placeholder="e.g. 45" value={d.timePerLead || ""} onChange={e => u("timePerLead", e.target.value)} />
      <p className="fh">Include everything: calls, re-sending documents, updating records, answering the same questions.</p>
    </div>
    <div className="field">
      <label className="fl">What percentage of your team's daily work is repetitive and manual?</label>
      <input type="number" min="0" max="100" placeholder="e.g. 60" value={d.manualWorkPct || ""} onChange={e => u("manualWorkPct", e.target.value)} />
      <p className="fh">Re-sending brochures, updating spreadsheets, answering the same FAQs repeatedly.</p>
      {Number(d.manualWorkPct) > 50 && (
        <WarnBox>This is significantly above average. AI automation typically eliminates 60–70% of this workload.</WarnBox>
      )}
    </div>
  </>;
}

function Step3({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How much does your agency spend on advertising per month? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 50000" value={d.adSpend || ""} onChange={e => u("adSpend", e.target.value)} />
      <p className="fh">Include Google Ads, Meta / Instagram Ads, YouTube promotions, any paid campaigns.</p>
    </div>
    <div className="field">
      <label className="fl">What is your approximate cost per lead? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 333" value={d.costPerLead || ""} onChange={e => u("costPerLead", e.target.value)} />
      <p className="fh">Formula: Ad Spend ÷ Monthly Leads. Leave blank and we'll calculate it for you.</p>
    </div>
    <div className="field">
      <label className="fl">Overall quality of leads your agency receives?</label>
      <div className="choice-grid">
        <CB val="low"    label="Low"    hint="— mostly unserious enquiries"      field="leadQuality" data={d} upd={u} />
        <CB val="medium" label="Medium" hint="— mix of serious and casual"       field="leadQuality" data={d} upd={u} />
        <CB val="high"   label="High"   hint="— mostly ready-to-enroll students" field="leadQuality" data={d} upd={u} />
      </div>
    </div>
    <div className="field" style={{ marginTop:4 }}>
      <label className="fl">Average revenue your agency earns per enrolled student? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 150000" value={d.revenuePerStudent || ""} onChange={e => u("revenuePerStudent", e.target.value)} />
      <p className="fh">Include service fees, commissions, application fees. Default is ₹1,50,000 if blank.</p>
    </div>
  </>;
}

function Step4({ d, u }) {
  const docs = Array.isArray(d.docHandling) ? d.docHandling : [];
  const hasManual  = docs.includes("manual");
  const hasDigital = docs.includes("digital");

  return <>
    <div className="field">
      <label className="fl">How does your agency handle student documents?</label>
      <p className="multi-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="#3a3e58" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="#3a3e58" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        <MCB val="manual"  label="Paper / physical files"    hint="— printed docs, physical folders"       field="docHandling" data={d} upd={u} />
        <MCB val="email"   label="Email attachments"         hint="— docs sent back and forth by email"    field="docHandling" data={d} upd={u} />
        <MCB val="drive"   label="Cloud storage"             hint="— Google Drive, Dropbox, OneDrive"      field="docHandling" data={d} upd={u} />
        <MCB val="digital" label="Digital workflow / portal" hint="— structured checklists, auto-verify"   field="docHandling" data={d} upd={u} />
      </div>
      {hasManual && !hasDigital && <WarnBox>Manual document handling adds 3–4 hours per student on average.</WarnBox>}
      {hasDigital && <div className="note">✓ Digital document handling gives you a strong operational base.</div>}
      {hasManual && hasDigital && <div className="note">You're in transition — digitising the remaining manual steps will save significant counselor time.</div>}
    </div>

    <div className="field" style={{ marginTop:4 }}>
      <label className="fl">Does your agency use a CRM to track leads and follow-ups?</label>
      <div className="choice-grid">
        <CB val="yes"    label="Yes, actively" hint="— we track every lead"                            field="usesCRM" data={d} upd={u} />
        <CB val="partly" label="Partially"     hint="— we have one but use it inconsistently"          field="usesCRM" data={d} upd={u} />
        <CB val="no"     label="No CRM"        hint="— spreadsheets, WhatsApp, or nothing"             field="usesCRM" data={d} upd={u} />
      </div>
      {d.usesCRM === "no" && <WarnBox>Agencies without a CRM lose an estimated 35% more leads due to poor follow-up tracking.</WarnBox>}
    </div>
  </>;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT FORM WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function AuditForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const upd = (k, v) => setData(p => ({ ...p, [k]: v }));

  const ok = () => {
    if (step === 0) return data.monthlyLeads && Array.isArray(data.leadSource) && data.leadSource.length > 0 && data.responseTime && data.conversionRate;
    if (step === 1) return Array.isArray(data.followUpMethod) && data.followUpMethod.length > 0 && data.followUpCount && data.dropOffStage;
    if (step === 2) return data.counselors && data.timePerLead && data.manualWorkPct;
    if (step === 3) return data.adSpend && data.leadQuality;
    if (step === 4) return Array.isArray(data.docHandling) && data.docHandling.length > 0 && data.usesCRM;
    return false;
  };

  const StepComp = [Step0, Step1, Step2, Step3, Step4][step];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"84px 20px 60px" }}>
      <div style={{ width:"100%", maxWidth:580 }}>

        {/* Progress */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div className="sdot" style={{
                  background: i < step ? "var(--green)" : i === step ? "rgba(99,102,241,0.12)" : "var(--bg-card)",
                  border: `${i === step ? "2px" : "1px"} solid ${i < step ? "var(--green)" : i === step ? "var(--accent)" : "var(--border)"}`,
                  color: i < step ? "#fff" : i === step ? "#a5b4fc" : "var(--t3)",
                  boxShadow: i === step ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                  transition: "all .3s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`sline ${i < step ? "on" : ""}`} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize:13, color:"var(--t3)" }}>
            Step {step + 1} of {STEPS.length} —{" "}
            <span style={{ color:"var(--t2)", fontWeight:500 }}>{STEPS[step].title}</span>
          </div>
        </div>

        {/* Card */}
        <div className="card-glow anim" key={step}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.025em", marginBottom:4, fontFamily:"var(--font-head)" }}>
              {STEPS[step].title}
            </h2>
            <p style={{ fontSize:14, color:"var(--t2)" }}>{STEPS[step].sub}</p>
          </div>

          <StepComp d={data} u={upd} />

          <hr className="div" />
          <div style={{ display:"flex", gap:10 }}>
            {step > 0 && <button className="btn bo" onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button
              className="btn bp"
              style={{ flex:1 }}
              disabled={!ok()}
              onClick={() => { if (step < 4) setStep(s => s + 1); else onSubmit(data); }}
            >
              {step === 4 ? "Generate My Audit Report →" : "Continue →"}
            </button>
          </div>
          {!ok() && (
            <p style={{ fontSize:12, color:"var(--t3)", textAlign:"center", marginTop:10 }}>
              Please answer all questions above to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYZING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function Analyzing() {
  const [active, setActive] = useState(0);
  const tasks = [
    { l: "Calculating your lead conversion gap",       d: "Comparing your rate against the 15% industry benchmark…" },
    { l: "Quantifying monthly revenue leakage",        d: "Multiplying lost leads × revenue per student…" },
    { l: "Measuring time and operational waste",       d: "Costing manual work at ₹200/hour across your team…" },
    { l: "Running AI bottleneck diagnosis",            d: "Identifying the root cause of your drop-off stage…" },
    { l: "Building your personalised action plan",     d: "Ranking AI fixes by ROI for your specific situation…" },
  ];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i < tasks.length) setActive(i);
      else clearInterval(t);
    }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40 }}>
      {/* Ambient glow */}
      <div style={{ position:"fixed", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:300, background:"radial-gradient(ellipse,rgba(99,102,241,0.09) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:460, width:"100%", textAlign:"center", position:"relative" }}>

        {/* Spinner with ring */}
        <div style={{ position:"relative", width:64, height:64, margin:"0 auto 32px" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(99,102,241,0.15)", animation:"pulse 2s ease infinite" }} />
          <div style={{ position:"absolute", inset:4, borderRadius:"50%", border:"2px solid var(--border)", borderTopColor:"var(--accent)", animation:"spin .9s linear infinite" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"var(--accent)", animation:"pulse 1.4s ease infinite" }} />
          </div>
        </div>

        <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.025em", marginBottom:8, fontFamily:"var(--font-head)" }}>
          Analysing Your Agency
        </h2>
        <p style={{ fontSize:14, color:"var(--t2)", marginBottom:40 }}>
          Your personalised audit is being built — takes about 5 seconds.
        </p>

        <div style={{ textAlign:"left", display:"flex", flexDirection:"column", gap:16 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", opacity: i <= active ? 1 : 0.18, transition:"opacity .5s ease" }}>
              <div style={{
                width:22, height:22, borderRadius:"50%", flexShrink:0, marginTop:1,
                background: i < active ? "var(--green)" : i === active ? "rgba(99,102,241,0.15)" : "var(--bg-card)",
                border: `1px solid ${i <= active ? (i < active ? "var(--green)" : "var(--accent)") : "var(--border)"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, color: i < active ? "#fff" : "var(--accent)",
                transition:"all .4s",
              }}>
                {i < active ? "✓" : i === active
                  ? <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"block", animation:"pulse 1s infinite" }} />
                  : ""}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color: i <= active ? "var(--t1)" : "var(--t3)", transition:"color .4s" }}>{t.l}</div>
                {i === active && (
                  <div style={{ fontSize:12, color:"var(--accent)", marginTop:3, animation:"fadeIn .3s ease" }}>{t.d}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALC ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function calc(d) {
  const leads   = Number(d.monthlyLeads)    || 0;
  const conv    = Number(d.conversionRate)  || 0;
  const rt      = Number(d.responseTime)    || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const counsel = Number(d.counselors)      || 1;
  const tpl     = Number(d.timePerLead)     || 30;
  const manual  = Number(d.manualWorkPct)   || 0;
  const ad      = Number(d.adSpend)         || 0;
  const cpl     = Number(d.costPerLead)     || (leads > 0 ? Math.round(ad / leads) : 0);

  const followUpArr = Array.isArray(d.followUpMethod) ? d.followUpMethod : (d.followUpMethod ? [d.followUpMethod] : []);
  const docArr      = Array.isArray(d.docHandling)    ? d.docHandling    : (d.docHandling    ? [d.docHandling]    : []);

  const BENCH   = 15;
  const penalty = rt > 10;
  const effConv = penalty ? conv * 0.7 : conv;
  const lost    = Math.max(0, leads * (BENCH - effConv) / 100);
  const mLoss   = Math.round(lost * rps);
  const aLoss   = mLoss * 12;
  const mWaste  = (manual / 100) * (tpl / 60) * leads;
  const wWaste  = Math.round(mWaste / 4.33);
  const mWasteCost  = Math.round(mWaste * 200);
  const rtPenMoney  = penalty ? Math.round(conv * 0.3 * leads * rps / 100) : 0;
  const adWasted    = Math.round(ad * (1 - effConv / 100));

  let score = 100;
  if (effConv < BENCH)                                              score -= Math.min(28, Math.round((BENCH - effConv) * 2));
  if (rt > 10)                                                      score -= 18;
  if (manual > 50)                                                  score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0)    score -= 14;
  if (d.usesCRM === "no")                                           score -= 10;
  if (docArr.includes("manual") && !docArr.includes("digital"))    score -= 8;
  if (d.leadQuality === "low")                                      score -= 6;
  score = Math.max(8, score);

  const growthPct = effConv > 0 ? Math.min(200, Math.round(((BENCH - effConv) / effConv) * 100)) : 80;

  return {
    leads, conv, effConv: Math.round(effConv * 10) / 10,
    rt, penalty, rps, counsel, tpl, manual, ad, cpl,
    lost: Math.round(lost), mLoss, aLoss, wWaste,
    mWasteCost, rtPenMoney, adWasted, score, growthPct,
    followUpArr, docArr,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Gauge({ score }) {
  const col = score >= 68 ? "#10b981" : score >= 42 ? "#f59e0b" : "#ef4444";
  const lbl = score >= 68 ? "Moderate" : score >= 42 ? "At Risk" : "Critical";
  const r   = 52;
  const c   = 2 * Math.PI * r;
  const off = c - (score / 100) * c;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative" }}>
        {/* Outer glow ring */}
        <div style={{ position:"absolute", inset:-6, borderRadius:"50%", background:`radial-gradient(ellipse,${col}18 0%,transparent 70%)` }} />
        <svg width={128} height={128} viewBox="0 0 128 128">
          <circle cx={64} cy={64} r={r} fill="none" stroke="#1a1d2e" strokeWidth={10} />
          <circle cx={64} cy={64} r={r} fill="none" stroke={col} strokeWidth={10}
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
          {/* Inner glow track */}
          <circle cx={64} cy={64} r={r} fill="none" stroke={col} strokeWidth={2}
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            transform="rotate(-90 64 64)" opacity={0.18}
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
          <text x={64} y={61} textAnchor="middle" fill="#eceef8" fontSize={26} fontWeight={700} fontFamily="'JetBrains Mono',monospace">{score}</text>
          <text x={64} y={77} textAnchor="middle" fill={col} fontSize={12}>/100</text>
        </svg>
      </div>
      <span className={`pill ${score >= 68 ? "pg" : score >= 42 ? "ph" : "pc"}`} style={{ fontSize:13 }}>{lbl}</span>
    </div>
  );
}

function StatCard({ label, value, sub, vc = "var(--t1)" }) {
  return (
    <div className="card" style={{ padding:"18px 20px" }}>
      <div style={{ fontSize:11, color:"var(--t3)", marginBottom:7, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase" }}>{label}</div>
      <div className="mono" style={{ fontSize:24, color:vc, marginBottom:4, fontWeight:500, animation:"countUp .5s ease" }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"var(--t3)", lineHeight:1.55 }}>{sub}</div>}
    </div>
  );
}

function BarRow({ label, val, pct, color, note }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
        <span style={{ fontSize:14, color:"var(--t2)" }}>{label}</span>
        <span className="mono" style={{ fontSize:14, color, fontWeight:500 }}>{val}</span>
      </div>
      <div style={{ height:5, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:color, borderRadius:4, transition:"width 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s" }} />
      </div>
      {note && <div style={{ fontSize:12, color:"var(--t3)", marginTop:5 }}>{note}</div>}
    </div>
  );
}

function OppCard({ title, impact, priority, idx }) {
  const pc = priority === "CRITICAL" ? "pc" : priority === "HIGH" ? "ph" : "pm";
  return (
    <div className="card" style={{
      padding:"16px 20px", display:"flex", gap:16, alignItems:"flex-start",
      animation:"fadeUp .45s cubic-bezier(0.22,1,0.36,1) both",
      animationDelay:`${idx * 0.08}s`,
      borderLeft:`3px solid ${priority === "CRITICAL" ? "var(--red)" : priority === "HIGH" ? "var(--yellow)" : "var(--accent)"}`,
    }}>
      <div style={{ flexShrink:0, paddingTop:2 }}>
        <span className={`pill ${pc}`}>{priority}</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600, fontSize:15, marginBottom:5, color:"var(--t1)", fontFamily:"var(--font-head)" }}>{title}</div>
        <div style={{ fontSize:14, color:"var(--t2)", lineHeight:1.7 }}>{impact}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT
// ─────────────────────────────────────────────────────────────────────────────
function Report({ fd, lead, onRestart }) {
  const m = calc(fd);
  const [aiTxt, setAiTxt]   = useState("");
  const [aiLoad, setAiLoad] = useState(true);

  useEffect(() => {
    const followUpStr = m.followUpArr.length ? m.followUpArr.join(", ") : "none";
    const docStr      = m.docArr.length      ? m.docArr.join(", ")      : "not specified";

    const prompt = `You are a senior business analyst for a study abroad agency. Write a sharp, direct 5–6 sentence analysis using the exact numbers provided. No generic advice — every sentence must reference actual data.

Agency data:
- Monthly enquiries: ${m.leads}
- Current conversion: ${m.conv}% → effective: ${m.effConv}% (${m.penalty ? "30% penalty applied because response time is " + m.rt + " min" : "no penalty"})
- Industry benchmark: 15%
- Lost leads/month: ${m.lost}
- Monthly revenue loss: ₹${m.mLoss.toLocaleString("en-IN")}
- Annual revenue at risk: ₹${m.aLoss.toLocaleString("en-IN")}
- Manual/repetitive work: ${m.manual}%
- Weekly wasted counselor hours: ${m.wWaste} hrs
- Follow-up methods used: ${followUpStr}
- Lead drop-off stage: ${fd.dropOffStage}
- CRM: ${fd.usesCRM}, Document handling: ${docStr}
- Lead quality: ${fd.leadQuality}
- Audit score: ${m.score}/100

Write 4 punchy paragraphs: (1) Biggest bottleneck + its rupee impact. (2) Why leads drop at "${fd.dropOffStage}" stage. (3) How response time + manual work compound the problem. (4) Top 2 AI fixes with estimated ROI. Use real numbers throughout.`;

    (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            businessName: lead?.agency || "",
            email:        lead?.email  || "",
            score:        m.score,
          }),
        });
        const data = await res.json();
        const reportText = data.text || fallback();
        setAiTxt(reportText);

        fetch("/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: reportText }),
        }).catch(() => {});

      } catch (err) {
        const reportText = fallback();
        setAiTxt(reportText);
        fetch("/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: reportText }),
        }).catch(() => {});
      } finally {
        setAiLoad(false);
      }
    })();
  }, []);

  const fallback = () => {
    const followUpStr = m.followUpArr.includes("none") || m.followUpArr.length === 0
      ? "no structured follow-up process"
      : m.followUpArr.join(" + ");
    return `Your agency receives ${m.leads} leads per month but converts only ${m.effConv}% — that's ${(15 - m.effConv).toFixed(1)}% below the 15% industry benchmark, costing you ${m.lost} students and ${inr(m.mLoss)} every single month. ${m.penalty ? `Your ${m.rt}-minute response time is triggering a 30% conversion penalty — leads contacted after 10 minutes are statistically 7× harder to close, dropping your effective rate from ${m.conv}% to ${m.effConv}%.` : `While your response time is within range, the conversion gap alone represents ${inr(m.aLoss)} in annual lost revenue.`} On top of this, ${m.manual}% manual workload consumes ${m.wWaste} counselor hours per week — time that could be spent closing the ${m.lost} leads slipping away each month. Your current follow-up approach (${followUpStr}) and the ${fd.dropOffStage} drop-off point are the two highest-leverage areas to fix with AI automation, with agencies reporting a 40–60% lead recovery rate within 90 days.`;
  };

  const opps = [
    {
      title: "AI Chatbot for Instant Lead Response",
      impact: `Bring your ${m.rt}-minute response time to under 2 minutes — 24/7, even on weekends. Estimated recovery: ${Math.round(m.lost * 0.35)} leads/month worth ${inr(Math.round(m.lost * 0.35 * m.rps))}.`,
      priority: m.rt > 15 ? "CRITICAL" : "HIGH",
    },
    {
      title: "Automated WhatsApp Follow-up Sequences",
      impact: `Replace or augment your current follow-up (${m.followUpArr.length ? m.followUpArr.join(", ") : "none"}) with personalised, multi-step WhatsApp sequences. Directly addresses the ${fd.dropOffStage} drop-off problem.`,
      priority: m.followUpArr.includes("none") || m.followUpArr.length === 0 ? "CRITICAL" : "HIGH",
    },
    {
      title: fd.usesCRM === "no" ? "CRM Setup + Lead Pipeline Tracking" : "CRM Automation & Smart Workflows",
      impact: fd.usesCRM === "no"
        ? `No CRM means no visibility into where leads go silent. A properly configured CRM would save your ${m.counsel} counselor${m.counsel > 1 ? "s" : ""} ~${Math.round(m.wWaste * 0.35)} hours/week in manual tracking.`
        : `Automate your existing CRM: auto-assign leads, send reminders at each follow-up stage, and generate weekly dashboards — cutting manual data entry by ~40%.`,
      priority: fd.usesCRM === "no" ? "HIGH" : "MEDIUM",
    },
    {
      title: "Document Processing Automation",
      impact: m.docArr.includes("manual") && !m.docArr.includes("digital")
        ? `Manual document collection adds 3–4 hours per student. An AI document portal reduces this to under 45 minutes, freeing ~${Math.round(m.wWaste * 0.3)} counselor hours per month.`
        : `Upgrade your current document process (${m.docArr.join(", ")}) with smart checklists and auto-verification — reducing errors by 70%.`,
      priority: m.docArr.includes("manual") && !m.docArr.includes("digital") ? "HIGH" : "MEDIUM",
    },
  ];

  const date = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:"84px 20px 80px", position:"relative" }}>

      {/* Top ambient glow */}
      <div style={{ position:"fixed", top:"10%", left:"50%", transform:"translateX(-50%)", width:700, height:350, background:"radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 68%)", pointerEvents:"none", zIndex:0 }} />

      {/* Header */}
      <div className="anim" style={{ marginBottom:32, position:"relative" }}>
        <div className="slabel">EnrollmentX AI Audit · {date}</div>
        <h1 style={{ fontSize:"clamp(24px,3.5vw,32px)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:8, fontFamily:"var(--font-head)" }}>
          Your Agency Audit Is Ready
        </h1>
        <p style={{ color:"var(--t2)", fontSize:15 }}>
          Based on <strong style={{ color:"var(--t1)" }}>{m.leads} monthly leads</strong> ·
          Revenue per student: <strong style={{ color:"var(--t1)" }}>{inr(m.rps)}</strong>
        </p>
      </div>

      {/* Score card */}
      <div className="card-glow anim d1" style={{ display:"flex", gap:24, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <Gauge score={m.score} />
        <div style={{ flex:1, minWidth:220 }}>
          <div className="slabel">AI Efficiency Score</div>
          <h2 style={{ fontSize:18, fontWeight:700, letterSpacing:"-0.025em", marginBottom:10, fontFamily:"var(--font-head)" }}>
            {m.score < 42
              ? "Critical inefficiencies — urgent action required"
              : m.score < 68
              ? "Several revenue leaks found — moderate risk"
              : "Good foundation, but revenue gaps remain"}
          </h2>
          <p style={{ fontSize:14, color:"var(--t2)", lineHeight:1.8 }}>
            Top agencies score <strong style={{ color:"var(--t1)" }}>75 or above</strong>.
            Your score of <strong style={{ color: m.score < 42 ? "var(--red)" : m.score < 68 ? "var(--yellow)" : "var(--green)" }}>{m.score}/100</strong> indicates
            {m.score < 42
              ? " multiple compounding problems actively reducing your revenue every day."
              : m.score < 68
              ? " clear gaps in conversion, follow-up, and operations limiting your growth."
              : " solid operations, with specific gaps holding back full potential."}
          </p>
        </div>
      </div>

      {/* Financial impact stats */}
      <div style={{ marginBottom:14 }}>
        <div className="slabel">What You're Losing — Financial Impact</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:10 }}>
          <StatCard label="Monthly Revenue Loss"   value={inr(m.mLoss)}        sub={`${m.lost} unconverted leads × ${inr(m.rps)}`}                                                      vc="var(--red)" />
          <StatCard label="Annual Revenue at Risk" value={inr(m.aLoss)}        sub="Projected over 12 months if nothing changes"                                                          vc="var(--red)" />
          <StatCard label="Response Time Penalty"  value={m.penalty ? inr(m.rtPenMoney) : "None"} sub={m.penalty ? `${m.rt}min response → 30% conversion loss` : `${m.rt}min — within safe range`} vc={m.penalty ? "var(--yellow)" : "var(--green)"} />
          <StatCard label="Ad Budget Wasted"       value={inr(m.adWasted)}     sub="Spent on leads that don't convert each month"                                                         vc="var(--yellow)" />
        </div>
      </div>

      {/* Operational efficiency */}
      <div className="card anim d2" style={{ marginBottom:14 }}>
        <div className="slabel">Time & Operational Efficiency</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:26 }}>
          <div>
            <div style={{ fontSize:12, color:"var(--t3)", marginBottom:5 }}>Counselor hours wasted per week</div>
            <div className="mono" style={{ fontSize:28, color:"var(--yellow)", fontWeight:500 }}>{m.wWaste} hrs</div>
            <div style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>Across {m.counsel} counselor{m.counsel > 1 ? "s" : ""}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"var(--t3)", marginBottom:5 }}>Monthly cost of manual inefficiency</div>
            <div className="mono" style={{ fontSize:28, color:"var(--red)", fontWeight:500 }}>{inr(m.mWasteCost)}</div>
            <div style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>At ₹200/hour labour cost</div>
          </div>
        </div>
        <BarRow
          label="Conversion rate vs. 15% benchmark"
          val={`${m.effConv}% / 15%`}
          pct={(m.effConv / 15) * 100}
          color={m.effConv < 8 ? "var(--red)" : "var(--yellow)"}
          note={`You are ${(15 - m.effConv).toFixed(1)}% below benchmark — that gap equals ${m.lost} missed enrollments/month`}
        />
        <BarRow
          label="Proportion of work that is manual / repetitive"
          val={`${m.manual}%`}
          pct={m.manual}
          color={m.manual > 60 ? "var(--red)" : m.manual > 30 ? "var(--yellow)" : "var(--green)"}
          note={m.manual > 50 ? "High manual load is consuming time that should be spent on lead conversion." : "Some manual work exists — targeted automation can clear this."}
        />
        <BarRow
          label="Lead response speed (target: under 10 minutes)"
          val={`${m.rt} min`}
          pct={Math.min(100, (10 / Math.max(m.rt, 1)) * 100)}
          color={m.rt <= 10 ? "var(--green)" : "var(--red)"}
          note={m.rt > 10 ? `${m.rt - 10} minutes above the safe threshold. Dropping your conversion from ${m.conv}% to ${m.effConv}%.` : "Your response time is optimal."}
        />
      </div>

      {/* AI Analysis */}
      <div className="card-accent anim d3" style={{ marginBottom:14 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"rgba(99,102,241,0.14)", border:"1px solid rgba(99,102,241,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0,
          }}>◈</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"var(--t1)", fontFamily:"var(--font-head)" }}>AI Bottleneck Analysis</div>
            <div style={{ fontSize:12, color:"var(--t2)" }}>Powered by EnrollmentX AI · Generated from your specific data</div>
          </div>
        </div>
        {aiLoad ? (
          <div style={{ display:"flex", alignItems:"center", gap:12, color:"var(--t2)", fontSize:14, padding:"8px 0" }}>
            <div className="spinner" />
            <span>Analysing your data — takes a few seconds…</span>
          </div>
        ) : (
          <div style={{ fontSize:15, color:"var(--t2)", lineHeight:1.9, whiteSpace:"pre-wrap" }}>{aiTxt}</div>
        )}
      </div>

      {/* Opportunities */}
      <div style={{ marginBottom:14 }}>
        <div className="slabel">AI Automation Opportunities — Ranked by ROI Impact</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {opps.map((o, i) => <OppCard key={i} {...o} idx={i} />)}
        </div>
      </div>

      {/* Growth potential */}
      <div className="card-accent anim" style={{ marginBottom:24 }}>
        <div className="slabel">Your Growth Potential</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:12, flexWrap:"wrap", marginBottom:14 }}>
          <div className="mono" style={{ fontSize:44, color:"var(--green)", fontWeight:700, fontFamily:"var(--font-head)" }}>
            +{Math.min(m.growthPct, 150)}%
          </div>
          <div style={{ fontSize:16, color:"var(--t2)" }}>potential revenue increase</div>
        </div>
        <p style={{ fontSize:15, color:"var(--t2)", lineHeight:1.85 }}>
          If your agency reaches the 15% conversion benchmark from your current {m.effConv}%, you would enroll{" "}
          <strong style={{ color:"var(--t1)" }}>{m.lost} additional students per month</strong>. At {inr(m.rps)} per student, that is{" "}
          <strong style={{ color:"var(--green)" }}>{inr(m.mLoss)}/month</strong> in recovered revenue, or{" "}
          <strong style={{ color:"var(--green)" }}>{inr(m.aLoss)} per year</strong> — without spending a single extra rupee on advertising.
        </p>
      </div>

      {/* CTA */}
      <div style={{
        background:"var(--bg-card)", border:"1px solid var(--border)",
        borderRadius:var_xl_fallback(), padding:"48px 32px", textAlign:"center",
        position:"relative", overflow:"hidden",
      }}>
        {/* CTA glow */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:500, height:200, background:"radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>
          Ready to fix this?
        </div>
        <h2 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginBottom:12, fontFamily:"var(--font-head)" }}>
          Recover {inr(m.mLoss)}/month<br />with AI — in 30 days
        </h2>
        <p style={{ color:"var(--t2)", fontSize:15, maxWidth:400, margin:"0 auto 36px", lineHeight:1.8 }}>
          Our team will build and deploy a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all tailored to how you work.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn bcta" onClick={() => window.open("https://calendly.com/charanrathod-inf/30min", "_blank")}>
            Book a Free Strategy Call →
          </button>
          <button className="btn bo" onClick={onRestart}>Run Another Audit</button>
        </div>
        <p style={{ fontSize:12, color:"var(--t3)", marginTop:20 }}>
          No commitment · 30-minute call · EnrollmentX specialists
        </p>
      </div>
    </div>
  );
}

// Helper to avoid template literal in inline style (not supported in JSX)
function var_xl_fallback() { return "22px"; }

// ─────────────────────────────────────────────────────────────────────────────
// LEAD CAPTURE
// ─────────────────────────────────────────────────────────────────────────────
function LeadCapture({ formData, onSubmit }) {
  const [mode, setMode]           = useState("choose");
  const [lead, setLead]           = useState({ name:"", email:"", phone:"", agency:"" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]       = useState({});
  const upd = (k, v) => { setLead(p => ({ ...p, [k]:v })); setErrors(e => ({ ...e, [k]:"" })); };

  const teaserScore = (() => {
    const m = calc(formData || {});
    return { score:m.score, mLoss:m.mLoss, lost:m.lost };
  })();

  const save = async (ld) => {
    try {
      await fetch("/api/capture", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ lead:ld, formData }),
      });
    } catch (e) {}
    onSubmit(ld);
  };

  const handleGoogle = async () => {
    if (formData) sessionStorage.setItem("audit_fd", JSON.stringify(formData));
    const { error } = await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{ redirectTo: window.location.origin + "?audit=true" },
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
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"84px 20px 60px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:800, height:400, background:"radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:520, position:"relative" }}>

        {/* Blurred teaser */}
        <div className="anim" style={{ position:"relative", marginBottom:20, borderRadius:var_xl_fallback(), overflow:"hidden", border:"1px solid rgba(99,102,241,0.22)" }}>
          <div style={{ filter:"blur(6px)", pointerEvents:"none", userSelect:"none", background:"var(--bg-card)", padding:"20px 24px", display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <svg width={80} height={80} viewBox="0 0 128 128">
                <circle cx={64} cy={64} r={52} fill="none" stroke="#1a1d2e" strokeWidth={10} />
                <circle cx={64} cy={64} r={52} fill="none"
                  stroke={teaserScore.score < 42 ? "#ef4444" : "#f59e0b"} strokeWidth={10}
                  strokeDasharray={2*Math.PI*52}
                  strokeDashoffset={2*Math.PI*52 - (teaserScore.score/100)*2*Math.PI*52}
                  strokeLinecap="round" transform="rotate(-90 64 64)" />
                <text x={64} y={60} textAnchor="middle" fill="#eceef8" fontSize={28} fontWeight={700} fontFamily="monospace">{teaserScore.score}</text>
                <text x={64} y={76} textAnchor="middle" fill="#7b80a0" fontSize={13}>/100</text>
              </svg>
            </div>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontSize:12, color:"var(--t3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Monthly Revenue Loss</div>
              <div style={{ fontSize:28, fontWeight:700, color:"var(--red)", fontFamily:"monospace" }}>{inr(teaserScore.mLoss)}</div>
              <div style={{ fontSize:12, color:"var(--t3)", marginTop:4 }}>{teaserScore.lost} leads slipping away each month</div>
            </div>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontSize:12, color:"var(--t3)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Top Issues Found</div>
              {["Response time penalty", "Conversion gap", "Manual work waste"].map((item, idx) => (
                <div key={idx} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--red)", flexShrink:0 }} />
                  <div style={{ fontSize:13, color:"var(--t2)" }}>{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lock overlay */}
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(7,8,15,0.7)", backdropFilter:"blur(2px)", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🔒</div>
            <div style={{ fontSize:14, fontWeight:700, color:"var(--t1)", fontFamily:"var(--font-head)" }}>Your report is ready</div>
            <div style={{ fontSize:13, color:"var(--t2)" }}>Sign in to unlock your full audit</div>
          </div>
        </div>

        {/* Urgency banner */}
        <div className="anim d1" style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:10, padding:"10px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--red)", flexShrink:0, animation:"pulse 1.5s infinite" }} />
          <span style={{ fontSize:13, color:"#fca5a5", lineHeight:1.55 }}>
            Your agency is losing <strong>{inr(teaserScore.mLoss)}/month</strong> right now. Sign in to see the full breakdown and fix plan.
          </span>
        </div>

        {/* Auth card */}
        <div className="card-glow anim d2" style={{ padding:"28px" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h2 style={{ fontSize:21, fontWeight:800, letterSpacing:"-0.03em", marginBottom:6, fontFamily:"var(--font-head)" }}>
              Unlock your free audit report
            </h2>
            <p style={{ fontSize:13, color:"var(--t2)", lineHeight:1.65 }}>Takes 5 seconds · No credit card · 100% free</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            style={{ width:"100%", background:"#fff", color:"#1f2937", border:"none", borderRadius:10, padding:"14px 20px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"all .18s", marginBottom:12, boxShadow:"0 2px 12px rgba(0,0,0,0.35)" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 22px rgba(0,0,0,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.35)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google — it's free
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
            <span style={{ fontSize:12, color:"var(--t3)", fontWeight:500 }}>or</span>
            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
          </div>

          <button className="btn bo" style={{ width:"100%", fontSize:13, padding:"11px 0", color:"var(--t3)" }} onClick={() => setMode("manual")}>
            Enter details manually
          </button>

          <div style={{ display:"flex", justifyContent:"center", gap:22, marginTop:18, flexWrap:"wrap" }}>
            {["🔒 No spam", "✓ Free forever", "📧 Report sent to email"].map((t, i) => (
              <span key={i} style={{ fontSize:11, color:"var(--t3)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Manual form
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"84px 20px 60px" }}>
      <div style={{ width:"100%", maxWidth:460 }}>
        <button className="btn bo" style={{ fontSize:13, padding:"7px 14px", marginBottom:20 }} onClick={() => setMode("choose")}>← Back</button>
        <div className="card-glow anim" style={{ padding:"28px" }}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:21, fontWeight:800, letterSpacing:"-0.025em", marginBottom:6, fontFamily:"var(--font-head)" }}>Your details</h2>
            <p style={{ fontSize:14, color:"var(--t2)" }}>We'll send your full audit report to your email.</p>
          </div>
          <div className="field">
            <label className="fl">Full Name <span style={{ color:"var(--red)", fontSize:12 }}>*</span></label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={lead.name} onChange={e => upd("name", e.target.value)} style={{ borderColor:errors.name ? "var(--red)" : undefined }} />
            {errors.name && <div style={{ fontSize:12, color:"var(--red)", marginTop:4 }}>{errors.name}</div>}
          </div>
          <div className="field">
            <label className="fl">Work Email <span style={{ color:"var(--red)", fontSize:12 }}>*</span></label>
            <input type="text" placeholder="e.g. rahul@agency.com" value={lead.email} onChange={e => upd("email", e.target.value)} style={{ borderColor:errors.email ? "var(--red)" : undefined }} />
            {errors.email && <div style={{ fontSize:12, color:"var(--red)", marginTop:4 }}>{errors.email}</div>}
          </div>
          <div className="field">
            <label className="fl">Agency Name <span style={{ color:"var(--t3)", fontWeight:400, fontSize:12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. Global Study Consultants" value={lead.agency} onChange={e => upd("agency", e.target.value)} />
          </div>
          <div className="field">
            <label className="fl">Phone Number <span style={{ color:"var(--t3)", fontWeight:400, fontSize:12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. +91 98765 43210" value={lead.phone} onChange={e => upd("phone", e.target.value)} />
          </div>
          <button className="btn bp" style={{ width:"100%", fontSize:15, padding:"13px 0", opacity:submitting ? 0.7 : 1, marginTop:4 }} onClick={handleManual} disabled={submitting}>
            {submitting ? "Saving…" : "View My Audit Report →"}
          </button>
          <p style={{ fontSize:11, color:"var(--t3)", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
            🔒 No spam. Your details are used only to deliver your report.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [fd, setFd]         = useState(null);
  const [lead, setLead]     = useState(null);
  const [user, setUser]     = useState(null);

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
              name:   session.user.user_metadata?.full_name || "",
              email:  session.user.email || "",
              phone:  session.user.user_metadata?.phone || "",
              agency: "",
            };
            setLead(profile);
            fetch("/api/capture", {
              method:"POST",
              headers:{ "Content-Type":"application/json" },
              body: JSON.stringify({ lead:profile, formData:restoredFd }),
            }).catch(() => {});
            setScreen("analyzing");
            setTimeout(() => setScreen("report"), 5800);
          }
        }
      }
    });

    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const submitForm = data => { setFd(data); setScreen("capture"); };
  const submitLead = ld   => { setLead(ld); setScreen("analyzing"); setTimeout(() => setScreen("report"), 5800); };
  const restart    = ()   => { setFd(null); setLead(null); setScreen("landing"); };
  const signOut    = async () => { await supabase.auth.signOut(); setUser(null); };

  return (
    <>
      <style>{G}</style>
      <Nav user={user} onSignOut={signOut} />
      {screen === "landing"   && <Landing    onStart={() => setScreen("form")} />}
      {screen === "form"      && <AuditForm  onSubmit={submitForm} />}
      {screen === "capture"   && <LeadCapture formData={fd} onSubmit={submitLead} />}
      {screen === "analyzing" && <Analyzing />}
      {screen === "report"    && <Report fd={fd} lead={lead} onRestart={restart} />}
    </>
  );
}