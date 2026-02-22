import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fintech Loan Eligibility Platform",
  description: "Lead scoring and routing platform for fintech/NBFC flows"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="container" style={{ paddingBottom: 8 }}>
          <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <strong>Fintech Platform</strong>
            <Link href="/">Eligibility</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/legal/privacy-policy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
