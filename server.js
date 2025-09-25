// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Serve static files (index.html, style.css, success.html, cancel.html)
app.use(express.static("public"));

// ✅ Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
            },
            unit_amount: 500, // $5 donation
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // 👇 IMPORTANT: Replace with your actual Render domain
      success_url: "https://your-render-app.onrender.com/success.html",
      cancel_url: "https://your-render-app.onrender.com/cancel.html",
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
  console.log(`Server running on port ${PORT}`);
});
