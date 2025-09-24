# DayForGood - MVP Website Scaffold

This is a simple static MVP website scaffold for **DayForGood** — a platform where users donate the value of one workday to charity.

## What's included
- `index.html` — homepage and donation flow (simulated, client-side).
- `styles.css` — basic styling.
- `app.js` — simple client-side logic, loads `charities.json` and simulates donations.
- `charities.json` — sample charity data + impact-per-dollar values.
- `server_example.js` — example Node/Express server code showing how to create a Stripe Checkout session (replace keys and deploy securely).
- `README.md` — this file.

## How this MVP works
- The frontend simulates a donation and shows an impact summary.
- Payment processing is **not implemented** in the static site — you must wire Stripe/PayPal using a small server component (example included).

## Next steps to accept real payments (high-level)
1. Create a Stripe account and get API keys (use test keys during development).
2. Deploy a small server (example in `server_example.js`) to create Checkout Sessions securely.
3. Set up Stripe webhooks to confirm payments and record donations server-side.
4. Implement charity payout logic (manual at first, later integrate Stripe Connect or send funds directly).

## Local testing
1. Open `index.html` in your browser (or serve via a static server).
2. Click "Donate Your Day" and use the form to simulate a donation.
3. Replace `charities.json` with real partner data when you're ready.

## Legal & Compliance
This scaffold is for MVP/testing only. Before accepting donations:
- Create a business entity (LLC/nonprofit) and consult a lawyer.
- Ensure donation routing and tax receipting follows regulations.
- Use proper Terms/Privacy/Refund policies.

## Need help deploying?
I can help you:
- Wire Stripe Checkout + webhooks (server example included).
- Add real charity admin dashboard.
- Convert the static site to React or Webflow.
- Provide hosting recommendations (Vercel, Netlify, AWS).

---
Enjoy — DayForGood!
