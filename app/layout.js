export const metadata = {
  title: "EnrollmentX — Free AI Audit for Study Abroad Agencies",
  description:
    "Discover exactly how much revenue your study abroad agency is losing. Get a free AI-powered audit with personalised ₹ figures and a step-by-step fix plan.",
  openGraph: {
    title: "EnrollmentX — Free AI Audit for Study Abroad Agencies",
    description:
      "Find out exactly how much revenue your agency is losing today. Free 2-minute audit.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#F2F0EB" }}>{children}</body>
    </html>
  );
}