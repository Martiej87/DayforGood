// server.js - Express backend for DayForGood with donation logging
// Install: npm install express stripe body-parser cors dotenv fs
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // serve static files (index.html, etc.)

const DONATIONS_FILE = path.join(__dirname, 'donations.json');

function saveDonation(donation) {
  let donations = [];
  if (fs.existsSync(DONATIONS_FILE)) {
    donations = JSON.parse(fs.readFileSync(DONATIONS_FILE));
  }
  donations.push(donation);
  fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2));
}

app.post('/create-checkout-session', async (req, res) => {
  const { amount, charityName, donationDate } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Donation — ${charityName}`,
            description: `Workday donation for ${donationDate}`
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/cancel.html',
    });

    // Save donation log immediately (MVP approach)
    const donationRecord = {
      id: session.id,
      amount,
      charity: charityName,
      donationDate,
      timestamp: new Date().toISOString()
    };
    saveDonation(donationRecord);

    res.json({ id: session.id, publicKey: process.env.STRIPE_PUBLIC_KEY });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/donations', (req, res) => {
  if (fs.existsSync(DONATIONS_FILE)) {
    const donations = JSON.parse(fs.readFileSync(DONATIONS_FILE));
    res.json(donations);
  } else {
    res.json([]);
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
