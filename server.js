const express = require('express');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4242;

app.use(express.static('public'));
app.use(bodyParser.json());

// Create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { charity, donationDate } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Donation to ${charity}` },
          unit_amount: 5000, // default $50 donation
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/cancel.html',
    });

    // Save donation log (MVP - logs at checkout creation)
    const donation = {
      id: session.id,
      amount: 50,
      charity,
      donationDate,
      timestamp: new Date().toISOString(),
    };
    const logPath = path.join(__dirname, 'donations.json');
    let donations = [];
    if (fs.existsSync(logPath)) {
      donations = JSON.parse(fs.readFileSync(logPath));
    }
    donations.push(donation);
    fs.writeFileSync(logPath, JSON.stringify(donations, null, 2));

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch all donations
app.get('/donations', (req, res) => {
  const logPath = path.join(__dirname, 'donations.json');
  if (!fs.existsSync(logPath)) return res.json([]);
  const donations = JSON.parse(fs.readFileSync(logPath));
  res.json(donations);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
