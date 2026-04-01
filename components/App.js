"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Palette */
    --gold:        #C8A96E;
    --gold2:       #E8C87E;
    --gold-dim:    rgba(200,169,110,0.12);
    --gold-mid:    rgba(200,169,110,0.25);
    --gold-glow:   rgba(200,169,110,0.45);
    --trust:       #3B82F6;
    --trust-glow:  rgba(59,130,246,0.35);
    --neon-red:    #FF3B3B;
    --neon-red-glow: rgba(255,59,59,0.4);
    --emerald:     #10D9A0;
    --emerald-glow: rgba(16,217,160,0.4);
    --amber-neon:  #FBBF24;
    --amber-glow:  rgba(251,191,36,0.4);
    --white:       #FFFFFF;
    --white-8:     rgba(255,255,255,0.08);
    --white-12:    rgba(255,255,255,0.12);
    --white-20:    rgba(255,255,255,0.20);
    --white-40:    rgba(255,255,255,0.40);
    --white-60:    rgba(255,255,255,0.60);
    --white-80:    rgba(255,255,255,0.80);
    --ink:         #050505;

    /* Glass */
    --glass-bg:    rgba(255,255,255,0.03);
    --glass-bg2:   rgba(255,255,255,0.06);
    --glass-border: rgba(255,255,255,0.12);
    --glass-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.10);

    /* Typography */
    --serif:  'Instrument Serif', Georgia, serif;
    --sans:   'Plus Jakarta Sans', -apple-system, sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--sans);
    line-height: 1.8;
    color: var(--white-80);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Fixed Background Stack ── */
  .bg-fixed {
    position: fixed; inset: 0; z-index: -2;
    background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070');
    background-size: cover; background-position: center;
    filter: brightness(0.3) saturate(0.8);
  }
  .frosted-glass {
    position: fixed; inset: 0; z-index: -1;
    background: radial-gradient(circle at 50% 50%, rgba(200,169,110,0.05) 0%, rgba(10,10,10,0.85) 100%);
    backdrop-filter: blur(12px);
  }
  .grain-overlay {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--gold-mid); border-radius: 10px; }

  /* ── Keyframes ── */
  @keyframes fadeUp    { from { opacity:0; transform:translateY(32px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes fadeOut   { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.97); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.88);} }
  @keyframes pulseCTA  { 0%,100%{box-shadow:0 0 0 0 var(--gold-glow), 0 8px 40px rgba(200,169,110,0.3);} 60%{box-shadow:0 0 0 14px rgba(200,169,110,0), 0 8px 40px rgba(200,169,110,0.5);} }
  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes shimmer   { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
  @keyframes barGrow   { from { width:0; opacity:0; } }
  @keyframes borderGlow { 0%,100%{border-color:var(--glass-border);} 50%{border-color:var(--gold-mid);} }
  @keyframes needleDrop { from { opacity:0; transform:translateX(-50%) scaleY(0); transform-origin:top; } to { opacity:1; transform:translateX(-50%) scaleY(1); } }
  @keyframes floatUp   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
  @keyframes marquee   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes stepIn    { from{opacity:0;transform:translateY(18px) scale(0.99);} to{opacity:1;transform:translateY(0) scale(1);} }

  .anim  { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  .d1 { animation-delay:0.08s; } .d2 { animation-delay:0.16s; }
  .d3 { animation-delay:0.24s; } .d4 { animation-delay:0.32s; }
  .d5 { animation-delay:0.40s; }

  /* ── Glass Card ── */
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: 16px;
  }
  .glass-strong {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12);
    border-radius: 20px;
  }
  .glass-gold {
    background: rgba(200,169,110,0.06);
    backdrop-filter: blur(30px) saturate(150%);
    border: 1px solid rgba(200,169,110,0.25);
    box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(200,169,110,0.15);
    border-radius: 16px;
  }
  .glass:focus-within {
    border-color: var(--gold-mid);
    box-shadow: var(--glass-shadow), 0 0 0 3px var(--gold-dim), 0 0 30px var(--gold-dim);
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  /* ── Typography ── */
  h1, h2.serif-title {
    font-family: var(--serif);
    font-style: italic;
    letter-spacing: -0.02em;
    line-height: 1.05;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  .serif { font-family: var(--serif); }
  .italic { font-style: italic; }
  .mono { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 62px; display: flex; align-items: center; padding: 0 32px;
    background: rgba(5,5,5,0.6);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--glass-border);
    transition: background 0.3s;
  }

  /* ── Inputs ── */
  .fl {
    display: block; font-size: 11px; font-weight: 700;
    color: var(--white-40); margin-bottom: 8px;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .fh { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 6px; line-height: 1.6; }

  input[type=number], input[type=text], select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: var(--white);
    padding: 13px 16px;
    font-size: 15px;
    font-family: var(--sans);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus {
    outline: none;
    border-color: var(--gold);
    background: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 3px var(--gold-dim), 0 0 20px rgba(200,169,110,0.1);
  }
  input::placeholder { color: rgba(255,255,255,0.18); }
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 16px center;
    padding-right: 40px; cursor: pointer;
  }
  select option { background: #1a1a1a; color: #fff; }

  /* ── Choice Buttons ── */
  .choice-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .cb {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 9px 15px;
    font-size: 13px; color: var(--white-60);
    cursor: pointer; transition: all 0.18s;
    font-family: var(--sans); font-weight: 500; line-height: 1.4;
  }
  .cb:hover { border-color: var(--white-40); color: var(--white); background: rgba(255,255,255,0.07); }
  .cb.sel {
    border-color: var(--gold); color: var(--gold);
    background: var(--gold-dim);
    box-shadow: 0 0 0 0.5px var(--gold), 0 0 12px var(--gold-dim);
    font-weight: 600;
  }
  .multi-hint {
    font-size: 10px; color: var(--white-40); margin-bottom: 10px;
    display: flex; align-items: center; gap: 5px;
    font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .field { margin-bottom: 22px; }

  /* ── Alert boxes ── */
  .note {
    background: rgba(16,217,160,0.08);
    border-left: 2px solid var(--emerald);
    border-radius: 0 8px 8px 0; padding: 10px 14px;
    font-size: 13px; color: var(--emerald);
    margin-top: 10px; line-height: 1.6;
  }
  .warn {
    background: rgba(255,59,59,0.07);
    border-left: 2px solid var(--neon-red);
    border-radius: 0 8px 8px 0; padding: 10px 14px;
    font-size: 13px; color: #FF7B7B;
    margin-top: 10px; line-height: 1.6;
  }
  hr.div { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }

  /* ── Pills ── */
  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 11px; border-radius: 4px;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .pc { background: rgba(255,59,59,0.12); color: #FF7B7B; border: 1px solid rgba(255,59,59,0.3); box-shadow: 0 0 10px rgba(255,59,59,0.15); }
  .ph { background: rgba(251,191,36,0.1); color: var(--amber-neon); border: 1px solid rgba(251,191,36,0.25); }
  .pm { background: var(--gold-dim); color: var(--gold2); border: 1px solid var(--gold-mid); }
  .pg { background: rgba(16,217,160,0.08); color: var(--emerald); border: 1px solid rgba(16,217,160,0.25); box-shadow: 0 0 10px rgba(16,217,160,0.12); }

  /* ── Slabel ── */
  .slabel {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--white-40);
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 9px; border-radius: 10px; cursor: pointer;
    font-family: var(--sans); font-weight: 700;
    transition: all 0.2s; border: none;
    letter-spacing: 0.04em;
  }
  .btn-gold {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #050505; padding: 14px 32px; font-size: 14px;
    box-shadow: 0 4px 24px rgba(200,169,110,0.35);
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(200,169,110,0.5); }
  .btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: rgba(255,255,255,0.06); color: var(--white-60);
    border: 1px solid rgba(255,255,255,0.15);
    padding: 14px 28px; font-size: 13px;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: var(--white); border-color: var(--white-40); }
  .btn-cta {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #050505; padding: 20px 52px; font-size: 17px;
    font-weight: 800; border-radius: 12px; letter-spacing: 0.03em;
    box-shadow: 0 8px 40px rgba(200,169,110,0.35);
    animation: pulseCTA 2.4s ease infinite;
  }
  .btn-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 60px rgba(200,169,110,0.55); }

  /* ── Step dots ── */
  .sdot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0; transition: all 0.3s;
  }
  .sline { flex: 1; height: 1px; background: rgba(255,255,255,0.08); transition: background 0.4s; }
  .sline.on { background: var(--gold); }

  /* ── Spinner ── */
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.08); border-top-color: var(--gold);
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ── Risk meter ── */
  .risk-track {
    height: 10px; border-radius: 6px; overflow: visible; display: flex;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
    position: relative;
  }
  .risk-needle {
    position: absolute; top: -12px; width: 3px; height: 34px;
    background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%);
    border-radius: 2px;
    transform: translateX(-50%);
    transition: left 1.8s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.4);
    animation: needleDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.4s both;
  }
  .risk-needle::after {
    content: ''; position: absolute; bottom: -6px; left: 50%;
    transform: translateX(-50%);
    width: 10px; height: 10px; border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 16px rgba(255,255,255,0.9), 0 0 32px rgba(255,255,255,0.5);
  }

  /* ── Marquee ── */
  .marquee-track { overflow: hidden; }
  .marquee-inner { display: flex; animation: marquee 32s linear infinite; width: max-content; }

  /* ── VIP Card ── */
  .vip-card {
    background: #050505;
    border: 2px solid var(--gold);
    border-radius: 24px;
    box-shadow: 0 0 0 1px rgba(200,169,110,0.15), 0 0 60px rgba(200,169,110,0.12), 0 40px 80px -20px rgba(0,0,0,0.8);
    position: relative; overflow: hidden;
  }
  .vip-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(200,169,110,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Stat card ── */
  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px; padding: 20px 22px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.4); }

  /* ── Progress bar top ── */
  .progress-bar-track {
    height: 3px; background: rgba(255,255,255,0.06);
    border-radius: 2px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold2), #fff);
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 0 10px var(--gold-glow);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function toggleMulti(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}
function hasVal(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val);
}
const inr = n => "₹" + Number(n).toLocaleString("en-IN");

/* ─────────────────────────────────────────────────────────────────────────────
   CHOICE BUTTONS
───────────────────────────────────────────────────────────────────────────── */
function CB({ val, label, hint, field, data, upd }) {
  const sel = data[field] === val;
  return (
    <button className={`cb ${sel ? "sel" : ""}`} onClick={() => upd(field, val)}>
      {label}
      {hint && <span style={{ color: sel ? "var(--gold)" : "rgba(255,255,255,0.25)", marginLeft: 6, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
    </button>
  );
}
function MCB({ val, label, hint, field, data, upd }) {
  const selected = hasVal(data, field, val);
  return (
    <button className={`cb ${selected ? "sel" : ""}`} onClick={() => upd(field, toggleMulti(data, field, val))}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 15, height: 15, borderRadius: 4, flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${selected ? "var(--gold)" : "rgba(255,255,255,0.2)"}`,
          background: selected ? "var(--gold)" : "transparent",
          transition: "all 0.18s",
        }}>
          {selected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#050505" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
        {label}
      </span>
      {hint && <span style={{ color: selected ? "var(--gold)" : "rgba(255,255,255,0.25)", marginLeft: 6, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOGO
───────────────────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, var(--gold), var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: 20, color: "#050505", lineHeight: 1 }}>E</span>
      </div>
      <span style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
        Enrollment<span style={{ color: "var(--gold)" }}>X</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────────────────────── */
function Nav({ user, onSignOut, onStart }) {
  return (
    <nav className="nav">
      <Logo />
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        {user ? (
          <>
            <span style={{ fontSize: 13, color: "var(--white-40)" }}>{user.email}</span>
            <button className="btn btn-ghost" style={{ padding: "7px 16px", fontSize: 12 }} onClick={onSignOut}>Sign out</button>
          </>
        ) : (
          <button className="btn btn-gold" style={{ padding: "9px 22px", fontSize: 13 }} onClick={onStart}>
            Start Free Audit
          </button>
        )}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING
───────────────────────────────────────────────────────────────────────────── */
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Hero */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 440px", gap: 80, alignItems: "center" }}>
          {/* Left */}
          <div>
            <div className="anim" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: 40, padding: "7px 18px", marginBottom: 40 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 10px var(--emerald-glow)", animation: "pulse 2s infinite", display: "block" }} />
              <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Free Audit · 2 Minutes · No Credit Card</span>
            </div>

            <h1 className="anim d1" style={{ fontSize: "clamp(46px, 5.5vw, 74px)", fontWeight: 400, marginBottom: 28, color: "#fff" }}>
              Stop losing<br />
              <em style={{ color: "var(--gold)", textShadow: "0 0 40px rgba(200,169,110,0.4), 0 2px 10px rgba(0,0,0,0.3)" }}>₹2 crore</em><br />
              every year
            </h1>

            <p className="anim d2" style={{ fontSize: 18, color: "var(--white-60)", lineHeight: 1.9, maxWidth: 500, marginBottom: 48, fontWeight: 300 }}>
              Most study abroad agencies lose 35–60% of their revenue to slow response times, broken follow-up, and manual operations. Find out exactly how much — in 2 minutes.
            </p>

            <div className="anim d3" style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 60 }}>
              <button className="btn btn-gold" style={{ fontSize: 15, padding: "17px 40px" }} onClick={onStart}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5L3 8.5h4v7l6-7h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                Get My Free Audit Report
              </button>
              <span style={{ fontSize: 12, color: "var(--white-40)", letterSpacing: "0.04em" }}>2–3 minutes · 100% confidential</span>
            </div>

            {/* Stats */}
            <div className="anim d4" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[["₹2.4Cr+", "Avg annual leak found"], ["87%", "Miss AI opportunities"], ["30 days", "To see results"]].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 28, color: "var(--gold)", lineHeight: 1, textShadow: "0 0 20px rgba(200,169,110,0.3)" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "var(--white-40)", marginTop: 5, fontWeight: 400 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: glass card */}
          <div className="glass-strong anim d2" style={{ padding: "32px", animation: "floatUp 5s ease-in-out infinite" }}>
            <div className="slabel" style={{ marginBottom: 22 }}>What we analyse</div>
            {[
              ["Response time & conversion gap", "Most agencies lose 30% here alone"],
              ["Follow-up process & drop-off stages", "80% of sales need 5+ touches"],
              ["Manual workload & counselor efficiency", "Typically 40+ hrs/week wasted"],
              ["Ad spend ROI & cost per conversion", "Most spend 2× what they should"],
              ["CRM usage & document workflow", "35% more leads lost without CRM"],
            ].map(([t, s], i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 4 ? 20 : 0, paddingBottom: i < 4 ? 20 : 0, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--gold-dim)", border: "1px solid var(--gold-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--gold)" }}>{i + 1}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--white-80)", fontWeight: 600, marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "var(--white-40)" }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: "linear-gradient(90deg, var(--gold), var(--gold2), var(--gold))", padding: "13px 0", position: "relative", zIndex: 1 }}>
        <div className="marquee-track">
          <div className="marquee-inner">
            {Array(4).fill(["Lead Conversion Audit", "AI Revenue Recovery", "WhatsApp Automation", "CRM Optimisation", "Response Time Analysis", "Document Workflow", "Study Abroad Specialists"]).flat().map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 800, color: "#050505", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 32px", flexShrink: 0 }}>
                {t} &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ position: "relative", zIndex: 1, padding: "100px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="slabel" style={{ marginBottom: 16 }}>How it works</div>
            <h2 className="serif-title" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, color: "#fff" }}>
              From answers to action<br /><em>in under 3 minutes</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
            {[
              { n: "01", t: "Answer 15 questions", d: "About your leads, team, budget, and operations." },
              { n: "02", t: "AI analyses your agency", d: "We calculate your exact revenue gap vs. benchmark." },
              { n: "03", t: "Get your report", d: "Rupee figures, bottleneck diagnosis, ranked fix plan." },
              { n: "04", t: "Book your call", d: "Our specialists deploy the AI fixes for you." },
            ].map((s, i) => (
              <div key={i} className="glass" style={{ padding: "32px 26px", borderRadius: i === 0 ? "16px 4px 4px 16px" : i === 3 ? "4px 16px 16px 4px" : "4px", background: i === 3 ? "rgba(200,169,110,0.08)" : "var(--glass-bg)", borderColor: i === 3 ? "rgba(200,169,110,0.3)" : "var(--glass-border)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: i === 3 ? "var(--gold)" : "var(--white-40)", letterSpacing: "0.12em", marginBottom: 18 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, fontWeight: 400, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: "var(--white-40)", lineHeight: 1.7 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 52 }}>
            <button className="btn btn-ghost" style={{ fontSize: 14, padding: "14px 36px" }} onClick={onStart}>Start My Free Audit →</button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ position: "relative", zIndex: 1, padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="slabel" style={{ marginBottom: 48, textAlign: "center" }}>What agencies discover</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { q: "We found ₹18L/month leaking through slow response time alone. Fixed in 2 weeks with their chatbot.", r: "Director, Premium Study Hub, Pune" },
              { q: "Our counselors were wasting 38 hours a week on tasks AI now handles. We used that time to close 40% more deals.", r: "Founder, Global Pathways, Hyderabad" },
              { q: "Went from 7% to 14% conversion in 60 days. The WhatsApp automation was the biggest lever.", r: "MD, Abroad Dreams Consultancy, Mumbai" },
            ].map((t, i) => (
              <div key={i} className="glass" style={{ padding: "28px" }}>
                <div style={{ fontSize: 36, color: "var(--gold)", lineHeight: 1, marginBottom: 14, fontFamily: "var(--serif)", textShadow: "0 0 20px rgba(200,169,110,0.3)" }}>"</div>
                <p style={{ fontSize: 14, color: "var(--white-60)", lineHeight: 1.85, marginBottom: 18 }}>{t.q}</p>
                <div style={{ fontSize: 10, color: "var(--white-40)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FORM STEPS
───────────────────────────────────────────────────────────────────────────── */
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
      <label className="fl">Monthly enquiries / leads</label>
      <input type="number" min="0" placeholder="e.g. 150" value={d.monthlyLeads || ""} onChange={e => u("monthlyLeads", e.target.value)} />
      <p className="fh">Count all channels: walk-ins, calls, WhatsApp, website forms, social DMs.</p>
    </div>
    <div className="field">
      <label className="fl">Where do most leads come from?</label>
      <p className="multi-hint">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select all that apply
      </p>
      <div className="choice-grid">
        {[["ads","Paid Ads","— Google, Meta"],["referrals","Referrals","— past students"],["organic","Organic / SEO","— website & search"],["walk-ins","Walk-ins","— in-person"],["social","Social Media","— YouTube, Instagram"]].map(([v,l,h]) => <MCB key={v} val={v} label={l} hint={h} field="leadSource" data={d} upd={u} />)}
      </div>
    </div>
    <div className="field">
      <label className="fl">Response time to a new enquiry (minutes)</label>
      <input type="number" min="0" placeholder="e.g. 30" value={d.responseTime || ""} onChange={e => u("responseTime", e.target.value)} />
      <p className="fh">Be honest — if it takes 2 hours, enter 120. One of the biggest revenue levers.</p>
      {Number(d.responseTime) > 10 && <div className="warn">⚠ Leads contacted after 10 min are 7× less likely to convert. This penalises your audit score.</div>}
      {Number(d.responseTime) <= 10 && Number(d.responseTime) > 0 && <div className="note">✓ Great — you're within the optimal response window.</div>}
    </div>
    <div className="field">
      <label className="fl">Lead-to-enrolment conversion rate (%)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 8" value={d.conversionRate || ""} onChange={e => u("conversionRate", e.target.value)} />
      <p className="fh">10 enrolments from 100 enquiries = 10%. Industry benchmark is 15%.</p>
      {Number(d.conversionRate) > 0 && Number(d.conversionRate) < 15 && <div className="warn">⚠ You are {(15 - Number(d.conversionRate)).toFixed(1)}% below the 15% benchmark. This will be quantified in rupees.</div>}
    </div>
  </>;
}

function Step1({ d, u }) {
  const methods = Array.isArray(d.followUpMethod) ? d.followUpMethod : [];
  return <>
    <div className="field">
      <label className="fl">How do you follow up after first contact?</label>
      <p className="multi-hint"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> Select all that apply</p>
      <div className="choice-grid">
        {[["manual","Phone calls","— manual outreach"],["whatsapp","WhatsApp","— messages & follow-ups"],["crm","CRM / Automation","— automated sequences"],["email","Email","— campaigns or one-off"],["none","No regular follow-up",""]].map(([v,l,h]) => <MCB key={v} val={v} label={l} hint={h} field="followUpMethod" data={d} upd={u} />)}
      </div>
      {methods.includes("none") && <div className="warn">⚠ No follow-up process is one of the top 3 causes of revenue loss in study abroad agencies.</div>}
      {!methods.includes("none") && methods.length >= 2 && <div className="note">✓ Using {methods.length} channels improves your chances of reaching leads at the right moment.</div>}
    </div>
    <div className="field">
      <label className="fl">Follow-ups per lead before giving up</label>
      <input type="number" min="0" placeholder="e.g. 3" value={d.followUpCount || ""} onChange={e => u("followUpCount", e.target.value)} />
      <p className="fh">80% of sales require 5+ follow-ups. Most agencies stop at 1–2.</p>
      {Number(d.followUpCount) > 0 && Number(d.followUpCount) < 4 && <div className="note">Consider increasing — most conversions happen on the 4th–7th contact.</div>}
    </div>
    <div className="field">
      <label className="fl">Where do most leads go cold?</label>
      <select value={d.dropOffStage || ""} onChange={e => u("dropOffStage", e.target.value)}>
        <option value="">Select the most common drop-off point</option>
        <option value="first-contact">After first contact — they go silent immediately</option>
        <option value="counseling">After the initial counselling session</option>
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
      <label className="fl">Number of counselors / student advisors</label>
      <input type="number" min="1" placeholder="e.g. 5" value={d.counselors || ""} onChange={e => u("counselors", e.target.value)} />
      <p className="fh">Include all staff who handle student enquiries, even part-time.</p>
    </div>
    <div className="field">
      <label className="fl">Minutes per week spent per active lead</label>
      <input type="number" min="0" placeholder="e.g. 45" value={d.timePerLead || ""} onChange={e => u("timePerLead", e.target.value)} />
      <p className="fh">Include calls, re-sending documents, updating records, answering repeated questions.</p>
    </div>
    <div className="field">
      <label className="fl">Percentage of daily work that is repetitive / manual (%)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 60" value={d.manualWorkPct || ""} onChange={e => u("manualWorkPct", e.target.value)} />
      <p className="fh">Examples: re-sending brochures, updating spreadsheets, answering the same FAQs.</p>
      {Number(d.manualWorkPct) > 50 && <div className="warn">⚠ Significantly above average. AI can typically eliminate 60–70% of this workload.</div>}
    </div>
  </>;
}

function Step3({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">Monthly advertising spend (₹)</label>
      <input type="number" min="0" placeholder="e.g. 50000" value={d.adSpend || ""} onChange={e => u("adSpend", e.target.value)} />
      <p className="fh">Include Google Ads, Meta / Instagram Ads, YouTube promotions, paid campaigns.</p>
    </div>
    <div className="field">
      <label className="fl">Cost per lead (₹) — optional, we'll calculate</label>
      <input type="number" min="0" placeholder="e.g. 333" value={d.costPerLead || ""} onChange={e => u("costPerLead", e.target.value)} />
    </div>
    <div className="field">
      <label className="fl">Lead quality</label>
      <div className="choice-grid">
        <CB val="low" label="Low" hint="— mostly unserious" field="leadQuality" data={d} upd={u} />
        <CB val="medium" label="Medium" hint="— mix of serious and casual" field="leadQuality" data={d} upd={u} />
        <CB val="high" label="High" hint="— mostly ready to enrol" field="leadQuality" data={d} upd={u} />
      </div>
    </div>
    <div className="field">
      <label className="fl">Average revenue per enrolled student (₹)</label>
      <input type="number" min="0" placeholder="e.g. 150000" value={d.revenuePerStudent || ""} onChange={e => u("revenuePerStudent", e.target.value)} />
      <p className="fh">Include service fees, commissions, application fees. Default ₹1,50,000 if blank.</p>
    </div>
  </>;
}

function Step4({ d, u }) {
  const docs = Array.isArray(d.docHandling) ? d.docHandling : [];
  return <>
    <div className="field">
      <label className="fl">How do you handle student documents?</label>
      <p className="multi-hint"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> Select all that apply</p>
      <div className="choice-grid">
        <MCB val="manual" label="Paper / physical files" hint="— physical folders" field="docHandling" data={d} upd={u} />
        <MCB val="email" label="Email attachments" hint="— back and forth" field="docHandling" data={d} upd={u} />
        <MCB val="drive" label="Cloud storage" hint="— Drive, Dropbox" field="docHandling" data={d} upd={u} />
        <MCB val="digital" label="Digital portal" hint="— checklists, auto-verify" field="docHandling" data={d} upd={u} />
      </div>
      {docs.includes("manual") && !docs.includes("digital") && <div className="warn">⚠ Manual document handling adds 3–4 hours per student on average.</div>}
      {docs.includes("digital") && <div className="note">✓ Digital document handling gives you a strong operational base.</div>}
    </div>
    <div className="field">
      <label className="fl">CRM usage</label>
      <div className="choice-grid">
        <CB val="yes" label="Yes, actively" hint="— every lead tracked" field="usesCRM" data={d} upd={u} />
        <CB val="partly" label="Partially" hint="— inconsistently used" field="usesCRM" data={d} upd={u} />
        <CB val="no" label="No CRM" hint="— spreadsheets or nothing" field="usesCRM" data={d} upd={u} />
      </div>
      {d.usesCRM === "no" && <div className="warn">⚠ Agencies without a CRM lose an estimated 35% more leads.</div>}
    </div>
  </>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUDIT FORM
───────────────────────────────────────────────────────────────────────────── */
function AuditForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [exiting, setExiting] = useState(false);
  const upd = (k, v) => setData(p => ({ ...p, [k]: v }));

  const ok = () => {
    if (step === 0) return data.monthlyLeads && Array.isArray(data.leadSource) && data.leadSource.length > 0 && data.responseTime && data.conversionRate;
    if (step === 1) return Array.isArray(data.followUpMethod) && data.followUpMethod.length > 0 && data.followUpCount && data.dropOffStage;
    if (step === 2) return data.counselors && data.timePerLead && data.manualWorkPct;
    if (step === 3) return data.adSpend && data.leadQuality;
    if (step === 4) return Array.isArray(data.docHandling) && data.docHandling.length > 0 && data.usesCRM;
  };

  const goNext = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (step < 4) setStep(s => s + 1);
      else onSubmit(data);
    }, 280);
  };
  const goBack = () => {
    setExiting(true);
    setTimeout(() => { setExiting(false); setStep(s => s - 1); }, 280);
  };

  const StepComp = [Step0, Step1, Step2, Step3, Step4][step];
  const pct = Math.round((step / 5) * 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "92px 20px 60px", position: "relative", zIndex: 1 }}>

      {/* Fixed top progress */}
      <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 150 }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Step indicator */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div className="sdot" style={{
                  background: i < step ? "var(--gold)" : i === step ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.04)",
                  border: `${i === step ? "1.5px" : "1px"} solid ${i <= step ? (i < step ? "var(--gold)" : "var(--gold)") : "rgba(255,255,255,0.15)"}`,
                  color: i < step ? "#050505" : i === step ? "var(--gold)" : "var(--white-40)",
                  boxShadow: i <= step ? "0 0 16px rgba(200,169,110,0.3)" : "none",
                }}>
                  {i < step ? (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`sline ${i < step ? "on" : ""}`} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--white-40)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Step {step + 1} of {STEPS.length} — <span style={{ color: "var(--white-60)" }}>{STEPS[step].title}</span>
          </div>
        </div>

        {/* Card with step transition */}
        <div
          className="glass"
          style={{
            padding: "36px",
            animation: exiting ? "fadeOut 0.28s cubic-bezier(0.16,1,0.3,1) forwards" : "stepIn 0.55s cubic-bezier(0.16,1,0.3,1) both",
            borderTop: "1px solid rgba(200,169,110,0.4)",
            boxShadow: "var(--glass-shadow), 0 0 0 0.5px rgba(200,169,110,0.15) inset",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26, fontWeight: 400, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>{STEPS[step].title}</h2>
            <p style={{ fontSize: 13, color: "var(--white-40)" }}>{STEPS[step].sub}</p>
          </div>

          <StepComp d={data} u={upd} />

          <hr className="div" />
          <div style={{ display: "flex", gap: 10 }}>
            {step > 0 && (
              <button className="btn btn-ghost" style={{ padding: "12px 20px", fontSize: 13 }} onClick={goBack}>← Back</button>
            )}
            <button
              className="btn btn-gold"
              style={{ flex: 1, padding: "13px", fontSize: 14, opacity: !ok() ? 0.4 : 1, cursor: !ok() ? "not-allowed" : "pointer" }}
              disabled={!ok()}
              onClick={goNext}
            >
              {step === 4 ? "Generate My Audit Report →" : "Continue →"}
            </button>
          </div>
          {!ok() && <p style={{ fontSize: 11, color: "var(--white-40)", textAlign: "center", marginTop: 10, letterSpacing: "0.04em" }}>Complete all fields above to continue</p>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANALYZING
───────────────────────────────────────────────────────────────────────────── */
function Analyzing() {
  const [active, setActive] = useState(0);
  const tasks = [
    { l: "Calculating lead conversion gap",       d: "Comparing against the 15% industry benchmark…" },
    { l: "Estimating monthly revenue leakage",    d: "Multiplying lost leads × revenue per student…" },
    { l: "Quantifying operational waste",          d: "Measuring manual work cost at ₹200/hour…" },
    { l: "Running AI bottleneck diagnosis",        d: "Identifying root causes of drop-offs…" },
    { l: "Building your personalised action plan", d: "Preparing specific AI solutions for your agency…" },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; if (i < tasks.length) setActive(i); else clearInterval(t); }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
        <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 36px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(200,169,110,0.15)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--gold)", animation: "spin 1.1s linear infinite", boxShadow: "0 0 20px rgba(200,169,110,0.2)" }} />
          <div style={{ position: "absolute", inset: "14px", borderRadius: "50%", background: "linear-gradient(135deg, var(--gold), var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20, color: "#050505" }}>E</span>
          </div>
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 30, fontWeight: 400, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Analysing Your Agency</h2>
        <p style={{ fontSize: 14, color: "var(--white-40)", marginBottom: 48 }}>Your confidential audit is being compiled — takes about 5 seconds.</p>

        <div className="glass" style={{ padding: "28px 32px", textAlign: "left" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: i <= active ? 1 : 0.2, transition: "opacity 0.5s" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  background: i < active ? "var(--gold)" : i === active ? "rgba(200,169,110,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i <= active ? (i < active ? "var(--gold)" : "rgba(200,169,110,0.5)") : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: i < active ? "0 0 14px rgba(200,169,110,0.4)" : "none",
                }}>
                  {i < active ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#050505" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  ) : i === active ? (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "block", animation: "pulse 1s infinite" }} />
                  ) : null}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: i <= active ? "var(--white-80)" : "var(--white-40)" }}>{t.l}</div>
                  {i === active && <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 3 }}>{t.d}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CALC
───────────────────────────────────────────────────────────────────────────── */
function calc(d) {
  const leads   = Number(d.monthlyLeads) || 0;
  const conv    = Number(d.conversionRate) || 0;
  const rt      = Number(d.responseTime) || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const counsel = Number(d.counselors) || 1;
  const tpl     = Number(d.timePerLead) || 30;
  const manual  = Number(d.manualWorkPct) || 0;
  const ad      = Number(d.adSpend) || 0;
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
  if (effConv < BENCH)    score -= Math.min(28, Math.round((BENCH - effConv) * 2));
  if (rt > 10)            score -= 18;
  if (manual > 50)        score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0) score -= 14;
  if (d.usesCRM === "no") score -= 10;
  if (docArr.includes("manual") && !docArr.includes("digital")) score -= 8;
  if (d.leadQuality === "low") score -= 6;
  score = Math.max(8, score);
  const growthPct = effConv > 0 ? Math.min(200, Math.round(((BENCH - effConv) / effConv) * 100)) : 80;
  return { leads, conv, effConv: Math.round(effConv * 10) / 10, rt, penalty, rps, counsel, tpl, manual, ad, lost: Math.round(lost), mLoss, aLoss, wWaste, mWasteCost, rtPenMoney, adWasted, score, growthPct, followUpArr, docArr };
}

/* ─────────────────────────────────────────────────────────────────────────────
   RISK METER
───────────────────────────────────────────────────────────────────────────── */
function RiskMeter({ score }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);

  const pct = score / 100;
  const lbl = score >= 68 ? "Moderate" : score >= 42 ? "At Risk" : "Critical";
  const pillCls = score >= 68 ? "pg" : score >= 42 ? "ph" : "pc";
  const scoreColor = score >= 68 ? "var(--emerald)" : score >= 42 ? "var(--amber-neon)" : "var(--neon-red)";
  const scoreGlow  = score >= 68 ? "var(--emerald-glow)" : score >= 42 ? "var(--amber-glow)" : "var(--neon-red-glow)";

  return (
    <div style={{ minWidth: 220 }}>
      <div className="slabel" style={{ marginBottom: 16 }}>Revenue Health Score</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 68, fontWeight: 400, color: scoreColor, lineHeight: 1, textShadow: `0 0 30px ${scoreGlow}, 0 0 60px ${scoreGlow}` }}>{score}</div>
        <div style={{ paddingBottom: 10 }}>
          <div style={{ fontSize: 12, color: "var(--white-40)", marginBottom: 7 }}>out of 100</div>
          <span className={`pill ${pillCls}`}>{lbl}</span>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div className="risk-track">
          <div style={{ flex: 42, background: "linear-gradient(90deg, rgba(255,59,59,0.7), #FF3B3B)", borderRadius: "6px 0 0 6px", boxShadow: "0 0 12px rgba(255,59,59,0.4)" }} />
          <div style={{ flex: 26, background: "linear-gradient(90deg, rgba(251,191,36,0.7), #FBBF24)", boxShadow: "0 0 12px rgba(251,191,36,0.3)" }} />
          <div style={{ flex: 32, background: "linear-gradient(90deg, rgba(16,217,160,0.7), #10D9A0)", borderRadius: "0 6px 6px 0", boxShadow: "0 0 12px rgba(16,217,160,0.4)" }} />
        </div>
        <div className="risk-needle" style={{ left: `${animated ? pct * 100 : 2}%` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--white-40)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <span>Critical</span><span>At Risk</span><span>Moderate</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAT / BAR / OPP
───────────────────────────────────────────────────────────────────────────── */
function Stat({ label, value, sub, vc = "var(--white-80)" }) {
  return (
    <div className="stat-card">
      <div className="slabel" style={{ marginBottom: 10 }}>{label}</div>
      <div className="mono" style={{ fontSize: 28, color: vc, marginBottom: 6, fontWeight: 700, textShadow: vc !== "var(--white-80)" ? `0 0 20px ${vc}88` : "none" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--white-40)", lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, val, pct, color, note }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: "var(--white-60)", fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 15, color, fontWeight: 700, textShadow: `0 0 16px ${color}88` }}>{val}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)" }}>
        <div style={{ height: "100%", width: `${animated ? Math.min(pct, 100) : 0}%`, background: color, borderRadius: 3, transition: "width 1.6s cubic-bezier(0.22,1,0.36,1) 0.3s", boxShadow: `0 0 12px ${color}88, 0 0 24px ${color}44` }} />
      </div>
      {note && <div style={{ fontSize: 12, color: "var(--white-40)", marginTop: 6, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

function OppCard({ title, impact, priority, idx }) {
  const pc = priority === "CRITICAL" ? "pc" : priority === "HIGH" ? "ph" : "pm";
  return (
    <div className="glass" style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start", animation: "fadeUp .5s cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${idx * 0.08}s`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 30px 60px -12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}><span className={`pill ${pc}`}>{priority}</span></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: 18, marginBottom: 6, color: "#fff", letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--white-60)", lineHeight: 1.75 }}>{impact}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REPORT
───────────────────────────────────────────────────────────────────────────── */
function Report({ fd, lead, onRestart }) {
  const m = calc(fd);
  const [aiTxt, setAiTxt] = useState("");
  const [aiLoad, setAiLoad] = useState(true);

  useEffect(() => {
    const followUpStr = m.followUpArr.length ? m.followUpArr.join(", ") : "none";
    const docStr = m.docArr.length ? m.docArr.join(", ") : "not specified";
    const prompt = `You are a senior business analyst for a study abroad agency. Write a sharp, direct analysis using the exact numbers provided. No generic advice — every sentence must reference actual data.

Agency data:
- Monthly enquiries: ${m.leads}
- Current conversion: ${m.conv}% → effective: ${m.effConv}% (${m.penalty ? "30% penalty applied because response time is " + m.rt + " min" : "no penalty"})
- Industry benchmark: 15%
- Lost leads/month: ${m.lost}
- Monthly revenue loss: ₹${m.mLoss.toLocaleString("en-IN")}
- Annual revenue at risk: ₹${m.aLoss.toLocaleString("en-IN")}
- Manual/repetitive work: ${m.manual}%
- Weekly wasted counselor hours: ${m.wWaste} hrs
- Follow-up methods: ${followUpStr}
- Lead drop-off stage: ${fd.dropOffStage}
- CRM: ${fd.usesCRM}, Document handling: ${docStr}
- Lead quality: ${fd.leadQuality}
- Audit score: ${m.score}/100

Write 4 punchy paragraphs: (1) Biggest bottleneck + its rupee impact. (2) Why leads drop at "${fd.dropOffStage}" stage. (3) How response time + manual work compound the problem. (4) Top 2 AI fixes with estimated ROI. Use real numbers throughout.`;

    (async () => {
      try {
        const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, businessName: lead?.agency || "", email: lead?.email || "", score: m.score }) });
        const data = await res.json();
        const reportText = data.text || fallback();
        setAiTxt(reportText);
        fetch("/api/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: reportText }) }).catch(() => {});
      } catch {
        const reportText = fallback();
        setAiTxt(reportText);
        fetch("/api/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: reportText }) }).catch(() => {});
      } finally { setAiLoad(false); }
    })();
  }, []);

  const fallback = () => {
    const followUpStr = m.followUpArr.includes("none") || m.followUpArr.length === 0 ? "no structured follow-up" : m.followUpArr.join(" + ");
    return `Your agency receives ${m.leads} leads per month but converts only ${m.effConv}% — that's ${(15 - m.effConv).toFixed(1)}% below the 15% industry benchmark, costing you ${m.lost} students and ${inr(m.mLoss)} every single month. ${m.penalty ? `Your ${m.rt}-minute response time is triggering a 30% conversion penalty — leads contacted after 10 minutes are statistically 7× harder to close, dropping your effective rate from ${m.conv}% to ${m.effConv}%.` : `While your response time is within range, the conversion gap alone represents ${inr(m.aLoss)} in annual lost revenue.`} On top of this, ${m.manual}% manual workload consumes ${m.wWaste} counselor hours per week. Your current follow-up approach (${followUpStr}) and the ${fd.dropOffStage} drop-off point are the two highest-leverage areas to fix with AI automation — agencies report a 40–60% lead recovery rate within 90 days.`;
  };

  const opps = [
    { title: "AI Chatbot for Instant Lead Response", impact: `Bring your ${m.rt}-minute response time to under 2 minutes — 24/7, even on weekends. Estimated recovery: ${Math.round(m.lost * 0.35)} leads/month.`, priority: m.rt > 15 ? "CRITICAL" : "HIGH" },
    { title: "Automated WhatsApp Follow-up Sequences", impact: `Replace or augment your current follow-up (${m.followUpArr.length ? m.followUpArr.join(", ") : "none"}) with personalised, multi-step WhatsApp sequences. Directly addresses the ${fd.dropOffStage} drop-off.`, priority: m.followUpArr.includes("none") || m.followUpArr.length === 0 ? "CRITICAL" : "HIGH" },
    { title: fd.usesCRM === "no" ? "CRM Setup + Lead Pipeline Tracking" : "CRM Automation & Smart Workflows", impact: fd.usesCRM === "no" ? `No CRM means no visibility. A configured CRM saves your ${m.counsel} counselor${m.counsel > 1 ? "s" : ""} ~${Math.round(m.wWaste * 0.35)} hours/week.` : `Auto-assign leads, send reminders, generate weekly dashboards — cutting manual entry by ~40%.`, priority: fd.usesCRM === "no" ? "HIGH" : "MEDIUM" },
    { title: "Document Processing Automation", impact: m.docArr.includes("manual") && !m.docArr.includes("digital") ? `Manual docs add 3–4 hrs/student. An AI portal reduces this to 45 min, freeing ~${Math.round(m.wWaste * 0.3)} hrs/month.` : `Upgrade your process (${m.docArr.join(", ")}) with smart checklists and auto-verification — reducing errors by 70%.`, priority: m.docArr.includes("manual") && !m.docArr.includes("digital") ? "HIGH" : "MEDIUM" },
  ];

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 62 }}>
      {/* Report hero */}
      <div style={{ padding: "64px 40px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div className="slabel" style={{ margin: 0 }}>FY 2026 · Agency Revenue Leakage Diagnosis</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 4, padding: "3px 10px" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><rect x="0.5" y="4.5" width="8" height="6" rx="1.5" stroke="var(--gold)" strokeWidth="1.2"/><path d="M2.5 4.5V3.5a2 2 0 014 0v1" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>Confidential</span>
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 400, color: "#fff", marginBottom: 14 }}>
            Your Agency Audit<br /><em>Is Ready</em>
          </h1>
          <p style={{ color: "var(--white-40)", fontSize: 15 }}>
            Based on <strong style={{ color: "var(--white-80)" }}>{m.leads} monthly leads</strong> · Revenue per student: <strong style={{ color: "var(--white-80)" }}>{inr(m.rps)}</strong> · Generated {date}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "36px 24px 100px" }}>

        {/* Score + Diagnosis */}
        <div className="glass anim" style={{ padding: "32px", marginBottom: 20, display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap", borderTop: "1px solid rgba(200,169,110,0.4)" }}>
          <RiskMeter score={m.score} />
          <div style={{ flex: 1, minWidth: 220, borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 32 }}>
            <div className="slabel" style={{ marginBottom: 12 }}>AI Efficiency Diagnosis</div>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, fontWeight: 400, marginBottom: 14, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              {m.score < 42 ? "Critical inefficiencies — urgent action required" : m.score < 68 ? "Several revenue leaks — moderate risk" : "Good foundation, specific gaps remain"}
            </h2>
            <p style={{ fontSize: 14, color: "var(--white-60)", lineHeight: 1.9 }}>
              Top agencies score <strong style={{ color: "var(--white-80)" }}>75+</strong>. Your score of <strong style={{ color: m.score < 42 ? "var(--neon-red)" : m.score < 68 ? "var(--amber-neon)" : "var(--emerald)" }}>{m.score}/100</strong> indicates
              {m.score < 42 ? " multiple compounding problems actively reducing your revenue every day." : m.score < 68 ? " clear gaps in conversion, follow-up, and operations limiting your growth." : " solid operations with specific gaps holding back full potential."}
            </p>
          </div>
        </div>

        {/* Financial stats */}
        <div style={{ marginBottom: 20 }}>
          <div className="slabel" style={{ marginBottom: 14 }}>Financial Impact — What You're Losing</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <Stat label="Monthly Revenue Loss" value={inr(m.mLoss)} sub={`${m.lost} unconverted leads × ${inr(m.rps)}`} vc="var(--neon-red)" />
            <Stat label="Annual Revenue at Risk" value={inr(m.aLoss)} sub="Projected over 12 months" vc="var(--neon-red)" />
            <Stat label="Response Time Penalty" value={m.penalty ? inr(m.rtPenMoney) : "None"} sub={m.penalty ? `${m.rt}min → 30% conversion loss` : `${m.rt}min — within safe range`} vc={m.penalty ? "var(--amber-neon)" : "var(--emerald)"} />
            <Stat label="Ad Budget Wasted" value={inr(m.adWasted)} sub="Spent on leads that don't convert" vc="var(--amber-neon)" />
          </div>
        </div>

        {/* Efficiency bars */}
        <div className="glass anim d2" style={{ padding: "32px", marginBottom: 20 }}>
          <div className="slabel" style={{ marginBottom: 24 }}>Time & Operational Efficiency</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 }}>
            <div style={{ paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="slabel" style={{ marginBottom: 8, fontSize: 9 }}>Counselor hours wasted / week</div>
              <div className="mono" style={{ fontSize: 38, color: "var(--amber-neon)", fontWeight: 700, textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>{m.wWaste} <span style={{ fontSize: 16, fontWeight: 400, color: "var(--white-40)" }}>hrs</span></div>
            </div>
            <div style={{ paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="slabel" style={{ marginBottom: 8, fontSize: 9 }}>Monthly cost of inefficiency</div>
              <div className="mono" style={{ fontSize: 38, color: "var(--neon-red)", fontWeight: 700, textShadow: "0 0 20px rgba(255,59,59,0.4)" }}>{inr(m.mWasteCost)}</div>
            </div>
          </div>
          <Bar label="Conversion rate vs. 15% benchmark" val={`${m.effConv}% / 15%`} pct={(m.effConv / 15) * 100} color={m.effConv < 8 ? "var(--neon-red)" : "var(--amber-neon)"} note={`${(15 - m.effConv).toFixed(1)}% below benchmark — ${m.lost} missed enrolments/month`} />
          <Bar label="Repetitive / manual work proportion" val={`${m.manual}%`} pct={m.manual} color={m.manual > 60 ? "var(--neon-red)" : m.manual > 30 ? "var(--amber-neon)" : "var(--emerald)"} note={m.manual > 50 ? "High manual load consuming time that should be spent on conversion." : "Some manual work exists — targeted automation can clear this."} />
          <Bar label="Lead response speed (target: under 10 min)" val={`${m.rt} min`} pct={Math.min(100, (10 / Math.max(m.rt, 1)) * 100)} color={m.rt <= 10 ? "var(--emerald)" : "var(--neon-red)"} note={m.rt > 10 ? `${m.rt - 10} min above safe threshold. Reducing your rate from ${m.conv}% to ${m.effConv}%.` : "Response time is optimal."} />
        </div>

        {/* AI Analysis */}
        <div className="glass anim d3" style={{ padding: "32px", marginBottom: 20, borderTop: "1px solid rgba(200,169,110,0.3)", background: "rgba(200,169,110,0.04)" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--gold-dim)", border: "1px solid var(--gold-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 20px rgba(200,169,110,0.2)" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.04em" }}>AI</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>AI Bottleneck Analysis</div>
              <div style={{ fontSize: 12, color: "var(--white-40)" }}>Generated from your specific agency data</div>
            </div>
          </div>
          {aiLoad ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--white-40)", fontSize: 14, padding: "8px 0" }}>
              <div className="spinner" />
              <span>Analysing your data with AI — takes a few seconds…</span>
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "var(--white-60)", lineHeight: 2, whiteSpace: "pre-wrap" }}>{aiTxt}</div>
          )}
        </div>

        {/* Opportunities */}
        <div style={{ marginBottom: 20 }}>
          <div className="slabel" style={{ marginBottom: 14 }}>AI Automation Opportunities — Ranked by ROI</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {opps.map((o, i) => <OppCard key={i} {...o} idx={i} />)}
          </div>
        </div>

        {/* Growth */}
        <div className="glass-gold anim" style={{ padding: "32px", marginBottom: 24 }}>
          <div className="slabel" style={{ marginBottom: 16 }}>Your Growth Potential</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 64, color: "var(--emerald)", fontWeight: 400, lineHeight: 1, textShadow: "0 0 30px var(--emerald-glow), 0 0 60px var(--emerald-glow)" }}>+{Math.min(m.growthPct, 150)}%</div>
            <div style={{ fontSize: 16, color: "var(--white-60)" }}>potential revenue increase</div>
          </div>
          <p style={{ fontSize: 15, color: "var(--white-60)", lineHeight: 1.9 }}>
            Reaching the 15% benchmark from your current {m.effConv}% means <strong style={{ color: "var(--white-80)" }}>{m.lost} additional enrolments/month</strong>. At {inr(m.rps)}/student, that's <strong style={{ color: "var(--emerald)", textShadow: "0 0 16px var(--emerald-glow)" }}>{inr(m.mLoss)}/month</strong> or <strong style={{ color: "var(--emerald)", textShadow: "0 0 16px var(--emerald-glow)" }}>{inr(m.aLoss)}/year</strong> — without spending a single extra rupee on advertising.
          </p>
        </div>

        {/* VIP CTA */}
        <div className="vip-card" style={{ padding: "60px 48px", textAlign: "center" }}>
          {/* Inner glow top */}
          <div style={{ position: "absolute", top: -1, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(200,169,110,0.6), transparent)", borderRadius: "50%" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="slabel" style={{ color: "rgba(200,169,110,0.4)", marginBottom: 20 }}>Ready to fix this?</div>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 400, color: "#fff", marginBottom: 16, lineHeight: 1.12, letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              Recover {inr(m.mLoss)}/month<br />
              <em style={{ color: "var(--gold)", textShadow: "0 0 30px rgba(200,169,110,0.5)" }}>with AI — in 30 days</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 460, margin: "0 auto 14px", lineHeight: 1.9 }}>
              Our team builds and deploys a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all in under 30 days.
            </p>
            <p style={{ color: "rgba(200,169,110,0.3)", fontSize: 13, marginBottom: 44 }}>
              Monthly leakage identified: <span style={{ color: "var(--neon-red)", fontWeight: 700, fontFamily: "monospace", textShadow: "0 0 12px rgba(255,59,59,0.5)" }}>{inr(m.mLoss)}</span>
            </p>

            {/* Pulsing CTA button */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              <button className="btn btn-cta" onClick={() => window.open("https://calendly.com/charanrathod-inf/30min", "_blank")}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 2v3M14 2v3M2 9h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Schedule My Briefing
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onRestart}>Run Another Audit</button>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", paddingTop: 28, borderTop: "1px solid rgba(200,169,110,0.1)" }}>
              {["📅 30-Min Private Briefing", "🔒 100% Confidential", "✓ Zero Commitment"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEAD CAPTURE
───────────────────────────────────────────────────────────────────────────── */
function LeadCapture({ formData, onSubmit }) {
  const [mode, setMode] = useState("choose");
  const [lead, setLead] = useState({ name: "", email: "", phone: "", agency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const upd = (k, v) => { setLead(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const ts = (() => { const m = calc(formData || {}); return { score: m.score, mLoss: m.mLoss, lost: m.lost }; })();

  const save = async (ld) => {
    try { await fetch("/api/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: ld, formData }) }); } catch (e) {}
    onSubmit(ld);
  };

  const handleGoogle = async () => {
    if (formData) sessionStorage.setItem("audit_fd", JSON.stringify(formData));
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "?audit=true" } });
    if (error) { console.error(error.message); alert("Google sign-in failed. Please try entering your details manually."); }
  };

  const handleManual = async () => {
    const errs = {};
    if (!lead.name.trim()) errs.name = "Name is required";
    if (!lead.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errs.email = "Enter a valid email address";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await save(lead);
    setSubmitting(false);
  };

  const scoreColor = ts.score < 42 ? "var(--neon-red)" : "var(--amber-neon)";
  const scoreGlow  = ts.score < 42 ? "var(--neon-red-glow)" : "var(--amber-glow)";

  if (mode === "choose") return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 24px 60px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Blurred teaser */}
        <div className="anim" style={{ position: "relative", marginBottom: 20, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(200,169,110,0.2)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
          <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", padding: "24px 28px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 52, color: scoreColor, lineHeight: 1, textShadow: `0 0 30px ${scoreGlow}` }}>{ts.score}</div>
              <div className="slabel" style={{ fontSize: 9, marginTop: 4 }}>Score</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="slabel" style={{ marginBottom: 6 }}>Monthly Revenue Loss</div>
              <div className="mono" style={{ fontSize: 30, fontWeight: 700, color: scoreColor, textShadow: `0 0 20px ${scoreGlow}` }}>{inr(ts.mLoss)}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              {["Response penalty", "Conversion gap", "Manual waste"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--neon-red)", boxShadow: "0 0 8px var(--neon-red-glow)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--white-60)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Lock overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(5,5,5,0.75)", backdropFilter: "blur(4px)", gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--gold-dim)", border: "1px solid var(--gold-mid)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(200,169,110,0.2)" }}>
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none"><rect x="2" y="10" width="16" height="11" rx="2.5" stroke="var(--gold)" strokeWidth="1.5"/><path d="M6 10V7a4 4 0 018 0v3" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Your report is ready</div>
            <div style={{ fontSize: 13, color: "var(--white-40)" }}>Sign in to unlock your full audit</div>
          </div>
        </div>

        {/* Urgency */}
        <div className="anim d1" style={{ background: "rgba(255,59,59,0.07)", border: "1px solid rgba(255,59,59,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 1L1.5 13h13L8 1z" stroke="#FF7B7B" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5v.5" stroke="#FF7B7B" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 13, color: "#FF7B7B", lineHeight: 1.5 }}>
            Your agency is losing <strong>{inr(ts.mLoss)}/month</strong>. Sign in to see the full breakdown and fix plan.
          </span>
        </div>

        {/* Auth card */}
        <div className="glass-strong anim d2" style={{ padding: "36px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 24, fontWeight: 400, marginBottom: 8, color: "#fff", letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Unlock your free audit report</h2>
            <p style={{ fontSize: 13, color: "var(--white-40)" }}>Takes 5 seconds · No credit card · 100% free</p>
          </div>

          <button onClick={handleGoogle} style={{ width: "100%", background: "#fff", color: "#050505", border: "none", borderRadius: 10, padding: "15px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all .2s", marginBottom: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", letterSpacing: "0.01em" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 10, color: "var(--white-40)", fontWeight: 700, letterSpacing: "0.08em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "12px 0" }} onClick={() => setMode("manual")}>
            Enter details manually
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 22, flexWrap: "wrap" }}>
            {["🔒 No spam", "✓ Free forever", "📧 Sent to email"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--white-40)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 24px 60px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px", marginBottom: 24 }} onClick={() => setMode("choose")}>← Back</button>
        <div className="glass-strong" style={{ padding: "36px", borderTop: "1px solid rgba(200,169,110,0.4)" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 24, fontWeight: 400, marginBottom: 6, color: "#fff", letterSpacing: "-0.02em" }}>Your details</h2>
          <p style={{ fontSize: 14, color: "var(--white-40)", marginBottom: 28 }}>We'll send your full audit report to your email.</p>

          <div className="field">
            <label className="fl">Full Name *</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={lead.name} onChange={e => upd("name", e.target.value)} style={{ borderColor: errors.name ? "var(--neon-red)" : undefined }} />
            {errors.name && <div style={{ fontSize: 12, color: "var(--neon-red)", marginTop: 4 }}>{errors.name}</div>}
          </div>
          <div className="field">
            <label className="fl">Work Email *</label>
            <input type="text" placeholder="e.g. rahul@agency.com" value={lead.email} onChange={e => upd("email", e.target.value)} style={{ borderColor: errors.email ? "var(--neon-red)" : undefined }} />
            {errors.email && <div style={{ fontSize: 12, color: "var(--neon-red)", marginTop: 4 }}>{errors.email}</div>}
          </div>
          <div className="field">
            <label className="fl">Agency Name <span style={{ color: "var(--white-40)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></label>
            <input type="text" placeholder="e.g. Global Study Consultants" value={lead.agency} onChange={e => upd("agency", e.target.value)} />
          </div>
          <div className="field">
            <label className="fl">Phone <span style={{ color: "var(--white-40)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></label>
            <input type="text" placeholder="e.g. +91 98765 43210" value={lead.phone} onChange={e => upd("phone", e.target.value)} />
          </div>

          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "14px", marginTop: 4, opacity: submitting ? 0.7 : 1 }} onClick={handleManual} disabled={submitting}>
            {submitting ? "Saving…" : "View My Audit Report →"}
          </button>
          <p style={{ fontSize: 11, color: "var(--white-40)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>🔒 No spam. Used only to deliver your report.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────────────────── */
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
            const profile = { name: session.user.user_metadata?.full_name || "", email: session.user.email || "", phone: "", agency: "" };
            setLead(profile);
            fetch("/api/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: profile, formData: restoredFd }) }).catch(() => {});
            setScreen("analyzing");
            setTimeout(() => setScreen("report"), 5800);
          }
        }
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const submitForm = data => { setFd(data); setScreen("capture"); };
  const submitLead = ld  => { setLead(ld); setScreen("analyzing"); setTimeout(() => setScreen("report"), 5800); };
  const restart    = ()  => { setFd(null); setLead(null); setScreen("landing"); };
  const signOut    = async () => { await supabase.auth.signOut(); setUser(null); };

  return (
    <>
      <style>{G}</style>

      {/* ── Fixed background stack ── */}
      <div className="bg-fixed" />
      <div className="frosted-glass" />
      <div className="grain-overlay" />

      <Nav user={user} onSignOut={signOut} onStart={() => setScreen("form")} />

      {screen === "landing"   && <Landing onStart={() => setScreen("form")} />}
      {screen === "form"      && <AuditForm onSubmit={submitForm} />}
      {screen === "capture"   && <LeadCapture formData={fd} onSubmit={submitLead} />}
      {screen === "analyzing" && <Analyzing />}
      {screen === "report"    && <Report fd={fd} lead={lead} onRestart={restart} />}
    </>
  );
}