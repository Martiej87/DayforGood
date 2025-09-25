// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Serve static files from "public" folder
app.use(express.static("public"));

// ✅ API endpoint to create a Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    // Get amount from request body (default $5 if not provided)
    const amount = req.body.amount || 5;
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
      // 👇 Pass donation amount back into success URL
      success_url: `http://localhost:3000/success.html?amount=${amount}`,
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
