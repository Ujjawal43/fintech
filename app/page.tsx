import { EligibilityForm } from "@/components/eligibility-form";

export default function HomePage() {
  return (
    <main className="container grid" style={{ gap: 20 }}>
      <section className="card">
        <h1>Fintech Loan Eligibility Platform</h1>
        <p>
          Capture leads, score eligibility instantly, and route qualified users to the right NBFC bucket.
        </p>
      </section>
      <EligibilityForm />
    </main>
  );
}
