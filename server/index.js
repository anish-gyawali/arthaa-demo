require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const crypto  = require('crypto');
const app     = express();

const ARTHAA_API_URL = process.env.ARTHAA_API_URL ?? 'https://api.arthaa.dev';
const ARTHAA_API_KEY = process.env.ARTHAA_API_KEY ?? '';
const JWT_TOKEN      = process.env.ARTHAA_JWT_TOKEN ?? '';

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const orders  = {};
const events  = [];

// ── Checkout ────────────────────────────────────────────────────────────
app.post('/api/checkout', async (req, res) => {
  const { productId, productName, amount, provider } = req.body;
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/payments/create`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${ARTHAA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        provider,
        order_id:    `order_${Date.now()}`,
        success_url: 'http://localhost:5173/success',
        failure_url: 'http://localhost:5173/failed',
        metadata:    { productId, productName },
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.error?.message ?? 'Payment failed' });
    orders[data.id] = { id: data.id, productName, amount, status: 'pending' };
    res.json({ checkout_url: data.checkout_url, transaction_id: data.id });
  } catch (err) {
    res.status(500).json({ error: 'Could not connect to Arthaa API' });
  }
});

// ── Order status ────────────────────────────────────────────────────────
app.get('/api/order/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// ── Webhook ─────────────────────────────────────────────────────────────
app.post('/api/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.headers['artha-signature'] ?? '';
    const secret    = process.env.ARTHAA_WEBHOOK_SECRET ?? '';

    try {
      if (signature && secret) {
        const parts    = Object.fromEntries(signature.split(',').map(p => p.split('=')));
        const expected = crypto.createHmac('sha256', secret)
          .update(`${parts.t}.${req.body}`).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(parts.v1 ?? ''), Buffer.from(expected))) {
          return res.status(400).json({ error: 'Invalid signature' });
        }
      }
    } catch (e) { console.error('Signature error:', e.message); }

    const event = JSON.parse(req.body);
    console.log('\n📦 Webhook received:', event.type);

    // Store event for dashboard display
    events.unshift({
      id:         `evt_${Date.now()}`,
      type:       event.type,
      data:       event.data,
      received_at: new Date().toISOString(),
    });
    if (events.length > 20) events.pop();

    // Fulfil order on payment.completed
    if (event.type === 'payment.completed') {
      const txnId = event.data?.id;
      if (orders[txnId]) {
        orders[txnId].status = 'completed';
        console.log('✅ Order fulfilled:', orders[txnId].productName);
      }
    }

    res.json({ received: true });
  }
);

// ── Webhook events log ──────────────────────────────────────────────────
app.get('/api/events', (_req, res) => {
  res.json({ events });
});

// ── Payment links ───────────────────────────────────────────────────────
app.post('/api/payment-links', async (req, res) => {
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/payment-links`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${JWT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.error?.message ?? 'Failed' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not connect to Arthaa API' });
  }
});

app.get('/api/payment-links', async (_req, res) => {
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/payment-links`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not connect to Arthaa API' });
  }
});

// ── Provider status ─────────────────────────────────────────────────────
app.get('/api/status', async (_req, res) => {
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/status`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch status' });
  }
});

// ── Plans ───────────────────────────────────────────────────────────────
app.get('/api/plans', async (_req, res) => {
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/plans`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not connect to Arthaa API' });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const response = await fetch(`${ARTHAA_API_URL}/v1/subscriptions`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${ARTHAA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.error?.message ?? 'Failed' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not connect to Arthaa API' });
  }
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log(`Using Arthaa API: ${ARTHAA_API_URL}`);
  console.log('Waiting for payments...\n');
});
