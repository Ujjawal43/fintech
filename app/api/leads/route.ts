import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { calculateScore, getApprovalStatus, routeNbfc } from "@/lib/scoring";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Too many requests. Please retry in a minute." }, { status: 429 });
  }

  const body = await req.json();
  const required = ["name", "phone", "income", "cibil", "employment"];
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json({ ok: false, message: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const score = calculateScore({ income: Number(body.income), cibil: Number(body.cibil), employment: body.employment });
  const status = getApprovalStatus(score);
  const lenderRoute = routeNbfc(score);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      message: `Lead captured in demo mode. Score ${score}, ${status}, Route ${lenderRoute}. Configure Supabase env vars to persist.`
    });
  }

  const { error } = await supabase.from("leads").insert({
    name: String(body.name),
    phone: String(body.phone),
    income: Number(body.income),
    cibil: Number(body.cibil),
    employment: String(body.employment),
    city: body.city ? String(body.city) : null,
    score,
    status,
    lender_route: lenderRoute,
    stage: "New"
  });

  if (error) {
    return NextResponse.json({ ok: false, message: `Failed to save lead: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: `Lead submitted. Score ${score} (${status}). Routed to ${lenderRoute}.` });
}
