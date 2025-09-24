// server.js
require('dotenv').config(); // safe to keep; Render uses env vars directly
const express = require('express');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { charity = 'General', donationDate = null } = req.body || {};

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY in environment');
    return res.status(500).json({ error: 'Payment configuration missing' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Donation to ${charity}` },
            unit_amount: 500, // 500 cents = $5
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    // Log donation locally (MVP)
    const donation = {
      id: session.id,
      amount: 5,
      charity,
      donationDate,
      timestamp: new Date().toISOString(),
    };
    const logPath = path.join(__dirname, 'donations.json');
    let donations = [];
    try {
      if (fs.existsSync(logPath)) donations = JSON.parse(fs.readFileSync(logPath));
    } catch (e) { donations = []; }
    donations.push(donation);
    fs.writeFileSync(logPath, JSON.stringify(donations, null, 2));

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Return donations for admin
app.get('/donations', (req, res) => {
  const logPath = path.join(__dirname, 'donations.json');
  if (!fs.existsSync(logPath)) return res.json([]);
  const donations = JSON.parse(fs.readFileSync(logPath));
  res.json(donations);
});

// Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
