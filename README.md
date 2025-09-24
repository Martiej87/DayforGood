# DayForGood MVP

This is the MVP website for DayForGood — where anyone can donate a workday's worth of pay to a charity of their choice.

## Features
- Donation form (charity + workday date)
- Stripe Checkout integration
- Logs donations to `donations.json`
- Simple admin dashboard at `/admin.html`

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Stripe secret key:
   ```bash
   export STRIPE_SECRET_KEY=your_test_key_here
   ```
3. Start server:
   ```bash
   npm start
   ```
4. Open [http://localhost:4242](http://localhost:4242)

## Deploying to Render
- Push this repo to GitHub
- Create a new Web Service on Render
- Set environment variable `STRIPE_SECRET_KEY`
- Done 🚀
