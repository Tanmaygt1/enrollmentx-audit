"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F2F0EB;
    --bg2:       #E8E5DF;
    --surface:   #FAFAF8;
    --navy:      #0E1728;
    --navy2:     #1A2640;
    --blue:      #004EEB;
    --blue-dim:  rgba(0,78,235,0.07);
    --blue-mid:  rgba(0,78,235,0.15);
    --teal:      #0A7A5E;
    --teal-dim:  rgba(10,122,94,0.08);
    --gold:      #92400E;
    --gold-dim:  rgba(146,64,14,0.08);
    --red:       #991B1B;
    --red-dim:   rgba(153,27,27,0.07);
    --text:      #141820;
    --sub:       #4A5268;
    --muted:     #8590A8;
    --border:    #D4D0C8;
    --border2:   #E4E1D8;
    --serif:     'Instrument Serif', Georgia, serif;
    --sans:      'Plus Jakarta Sans', -apple-system, sans-serif;
    --shadow-sm: 0 1px 3px rgba(14,23,40,0.07), 0 1px 2px rgba(14,23,40,0.04);
    --shadow-md: 0 4px 16px rgba(14,23,40,0.09), 0 2px 4px rgba(14,23,40,0.05);
    --shadow-lg: 0 16px 48px rgba(14,23,40,0.12), 0 4px 12px rgba(14,23,40,0.06);
    --grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes dash    { from { stroke-dashoffset: 900; } to { stroke-dashoffset: 0; } }
  @keyframes needlePop { from { transform: rotate(-90deg) scaleY(0); } to { transform: rotate(var(--angle)) scaleY(1); } }

  .anim  { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1 { animation-delay:0.08s; } .d2 { animation-delay:0.16s; }
  .d3 { animation-delay:0.24s; } .d4 { animation-delay:0.32s; }

  /* ── Typography ── */
  .serif { font-family: var(--serif); }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 24px;
    box-shadow: var(--shadow-sm);
  }
  .card-ink {
    background: var(--navy);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 6px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .card-ink::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--grain);
    pointer-events: none;
    opacity: 0.6;
  }
  .card-ruled {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 3px solid var(--navy);
    border-radius: 0 0 6px 6px;
    padding: 24px;
    box-shadow: var(--shadow-sm);
  }
  .card-blue {
    background: var(--blue-dim);
    border: 1px solid var(--blue-mid);
    border-radius: 6px;
    padding: 24px;
  }
  .card-teal {
    background: var(--teal-dim);
    border: 1px solid rgba(10,122,94,0.2);
    border-radius: 6px;
    padding: 24px;
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 11px 22px; border-radius: 5px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: var(--sans); transition: all 0.15s; border: none;
    letter-spacing: 0.01em;
  }
  .bp { background: var(--blue); color: #fff; }
  .bp:hover { background: #0041CC; transform: scale(1.015); }
  .bp:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; transform: none; }
  .bo {
    background: transparent; color: var(--sub);
    border: 1px solid var(--border);
  }
  .bo:hover { border-color: var(--navy); color: var(--text); }
  .bcta {
    background: var(--navy);
    color: #fff; font-size: 15px; padding: 14px 32px;
    position: relative; overflow: hidden;
    box-shadow: 0 3px 12px rgba(14,23,40,0.28);
  }
  .bcta::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent, transparent 3px,
      rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px
    );
  }
  .bcta:hover { background: var(--navy2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,23,40,0.35); }

  /* ── Form inputs ── */
  .fl {
    display: block; font-size: 13px; font-weight: 600;
    color: var(--sub); margin-bottom: 8px; letter-spacing: 0.015em;
  }
  .fh { font-size: 12px; color: var(--muted); margin-top: 5px; line-height: 1.55; }

  input[type=number], input[type=text], select {
    width: 100%; background: var(--surface);
    border: 1px solid var(--border); border-radius: 5px;
    color: var(--text); padding: 11px 14px; font-size: 15px;
    font-family: var(--sans); transition: border-color .18s, box-shadow .18s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus {
    outline: none; border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(0,78,235,0.1);
  }
  input::placeholder { color: var(--border); }
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath fill='none' stroke='%238590A8' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    background-color: var(--surface); padding-right: 36px;
  }
  select option { background: var(--surface); color: var(--text); }

  /* ── Choice buttons ── */
  .choice-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .cb {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 5px; padding: 9px 14px; font-size: 14px;
    color: var(--sub); cursor: pointer; transition: all .15s;
    font-family: var(--sans); font-weight: 500;
  }
  .cb:hover { border-color: var(--navy); color: var(--text); }
  .cb.sel {
    border-color: var(--blue); color: var(--blue);
    background: var(--blue-dim);
    box-shadow: inset 0 0 0 1px var(--blue);
  }
  .multi-hint {
    font-size: 11px; color: var(--muted); margin-bottom: 8px;
    display: flex; align-items: center; gap: 5px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .field { margin-bottom: 20px; }

  /* ── Labels / misc ── */
  .slabel {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
  }
  .mono { font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; letter-spacing: -0.02em; }
  .note {
    background: var(--teal-dim); border-left: 3px solid var(--teal);
    border-radius: 0 5px 5px 0; padding: 10px 14px;
    font-size: 13px; color: var(--teal); margin-top: 8px; line-height: 1.55;
  }
  .warn {
    background: var(--red-dim); border-left: 3px solid var(--red);
    border-radius: 0 5px 5px 0; padding: 10px 14px;
    font-size: 13px; color: var(--red); margin-top: 8px; line-height: 1.55;
  }
  hr.div { border: none; border-top: 1px solid var(--border2); margin: 22px 0; }

  /* ── Step indicator ── */
  .sdot {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all .3s;
  }
  .sline { flex: 1; height: 1px; background: var(--border2); }
  .sline.on { background: var(--navy); }
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: var(--blue);
    animation: spin .7s linear infinite; flex-shrink: 0;
  }

  /* ── Pills ── */
  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 3px; font-size: 11px;
    font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .pc { background: var(--red-dim); color: var(--red); border: 1px solid rgba(153,27,27,0.15); }
  .ph { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(146,64,14,0.15); }
  .pm { background: var(--blue-dim); color: var(--blue); border: 1px solid var(--blue-mid); }
  .pg { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(10,122,94,0.2); }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(242,240,235,0.92); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border); display: flex;
    align-items: center; padding: 0 28px; height: 58px;
  }

  /* ── Stat card ── */
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 18px 20px; box-shadow: var(--shadow-sm);
  }

  /* ── Risk meter ── */
  .risk-meter-track {
    height: 10px; border-radius: 2px; overflow: hidden;
    display: flex; position: relative;
    box-shadow: inset 0 1px 3px rgba(14,23,40,0.12);
  }
  .risk-meter-needle {
    position: absolute; top: -8px; width: 2px; height: 26px;
    background: var(--navy); border-radius: 2px;
    transform: translateX(-50%);
    transition: left 1.6s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 2px 8px rgba(14,23,40,0.3);
  }
  .risk-meter-needle::after {
    content: '';
    position: absolute; bottom: -4px; left: 50%;
    transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--navy);
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function toggleMulti(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}
function hasVal(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val);
}
function joinField(data, field) {
  const arr = Array.isArray(data[field]) ? data[field] : data[field] ? [data[field]] : [];
  return arr.join(", ") || "not specified";
}

// ── Choice Buttons ────────────────────────────────────────────────────────────
function CB({ val, label, hint, field, data, upd }) {
  const sel = data[field] === val;
  return (
    <button className={`cb ${sel ? "sel" : ""}`} onClick={() => upd(field, val)}>
      {label}
      {hint && <span style={{ color: sel ? "var(--blue)" : "var(--muted)", marginLeft: 5, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
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
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <span style={{
          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${selected ? "var(--blue)" : "var(--border)"}`,
          background: selected ? "var(--blue)" : "transparent",
          transition: "all .15s",
        }}>
          {selected && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {label}
      </span>
      {hint && <span style={{ color: selected ? "var(--blue)" : "var(--muted)", marginLeft: 6, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
    </button>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ size = 17, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size + 10, height: size + 10, borderRadius: 5,
        background: light ? "rgba(255,255,255,0.12)" : "var(--navy)",
        border: light ? "1px solid rgba(255,255,255,0.2)" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: size * 0.65, fontWeight: 800, color: light ? "#fff" : "#F2F0EB", fontFamily: "var(--serif)", fontStyle: "italic" }}>E</span>
      </div>
      <span style={{
        fontSize: size + 1, fontWeight: 700, letterSpacing: "-0.02em",
        color: light ? "#fff" : "var(--text)", fontFamily: "var(--sans)",
      }}>
        Enrollment<span style={{ color: light ? "rgba(255,255,255,0.55)" : "var(--blue)" }}>X</span>
      </span>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ user, onSignOut }) {
  return (
    <nav className="nav">
      <Logo />
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        {user && (
          <>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</span>
            <button className="btn bo" style={{ fontSize: 13, padding: "6px 14px" }} onClick={onSignOut}>Sign out</button>
          </>
        )}
        {!user && (
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI Audit System</div>
        )}
      </div>
    </nav>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
      {/* Subtle texture overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "var(--grain)", pointerEvents: "none", opacity: 0.4 }} />

      {/* Decorative rule lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--navy)" }} />

      <div style={{ maxWidth: 680, textAlign: "center", position: "relative" }}>
        <div className="anim" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, padding: "5px 14px", marginBottom: 36, boxShadow: "var(--shadow-sm)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", animation: "pulse 2s infinite", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "var(--sub)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Free · No credit card · 2 minutes</span>
        </div>

        <h1 className="anim d1 serif" style={{ fontSize: "clamp(36px, 5.5vw, 62px)", fontWeight: 400, lineHeight: 1.1, marginBottom: 24, color: "var(--navy)", fontStyle: "italic" }}>
          Find out exactly how much<br />
          revenue your agency is<br />
          <span style={{ fontStyle: "normal", fontSize: "0.92em" }}>losing <em>right now</em></span>
        </h1>

        <p className="anim d2" style={{ fontSize: 17, color: "var(--sub)", lineHeight: 1.85, maxWidth: 520, margin: "0 auto 44px", fontWeight: 400 }}>
          Answer 15 questions about your study abroad business. EnrollmentX AI analyses your operations and delivers a confidential audit — with exact ₹ figures and a step-by-step AI fix plan.
        </p>

        <div className="anim d3">
          <button className="btn bcta" onClick={onStart} style={{ fontSize: 15, padding: "15px 38px" }}>
            Start My Free Audit →
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, letterSpacing: "0.04em" }}>Takes 2–3 minutes · 100% confidential</p>
        </div>

        <div className="anim d4" style={{ display: "flex", gap: 0, justifyContent: "center", marginTop: 64, borderTop: "1px solid var(--border)", paddingTop: 40, flexWrap: "wrap" }}>
          {[
            ["₹2.4Cr+", "Average annual revenue leak found per agency"],
            ["87%", "Of agencies miss key AI automation opportunities"],
            ["2–3 min", "To get your full personalised report"],
          ].map(([n, d]) => (
            <div key={n} style={{ flex: 1, minWidth: 160, textAlign: "center", padding: "0 24px", borderRight: "1px solid var(--border2)" }}>
              <div className="mono serif" style={{ fontSize: 30, fontWeight: 400, color: "var(--navy)", fontStyle: "italic" }}>{n}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, lineHeight: 1.55 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { title: "Lead Generation", sub: "How enquiries come in and how fast you respond" },
  { title: "Sales & Follow-up", sub: "How your team handles and converts leads" },
  { title: "Team & Time", sub: "Your team size and how counselor time is spent" },
  { title: "Marketing & Budget", sub: "Your ad spend and cost per lead" },
  { title: "Operations & Tools", sub: "Systems and tools your agency currently uses" },
];

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
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        {[
          ["ads", "Paid Ads", "— Google, Meta / Instagram"],
          ["referrals", "Referrals", "— past students or partners"],
          ["organic", "Organic / SEO", "— website & search"],
          ["walk-ins", "Walk-ins", "— in-person enquiries"],
          ["social", "Social Media", "— YouTube, Instagram content"],
        ].map(([v, l, h]) => <MCB key={v} val={v} label={l} hint={h} field="leadSource" data={d} upd={u} />)}
      </div>
    </div>
    <div className="field">
      <label className="fl">How long does it typically take your team to respond to a new enquiry? (in minutes)</label>
      <input type="number" min="0" placeholder="e.g. 30" value={d.responseTime || ""} onChange={e => u("responseTime", e.target.value)} />
      <p className="fh">Be honest — if it takes 2 hours, enter 120. This is one of the biggest revenue levers.</p>
      {Number(d.responseTime) > 10 && <div className="warn">⚠ Leads contacted after 10 minutes are 7× less likely to convert. This will be penalised in your audit score.</div>}
      {Number(d.responseTime) <= 10 && Number(d.responseTime) > 0 && <div className="note">✓ Great! You're within the optimal response window.</div>}
    </div>
    <div className="field">
      <label className="fl">What percentage of your leads actually enroll? (Your conversion rate)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 8" value={d.conversionRate || ""} onChange={e => u("conversionRate", e.target.value)} />
      <p className="fh">If you sign up 10 students from 100 enquiries, that's 10%. The industry benchmark is 15%.</p>
      {Number(d.conversionRate) > 0 && Number(d.conversionRate) < 15 && <div className="warn">⚠ You're {(15 - Number(d.conversionRate)).toFixed(1)}% below the 15% benchmark. This gap will be quantified in rupees.</div>}
    </div>
  </>;
}

function Step1({ d, u }) {
  const methods = Array.isArray(d.followUpMethod) ? d.followUpMethod : [];
  const noneSelected = methods.includes("none");
  return <>
    <div className="field">
      <label className="fl">How does your team follow up with leads after the first contact?</label>
      <p className="multi-hint">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        {[
          ["manual", "Phone calls", "— manual outreach"],
          ["whatsapp", "WhatsApp", "— messages & follow-ups"],
          ["crm", "CRM / Automation", "— automated sequences"],
          ["email", "Email", "— campaigns or one-off"],
          ["none", "No regular follow-up", ""],
        ].map(([v, l, h]) => <MCB key={v} val={v} label={l} hint={h} field="followUpMethod" data={d} upd={u} />)}
      </div>
      {noneSelected && <div className="warn">⚠ No follow-up process is one of the top 3 causes of revenue loss in study abroad agencies.</div>}
      {!noneSelected && methods.length >= 2 && <div className="note">✓ Good — using {methods.length} follow-up channels increases your chances of reaching leads at the right moment.</div>}
    </div>
    <div className="field">
      <label className="fl">On average, how many follow-ups do you make per lead before giving up?</label>
      <input type="number" min="0" placeholder="e.g. 3" value={d.followUpCount || ""} onChange={e => u("followUpCount", e.target.value)} />
      <p className="fh">Research shows 80% of sales require 5+ follow-ups. Most agencies stop at 1–2.</p>
      {Number(d.followUpCount) > 0 && Number(d.followUpCount) < 4 && <div className="note">Consider increasing follow-ups — most conversions happen on the 4th–7th contact.</div>}
    </div>
    <div className="field">
      <label className="fl">At which stage do most of your leads go cold or stop responding?</label>
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
      <label className="fl">On average, how many minutes per week does a counselor spend on each active lead?</label>
      <input type="number" min="0" placeholder="e.g. 45" value={d.timePerLead || ""} onChange={e => u("timePerLead", e.target.value)} />
      <p className="fh">Include everything: calls, re-sending documents, updating records, answering the same questions.</p>
    </div>
    <div className="field">
      <label className="fl">What percentage of your team's daily work is repetitive and manual?</label>
      <input type="number" min="0" max="100" placeholder="e.g. 60" value={d.manualWorkPct || ""} onChange={e => u("manualWorkPct", e.target.value)} />
      <p className="fh">Examples: re-sending the same brochures, manually updating spreadsheets, answering the same FAQs repeatedly.</p>
      {Number(d.manualWorkPct) > 50 && <div className="warn">⚠ This is significantly above average. AI automation can typically eliminate 60–70% of this workload.</div>}
    </div>
  </>;
}

function Step3({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">How much does your agency spend on advertising per month? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 50000" value={d.adSpend || ""} onChange={e => u("adSpend", e.target.value)} />
      <p className="fh">Include Google Ads, Meta / Instagram Ads, YouTube promotions, or any paid campaigns.</p>
    </div>
    <div className="field">
      <label className="fl">What is your approximate cost per lead? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 333" value={d.costPerLead || ""} onChange={e => u("costPerLead", e.target.value)} />
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
    <div className="field">
      <label className="fl">What is the average revenue your agency earns per enrolled student? (₹)</label>
      <input type="number" min="0" placeholder="e.g. 150000" value={d.revenuePerStudent || ""} onChange={e => u("revenuePerStudent", e.target.value)} />
      <p className="fh">Include service fees, commissions, application fees. Default is ₹1,50,000 if left blank.</p>
    </div>
  </>;
}

function Step4({ d, u }) {
  const docs = Array.isArray(d.docHandling) ? d.docHandling : [];
  const hasManual = docs.includes("manual");
  const hasDigital = docs.includes("digital");
  return <>
    <div className="field">
      <label className="fl">How does your agency currently handle student documents?</label>
      <p className="multi-hint">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        <MCB val="manual"  label="Paper / physical files"   hint="— printed docs, physical folders"     field="docHandling" data={d} upd={u} />
        <MCB val="email"   label="Email attachments"        hint="— docs sent back and forth by email"  field="docHandling" data={d} upd={u} />
        <MCB val="drive"   label="Cloud storage"            hint="— Google Drive, Dropbox, OneDrive"    field="docHandling" data={d} upd={u} />
        <MCB val="digital" label="Digital workflow / portal" hint="— structured checklists, auto-verify" field="docHandling" data={d} upd={u} />
      </div>
      {hasManual && !hasDigital && <div className="warn">⚠ Manual document handling adds 3–4 hours per student on average.</div>}
      {hasDigital && <div className="note">✓ Great — digital document handling gives you a strong operational base.</div>}
      {hasManual && hasDigital && <div className="note">You're in transition — digitising the remaining manual steps will save significant counselor time.</div>}
    </div>
    <div className="field">
      <label className="fl">Does your agency use a CRM to track leads and follow-ups?</label>
      <div className="choice-grid">
        <CB val="yes"    label="Yes, actively" hint="— we track every lead in the CRM"           field="usesCRM" data={d} upd={u} />
        <CB val="partly" label="Partially"     hint="— we have one but don't use it consistently" field="usesCRM" data={d} upd={u} />
        <CB val="no"     label="No CRM"        hint="— we use spreadsheets, WhatsApp, or nothing" field="usesCRM" data={d} upd={u} />
      </div>
      {d.usesCRM === "no" && <div className="warn">⚠ Agencies without a CRM lose an estimated 35% more leads due to poor follow-up tracking.</div>}
    </div>
  </>;
}

// ── Audit Form ────────────────────────────────────────────────────────────────
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
  };

  const StepComp = [Step0, Step1, Step2, Step3, Step4][step];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "84px 20px 60px" }}>
      <div style={{ width: "100%", maxWidth: 580 }}>
        {/* Step indicator */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div className="sdot" style={{
                  background: i < step ? "var(--navy)" : i === step ? "var(--blue-dim)" : "var(--surface)",
                  border: `${i === step ? "2px" : "1px"} solid ${i <= step ? (i < step ? "var(--navy)" : "var(--blue)") : "var(--border)"}`,
                  color: i < step ? "#fff" : i === step ? "var(--blue)" : "var(--muted)",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {i < step ? (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`sline ${i < step ? "on" : ""}`} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Step {step + 1} of {STEPS.length} — <span style={{ color: "var(--sub)" }}>{STEPS[step].title}</span>
          </div>
        </div>

        <div className="card anim" key={step} style={{ borderTop: "3px solid var(--navy)" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, fontStyle: "italic", marginBottom: 4, color: "var(--navy)" }}>{STEPS[step].title}</h2>
            <p style={{ fontSize: 14, color: "var(--sub)" }}>{STEPS[step].sub}</p>
          </div>
          <StepComp d={data} u={upd} />
          <hr className="div" />
          <div style={{ display: "flex", gap: 10 }}>
            {step > 0 && <button className="btn bo" onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button
              className="btn bp"
              style={{ flex: 1 }}
              disabled={!ok()}
              onClick={() => { if (step < 4) setStep(s => s + 1); else onSubmit(data); }}
            >
              {step === 4 ? "Generate My Audit Report →" : "Continue →"}
            </button>
          </div>
          {!ok() && <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>Please answer all questions above to continue</p>}
        </div>
      </div>
    </div>
  );
}

// ── Analyzing ─────────────────────────────────────────────────────────────────
function Analyzing() {
  const [active, setActive] = useState(0);
  const tasks = [
    { l: "Calculating your lead conversion gap",    d: "Comparing against the 15% industry benchmark…" },
    { l: "Estimating monthly revenue leakage",       d: "Multiplying lost leads × revenue per student…" },
    { l: "Quantifying time and operational waste",   d: "Measuring manual work cost at ₹200/hour…" },
    { l: "Running AI bottleneck diagnosis",          d: "Identifying root causes of drop-offs…" },
    { l: "Building your personalised action plan",   d: "Preparing specific AI solutions for your agency…" },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; if (i < tasks.length) setActive(i); else clearInterval(t); }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, background: "var(--bg)" }}>
      <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
        {/* Premium spinner — crosshair style */}
        <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 32px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid var(--border2)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--navy)", animation: "spin .9s linear infinite" }} />
          <div style={{ position: "absolute", inset: "18px", borderRadius: "50%", background: "var(--navy)" }} />
        </div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, fontStyle: "italic", marginBottom: 8, color: "var(--navy)" }}>Analysing Your Agency</h2>
        <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 40 }}>Your confidential audit is being compiled — takes about 5 seconds.</p>
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 16 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: i <= active ? 1 : 0.25, transition: "opacity .4s" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                background: i < active ? "var(--navy)" : i === active ? "var(--blue-dim)" : "var(--surface)",
                border: `1px solid ${i <= active ? (i < active ? "var(--navy)" : "var(--blue)") : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i < active ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                ) : i === active ? (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", display: "block", animation: "pulse 1s infinite" }} />
                ) : null}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: i <= active ? "var(--text)" : "var(--muted)" }}>{t.l}</div>
                {i === active && <div style={{ fontSize: 12, color: "var(--blue)", marginTop: 3, fontWeight: 500 }}>{t.d}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── calc ──────────────────────────────────────────────────────────────────────
function calc(d) {
  const leads   = Number(d.monthlyLeads) || 0;
  const conv    = Number(d.conversionRate) || 0;
  const rt      = Number(d.responseTime) || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const counsel = Number(d.counselors) || 1;
  const tpl     = Number(d.timePerLead) || 30;
  const manual  = Number(d.manualWorkPct) || 0;
  const ad      = Number(d.adSpend) || 0;
  const cpl     = Number(d.costPerLead) || (leads > 0 ? Math.round(ad / leads) : 0);

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
  const mWasteCost = Math.round(mWaste * 200);
  const rtPenMoney = penalty ? Math.round(conv * 0.3 * leads * rps / 100) : 0;
  const adWasted   = Math.round(ad * (1 - effConv / 100));

  let score = 100;
  if (effConv < BENCH)                    score -= Math.min(28, Math.round((BENCH - effConv) * 2));
  if (rt > 10)                            score -= 18;
  if (manual > 50)                        score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0) score -= 14;
  if (d.usesCRM === "no")                 score -= 10;
  if (docArr.includes("manual") && !docArr.includes("digital")) score -= 8;
  if (d.leadQuality === "low")            score -= 6;
  score = Math.max(8, score);

  const growthPct = effConv > 0 ? Math.min(200, Math.round(((BENCH - effConv) / effConv) * 100)) : 80;

  return {
    leads, conv, effConv: Math.round(effConv * 10) / 10, rt, penalty, rps, counsel, tpl, manual, ad, cpl,
    lost: Math.round(lost), mLoss, aLoss, wWaste, mWasteCost, rtPenMoney, adWasted, score, growthPct,
    followUpArr, docArr,
  };
}

const inr = n => "₹" + Number(n).toLocaleString("en-IN");

// ── Risk Meter (replaces circular gauge) ──────────────────────────────────────
function RiskMeter({ score }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const pct   = score / 100;
  const lbl   = score >= 68 ? "Moderate" : score >= 42 ? "At Risk" : "Critical";
  const color = score >= 68 ? "var(--teal)" : score >= 42 ? "var(--gold)" : "var(--red)";
  const pillCls = score >= 68 ? "pg" : score >= 42 ? "ph" : "pc";

  return (
    <div style={{ minWidth: 220 }}>
      <div className="slabel" style={{ marginBottom: 14 }}>Revenue Risk Meter</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 52, fontWeight: 400, color: "var(--navy)", fontFamily: "var(--serif)", fontStyle: "italic", lineHeight: 1 }}>{score}</div>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>out of 100</div>
          <span className={`pill ${pillCls}`}>{lbl}</span>
        </div>
      </div>

      {/* Segmented bar */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div className="risk-meter-track">
          <div style={{ flex: 42, background: "linear-gradient(90deg, #FCA5A5, #EF4444)", opacity: 0.85 }} />
          <div style={{ flex: 26, background: "linear-gradient(90deg, #FCD34D, #D97706)", opacity: 0.85 }} />
          <div style={{ flex: 32, background: "linear-gradient(90deg, #6EE7B7, #0A7A5E)", opacity: 0.85 }} />
        </div>
        <div className="risk-meter-needle" style={{ left: `${animated ? pct * 100 : 0}%` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        <span>Critical</span>
        <span>At Risk</span>
        <span>Moderate</span>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, vc = "var(--text)" }) {
  return (
    <div className="stat-card">
      <div className="slabel" style={{ marginBottom: 8 }}>{label}</div>
      <div className="mono" style={{ fontSize: 26, color: vc, marginBottom: 4, fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

// ── Bar ───────────────────────────────────────────────────────────────────────
function Bar({ label, val, pct, color, note }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="serif" style={{ fontSize: 15, color: "var(--text)", fontStyle: "italic" }}>{label}</span>
        <span className="mono" style={{ fontSize: 14, color, fontWeight: 600 }}>{val}</span>
      </div>
      <div style={{ height: 4, background: "var(--border2)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${animated ? Math.min(pct, 100) : 0}%`,
          background: color, borderRadius: 2,
          transition: "width 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s",
        }} />
      </div>
      {note && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 5, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

// ── Opportunity Card ──────────────────────────────────────────────────────────
function OppCard({ title, impact, priority, idx }) {
  const pc = priority === "CRITICAL" ? "pc" : priority === "HIGH" ? "ph" : "pm";
  return (
    <div className="card" style={{ padding: "18px 22px", display: "flex", gap: 18, alignItems: "flex-start", animation: "fadeUp .4s ease both", animationDelay: `${idx * 0.07}s` }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}><span className={`pill ${pc}`}>{priority}</span></div>
      <div style={{ flex: 1 }}>
        <div className="serif" style={{ fontWeight: 400, fontSize: 17, fontStyle: "italic", marginBottom: 5, color: "var(--navy)" }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.7 }}>{impact}</div>
      </div>
    </div>
  );
}

// ── Report ────────────────────────────────────────────────────────────────────
function Report({ fd, lead, onRestart }) {
  const m = calc(fd);
  const [aiTxt, setAiTxt] = useState("");
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
            email: lead?.email || "",
            score: m.score,
          }),
        });
        const data = await res.json();
        const reportText = data.text || fallback();
        setAiTxt(reportText);

        fetch("/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: reportText }),
        }).then(r => console.log("/api/capture status:", r.status))
          .catch(e => console.log("/api/capture error:", e.message));

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
      impact: `Bring your ${m.rt}-minute response time to under 2 minutes — 24/7, even on weekends. Estimated recovery: ${Math.round(m.lost * 0.35)} leads/month.`,
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

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "84px 20px 100px" }}>

      {/* ── Report Header ── */}
      <div className="anim" style={{ marginBottom: 32 }}>
        {/* Confidential banner */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div className="slabel" style={{ marginBottom: 0 }}>Fiscal Year 2026 · Agency Revenue Leakage Diagnosis</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, padding: "3px 10px" }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="1" y="5" width="8" height="6" rx="1.5" stroke="var(--muted)" strokeWidth="1.3"/><path d="M3 5V3.5a2 2 0 014 0V5" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Confidential Analysis</span>
          </div>
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, fontStyle: "italic", marginBottom: 10, color: "var(--navy)", lineHeight: 1.15 }}>
          Your Agency Audit Is Ready
        </h1>
        <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.7 }}>
          Based on <strong style={{ color: "var(--text)", fontWeight: 600 }}>{m.leads} monthly leads</strong> · Revenue per student: <strong style={{ color: "var(--text)", fontWeight: 600 }}>{inr(m.rps)}</strong> · Generated {date}
        </p>
      </div>

      {/* ── Score + Risk Meter ── */}
      <div className="card anim d1" style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", borderTop: "3px solid var(--navy)" }}>
        <RiskMeter score={m.score} />
        <div style={{ flex: 1, minWidth: 220, borderLeft: "1px solid var(--border2)", paddingLeft: 28 }}>
          <div className="slabel" style={{ marginBottom: 10 }}>AI Efficiency Diagnosis</div>
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 400, fontStyle: "italic", marginBottom: 12, color: "var(--navy)", lineHeight: 1.3 }}>
            {m.score < 42
              ? "Critical inefficiencies — urgent action required"
              : m.score < 68
                ? "Several revenue leaks found — moderate risk"
                : "Good foundation, but revenue gaps remain"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.8 }}>
            Top-performing agencies score <strong style={{ color: "var(--text)" }}>75 or above</strong>.
            Your score of <strong style={{ color: m.score < 42 ? "var(--red)" : m.score < 68 ? "var(--gold)" : "var(--teal)" }}>{m.score}/100</strong> indicates
            {m.score < 42
              ? " multiple compounding problems actively reducing your revenue every day."
              : m.score < 68
                ? " clear gaps in conversion, follow-up, and operations limiting your growth."
                : " solid operations, with specific gaps holding back full potential."}
          </p>
        </div>
      </div>

      {/* ── Financial Impact ── */}
      <div style={{ marginBottom: 14 }}>
        <div className="slabel" style={{ marginBottom: 12 }}>What You're Losing — Financial Impact</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          <Stat label="Monthly Revenue Loss"   value={inr(m.mLoss)}  sub={`${m.lost} unconverted leads × ${inr(m.rps)}`}         vc="var(--red)" />
          <Stat label="Annual Revenue at Risk" value={inr(m.aLoss)}  sub="Projected over 12 months if nothing changes"             vc="var(--red)" />
          <Stat label="Response Time Penalty"  value={m.penalty ? inr(m.rtPenMoney) : "None"}
            sub={m.penalty ? `${m.rt}min response → 30% conversion loss` : `${m.rt}min — within safe range`}
            vc={m.penalty ? "var(--gold)" : "var(--teal)"} />
          <Stat label="Ad Budget Wasted"       value={inr(m.adWasted)} sub="Spent on leads that don't convert each month"          vc="var(--gold)" />
        </div>
      </div>

      {/* ── Operational Efficiency ── */}
      <div className="card anim d2" style={{ marginBottom: 14 }}>
        <div className="slabel" style={{ marginBottom: 18 }}>Time & Operational Efficiency</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div style={{ borderBottom: "1px solid var(--border2)", paddingBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.04em" }}>COUNSELOR HOURS WASTED / WEEK</div>
            <div className="mono" style={{ fontSize: 32, color: "var(--gold)", fontWeight: 600 }}>{m.wWaste} <span style={{ fontSize: 16, fontWeight: 400 }}>hrs</span></div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Across {m.counsel} counselor{m.counsel > 1 ? "s" : ""}</div>
          </div>
          <div style={{ borderBottom: "1px solid var(--border2)", paddingBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.04em" }}>MONTHLY COST OF INEFFICIENCY</div>
            <div className="mono" style={{ fontSize: 32, color: "var(--red)", fontWeight: 600 }}>{inr(m.mWasteCost)}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>At ₹200/hour labour cost</div>
          </div>
        </div>

        <Bar label="Conversion rate vs. 15% benchmark"
          val={`${m.effConv}% / 15%`}
          pct={(m.effConv / 15) * 100}
          color={m.effConv < 8 ? "var(--red)" : "var(--gold)"}
          note={`You are ${(15 - m.effConv).toFixed(1)}% below benchmark — that gap equals ${m.lost} missed enrollments per month`} />
        <Bar label="Proportion of work that is manual / repetitive"
          val={`${m.manual}%`}
          pct={m.manual}
          color={m.manual > 60 ? "var(--red)" : m.manual > 30 ? "var(--gold)" : "var(--teal)"}
          note={m.manual > 50 ? "High manual load consuming time that should be spent on lead conversion." : "Some manual work exists — targeted automation can clear this."} />
        <Bar label="Lead response speed (target: under 10 minutes)"
          val={`${m.rt} min`}
          pct={Math.min(100, (10 / Math.max(m.rt, 1)) * 100)}
          color={m.rt <= 10 ? "var(--teal)" : "var(--red)"}
          note={m.rt > 10 ? `${m.rt - 10} minutes above the safe threshold. Actively reducing your conversion from ${m.conv}% to ${m.effConv}%.` : "Your response time is optimal."} />
      </div>

      {/* ── AI Analysis ── */}
      <div className="card-ruled anim d3" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 5, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F2F0EB" strokeWidth="1.3"/><path d="M8 5v4M8 11v.5" stroke="#F2F0EB" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)" }}>AI Bottleneck Analysis</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Powered by EnrollmentX AI · Generated from your specific data</div>
          </div>
        </div>
        {aiLoad ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--sub)", fontSize: 14, padding: "8px 0" }}>
            <div className="spinner" />
            <span>Analysing your data with AI — takes a few seconds…</span>
          </div>
        ) : (
          <div style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.9, whiteSpace: "pre-wrap", fontStyle: "normal" }}>{aiTxt}</div>
        )}
      </div>

      {/* ── Opportunities ── */}
      <div style={{ marginBottom: 14 }}>
        <div className="slabel" style={{ marginBottom: 12 }}>AI Automation Opportunities — Ranked by ROI Impact</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {opps.map((o, i) => <OppCard key={i} {...o} idx={i} />)}
        </div>
      </div>

      {/* ── Growth Potential ── */}
      <div className="card-blue anim" style={{ marginBottom: 20 }}>
        <div className="slabel" style={{ marginBottom: 14 }}>Your Growth Potential</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
          <div className="mono serif" style={{ fontSize: 52, color: "var(--teal)", fontWeight: 400, fontStyle: "italic", lineHeight: 1 }}>+{Math.min(m.growthPct, 150)}%</div>
          <div style={{ fontSize: 16, color: "var(--sub)" }}>potential revenue increase</div>
        </div>
        <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.85 }}>
          If your agency reaches the 15% conversion benchmark from your current {m.effConv}%, you would enroll{" "}
          <strong style={{ color: "var(--text)" }}>{m.lost} additional students per month</strong>. At {inr(m.rps)} per student, that is{" "}
          <strong style={{ color: "var(--teal)" }}>{inr(m.mLoss)}/month</strong> in recovered revenue, or{" "}
          <strong style={{ color: "var(--teal)" }}>{inr(m.aLoss)} per year</strong> — without spending a single extra rupee on advertising.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="card-ink" style={{ padding: "52px 40px", textAlign: "center" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="slabel" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>Ready to fix this?</div>
          <h2 className="serif" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400, fontStyle: "italic", color: "#fff", marginBottom: 14, lineHeight: 1.2 }}>
            Recover {inr(m.mLoss)}/month<br />with AI — in 30 days
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, maxWidth: 420, margin: "0 auto 10px", lineHeight: 1.8 }}>
            Our team will build and deploy a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all tailored to how you work.
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 36 }}>
            Monthly leakage identified: <span style={{ color: "#EF4444", fontWeight: 600, fontFamily: "monospace" }}>{inr(m.mLoss)}</span>
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" style={{
              background: "#fff", color: "var(--navy)", fontSize: 15, padding: "15px 36px",
              fontWeight: 700, borderRadius: 5, display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }} onClick={() => window.open("https://calendly.com/charanrathod-inf/30min", "_blank")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Book a Free Strategy Call →
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 14 }} onClick={onRestart}>
              Run Another Audit
            </button>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 22, letterSpacing: "0.04em" }}>
            No commitment · 30-Minute Confidential Call with EnrollmentX Certified Study Abroad Specialists
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Lead Capture ──────────────────────────────────────────────────────────────
function LeadCapture({ formData, onSubmit }) {
  const [mode, setMode] = useState("choose");
  const [lead, setLead] = useState({ name: "", email: "", phone: "", agency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const upd = (k, v) => { setLead(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const teaserScore = (() => {
    const m = calc(formData || {});
    return { score: m.score, mLoss: m.mLoss, lost: m.lost };
  })();

  const save = async (ld) => {
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: ld, formData }),
      });
    } catch (e) {}
    onSubmit(ld);
  };

  const handleGoogle = async () => {
    if (formData) sessionStorage.setItem("audit_fd", JSON.stringify(formData));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "?audit=true" },
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

  const scoreCol = teaserScore.score < 42 ? "var(--red)" : "var(--gold)";

  if (mode === "choose") return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 20px 60px", background: "var(--bg)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "var(--grain)", pointerEvents: "none", opacity: 0.3 }} />
      <div style={{ width: "100%", maxWidth: 520, position: "relative" }}>

        {/* Blurred teaser */}
        <div className="anim" style={{ position: "relative", marginBottom: 16, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
          <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none", background: "var(--surface)", padding: "22px 26px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            {/* Mini score */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, color: "var(--navy)", lineHeight: 1 }}>{teaserScore.score}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.08em" }}>SCORE</div>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div className="slabel" style={{ marginBottom: 4 }}>Monthly Revenue Loss</div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, color: scoreCol }}>{inr(teaserScore.mLoss)}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{teaserScore.lost} leads slipping away each month</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="slabel" style={{ marginBottom: 8 }}>Top Issues Found</div>
              {["Response time penalty", "Conversion gap", "Manual work waste"].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "var(--sub)" }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Lock overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(242,240,235,0.78)", backdropFilter: "blur(2px)", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)" }}>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><rect x="2" y="9" width="14" height="10" rx="2" stroke="var(--navy)" strokeWidth="1.5"/><path d="M5 9V6a4 4 0 018 0v3" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>Your report is ready</div>
            <div style={{ fontSize: 13, color: "var(--sub)" }}>Sign in to unlock your full audit</div>
          </div>
        </div>

        {/* Urgency strip */}
        <div className="anim d1" style={{ background: "var(--red-dim)", border: "1px solid rgba(153,27,27,0.15)", borderRadius: 5, padding: "11px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L1.5 13h13L8 1z" stroke="var(--red)" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5v.5" stroke="var(--red)" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 13, color: "var(--red)", lineHeight: 1.5 }}>
            Your agency is losing <strong>{inr(teaserScore.mLoss)}/month</strong> right now. Sign in to see the full breakdown and fix plan.
          </span>
        </div>

        {/* Auth card */}
        <div className="card anim d2" style={{ padding: "30px", borderTop: "3px solid var(--navy)" }}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, fontStyle: "italic", marginBottom: 6, color: "var(--navy)" }}>Unlock your free audit report</h2>
            <p style={{ fontSize: 13, color: "var(--sub)" }}>Takes 5 seconds · No credit card · 100% free</p>
          </div>

          {/* Google CTA — dominant */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%", background: "var(--navy)", color: "#fff",
              border: "none", borderRadius: 5, padding: "15px 20px",
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all .15s", marginBottom: 12, position: "relative", overflow: "hidden",
              boxShadow: "0 3px 14px rgba(14,23,40,0.25)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--navy2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--navy)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google — it's free
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border2)" }} />
            <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border2)" }} />
          </div>

          <button className="btn bo" style={{ width: "100%", fontSize: 13, padding: "11px 0", color: "var(--muted)" }} onClick={() => setMode("manual")}>
            Enter details manually
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
            {["🔒 No spam", "✓ Free forever", "📧 Report sent to email"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Manual form
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 20px 60px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="btn bo" style={{ fontSize: 13, padding: "7px 14px", marginBottom: 20 }} onClick={() => setMode("choose")}>← Back</button>
        <div className="card anim" style={{ padding: "30px", borderTop: "3px solid var(--navy)" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, fontStyle: "italic", marginBottom: 6, color: "var(--navy)" }}>Your details</h2>
            <p style={{ fontSize: 14, color: "var(--sub)" }}>We'll send your full audit report to your email.</p>
          </div>
          <div className="field">
            <label className="fl">Full Name <span style={{ color: "var(--red)", fontSize: 12 }}>*</span></label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={lead.name} onChange={e => upd("name", e.target.value)} style={{ borderColor: errors.name ? "var(--red)" : undefined }} />
            {errors.name && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.name}</div>}
          </div>
          <div className="field">
            <label className="fl">Work Email <span style={{ color: "var(--red)", fontSize: 12 }}>*</span></label>
            <input type="text" placeholder="e.g. rahul@agency.com" value={lead.email} onChange={e => upd("email", e.target.value)} style={{ borderColor: errors.email ? "var(--red)" : undefined }} />
            {errors.email && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.email}</div>}
          </div>
          <div className="field">
            <label className="fl">Agency Name <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. Global Study Consultants" value={lead.agency} onChange={e => upd("agency", e.target.value)} />
          </div>
          <div className="field">
            <label className="fl">Phone Number <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>— optional</span></label>
            <input type="text" placeholder="e.g. +91 98765 43210" value={lead.phone} onChange={e => upd("phone", e.target.value)} />
          </div>
          <button className="btn bp" style={{ width: "100%", fontSize: 15, padding: "13px 0", opacity: submitting ? 0.7 : 1, marginTop: 4 }} onClick={handleManual} disabled={submitting}>
            {submitting ? "Saving…" : "View My Audit Report →"}
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            🔒 No spam. Your details are used only to deliver your report.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
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
              name:   session.user.user_metadata?.full_name || "",
              email:  session.user.email || "",
              phone:  session.user.user_metadata?.phone || "",
              agency: "",
            };
            setLead(profile);
            fetch("/api/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lead: profile, formData: restoredFd }),
            }).catch(() => {});
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
      {screen === "landing"   && <Landing onStart={() => setScreen("form")} />}
      {screen === "form"      && <AuditForm onSubmit={submitForm} />}
      {screen === "capture"   && <LeadCapture formData={fd} onSubmit={submitLead} />}
      {screen === "analyzing" && <Analyzing />}
      {screen === "report"    && <Report fd={fd} lead={lead} onRestart={restart} />}
    </>
  );
}