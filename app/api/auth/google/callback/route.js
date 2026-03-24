// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      `<script>window.opener?.postMessage({type:'GOOGLE_AUTH_SUCCESS', profile:{}}, location.origin); window.close();</script>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Exchange code for token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + "/api/auth/google/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = await userRes.json();

  return new NextResponse(
    `<script>
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        profile: { name: "${user.name}", email: "${user.email}", phone: "", agency: "" }
      }, location.origin);
      window.close();
    </script>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
```

### 3. Add these 3 env vars to Vercel
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID    = your_google_client_id
GOOGLE_CLIENT_SECRET            = your_google_client_secret  
NEXT_PUBLIC_APP_URL             = https://enrollmentxaudit.vercel.app
```

### 4. Add callback URL to Google Cloud Console
```
https://enrollmentxaudit.vercel.app/api/auth/google/callback