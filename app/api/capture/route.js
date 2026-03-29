import { NextResponse } from "next/server";

// ── helpers ──────────────────────────────────────────────────────────────────

function calcMetrics(d) {
  const leads   = Number(d.monthlyLeads) || 0;
  const conv    = Number(d.conversionRate) || 0;
  const rt      = Number(d.responseTime) || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const manual  = Number(d.manualWorkPct) || 0;
  const ad      = Number(d.adSpend) || 0;
  const counsel = Number(d.counselors) || 1;
  const tpl     = Number(d.timePerLead) || 30;

  const penalty = rt > 10;
  const effConv = penalty ? conv * 0.7 : conv;
  const lost    = Math.max(0, leads * (15 - effConv) / 100);
  const mLoss   = Math.round(lost * rps);
  const aLoss   = mLoss * 12;

  const mWaste      = (manual / 100) * (tpl / 60) * leads;
  const wWaste      = Math.round(mWaste / 4.33);
  const mWasteCost  = Math.round(mWaste * 200);
  const growthPct   = effConv > 0 ? Math.min(200, Math.round(((15 - effConv) / effConv) * 100)) : 80;

  const followUpArr = Array.isArray(d.followUpMethod) ? d.followUpMethod : (d.followUpMethod ? [d.followUpMethod] : []);

  let score = 100;
  if (effConv < 15) score -= Math.min(28, Math.round((15 - effConv) * 2));
  if (rt > 10)      score -= 18;
  if (manual > 50)  score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0) score -= 14;
  if (d.usesCRM === "no")          score -= 10;
  if (d.docHandling === "manual")  score -= 8;
  if (d.leadQuality === "low")     score -= 6;

  return {
    leads, conv, effConv: Math.round(effConv * 10) / 10,
    rt, rps, lost: Math.round(lost),
    mLoss, aLoss,
    wWaste, mWasteCost,
    growthPct: Math.max(0, growthPct),
    score: Math.max(8, score),
  };
}

// ── Supabase ──────────────────────────────────────────────────────────────────
async function saveToSupabase(lead, formData, metrics) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  const res = await fetch(`${url}/rest/v1/audit_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=representation",  // ← returns the inserted row with its id
    },
    body: JSON.stringify({
      name:               lead.name   || null,
      email:              lead.email  || null,
      phone:              lead.phone  || null,
      agency_name:        lead.agency || null,

      // All form answers
      monthly_leads:          formData.monthlyLeads,
      conversion_rate:        formData.conversionRate,
      response_time:          formData.responseTime,
      manual_work_pct:        formData.manualWorkPct,
      ad_spend:               formData.adSpend,
      follow_up_method:       Array.isArray(formData.followUpMethod)
                                ? formData.followUpMethod.join(", ")
                                : formData.followUpMethod,
      follow_up_count:        formData.followUpCount        || null,
      drop_off_stage:         formData.dropOffStage,
      uses_crm:               formData.usesCRM,
      doc_handling:           Array.isArray(formData.docHandling)
                                ? formData.docHandling.join(", ")
                                : formData.docHandling,
      lead_quality:           formData.leadQuality,
      lead_source:            Array.isArray(formData.leadSource)
                                ? formData.leadSource.join(", ")
                                : formData.leadSource,
      counselors:             formData.counselors            || null,
      time_per_lead:          formData.timePerLead           || null,
      cost_per_lead:          formData.costPerLead           || null,
      revenue_per_student:    formData.revenuePerStudent     || 150000,

      // Calculated metrics
      audit_score:            metrics.score,
      monthly_rev_loss:       metrics.mLoss,
      annual_rev_loss:        metrics.aLoss,
      effective_conversion:   metrics.effConv,
      lost_leads:             metrics.lost,
      weekly_wasted_hours:    metrics.wWaste,
      monthly_waste_cost:     metrics.mWasteCost,
      growth_potential_pct:   metrics.growthPct,
      weekly_wasted_hours:  metrics.wWaste,
      monthly_waste_cost:   metrics.mWasteCost,
      annual_rev_risk:      metrics.aLoss,
      growth_potential_pct: metrics.growthPct,
      effective_conversion: metrics.effConv,
      lost_leads:           metrics.lost, 
    }),
  });

  const rows = await res.json();
  return rows?.[0]?.id || null;  // return the row id so we can update it later
}

// ── Google Sheets ─────────────────────────────────────────────────────────────
async function saveToGoogleSheets(lead, formData, metrics) {
  const sheetId  = process.env.GOOGLE_SHEET_ID;
  const apiKey   = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId || !apiKey) return;

  // Use the Google Sheets API via service account JWT
  const serviceAccount = JSON.parse(apiKey);
  const token = await getGoogleToken(serviceAccount);
  if (!token) return;

  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const row = [
    now,
    lead.name   || "",
    lead.email  || "",
    lead.phone  || "",
    lead.agency || "",
    formData.monthlyLeads    || "",
    formData.conversionRate  || "",
    formData.responseTime    || "",
    formData.manualWorkPct   || "",
    formData.adSpend         || "",
    formData.followUpMethod  || "",
    formData.dropOffStage    || "",
    formData.usesCRM         || "",
    formData.docHandling     || "",
    formData.leadQuality     || "",
    formData.revenuePerStudent || 150000,
    metrics.score,
    `₹${metrics.mLoss.toLocaleString("en-IN")}`,
    `₹${metrics.aLoss.toLocaleString("en-IN")}`,
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ values: [row] }),
    }
  );
}

async function getGoogleToken(sa) {
  try {
    const header  = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now     = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }));

    // Sign with RS256 using Web Crypto
    const pemKey = sa.private_key.replace(/\\n/g, "\n");
    const keyData = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, "");
    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8", binaryKey.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["sign"]
    );
    const sigInput = `${header}.${payload}`;
    const sig = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(sigInput)
    );
    const jwt = `${sigInput}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const data = await res.json();
    return data.access_token || null;
  } catch { return null; }
}

// ── Email via Resend ──────────────────────────────────────────────────────────
async function sendEmailNotification(lead, formData, metrics, aiReport) {
  console.log("Sending email to:", lead.email, "resend key:", !!resendKey);
  const resendKey   = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resendKey) return;

  const inr = n => "₹" + Number(n).toLocaleString("en-IN");
  const scoreColor = metrics.score < 42 ? "#ef4444" : metrics.score < 68 ? "#f59e0b" : "#10b981";
  const scoreLabel = metrics.score < 42 ? "Critical" : metrics.score < 68 ? "At Risk" : "Moderate";

  // ── Email 1: notify you ───────────────────────────────────────────────────
  if (notifyEmail) {
    const adminHtml = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#08090e;color:#e8eaf0;padding:32px;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#5E60FF,#0ea5e9);border-radius:8px;padding:20px 24px;margin-bottom:24px;">
          <h1 style="color:#fff;font-size:20px;margin:0;">🎯 New Audit Lead — EnrollmentX</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">${new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e2030;color:#6b6f88;font-size:13px;width:40%;">Name</td><td style="padding:10px 0;border-bottom:1px solid #1e2030;font-size:14px;font-weight:500;">${lead.name || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e2030;color:#6b6f88;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #1e2030;font-size:14px;">${lead.email || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e2030;color:#6b6f88;font-size:13px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #1e2030;font-size:14px;">${lead.phone || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e2030;color:#6b6f88;font-size:13px;">Agency</td><td style="padding:10px 0;border-bottom:1px solid #1e2030;font-size:14px;">${lead.agency || "—"}</td></tr>
        </table>
        <div style="background:#0f1017;border:1px solid #1e2030;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h2 style="font-size:15px;margin:0 0 14px;color:#8b8fa8;text-transform:uppercase;letter-spacing:0.08em;">Audit Results</h2>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2030;"><span style="color:#6b6f88;font-size:14px;">Audit Score</span><strong style="color:${scoreColor}">${metrics.score}/100 — ${scoreLabel}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2030;"><span style="color:#6b6f88;font-size:14px;">Monthly Revenue Loss</span><strong style="color:#ef4444;">${inr(metrics.mLoss)}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2030;"><span style="color:#6b6f88;font-size:14px;">Annual Revenue at Risk</span><strong style="color:#ef4444;">${inr(metrics.aLoss)}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2030;"><span style="color:#6b6f88;font-size:14px;">Monthly Leads</span><strong>${metrics.leads}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2030;"><span style="color:#6b6f88;font-size:14px;">Conversion Rate</span><strong>${metrics.conv}% → effective ${metrics.effConv}%</strong></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="color:#6b6f88;font-size:14px;">Response Time</span><strong style="color:${metrics.rt>10?"#ef4444":"#10b981"}">${metrics.rt} minutes</strong></div>
        </div>
        <a href="https://calendly.com/charanrathod-inf/30min" style="display:block;background:linear-gradient(135deg,#5E60FF,#0ea5e9);color:#fff;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Book Strategy Call with ${lead.name || "this lead"} →
        </a>
      </div>`;

    await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "EnrollmentX Audit <audit@enrollmentx.ai>",
      to: ["tanmay.inf@gmail.com"],          // ← always goes to you
      cc: lead.email ? [lead.email] : [],    // ← CC the user if email exists
      subject: `🎯 New Audit Lead${lead.name ? ` — ${lead.name}` : ""}${lead.agency ? ` (${lead.agency})` : ""} | Score: ${metrics.score}/100 | Loss: ₹${metrics.mLoss.toLocaleString("en-IN")}/mo`,
      html,
    }),
  });
  }

  // ── Email 2: send report to the user ─────────────────────────────────────
  if (!lead.email) return;

  const inr2 = n => "₹" + Number(n).toLocaleString("en-IN");

  const userHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f8;font-family:Inter,Arial,sans-serif;">
<div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.10);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#5E60FF 0%,#0ea5e9 100%);padding:36px 36px 28px;">
    <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;">E</div>
      <span style="font-size:18px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Enrollment<span style="opacity:0.7">X</span></span>
    </div>
    <h1 style="color:#fff;font-size:26px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">Your Agency Audit Report</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Hi ${lead.name?.split(" ")[0] || "there"}, here's your full personalised audit from EnrollmentX.</p>
  </div>

  <!-- Score banner -->
  <div style="background:#0f1117;padding:28px 36px;display:flex;align-items:center;gap:24px;">
    <div style="text-align:center;flex-shrink:0;">
      <div style="font-size:48px;font-weight:800;color:${scoreColor};font-family:monospace;line-height:1;">${metrics.score}</div>
      <div style="font-size:12px;color:#6b6f88;margin-top:2px;">out of 100</div>
    </div>
    <div style="flex:1;border-left:1px solid #1e2030;padding-left:24px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#4a4d66;margin-bottom:6px;">AI Efficiency Score</div>
      <div style="font-size:17px;font-weight:600;color:#e8eaf0;margin-bottom:6px;">${metrics.score < 42 ? "Critical — Urgent action required" : metrics.score < 68 ? "At Risk — Revenue leaks detected" : "Moderate — Gaps need addressing"}</div>
      <div style="height:6px;background:#1e2030;border-radius:3px;overflow:hidden;">
        <div style="height:100%;width:${metrics.score}%;background:${scoreColor};border-radius:3px;"></div>
      </div>
    </div>
  </div>

  <!-- Revenue loss boxes -->
  <div style="padding:28px 36px 0;background:#fff;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:16px;">What You're Losing</div>
    <div style="display:grid;gap:12px;">
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:2px;">Monthly Revenue Loss</div>
          <div style="font-size:11px;color:#9ca3af;">${metrics.lost} unconverted leads × ${inr2(metrics.rps)}</div>
        </div>
        <div style="font-size:24px;font-weight:700;color:#ef4444;font-family:monospace;">${inr2(metrics.mLoss)}</div>
      </div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:2px;">Annual Revenue at Risk</div>
          <div style="font-size:11px;color:#9ca3af;">If nothing changes in 12 months</div>
        </div>
        <div style="font-size:24px;font-weight:700;color:#f97316;font-family:monospace;">${inr2(metrics.aLoss)}</div>
      </div>
    </div>
  </div>

  <!-- Key metrics -->
  <div style="padding:24px 36px;background:#fff;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:16px;">Key Metrics</div>
    <table style="width:100%;border-collapse:collapse;">
      ${[
        ["Conversion Rate", `${metrics.effConv}%`, `Benchmark: 15% — you are ${(15 - metrics.effConv).toFixed(1)}% below`, metrics.effConv < 15 ? "#ef4444" : "#10b981"],
        ["Response Time", `${metrics.rt} min`, metrics.rt > 10 ? "⚠ Above 10-min threshold — 7× harder to convert" : "✓ Within optimal range", metrics.rt > 10 ? "#ef4444" : "#10b981"],
        ["Manual Work", `${formData.manualWorkPct || 0}%`, "Of counselor time spent on repetitive tasks", metrics.score < 50 ? "#f97316" : "#6b7280"],
        ["Weekly Hours Wasted", `${metrics.wWaste} hrs`, "Across your team on manual tasks", "#6b7280"],
        ["Ad Budget Wasted", inr2(Math.round((formData.adSpend||0) * (1 - metrics.effConv/100))), "Spent on leads that never convert", "#f97316"],
      ].map(([label, val, note, color]) => `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;font-size:14px;color:#374151;">${label}</td>
        <td style="padding:12px 0;font-size:15px;font-weight:700;color:${color};font-family:monospace;text-align:right;">${val}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td colspan="2" style="padding:0 0 10px;font-size:12px;color:#9ca3af;">${note}</td>
      </tr>`).join("")}
    </table>
  </div>

  <!-- AI Analysis -->
  ${aiReport ? `
  <div style="margin:0 36px 24px;background:#f8f7ff;border:1px solid #e0e0ff;border-radius:12px;padding:24px;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#7c6fcd;margin-bottom:12px;">◈ AI Bottleneck Analysis</div>
    <div style="font-size:14px;color:#374151;line-height:1.85;white-space:pre-wrap;">${aiReport}</div>
  </div>` : ""}

  <!-- Growth potential -->
  <div style="margin:0 36px 24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#16a34a;margin-bottom:8px;">Your Growth Potential</div>
    <div style="font-size:36px;font-weight:800;color:#16a34a;font-family:monospace;margin-bottom:8px;">+${Math.min(metrics.growthPct, 150)}%</div>
    <div style="font-size:14px;color:#374151;line-height:1.7;">
      Reaching the 15% conversion benchmark from your current ${metrics.effConv}% would bring in 
      <strong>${metrics.lost} additional students/month</strong> — that's 
      <strong>${inr2(metrics.mLoss)}/month</strong> or <strong>${inr2(metrics.aLoss)}/year</strong> 
      in recovered revenue without spending a single extra rupee on ads.
    </div>
  </div>

  <!-- CTA -->
  <div style="margin:0 36px 36px;background:linear-gradient(135deg,#5E60FF,#0ea5e9);border-radius:12px;padding:28px;text-align:center;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.7);margin-bottom:10px;">Ready to fix this?</div>
    <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 10px;letter-spacing:-0.02em;">Recover ${inr2(metrics.mLoss)}/month in 30 days</h2>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 20px;line-height:1.6;">Our team will build a custom AI system for your agency — lead chatbot, WhatsApp automation, CRM workflows — all tailored to how you work.</p>
    <a href="https://calendly.com/charanrathod-inf/30min" style="display:inline-block;background:#fff;color:#5E60FF;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Book a Free Strategy Call →</a>
    <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:14px 0 0;">No commitment · 30-minute call · EnrollmentX specialists</p>
  </div>

  <!-- Footer -->
  <div style="padding:20px 36px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="font-size:12px;color:#9ca3af;margin:0;">EnrollmentX · AI Systems for Study Abroad Agencies</p>
  </div>

</div>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: "EnrollmentX Audit <audit@enrollmentx.ai>",
      to: [lead.email],
      subject: `Your EnrollmentX Audit — Score: ${metrics.score}/100 | You're losing ${inr(metrics.mLoss)}/month`,
      html: userHtml,
    }),
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { lead, formData, aiReport } = await req.json();
    const metrics = calcMetrics(formData);
    console.log("=== CAPTURE DEBUG ===");
    console.log("lead email:", lead?.email);
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("NOTIFY_EMAIL:", process.env.NOTIFY_EMAIL);

    const [supabaseResult] = await Promise.allSettled([
      saveToSupabase(lead, formData, metrics),
      saveToGoogleSheets(lead, formData, metrics),
      sendEmailNotification(lead, formData, metrics),
    ]);

    // If AI report was passed in, patch it onto the row
    const rowId = supabaseResult?.value;
    if (rowId && aiReport) {
      const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      await fetch(`${url}/rest/v1/audit_leads?id=eq.${rowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": key,
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({ ai_report: aiReport }),
      });
    }

    return NextResponse.json({ ok: true, rowId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
