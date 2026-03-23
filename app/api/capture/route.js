import { NextResponse } from "next/server";

// ── helpers ──────────────────────────────────────────────────────────────────

function calcMetrics(d) {
  const leads   = Number(d.monthlyLeads) || 0;
  const conv    = Number(d.conversionRate) || 0;
  const rt      = Number(d.responseTime) || 0;
  const rps     = Number(d.revenuePerStudent) || 150000;
  const manual  = Number(d.manualWorkPct) || 0;
  const ad      = Number(d.adSpend) || 0;
  const penalty = rt > 10;
  const effConv = penalty ? conv * 0.7 : conv;
  const lost    = Math.max(0, leads * (15 - effConv) / 100);
  const mLoss   = Math.round(lost * rps);
  const aLoss   = mLoss * 12;
  let score = 100;
  if (effConv < 15) score -= Math.min(28, Math.round((15 - effConv) * 2));
  if (rt > 10)      score -= 18;
  if (manual > 50)  score -= 16;
  if (d.followUpMethod === "none") score -= 14;
  if (d.usesCRM === "no")          score -= 10;
  if (d.docHandling === "manual")  score -= 8;
  if (d.leadQuality === "low")     score -= 6;
  return { leads, conv, effConv: Math.round(effConv * 10) / 10, rt, rps, lost: Math.round(lost), mLoss, aLoss, ad, score: Math.max(8, score) };
}

// ── Supabase ──────────────────────────────────────────────────────────────────
async function saveToSupabase(lead, formData, metrics) {
  const url  = process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return;

  await fetch(`${url}/rest/v1/audit_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      name:          lead.name   || null,
      email:         lead.email  || null,
      phone:         lead.phone  || null,
      agency_name:   lead.agency || null,
      monthly_leads:    formData.monthlyLeads,
      conversion_rate:  formData.conversionRate,
      response_time:    formData.responseTime,
      manual_work_pct:  formData.manualWorkPct,
      ad_spend:         formData.adSpend,
      follow_up_method: formData.followUpMethod,
      drop_off_stage:   formData.dropOffStage,
      uses_crm:         formData.usesCRM,
      doc_handling:     formData.docHandling,
      lead_quality:     formData.leadQuality,
      revenue_per_student: formData.revenuePerStudent || 150000,
      audit_score:      metrics.score,
      monthly_rev_loss: metrics.mLoss,
      annual_rev_loss:  metrics.aLoss,
      created_at:       new Date().toISOString(),
    }),
  });
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
async function sendEmailNotification(lead, formData, metrics) {
  const resendKey   = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resendKey || !notifyEmail) return;

  const html = `
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
        <div style="display:grid;gap:12px;">
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Audit Score</span><strong style="color:${metrics.score<42?"#ef4444":metrics.score<68?"#f59e0b":"#10b981"}">${metrics.score}/100</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Monthly Revenue Loss</span><strong style="color:#ef4444;">₹${metrics.mLoss.toLocaleString("en-IN")}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Annual Revenue at Risk</span><strong style="color:#ef4444;">₹${metrics.aLoss.toLocaleString("en-IN")}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Monthly Leads</span><strong>${metrics.leads}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Conversion Rate</span><strong>${metrics.conv}% (benchmark: 15%)</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Response Time</span><strong style="color:${metrics.rt>10?"#ef4444":"#10b981"}">${metrics.rt} minutes</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Manual Work</span><strong>${formData.manualWorkPct}%</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Uses CRM</span><strong>${formData.usesCRM}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b6f88;font-size:14px;">Ad Spend / month</span><strong>₹${Number(formData.adSpend||0).toLocaleString("en-IN")}</strong></div>
        </div>
      </div>

      <a href="https://calendly.com/charanrathod-inf/30min" style="display:block;background:linear-gradient(135deg,#5E60FF,#0ea5e9);color:#fff;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Book Strategy Call with ${lead.name || "this lead"} →
      </a>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "EnrollmentX Audit <audit@enrollmentx.ai>",
      to: [notifyEmail],
      subject: `🎯 New Audit Lead${lead.name ? ` — ${lead.name}` : ""}${lead.agency ? ` (${lead.agency})` : ""} | Score: ${metrics.score}/100 | Loss: ₹${metrics.mLoss.toLocaleString("en-IN")}/mo`,
      html,
    }),
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { lead, formData } = await req.json();
    const metrics = calcMetrics(formData);

    // Run all three in parallel — non-blocking, failures are silent
    await Promise.allSettled([
      saveToSupabase(lead, formData, metrics),
      saveToGoogleSheets(lead, formData, metrics),
      sendEmailNotification(lead, formData, metrics),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
