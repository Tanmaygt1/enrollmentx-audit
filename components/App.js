"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:        #0A0A0A;
    --ink2:       #111318;
    --surface:    #FFFFFF;
    --warm:       #FAF8F5;
    --warm2:      #F2EFE9;
    --accent:     #C8A96E;
    --accent2:    #A8874A;
    --accent-dim: rgba(200,169,110,0.12);
    --accent-mid: rgba(200,169,110,0.25);
    --green:      #1A6B4A;
    --green-dim:  rgba(26,107,74,0.08);
    --red:        #8B1A1A;
    --red-dim:    rgba(139,26,26,0.07);
    --amber:      #92521A;
    --amber-dim:  rgba(146,82,26,0.08);
    --text:       #0A0A0A;
    --sub:        #3A3A3A;
    --muted:      #757575;
    --faint:      #ABABAB;
    --border:     #E2DDD6;
    --border2:    #EDE9E2;
    --serif:      'DM Serif Display', Georgia, serif;
    --sans:       'DM Sans', -apple-system, sans-serif;
    --display:    'Syne', sans-serif;
    --shadow-sm:  0 1px 4px rgba(10,10,10,0.06);
    --shadow-md:  0 8px 32px rgba(10,10,10,0.10);
    --shadow-lg:  0 24px 64px rgba(10,10,10,0.14);
    --shadow-xl:  0 40px 100px rgba(10,10,10,0.18);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--warm);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--warm2); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn   { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.6;transform:scale(0.92);} }
  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes barGrow   { from { width: 0% } }
  @keyframes needleSlide { from { left: 0% } }
  @keyframes counterUp { from { opacity:0; } to { opacity:1; } }
  @keyframes marquee   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes borderPulse { 0%,100%{border-color:var(--accent)} 50%{border-color:var(--accent2)} }

  .anim  { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .fadein { animation: fadeIn 0.5s ease both; }
  .d1 { animation-delay:0.1s; } .d2 { animation-delay:0.2s; }
  .d3 { animation-delay:0.3s; } .d4 { animation-delay:0.4s; }
  .d5 { animation-delay:0.5s; }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px;
    display: flex; align-items: center; padding: 0 32px;
    transition: all 0.3s;
  }
  .nav.scrolled {
    background: rgba(10,10,10,0.96);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(200,169,110,0.15);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .nav-logomark {
    width: 34px; height: 34px; border-radius: 6px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nav-wordmark {
    font-family: var(--display);
    font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
    color: #fff;
  }
  .nav-wordmark span { color: var(--accent); }
  .nav-cta {
    margin-left: auto;
    background: var(--accent);
    color: var(--ink);
    border: none; border-radius: 6px;
    padding: 9px 20px;
    font-family: var(--display);
    font-size: 13px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em;
    transition: all 0.2s;
    text-transform: uppercase;
  }
  .nav-cta:hover { background: #fff; transform: translateY(-1px); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; border-radius: 6px; cursor: pointer;
    font-family: var(--display); font-weight: 700;
    transition: all 0.2s; border: none;
    letter-spacing: 0.02em; text-transform: uppercase;
  }
  .btn-gold {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: var(--ink);
    padding: 14px 32px; font-size: 13px;
    box-shadow: 0 4px 20px rgba(200,169,110,0.35);
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(200,169,110,0.45); }
  .btn-ghost {
    background: transparent; color: var(--accent);
    border: 1px solid rgba(200,169,110,0.4);
    padding: 14px 32px; font-size: 13px;
  }
  .btn-ghost:hover { background: var(--accent-dim); border-color: var(--accent); }
  .btn-ink {
    background: var(--ink); color: #fff;
    padding: 14px 32px; font-size: 13px;
    box-shadow: 0 4px 20px rgba(10,10,10,0.25);
  }
  .btn-ink:hover { background: #222; transform: translateY(-1px); }
  .btn-outline-light {
    background: transparent; color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 12px 24px; font-size: 12px;
  }
  .btn-outline-light:hover { background: rgba(255,255,255,0.07); color: #fff; border-color: rgba(255,255,255,0.4); }
  .btn-primary {
    background: var(--ink); color: #fff;
    padding: 13px 24px; font-size: 13px;
    box-shadow: var(--shadow-md);
  }
  .btn-primary:hover { background: #1a1a1a; transform: scale(1.01); }
  .btn-primary:disabled { background: var(--border2); color: var(--faint); cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-secondary {
    background: var(--warm2); color: var(--sub);
    border: 1px solid var(--border);
    padding: 13px 24px; font-size: 13px;
  }
  .btn-secondary:hover { background: var(--warm); border-color: var(--ink); color: var(--ink); }

  /* ── Forms ── */
  .field { margin-bottom: 22px; }
  .fl {
    display: block; font-size: 12px; font-weight: 600;
    color: var(--muted); margin-bottom: 8px;
    letter-spacing: 0.06em; text-transform: uppercase;
    font-family: var(--display);
  }
  .fh { font-size: 12px; color: var(--faint); margin-top: 6px; line-height: 1.6; }
  input[type=number], input[type=text], select {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    padding: 12px 16px;
    font-size: 15px;
    font-family: var(--sans);
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  input::placeholder { color: var(--border); }
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath fill='none' stroke='%23ABABAB' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 16px center;
    background-color: var(--surface); padding-right: 40px; cursor: pointer;
  }

  /* ── Choice Buttons ── */
  .choice-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .cb {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 10px 16px;
    font-size: 13px; color: var(--muted);
    cursor: pointer; transition: all 0.18s;
    font-family: var(--sans); font-weight: 500;
    line-height: 1.4;
  }
  .cb:hover { border-color: var(--ink); color: var(--ink); background: var(--warm2); }
  .cb.sel {
    border-color: var(--accent); color: var(--ink);
    background: var(--accent-dim);
    box-shadow: inset 0 0 0 0.5px var(--accent);
    font-weight: 600;
  }
  .multi-hint {
    font-size: 11px; color: var(--faint); margin-bottom: 10px;
    display: flex; align-items: center; gap: 5px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    font-family: var(--display);
  }

  /* ── Alert boxes ── */
  .note {
    background: var(--green-dim);
    border-left: 3px solid var(--green);
    border-radius: 0 6px 6px 0;
    padding: 10px 14px; font-size: 13px;
    color: var(--green); margin-top: 10px; line-height: 1.6;
  }
  .warn {
    background: var(--red-dim);
    border-left: 3px solid var(--red);
    border-radius: 0 6px 6px 0;
    padding: 10px 14px; font-size: 13px;
    color: var(--red); margin-top: 10px; line-height: 1.6;
  }
  hr.div { border: none; border-top: 1px solid var(--border2); margin: 24px 0; }

  /* ── Pills ── */
  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 4px;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: var(--display);
  }
  .pc { background: var(--red-dim); color: var(--red); border: 1px solid rgba(139,26,26,0.2); }
  .ph { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(146,82,26,0.2); }
  .pm { background: var(--accent-dim); color: var(--accent2); border: 1px solid var(--accent-mid); }
  .pg { background: var(--green-dim); color: var(--green); border: 1px solid rgba(26,107,74,0.2); }

  /* ── Step indicators ── */
  .sdot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
    font-family: var(--display); transition: all 0.3s;
  }
  .sline { flex: 1; height: 1px; background: var(--border2); transition: background 0.4s; }
  .sline.on { background: var(--accent); }

  /* ── Spinner ── */
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border2); border-top-color: var(--accent);
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ── Stat card ── */
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 22px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); }

  /* ── Slabel ── */
  .slabel {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--faint); font-family: var(--display);
  }

  /* ── Mono ── */
  .mono { font-variant-numeric: tabular-nums; }

  /* ── Risk meter ── */
  .risk-meter-track {
    height: 8px; border-radius: 4px; overflow: visible;
    display: flex; position: relative;
  }
  .risk-meter-needle {
    position: absolute; top: -10px; width: 3px; height: 28px;
    background: var(--ink); border-radius: 2px;
    transform: translateX(-50%);
    transition: left 1.8s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 2px 8px rgba(10,10,10,0.3);
  }
  .risk-meter-needle::after {
    content: '';
    position: absolute; bottom: -5px; left: 50%;
    transform: translateX(-50%);
    width: 9px; height: 9px; border-radius: 50%;
    background: var(--ink);
    box-shadow: 0 2px 8px rgba(10,10,10,0.3);
  }

  /* ── Marquee ── */
  .marquee-track { overflow: hidden; }
  .marquee-inner {
    display: flex; gap: 0;
    animation: marquee 28s linear infinite;
    width: max-content;
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function toggleMulti(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}
function hasVal(data, field, val) {
  const arr = Array.isArray(data[field]) ? data[field] : [];
  return arr.includes(val);
}
const inr = n => "₹" + Number(n).toLocaleString("en-IN");

// ── CB / MCB ──────────────────────────────────────────────────────────────────
function CB({ val, label, hint, field, data, upd }) {
  const sel = data[field] === val;
  return (
    <button className={`cb ${sel ? "sel" : ""}`} onClick={() => upd(field, val)}>
      {label}
      {hint && <span style={{ color: sel ? "var(--accent2)" : "var(--faint)", marginLeft: 6, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
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
          border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
          background: selected ? "var(--accent)" : "transparent",
          transition: "all 0.18s",
        }}>
          {selected && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3l2 2 4-4" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {label}
      </span>
      {hint && <span style={{ color: selected ? "var(--accent2)" : "var(--faint)", marginLeft: 6, fontSize: 12, fontWeight: 400 }}>{hint}</span>}
    </button>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ light = false }) {
  return (
    <div className="nav-logo">
      <div className="nav-logomark">
        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", fontFamily: "var(--display)" }}>E</span>
      </div>
      <span className="nav-wordmark">Enrollment<span>X</span></span>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────────
function Nav({ user, onSignOut, onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <Logo />
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        {user && (
          <>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{user.email}</span>
            <button className="btn btn-outline-light" style={{ padding: "7px 16px", fontSize: 11 }} onClick={onSignOut}>Sign out</button>
          </>
        )}
        {!user && (
          <button className="btn nav-cta" onClick={onStart}>Start Free Audit</button>
        )}
      </div>
    </nav>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "#fff", overflowX: "hidden" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&q=80')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
          filter: "brightness(0.22) saturate(0.6)",
        }} />

        {/* Gold gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,10,0.9) 40%, rgba(200,169,110,0.08) 100%)",
        }} />

        {/* Grain texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
          pointerEvents: "none",
        }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "120px 40px 80px", width: "100%" }}>

          {/* Badge */}
          <div className="anim" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.3)",
            borderRadius: 40, padding: "7px 18px", marginBottom: 40,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", display: "block" }} />
            <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--display)" }}>
              Free Revenue Audit · 2 Minutes · No Credit Card
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 80, alignItems: "center" }}>
            {/* Left: Copy */}
            <div>
              <h1 className="anim d1" style={{
                fontFamily: "var(--serif)", fontWeight: 400,
                fontSize: "clamp(44px, 5vw, 72px)",
                lineHeight: 1.08, marginBottom: 28,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}>
                Stop losing<br />
                <em style={{ color: "var(--accent)" }}>₹2 crore</em><br />
                every year
              </h1>

              <p className="anim d2" style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 480, marginBottom: 44, fontWeight: 300 }}>
                Most study abroad agencies lose 35–60% of their potential revenue to slow response times, broken follow-up, and manual operations. Find out exactly how much — in 2 minutes.
              </p>

              <div className="anim d3" style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 48 }}>
                <button className="btn btn-gold" style={{ fontSize: 14, padding: "16px 36px" }} onClick={onStart}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>
                  Get My Free Audit
                </button>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>Takes 2–3 minutes · 100% confidential</span>
              </div>

              {/* Social proof */}
              <div className="anim d4" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[["₹2.4Cr+", "Avg annual leak found"], ["87%", "Miss AI opportunities"], ["< 30 days", "To see results"]].map(([n, l]) => (
                  <div key={n}>
                    <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 400 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating card */}
            <div className="anim d2" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,169,110,0.2)",
              borderRadius: 16,
              padding: "32px",
              backdropFilter: "blur(20px)",
            }}>
              <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--display)", marginBottom: 24 }}>
                What we analyse
              </div>
              {[
                ["Lead response time & conversion gap", "Most agencies lose 30% here"],
                ["Follow-up process & drop-off stages", "80% of sales need 5+ touches"],
                ["Manual workload & counselor efficiency", "Typically 40+ hrs/week wasted"],
                ["Ad spend ROI & cost per conversion", "Most spend 2× what they should"],
                ["CRM usage & document workflow", "35% more leads lost without CRM"],
              ].map(([t, s], i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 4 ? 20 : 0, paddingBottom: i < 4 ? 20 : 0, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(200,169,110,0.15)", border: "1px solid rgba(200,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--display)" }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, marginBottom: 2, lineHeight: 1.4 }}>{t}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div style={{ background: "var(--accent)", padding: "14px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          <div className="marquee-inner">
            {Array(4).fill(["Lead Conversion Audit", "AI Revenue Recovery", "WhatsApp Automation", "CRM Setup & Optimisation", "Response Time Analysis", "Document Workflow", "Study Abroad Specialists"]).flat().map((t, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--display)", padding: "0 32px", flexShrink: 0 }}>
                {t} &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ background: "var(--warm)", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="slabel" style={{ marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.15 }}>
              From answers to action<br />
              <em>in under 3 minutes</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {[
              { n: "01", title: "Answer 15 questions", desc: "About your leads, team, budget, and operations. Takes 2–3 minutes." },
              { n: "02", title: "AI analyses your agency", desc: "We calculate your exact revenue gap vs. the industry benchmark." },
              { n: "03", title: "Get your personalised report", desc: "With rupee figures, bottleneck diagnosis, and a ranked fix plan." },
              { n: "04", title: "Book your strategy call", desc: "Talk to a specialist. We'll build and deploy the AI fixes for you." },
            ].map((s, i) => (
              <div key={i} style={{
                background: i === 3 ? "var(--ink)" : "var(--surface)",
                border: `1px solid ${i === 3 ? "transparent" : "var(--border)"}`,
                borderRadius: i === 0 ? "12px 0 0 12px" : i === 3 ? "0 12px 12px 0" : "0",
                padding: "36px 28px",
              }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 11, fontWeight: 800, color: i === 3 ? "var(--accent)" : "var(--faint)", letterSpacing: "0.12em", marginBottom: 20 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: i === 3 ? "#fff" : "var(--ink)", marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: i === 3 ? "rgba(255,255,255,0.5)" : "var(--muted)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 52 }}>
            <button className="btn btn-ink" onClick={onStart}>Start My Free Audit →</button>
          </div>
        </div>
      </div>

      {/* ── Testimonials / social proof ── */}
      <div style={{ background: "var(--ink2)", padding: "80px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="slabel" style={{ color: "rgba(255,255,255,0.25)", marginBottom: 48, textAlign: "center" }}>What agencies discover</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { quote: "We found ₹18L/month leaking through slow response time alone. Fixed in 2 weeks with their chatbot.", role: "Director, Premium Study Hub, Pune" },
              { quote: "Our counselors were wasting 38 hours a week on tasks AI now handles. We used that time to close 40% more deals.", role: "Founder, Global Pathways, Hyderabad" },
              { quote: "Went from 7% to 14% conversion in 60 days. The WhatsApp automation was the biggest lever.", role: "MD, Abroad Dreams Consultancy, Mumbai" },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "28px" }}>
                <div style={{ fontSize: 32, color: "var(--accent)", lineHeight: 1, marginBottom: 16, fontFamily: "var(--serif)" }}>"</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.04em", fontFamily: "var(--display)", textTransform: "uppercase" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form Steps ────────────────────────────────────────────────────────────────
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
      <p className="multi-hint"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> Select all that apply</p>
      <div className="choice-grid">
        {[["ads","Paid Ads","Google, Meta"],["referrals","Referrals","Past students"],["organic","Organic / SEO","Website & search"],["walk-ins","Walk-ins","In-person"],["social","Social Media","YouTube, Instagram"]].map(([v,l,h]) => <MCB key={v} val={v} label={l} hint={`— ${h}`} field="leadSource" data={d} upd={u} />)}
      </div>
    </div>
    <div className="field">
      <label className="fl">Response time to a new enquiry (minutes)</label>
      <input type="number" min="0" placeholder="e.g. 30" value={d.responseTime || ""} onChange={e => u("responseTime", e.target.value)} />
      <p className="fh">Be honest — if it takes 2 hours, enter 120. One of the biggest revenue levers.</p>
      {Number(d.responseTime) > 10 && <div className="warn">⚠ Leads contacted after 10 min are 7× less likely to convert. This will penalise your audit score.</div>}
      {Number(d.responseTime) <= 10 && Number(d.responseTime) > 0 && <div className="note">✓ Great — you're within the optimal response window.</div>}
    </div>
    <div className="field">
      <label className="fl">Lead-to-enrolment conversion rate (%)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 8" value={d.conversionRate || ""} onChange={e => u("conversionRate", e.target.value)} />
      <p className="fh">10 enrolments from 100 enquiries = 10%. Industry benchmark is 15%.</p>
      {Number(d.conversionRate) > 0 && Number(d.conversionRate) < 15 && <div className="warn">⚠ You are {(15 - Number(d.conversionRate)).toFixed(1)}% below the 15% benchmark. This gap will be quantified in rupees.</div>}
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
        {[["manual","Phone calls","— manual"],["whatsapp","WhatsApp","— messages"],["crm","CRM / Automation","— sequences"],["email","Email","— campaigns"],["none","No regular follow-up",""]].map(([v,l,h]) => <MCB key={v} val={v} label={l} hint={h} field="followUpMethod" data={d} upd={u} />)}
      </div>
      {methods.includes("none") && <div className="warn">⚠ No follow-up is one of the top 3 causes of revenue loss in study abroad agencies.</div>}
      {!methods.includes("none") && methods.length >= 2 && <div className="note">✓ Using {methods.length} channels improves your chances of reaching leads at the right moment.</div>}
    </div>
    <div className="field">
      <label className="fl">Follow-ups per lead before giving up</label>
      <input type="number" min="0" placeholder="e.g. 3" value={d.followUpCount || ""} onChange={e => u("followUpCount", e.target.value)} />
      <p className="fh">80% of sales require 5+ follow-ups. Most agencies stop at 1–2.</p>
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
    </div>
    <div className="field">
      <label className="fl">Minutes per week spent per active lead</label>
      <input type="number" min="0" placeholder="e.g. 45" value={d.timePerLead || ""} onChange={e => u("timePerLead", e.target.value)} />
      <p className="fh">Include calls, re-sending documents, updating records, answering repeated questions.</p>
    </div>
    <div className="field">
      <label className="fl">Percentage of daily work that is repetitive / manual (%)</label>
      <input type="number" min="0" max="100" placeholder="e.g. 60" value={d.manualWorkPct || ""} onChange={e => u("manualWorkPct", e.target.value)} />
      {Number(d.manualWorkPct) > 50 && <div className="warn">⚠ Significantly above average. AI automation can typically eliminate 60–70% of this.</div>}
    </div>
  </>;
}
function Step3({ d, u }) {
  return <>
    <div className="field">
      <label className="fl">Monthly advertising spend (₹)</label>
      <input type="number" min="0" placeholder="e.g. 50000" value={d.adSpend || ""} onChange={e => u("adSpend", e.target.value)} />
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

// ── Audit Form ─────────────────────────────────────────────────────────────────
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
  const pct = Math.round(((step) / 5) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--warm)", display: "flex", flexDirection: "column" }}>

      {/* Top progress bar */}
      <div style={{ height: 3, background: "var(--border2)", position: "fixed", top: 64, left: 0, right: 0, zIndex: 150 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--accent), var(--accent2))", transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "100px 20px 60px" }}>
        <div style={{ width: "100%", maxWidth: 600 }}>

          {/* Step dots */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                  <div className="sdot" style={{
                    background: i < step ? "var(--ink)" : i === step ? "var(--accent-dim)" : "var(--surface)",
                    border: `${i === step ? "2px" : "1.5px"} solid ${i <= step ? (i < step ? "var(--ink)" : "var(--accent)") : "var(--border)"}`,
                    color: i < step ? "#fff" : i === step ? "var(--accent2)" : "var(--faint)",
                  }}>
                    {i < step ? (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`sline ${i < step ? "on" : ""}`} />}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--display)" }}>
              Step {step + 1} of {STEPS.length} — <span style={{ color: "var(--sub)" }}>{STEPS[step].title}</span>
            </div>
          </div>

          <div key={step} className="anim" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "36px", boxShadow: "var(--shadow-md)", borderTop: "3px solid var(--accent)" }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, color: "var(--ink)", marginBottom: 6 }}>{STEPS[step].title}</h2>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>{STEPS[step].sub}</p>
            </div>

            <StepComp d={data} u={upd} />

            <hr className="div" />
            <div style={{ display: "flex", gap: 10 }}>
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!ok()}
                onClick={() => { if (step < 4) setStep(s => s + 1); else onSubmit(data); }}
              >
                {step === 4 ? "Generate My Audit Report →" : "Continue →"}
              </button>
            </div>
            {!ok() && <p style={{ fontSize: 11, color: "var(--faint)", textAlign: "center", marginTop: 10, fontFamily: "var(--display)", letterSpacing: "0.04em" }}>Complete all fields above to continue</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Analyzing ──────────────────────────────────────────────────────────────────
function Analyzing() {
  const [active, setActive] = useState(0);
  const tasks = [
    { l: "Calculating lead conversion gap", d: "Comparing against the 15% industry benchmark…" },
    { l: "Estimating monthly revenue leakage", d: "Multiplying lost leads × revenue per student…" },
    { l: "Quantifying operational waste", d: "Measuring manual work cost at ₹200/hour…" },
    { l: "Running AI bottleneck diagnosis", d: "Identifying root causes of drop-offs…" },
    { l: "Building your personalised action plan", d: "Preparing specific AI solutions for your agency…" },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; if (i < tasks.length) setActive(i); else clearInterval(t); }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80')",
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "brightness(0.08) saturate(0.4)",
      }} />
      <div style={{ position: "relative", maxWidth: 460, width: "100%", textAlign: "center" }}>

        {/* Animated logo mark */}
        <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 36px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(200,169,110,0.2)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "spin 1.2s linear infinite" }} />
          <div style={{ position: "absolute", inset: "16px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", fontFamily: "var(--display)" }}>E</span>
          </div>
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, fontStyle: "italic", marginBottom: 8, color: "#fff" }}>Analysing Your Agency</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 48 }}>Your confidential audit is being compiled</p>

        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 18 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: i <= active ? 1 : 0.2, transition: "opacity 0.5s" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                background: i < active ? "var(--accent)" : i === active ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${i <= active ? (i < active ? "var(--accent)" : "rgba(200,169,110,0.5)") : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i < active ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                ) : i === active ? (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "block", animation: "pulse 1s infinite" }} />
                ) : null}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: i <= active ? "#fff" : "rgba(255,255,255,0.3)" }}>{t.l}</div>
                {i === active && <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 3 }}>{t.d}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Calc ───────────────────────────────────────────────────────────────────────
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
  if (effConv < BENCH)                    score -= Math.min(28, Math.round((BENCH - effConv) * 2));
  if (rt > 10)                            score -= 18;
  if (manual > 50)                        score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0) score -= 14;
  if (d.usesCRM === "no")                 score -= 10;
  if (docArr.includes("manual") && !docArr.includes("digital")) score -= 8;
  if (d.leadQuality === "low")            score -= 6;
  score = Math.max(8, score);
  const growthPct = effConv > 0 ? Math.min(200, Math.round(((BENCH - effConv) / effConv) * 100)) : 80;
  return { leads, conv, effConv: Math.round(effConv * 10) / 10, rt, penalty, rps, counsel, tpl, manual, ad, lost: Math.round(lost), mLoss, aLoss, wWaste, mWasteCost, rtPenMoney, adWasted, score, growthPct, followUpArr, docArr };
}

// ── Risk Meter ─────────────────────────────────────────────────────────────────
function RiskMeter({ score }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);
  const pct = score / 100;
  const lbl = score >= 68 ? "Moderate" : score >= 42 ? "At Risk" : "Critical";
  const pillCls = score >= 68 ? "pg" : score >= 42 ? "ph" : "pc";
  const scoreColor = score >= 68 ? "var(--green)" : score >= 42 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ minWidth: 220 }}>
      <div className="slabel" style={{ marginBottom: 16 }}>Revenue Health Score</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, fontStyle: "italic", color: scoreColor, lineHeight: 1 }}>{score}</div>
        <div style={{ paddingBottom: 8 }}>
          <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 6 }}>out of 100</div>
          <span className={`pill ${pillCls}`}>{lbl}</span>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div className="risk-meter-track">
          <div style={{ flex: 42, background: "linear-gradient(90deg, #FCA5A5, #DC2626)", borderRadius: "4px 0 0 4px" }} />
          <div style={{ flex: 26, background: "linear-gradient(90deg, #FCD34D, #D97706)" }} />
          <div style={{ flex: 32, background: "linear-gradient(90deg, #6EE7B7, #059669)", borderRadius: "0 4px 4px 0" }} />
        </div>
        <div className="risk-meter-needle" style={{ left: `${animated ? pct * 100 : 0}%` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--faint)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--display)" }}>
        <span>Critical</span><span>At Risk</span><span>Moderate</span>
      </div>
    </div>
  );
}

// ── Stat ───────────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, vc = "var(--text)" }) {
  return (
    <div className="stat-card">
      <div className="slabel" style={{ marginBottom: 10 }}>{label}</div>
      <div className="mono" style={{ fontSize: 28, color: vc, marginBottom: 6, fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

// ── Bar ────────────────────────────────────────────────────────────────────────
function Bar({ label, val, pct, color, note }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 15, color, fontWeight: 700 }}>{val}</span>
      </div>
      <div style={{ height: 6, background: "var(--border2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${animated ? Math.min(pct, 100) : 0}%`, background: color, borderRadius: 3, transition: "width 1.6s cubic-bezier(0.22,1,0.36,1) 0.3s" }} />
      </div>
      {note && <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 6, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

// ── OppCard ────────────────────────────────────────────────────────────────────
function OppCard({ title, impact, priority, idx }) {
  const pc = priority === "CRITICAL" ? "pc" : priority === "HIGH" ? "ph" : "pm";
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start", animation: "fadeUp .5s ease both", animationDelay: `${idx * 0.08}s`, transition: "box-shadow 0.2s", boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}><span className={`pill ${pc}`}>{priority}</span></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--serif)", fontWeight: 400, fontStyle: "italic", fontSize: 18, marginBottom: 6, color: "var(--ink)" }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{impact}</div>
      </div>
    </div>
  );
}

// ── Report ─────────────────────────────────────────────────────────────────────
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
- Follow-up methods used: ${followUpStr}
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
        fetch("/api/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: lead || {}, formData: fd, aiReport: fallback() }) }).catch(() => {});
      } finally { setAiLoad(false); }
    })();
  }, []);

  const fallback = () => {
    const followUpStr = m.followUpArr.includes("none") || m.followUpArr.length === 0 ? "no structured follow-up" : m.followUpArr.join(" + ");
    return `Your agency receives ${m.leads} leads per month but converts only ${m.effConv}% — that's ${(15 - m.effConv).toFixed(1)}% below the 15% industry benchmark, costing you ${m.lost} students and ${inr(m.mLoss)} every single month. ${m.penalty ? `Your ${m.rt}-minute response time is triggering a 30% conversion penalty — leads contacted after 10 minutes are statistically 7× harder to close, dropping your effective rate from ${m.conv}% to ${m.effConv}%.` : `While your response time is within range, the conversion gap alone represents ${inr(m.aLoss)} in annual lost revenue.`} On top of this, ${m.manual}% manual workload consumes ${m.wWaste} counselor hours per week. Your current follow-up approach (${followUpStr}) and the ${fd.dropOffStage} drop-off point are the two highest-leverage areas to fix with AI automation — agencies report a 40–60% lead recovery rate within 90 days.`;
  };

  const opps = [
    { title: "AI Chatbot for Instant Lead Response", impact: `Bring your ${m.rt}-minute response time to under 2 minutes — 24/7, even on weekends. Estimated recovery: ${Math.round(m.lost * 0.35)} leads/month.`, priority: m.rt > 15 ? "CRITICAL" : "HIGH" },
    { title: "Automated WhatsApp Follow-up Sequences", impact: `Replace or augment your current follow-up (${m.followUpArr.length ? m.followUpArr.join(", ") : "none"}) with personalised, multi-step WhatsApp sequences. Directly addresses the ${fd.dropOffStage} drop-off problem.`, priority: m.followUpArr.includes("none") || m.followUpArr.length === 0 ? "CRITICAL" : "HIGH" },
    { title: fd.usesCRM === "no" ? "CRM Setup + Lead Pipeline Tracking" : "CRM Automation & Smart Workflows", impact: fd.usesCRM === "no" ? `No CRM means no visibility. A configured CRM saves your ${m.counsel} counselor${m.counsel > 1 ? "s" : ""} ~${Math.round(m.wWaste * 0.35)} hours/week in manual tracking.` : `Auto-assign leads, send reminders, and generate weekly dashboards — cutting manual data entry by ~40%.`, priority: fd.usesCRM === "no" ? "HIGH" : "MEDIUM" },
    { title: "Document Processing Automation", impact: m.docArr.includes("manual") && !m.docArr.includes("digital") ? `Manual document collection adds 3–4 hours per student. An AI portal reduces this to 45 minutes, freeing ~${Math.round(m.wWaste * 0.3)} counselor hours/month.` : `Upgrade your document process (${m.docArr.join(", ")}) with smart checklists and auto-verification — reducing errors by 70%.`, priority: m.docArr.includes("manual") && !m.docArr.includes("digital") ? "HIGH" : "MEDIUM" },
  ];

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ background: "var(--warm)", minHeight: "100vh" }}>

      {/* ── Report hero banner ── */}
      <div style={{ background: "var(--ink)", position: "relative", overflow: "hidden", padding: "100px 40px 64px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.1) saturate(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div className="slabel" style={{ color: "rgba(255,255,255,0.25)", margin: 0 }}>FY 2026 · Agency Revenue Leakage Diagnosis</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: 4, padding: "4px 10px" }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><rect x="0.5" y="4.5" width="8" height="6" rx="1.5" stroke="var(--accent)" strokeWidth="1.2"/><path d="M2.5 4.5V3.5a2 2 0 014 0v1" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--display)" }}>Confidential</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 400, fontStyle: "italic", color: "#fff", lineHeight: 1.12, marginBottom: 16 }}>
            Your Agency Audit<br />Is Ready
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
            Based on <strong style={{ color: "rgba(255,255,255,0.8)" }}>{m.leads} monthly leads</strong> · Revenue per student: <strong style={{ color: "rgba(255,255,255,0.8)" }}>{inr(m.rps)}</strong> · Generated {date}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── Score + Diagnosis ── */}
        <div className="anim" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", boxShadow: "var(--shadow-md)", marginBottom: 24, display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap", borderTop: "3px solid var(--accent)" }}>
          <RiskMeter score={m.score} />
          <div style={{ flex: 1, minWidth: 220, borderLeft: "1px solid var(--border2)", paddingLeft: 32 }}>
            <div className="slabel" style={{ marginBottom: 12 }}>AI Efficiency Diagnosis</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, fontStyle: "italic", marginBottom: 14, color: "var(--ink)", lineHeight: 1.3 }}>
              {m.score < 42 ? "Critical inefficiencies — urgent action required" : m.score < 68 ? "Several revenue leaks found — moderate risk" : "Good foundation, but revenue gaps remain"}
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
              Top agencies score <strong style={{ color: "var(--text)" }}>75+</strong>. Your score of <strong style={{ color: m.score < 42 ? "var(--red)" : m.score < 68 ? "var(--amber)" : "var(--green)" }}>{m.score}/100</strong> indicates
              {m.score < 42 ? " multiple compounding problems actively reducing your revenue every day." : m.score < 68 ? " clear gaps in conversion, follow-up, and operations limiting your growth." : " solid operations with specific gaps holding back full potential."}
            </p>
          </div>
        </div>

        {/* ── Financial stats ── */}
        <div style={{ marginBottom: 24 }}>
          <div className="slabel" style={{ marginBottom: 14 }}>Financial Impact — What You're Losing</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <Stat label="Monthly Revenue Loss" value={inr(m.mLoss)} sub={`${m.lost} unconverted leads × ${inr(m.rps)}`} vc="var(--red)" />
            <Stat label="Annual Revenue at Risk" value={inr(m.aLoss)} sub="Projected over 12 months" vc="var(--red)" />
            <Stat label="Response Time Penalty" value={m.penalty ? inr(m.rtPenMoney) : "None"} sub={m.penalty ? `${m.rt}min response → 30% loss` : `${m.rt}min — within range`} vc={m.penalty ? "var(--amber)" : "var(--green)"} />
            <Stat label="Ad Budget Wasted" value={inr(m.adWasted)} sub="Spent on leads that don't convert" vc="var(--amber)" />
          </div>
        </div>

        {/* ── Efficiency bars ── */}
        <div className="anim d2" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", boxShadow: "var(--shadow-sm)", marginBottom: 24 }}>
          <div className="slabel" style={{ marginBottom: 24 }}>Time & Operational Efficiency</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 }}>
            <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--border2)" }}>
              <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--display)", textTransform: "uppercase" }}>Counselor hours wasted / week</div>
              <div className="mono" style={{ fontSize: 36, color: "var(--amber)", fontWeight: 700, letterSpacing: "-0.03em" }}>{m.wWaste} <span style={{ fontSize: 16, fontWeight: 400, color: "var(--faint)" }}>hrs</span></div>
            </div>
            <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--border2)" }}>
              <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--display)", textTransform: "uppercase" }}>Monthly cost of inefficiency</div>
              <div className="mono" style={{ fontSize: 36, color: "var(--red)", fontWeight: 700, letterSpacing: "-0.03em" }}>{inr(m.mWasteCost)}</div>
            </div>
          </div>
          <Bar label="Conversion rate vs. 15% benchmark" val={`${m.effConv}% / 15%`} pct={(m.effConv / 15) * 100} color={m.effConv < 8 ? "var(--red)" : "var(--amber)"} note={`${(15 - m.effConv).toFixed(1)}% below benchmark — ${m.lost} missed enrolments/month`} />
          <Bar label="Repetitive / manual work proportion" val={`${m.manual}%`} pct={m.manual} color={m.manual > 60 ? "var(--red)" : m.manual > 30 ? "var(--amber)" : "var(--green)"} note={m.manual > 50 ? "High manual load consuming time that should be spent on conversion." : "Some manual work exists — targeted automation can clear this."} />
          <Bar label="Lead response speed (target: under 10 min)" val={`${m.rt} min`} pct={Math.min(100, (10 / Math.max(m.rt, 1)) * 100)} color={m.rt <= 10 ? "var(--green)" : "var(--red)"} note={m.rt > 10 ? `${m.rt - 10} min above safe threshold. Reducing conversion from ${m.conv}% to ${m.effConv}%.` : "Response time is optimal."} />
        </div>

        {/* ── AI Analysis ── */}
        <div className="anim d3" style={{ background: "var(--ink)", border: "1px solid rgba(200,169,110,0.15)", borderRadius: 16, padding: "32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--accent), var(--accent2))" }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(200,169,110,0.15)", border: "1px solid rgba(200,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--display)" }}>AI</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "0.02em" }}>AI Bottleneck Analysis</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Generated from your specific agency data</div>
            </div>
          </div>
          {aiLoad ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, padding: "8px 0" }}>
              <div className="spinner" style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "var(--accent)" }} />
              <span>Analysing your data with AI…</span>
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 2, whiteSpace: "pre-wrap" }}>{aiTxt}</div>
          )}
        </div>

        {/* ── Opportunities ── */}
        <div style={{ marginBottom: 24 }}>
          <div className="slabel" style={{ marginBottom: 14 }}>AI Automation Opportunities — Ranked by ROI</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {opps.map((o, i) => <OppCard key={i} {...o} idx={i} />)}
          </div>
        </div>

        {/* ── Growth potential ── */}
        <div className="anim" style={{ background: "var(--warm2)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", marginBottom: 24 }}>
          <div className="slabel" style={{ marginBottom: 16 }}>Your Growth Potential</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 60, color: "var(--green)", fontWeight: 400, lineHeight: 1 }}>+{Math.min(m.growthPct, 150)}%</div>
            <div style={{ fontSize: 16, color: "var(--muted)" }}>potential revenue increase</div>
          </div>
          <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.9 }}>
            Reaching the 15% benchmark from your current {m.effConv}% means <strong style={{ color: "var(--ink)" }}>{m.lost} additional enrolments per month</strong>. At {inr(m.rps)}/student, that's <strong style={{ color: "var(--green)" }}>{inr(m.mLoss)}/month</strong> or <strong style={{ color: "var(--green)" }}>{inr(m.aLoss)}/year</strong> — without spending a single extra rupee on advertising.
          </p>
        </div>

        {/* ── CTA ── */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15) saturate(0.4)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.97) 50%, rgba(200,169,110,0.08) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--accent), var(--accent2))" }} />
          <div style={{ position: "relative", padding: "60px 48px", textAlign: "center" }}>
            <div className="slabel" style={{ color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Ready to fix this?</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 400, fontStyle: "italic", color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
              Recover {inr(m.mLoss)}/month<br />
              <em style={{ color: "var(--accent)" }}>with AI — in 30 days</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 460, margin: "0 auto 14px", lineHeight: 1.85 }}>
              Our team builds and deploys a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all in under 30 days.
            </p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginBottom: 40 }}>
              Monthly leakage identified: <span style={{ color: "#F87171", fontWeight: 700, fontFamily: "monospace" }}>{inr(m.mLoss)}</span>
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              <button className="btn btn-gold" style={{ fontSize: 14, padding: "16px 40px" }} onClick={() => window.open("https://calendly.com/charanrathod-inf/30min", "_blank")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                Book My Free Strategy Call
              </button>
              <button className="btn btn-outline-light" onClick={onRestart}>Run Another Audit</button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
              {["📅 30-Min Call · No Pitch", "🔒 100% Confidential", "✓ No Commitment Required"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lead Capture ───────────────────────────────────────────────────────────────
function LeadCapture({ formData, onSubmit }) {
  const [mode, setMode] = useState("choose");
  const [lead, setLead] = useState({ name: "", email: "", phone: "", agency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const upd = (k, v) => { setLead(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const teaserScore = (() => { const m = calc(formData || {}); return { score: m.score, mLoss: m.mLoss, lost: m.lost }; })();

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

  const scoreColor = teaserScore.score < 42 ? "var(--red)" : "var(--amber)";

  if (mode === "choose") return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 24px 60px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.1) saturate(0.3)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(200,169,110,0.06) 0%, rgba(10,10,10,0.98) 70%)" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>

        {/* Blurred teaser */}
        <div className="anim" style={{ position: "relative", marginBottom: 20, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(200,169,110,0.2)" }}>
          <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none", background: "var(--warm)", padding: "24px 28px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink)", lineHeight: 1 }}>{teaserScore.score}</div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", fontFamily: "var(--display)", textTransform: "uppercase", color: "var(--faint)" }}>Score</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="slabel" style={{ marginBottom: 6 }}>Monthly Revenue Loss</div>
              <div className="mono" style={{ fontSize: 30, fontWeight: 700, color: scoreColor }}>{inr(teaserScore.mLoss)}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              {["Response penalty", "Conversion gap", "Manual waste"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Lock overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(250,248,245,0.82)", backdropFilter: "blur(2px)", gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none"><rect x="2" y="10" width="16" height="11" rx="2.5" stroke="#fff" strokeWidth="1.5"/><path d="M6 10V7a4 4 0 018 0v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--display)" }}>Your report is ready</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Sign in to unlock your full audit</div>
          </div>
        </div>

        {/* Urgency */}
        <div className="anim d1" style={{ background: "rgba(139,26,26,0.12)", border: "1px solid rgba(139,26,26,0.25)", borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 1L1.5 13h13L8 1z" stroke="#F87171" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5v.5" stroke="#F87171" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 13, color: "#F87171", lineHeight: 1.5 }}>
            Your agency is losing <strong>{inr(teaserScore.mLoss)}/month</strong>. Sign in to see the full breakdown and fix plan.
          </span>
        </div>

        {/* Auth card */}
        <div className="anim d2" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 16, padding: "36px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, fontStyle: "italic", marginBottom: 8, color: "#fff" }}>Unlock your free audit report</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Takes 5 seconds · No credit card · 100% free</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{ width: "100%", background: "#fff", color: "var(--ink)", border: "none", borderRadius: 10, padding: "15px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--display)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all .18s", marginBottom: 14, letterSpacing: "0.01em" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}
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
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "var(--display)" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "12px 0", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => setMode("manual")}>
            Enter details manually
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {["🔒 No spam", "✓ Free forever", "📧 Sent to email"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--warm)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 24px 60px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="btn btn-secondary" style={{ fontSize: 13, padding: "8px 16px", marginBottom: 24 }} onClick={() => setMode("choose")}>← Back</button>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "36px", boxShadow: "var(--shadow-md)", borderTop: "3px solid var(--accent)" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, fontStyle: "italic", marginBottom: 6, color: "var(--ink)" }}>Your details</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>We'll send your full audit report to your email.</p>
          <div className="field">
            <label className="fl">Full Name *</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={lead.name} onChange={e => upd("name", e.target.value)} style={{ borderColor: errors.name ? "var(--red)" : undefined }} />
            {errors.name && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.name}</div>}
          </div>
          <div className="field">
            <label className="fl">Work Email *</label>
            <input type="text" placeholder="e.g. rahul@agency.com" value={lead.email} onChange={e => upd("email", e.target.value)} style={{ borderColor: errors.email ? "var(--red)" : undefined }} />
            {errors.email && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.email}</div>}
          </div>
          <div className="field">
            <label className="fl">Agency Name <span style={{ color: "var(--faint)", fontWeight: 400 }}>— optional</span></label>
            <input type="text" placeholder="e.g. Global Study Consultants" value={lead.agency} onChange={e => upd("agency", e.target.value)} />
          </div>
          <div className="field">
            <label className="fl">Phone Number <span style={{ color: "var(--faint)", fontWeight: 400 }}>— optional</span></label>
            <input type="text" placeholder="e.g. +91 98765 43210" value={lead.phone} onChange={e => upd("phone", e.target.value)} />
          </div>
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "14px", opacity: submitting ? 0.7 : 1, marginTop: 4 }} onClick={handleManual} disabled={submitting}>
            {submitting ? "Saving…" : "View My Audit Report →"}
          </button>
          <p style={{ fontSize: 11, color: "var(--faint)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>🔒 No spam. Used only to deliver your report.</p>
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const submitForm = data => { setFd(data); setScreen("capture"); };
  const submitLead = ld  => { setLead(ld); setScreen("analyzing"); setTimeout(() => setScreen("report"), 5800); };
  const restart    = ()  => { setFd(null); setLead(null); setScreen("landing"); };
  const signOut    = async () => { await supabase.auth.signOut(); setUser(null); };

  return (
    <>
      <style>{G}</style>
      <Nav user={user} onSignOut={signOut} onStart={() => setScreen("form")} />
      {screen === "landing"   && <Landing onStart={() => setScreen("form")} />}
      {screen === "form"      && <AuditForm onSubmit={submitForm} />}
      {screen === "capture"   && <LeadCapture formData={fd} onSubmit={submitLead} />}
      {screen === "analyzing" && <Analyzing />}
      {screen === "report"    && <Report fd={fd} lead={lead} onRestart={restart} />}
    </>
  );
}