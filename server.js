// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Middleware to parse JSON from frontend
app.use(express.json());

// ✅ Serve static files from "public" folder
app.use(express.static("public"));

// ✅ API endpoint to create a Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    // Get amount from frontend (in dollars)
    let { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      amount = 5; // default fallback
    }

    // Convert dollars to cents (Stripe uses cents)
    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Donation",
        },
        unit_amount: amountInCents,
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: "http://localhost:3000/success.html?amount=" + amount,
  cancel_url: "http://localhost:3000/cancel.html",
});


    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Something went wrong creating checkout session" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
