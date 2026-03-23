# EnrollmentX — AI Audit System

A conversion-optimised AI audit tool for study abroad agencies. Built with Next.js 14 and the Anthropic API.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enrollmentx-audit.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework will auto-detect as **Next.js**
4. Click **Deploy** — but first add your environment variable:

### Step 3 — Add Environment Variable

In Vercel → Project Settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...your key here...` |

Then redeploy.

---

## Run Locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
enrollmentx/
├── app/
│   ├── layout.js          # Root layout + metadata + fonts
│   ├── page.js            # Entry point (renders App component)
│   └── api/
│       └── analyze/
│           └── route.js   # Server-side Anthropic API call
├── components/
│   └── App.js             # Full audit system UI
├── .env.example           # Environment variable template
└── package.json
```

---

## Booking Link

The "Book a Free Strategy Call" button links to:
`https://calendly.com/charanrathod-inf/30min`

To change it, search for that URL in `components/App.js`.
