import express from "express";
import Stripe from "stripe";
import path from "path";

const app = express();
const stripe = new Stripe("sk_test_51SAK8NRrdacqNw9CrhpSQFOhGQc0g8zMDAA4LVlCgNzPD1J95HfCGlb2frX47pkhGingw5xemVkcN3e7wdwfnPwD00p2jf37d8"); // replace with real key

app.use(express.json());
app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Day for Good Donation",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://dayforgood.org/success.html",
      cancel_url: "https://dayforgood.org/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
