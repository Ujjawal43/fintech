"use client";

import { useMemo, useState } from "react";
import { calculateScore, getApprovalStatus, routeNbfc, type EmploymentType } from "@/lib/scoring";

type SubmitResponse = {
  ok: boolean;
  message: string;
};

export function EligibilityForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    income: 30000,
    cibil: 700,
    employment: "Salaried" as EmploymentType,
    city: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  const score = useMemo(() => calculateScore(form), [form]);
  const status = useMemo(() => getApprovalStatus(score), [score]);
  const lenderRoute = useMemo(() => routeNbfc(score), [score]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, score, status, lenderRoute })
    });

    const data = (await res.json()) as SubmitResponse;
    setResult(data);
    setSubmitting(false);
  }

  return (
    <div className="grid grid-2">
      <form className="card" onSubmit={onSubmit}>
        <h2>Check Loan Eligibility</h2>
        <p className="small">Real-time score before submission.</p>

        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Phone</label>
        <input required pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <label>Monthly Income</label>
        <input type="number" min={0} required value={form.income} onChange={(e) => setForm({ ...form, income: Number(e.target.value) })} />

        <label>CIBIL Score</label>
        <input type="number" min={300} max={900} required value={form.cibil} onChange={(e) => setForm({ ...form, cibil: Number(e.target.value) })} />

        <label>Employment Type</label>
        <select value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value as EmploymentType })}>
          <option value="Salaried">Salaried</option>
          <option value="Business">Business</option>
        </select>

        <label>City (for smart matching)</label>
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />

        <button disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</button>

        {result && <p className="small">{result.message}</p>}
      </form>

      <div className="card">
        <h3>Live Decision Engine</h3>
        <p>Score: <strong>{score}</strong></p>
        <p>Status: <span className={`badge ${status.startsWith("High") ? "high" : status.startsWith("Medium") ? "medium" : "low"}`}>{status}</span></p>
        <p>NBFC Route: <strong>{lenderRoute}</strong></p>

        <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "18px 0" }} />
        <h4>Production Hardening Checklist</h4>
        <ul className="small">
          <li>✅ Database capture via Supabase</li>
          <li>🟡 Add CAPTCHA provider in /api/leads</li>
          <li>🟡 Add phone OTP verification before final submit</li>
          <li>🟡 Add Supabase Auth-protected admin login</li>
          <li>🟡 Add Razorpay checkout API + webhook</li>
          <li>🟡 Add WhatsApp event automation worker</li>
        </ul>
      </div>
    </div>
  );
}
