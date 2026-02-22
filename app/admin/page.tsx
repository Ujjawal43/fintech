import { getSupabaseServerClient } from "@/lib/supabase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  income: number;
  cibil: number;
  employment: string;
  city: string | null;
  score: number;
  status: string;
  lender_route: string;
  stage: string;
  created_at: string;
};

function getBadgeClass(status: string) {
  if (status.startsWith("High")) return "high";
  if (status.startsWith("Medium")) return "medium";
  return "low";
}

export default async function AdminPage() {
  const supabase = getSupabaseServerClient();
  let leads: Lead[] = [];
  let errorMessage: string | null = null;

  if (!supabase) {
    errorMessage = "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
  } else {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) errorMessage = error.message;
    else leads = data as Lead[];
  }

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="card">
        <h1>Admin Dashboard</h1>
        <p className="small">MVP: all leads + score/status. Phase 2 includes filters, CSV export, and stage transitions.</p>
      </section>

      <section className="card table-wrap">
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Phone</th><th>Income</th><th>CIBIL</th><th>Employment</th><th>City</th><th>Score</th><th>Status</th><th>Route</th><th>CRM Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.income}</td>
                  <td>{lead.cibil}</td>
                  <td>{lead.employment}</td>
                  <td>{lead.city ?? "-"}</td>
                  <td>{lead.score}</td>
                  <td><span className={`badge ${getBadgeClass(lead.status)}`}>{lead.status}</span></td>
                  <td>{lead.lender_route}</td>
                  <td>{lead.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
