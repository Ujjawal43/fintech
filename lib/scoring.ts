export type EmploymentType = "Salaried" | "Business";

export type LeadInput = {
  name: string;
  phone: string;
  income: number;
  cibil: number;
  employment: EmploymentType;
  city?: string;
};

export function calculateScore(input: Pick<LeadInput, "income" | "cibil" | "employment">): number {
  let score = 0;

  if (input.cibil >= 750) score += 40;
  else if (input.cibil >= 700) score += 30;
  else if (input.cibil >= 650) score += 20;

  if (input.income >= 50000) score += 30;
  else if (input.income >= 30000) score += 20;
  else score += 10;

  if (input.employment === "Salaried") score += 20;
  else score += 15;

  return score;
}

export function getApprovalStatus(score: number): "High Approval" | "Medium Approval" | "Low Approval" {
  if (score >= 70) return "High Approval";
  if (score >= 50) return "Medium Approval";
  return "Low Approval";
}

export function routeNbfc(score: number): "Prime NBFC" | "Standard NBFC" | "Subprime NBFC" {
  if (score >= 70) return "Prime NBFC";
  if (score >= 50) return "Standard NBFC";
  return "Subprime NBFC";
}
