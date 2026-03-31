import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── helpers ───────────────────────────────────────────────────────────────────

function calcMetrics(d) {
  const leads   = Number(d.monthlyLeads) || 0;
  const conv    = Number(d.conversionRate) || 0;
  const rt      = Number(d.responseTime) || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const manual  = Number(d.manualWorkPct) || 0;
  const counsel = Number(d.counselors) || 1;
  const tpl     = Number(d.timePerLead) || 30;
  const ad      = Number(d.adSpend) || 0;

  const penalty    = rt > 10;
  const effConv    = penalty ? conv * 0.7 : conv;
  const lost       = Math.max(0, leads * (15 - effConv) / 100);
  const mLoss      = Math.round(lost * rps);
  const aLoss      = mLoss * 12;
  const mWaste     = (manual / 100) * (tpl / 60) * leads;
  const wWaste     = Math.round(mWaste / 4.33);
  const mWasteCost = Math.round(mWaste * 200);
  const growthPct  = effConv > 0 ? Math.min(200, Math.round(((15 - effConv) / effConv) * 100)) : 80;

  const followUpArr = Array.isArray(d.followUpMethod)
    ? d.followUpMethod
    : d.followUpMethod ? [d.followUpMethod] : [];

  let score = 100;
  if (effConv < 15) score -= Math.min(28, Math.round((15 - effConv) * 2));
  if (rt > 10)      score -= 18;
  if (manual > 50)  score -= 16;
  if (followUpArr.includes("none") || followUpArr.length === 0) score -= 14;
  if (d.usesCRM === "no")         score -= 10;
  if (d.docHandling === "manual") score -= 8;
  if (d.leadQuality === "low")    score -= 6;

  return {
    leads, conv, effConv: Math.round(effConv * 10) / 10,
    rt, rps, lost: Math.round(lost),
    mLoss, aLoss, wWaste, mWasteCost,
    growthPct: Math.max(0, growthPct),
    score: Math.max(8, score),
    counsel, ad,
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
      "Prefer": "return=representation",
    },
    body: JSON.stringify({
      name:               lead.name   || null,
      email:              lead.email  || null,
      phone:              lead.phone  || null,
      agency_name:        lead.agency || null,
      monthly_leads:      formData.monthlyLeads,
      conversion_rate:    formData.conversionRate,
      response_time:      formData.responseTime,
      manual_work_pct:    formData.manualWorkPct,
      ad_spend:           formData.adSpend,
      follow_up_method:   Array.isArray(formData.followUpMethod)
                            ? formData.followUpMethod.join(", ")
                            : formData.followUpMethod,
      follow_up_count:    formData.followUpCount   || null,
      drop_off_stage:     formData.dropOffStage,
      uses_crm:           formData.usesCRM,
      doc_handling:       Array.isArray(formData.docHandling)
                            ? formData.docHandling.join(", ")
                            : formData.docHandling,
      lead_quality:       formData.leadQuality,
      lead_source:        Array.isArray(formData.leadSource)
                            ? formData.leadSource.join(", ")
                            : formData.leadSource,
      counselors:         formData.counselors       || null,
      time_per_lead:      formData.timePerLead      || null,
      cost_per_lead:      formData.costPerLead      || null,
      revenue_per_student: formData.revenuePerStudent || 150000,
      audit_score:        metrics.score,
      monthly_rev_loss:   metrics.mLoss,
      annual_rev_loss:    metrics.aLoss,
      effective_conversion: metrics.effConv,
      lost_leads:         metrics.lost,
      weekly_wasted_hours: metrics.wWaste,
      monthly_waste_cost: metrics.mWasteCost,
      annual_rev_risk:    metrics.aLoss,
      growth_potential_pct: metrics.growthPct,
    }),
  });

  const rows = await res.json();
  return rows?.[0]?.id || null;
}

// ── Google Sheets ─────────────────────────────────────────────────────────────
async function saveToGoogleSheets(lead, formData, metrics) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey  = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId || !apiKey) return;

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
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
    const pemKey   = sa.private_key.replace(/\\n/g, "\n");
    const keyData  = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, "");
    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8", binaryKey.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["sign"]
    );
    const sigInput = `${header}.${payload}`;
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(sigInput));
    const jwt = `${sigInput}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
    const res  = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const data = await res.json();
    return data.access_token || null;
  } catch { return null; }
}

// ── Email via Gmail / Nodemailer ──────────────────────────────────────────────
async function sendEmailNotification(lead, formData, metrics, aiReport) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  console.log("Email — gmail user:", gmailUser, "pass exists:", !!gmailPass, "lead email:", lead?.email);

  if (!gmailUser || !gmailPass) {
    console.log("Email skipped — GMAIL_USER or GMAIL_PASS not set");
    return;
  }

  const inr        = n => "₹" + Number(n).toLocaleString("en-IN");
  const scoreColor = metrics.score < 42 ? "#ef4444" : metrics.score < 68 ? "#f59e0b" : "#10b981";
  const scoreLabel = metrics.score < 42 ? "Critical" : metrics.score < 68 ? "At Risk" : "Moderate";

  const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f2f8;font-family:Inter,Arial,sans-serif;">
<div style="max-width:640px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.10);">

  <div style="background:linear-gradient(135deg,#5E60FF,#0ea5e9);padding:32px 36px;">
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 6px;">🎯 EnrollmentX Audit Report</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">${new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}</p>
  </div>

  <div style="background:#0f1117;padding:24px 36px;display:flex;align-items:center;gap:24px;">
    <div style="text-align:center;">
      <div style="font-size:48px;font-weight:800;color:${scoreColor};font-family:monospace;line-height:1;">${metrics.score}</div>
      <div style="font-size:12px;color:#6b6f88;">/ 100</div>
    </div>
    <div style="flex:1;padding-left:24px;border-left:1px solid #1e2030;">
      <div style="font-size:13px;color:#8b8fa8;margin-bottom:4px;">AI Efficiency Score — <strong style="color:${scoreColor}">${scoreLabel}</strong></div>
      <div style="height:6px;background:#1e2030;border-radius:3px;"><div style="height:100%;width:${metrics.score}%;background:${scoreColor};border-radius:3px;"></div></div>
    </div>
  </div>

  <div style="padding:28px 36px;background:#fff;">
    <h2 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin:0 0 16px;">Lead Details</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:35%;">Name</td><td style="font-size:14px;font-weight:500;">${lead.name || "—"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="font-size:14px;">${lead.email || "—"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td><td style="font-size:14px;">${lead.phone || "—"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Agency</td><td style="font-size:14px;">${lead.agency || "—"}</td></tr>
    </table>
  </div>

  <div style="padding:0 36px 28px;background:#fff;">
    <h2 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin:0 0 16px;">Revenue Impact</h2>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div><div style="font-size:13px;color:#6b7280;">Monthly Revenue Loss</div><div style="font-size:11px;color:#9ca3af;">${metrics.lost} unconverted leads × ${inr(metrics.rps)}</div></div>
      <div style="font-size:24px;font-weight:700;color:#ef4444;font-family:monospace;">${inr(metrics.mLoss)}</div>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
      <div><div style="font-size:13px;color:#6b7280;">Annual Revenue at Risk</div></div>
      <div style="font-size:24px;font-weight:700;color:#f97316;font-family:monospace;">${inr(metrics.aLoss)}</div>
    </div>
  </div>

  <div style="padding:0 36px 28px;background:#fff;">
    <h2 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin:0 0 16px;">Key Metrics</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;font-size:14px;color:#374151;">Conversion Rate</td><td style="font-size:15px;font-weight:700;color:${metrics.effConv < 15 ? "#ef4444" : "#10b981"};text-align:right;font-family:monospace;">${metrics.effConv}%</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;font-size:14px;color:#374151;">Response Time</td><td style="font-size:15px;font-weight:700;color:${metrics.rt > 10 ? "#ef4444" : "#10b981"};text-align:right;font-family:monospace;">${metrics.rt} min</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;font-size:14px;color:#374151;">Manual Work</td><td style="font-size:15px;font-weight:700;color:#f97316;text-align:right;font-family:monospace;">${formData.manualWorkPct || 0}%</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;font-size:14px;color:#374151;">Weekly Hours Wasted</td><td style="font-size:15px;font-weight:700;color:#6b7280;text-align:right;font-family:monospace;">${metrics.wWaste} hrs</td></tr>
      <tr><td style="padding:10px 0;font-size:14px;color:#374151;">CRM</td><td style="font-size:15px;font-weight:700;color:#6b7280;text-align:right;">${formData.usesCRM || "—"}</td></tr>
    </table>
  </div>

  ${aiReport ? `
  <div style="margin:0 36px 24px;background:#f8f7ff;border:1px solid #e0e0ff;border-radius:12px;padding:24px;">
    <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#7c6fcd;margin-bottom:12px;">◈ AI Bottleneck Analysis</div>
    <div style="font-size:14px;color:#374151;line-height:1.85;white-space:pre-wrap;">${aiReport}</div>
  </div>` : ""}

  <div style="margin:0 36px 36px;background:linear-gradient(135deg,#5E60FF,#0ea5e9);border-radius:12px;padding:28px;text-align:center;">
    <h2 style="color:#fff;font-size:20px;font-weight:700;margin:0 0 10px;">Recover ${inr(metrics.mLoss)}/month in 30 days</h2>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 20px;line-height:1.6;">Book a free strategy call — our team will build a custom AI system for your agency.</p>
    <a href="https://calendly.com/charanrathod-inf/30min" style="display:inline-block;background:#fff;color:#5E60FF;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Book a Free Strategy Call →</a>
  </div>

  <div style="padding:20px 36px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="font-size:12px;color:#9ca3af;margin:0;">EnrollmentX · AI Systems for Study Abroad Agencies</p>
  </div>

</div>
</body></html>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const recipients = ["tanmay.inf@gmail.com"];
  if (lead.email && lead.email !== "tanmay.inf@gmail.com") recipients.push(lead.email);

  await transporter.sendMail({
    from: `"EnrollmentX Audit" <${gmailUser}>`,
    to: recipients.join(", "),
    subject: `🎯 New Audit — ${lead.name || "Unknown"} | Score: ${metrics.score}/100 | Loss: ₹${metrics.mLoss.toLocaleString("en-IN")}/mo`,
    html,
  });

  console.log("✅ Email sent to:", recipients.join(", "));
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { lead, formData, aiReport } = await req.json();
    const metrics = calcMetrics(formData);

    console.log("=== CAPTURE ===", "email:", lead?.email, "supabase:", !!process.env.SUPABASE_URL, "gmail:", !!process.env.GMAIL_USER);

    const [supabaseResult] = await Promise.allSettled([
      saveToSupabase(lead, formData, metrics),
      saveToGoogleSheets(lead, formData, metrics),
    ]);

    try {
      await sendEmailNotification(lead, formData, metrics, aiReport);
    } catch (emailErr) {
      console.log("Email error:", emailErr.message);
    }

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
    console.log("Capture error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}