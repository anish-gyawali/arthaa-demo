require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();

const ARTHAA_API_URL = process.env.ARTHAA_API_URL ?? "https://api.arthaa.dev";
const ARTHAA_API_KEY = process.env.ARTHAA_API_KEY ?? "";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const orders = {};

app.post("/api/checkout", async (req, res) => {
  const { productId, productName, amount, provider } = req.body;
console.log('API Key being used:', ARTHAA_API_KEY?.substring(0, 20) + '...');
console.log('API URL:', ARTHAA_API_URL);
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/payments/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ARTHAA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        provider,
        order_id: `order_${Date.now()}`,
        success_url: "http://localhost:5173/success",
        failure_url: "http://localhost:5173/failed",
        metadata: { productId, productName },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(400)
        .json({ error: data.error?.message ?? "Payment failed" });
    }

    orders[data.id] = {
      id: data.id,
      productName,
      amount,
      status: "pending",
      checkout_url: data.checkout_url,
    };

    res.json({ checkout_url: data.checkout_url, transaction_id: data.id });
  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: "Could not connect to Arthaa API" });
  }
});

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature =
      req.headers["arthaa-signature"] ?? req.headers["artha-signature"] ?? "";
    const secret = process.env.ARTHAA_WEBHOOK_SECRET ?? "";

    try {
      if (signature && secret) {
        const parts = Object.fromEntries(
          signature.split(",").map((p) => p.split("=")),
        );
        const expected = crypto
          .createHmac("sha256", secret)
          .update(`${parts.t}.${req.body}`)
          .digest("hex");

        if (
          !crypto.timingSafeEqual(
            Buffer.from(parts.v1 ?? ""),
            Buffer.from(expected),
          )
        ) {
          return res.status(400).json({ error: "Invalid signature" });
        }
      }
    } catch (e) {
      console.error("Signature error:", e.message);
    }

    const event = JSON.parse(req.body);
    console.log("\n Webhook received:", event.type);
    console.log("Transaction:", event.data?.id);
    console.log("Order:", event.data?.order_id);
    console.log("Amount: NPR", event.data?.amount);

    if (event.type === "payment.completed") {
      const txnId = event.data.id;
      if (orders[txnId]) {
        orders[txnId].status = "completed";
        console.log("Order fulfilled:", orders[txnId].productName);
      }
    }

    res.json({ received: true });
  },
);

app.get("/api/order/:id", (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log(`Using Arthaa API: ${ARTHAA_API_URL}`);
  console.log("Waiting for payments...\n");
});
