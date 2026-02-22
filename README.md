# Fintech Loan Eligibility Platform

Production-ready starter for a loan lead qualification stack using **Next.js + Supabase**.

## Implemented features

- Loan eligibility form with real-time score calculation.
- Scoring engine (CIBIL + income + employment).
- Lead submission API with in-memory rate limiting.
- Supabase lead persistence (`leads` table).
- Admin dashboard to view all leads sorted by latest submissions.
- NBFC routing bucket (`Prime`, `Standard`, `Subprime`).
- Legal pages (privacy, terms, disclaimer).
- Basic admin route guard middleware (token-based fallback).

## Scoring and routing

- **CIBIL:** 750+ = 40, 700–749 = 30, 650–699 = 20
- **Income:** >=50k = 30, 30k–49,999 = 20, else 10
- **Employment:** Salaried = 20, Business = 15
- **Decision:** 70+ High, 50–69 Medium, else Low
- **Lender route:** High -> Prime NBFC, Medium -> Standard NBFC, Low -> Subprime NBFC

## Setup

```bash
npm install
cp .env.example .env.local
# fill env values
npm run dev
```

## Supabase setup

Run SQL in `db/schema.sql` in your Supabase SQL editor.

## APIs

### `POST /api/leads`
Expected body:

```json
{
  "name": "Aman",
  "phone": "9876543210",
  "income": 65000,
  "cibil": 760,
  "employment": "Salaried",
  "city": "Mumbai"
}
```

## Security roadmap (next)

- Replace token middleware with Supabase Auth session checks.
- Add CAPTCHA verification in `/api/leads`.
- Add phone OTP validation before final lead creation.
- Move rate-limiting to Redis/Upstash for multi-instance support.

## Monetization hooks (next)

- Razorpay payment intents + webhook.
- WhatsApp automation after lead creation.
- CRM stage update endpoints.
