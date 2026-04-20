# Arthaa Demo Store

A working example showing how to integrate [Arthaa](https://arthaa.dev) payments into a React + Node.js app.

> Built with React, Vite, TypeScript, and Express.  
> Payments powered by [Arthaa](https://arthaa.dev) — accepts eSewa and Khalti.

---

## Prerequisites

- Node.js 18+
- An Arthaa account — [arthaa.dev](https://arthaa.dev)
- ngrok — [ngrok.com](https://ngrok.com) (for webhook testing)

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/yourusername/arthaa-demo
cd arthaa-demo
```

### 2. Get your Arthaa API key

1. Sign up at [arthaa.dev](https://arthaa.dev)
2. Go to **Settings** → add eSewa and Khalti sandbox credentials
3. Go to **API Keys** → create a sandbox key
4. Go to **Webhooks** → add your ngrok URL (see Step 4)

### 3. Environment variables

**Root `.env`:**
```env
VITE_API_URL=http://localhost:3000
```

**`server/.env`:**
```env
ARTHAA_API_KEY=arthaa_sandbox_sk_your_key_here
ARTHAA_API_URL=https://api.arthaa.dev
ARTHAA_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Set up webhooks with ngrok

```bash
ngrok http 4000
```

Copy the URL (e.g. `https://abc123.ngrok-free.app`) and register it in your Arthaa dashboard:
https://abc123.ngrok-free.app/api/webhook

Copy the webhook secret shown and paste it in `server/.env`.

### 5. Install and run

```bash
# Install frontend
npm install

# Install server
cd server && npm install && cd ..
```

**Terminal 1 — server:**
```bash
cd server && node index.js
```

**Terminal 2 — frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Test Credentials

**eSewa:**
| Field    | Value        |
|----------|-------------|
| eSewa ID | `9806800001` |
| Password | `Nepal@123`  |
| MPIN     | `1122`       |
| Token    | `123456`     |

**Khalti:**
| Field   | Value        |
|---------|-------------|
| Test ID | `9800000001` |
| MPIN    | `1111`       |
| OTP     | `987654`     |

---

## Project Structure
arthaa-demo/
├── src/
│   ├── pages/
│   │   ├── Store.tsx      # Products + checkout button
│   │   ├── Success.tsx    # Success page
│   │   └── Failed.tsx     # Failure page
│   └── App.tsx            # Routes
├── server/
│   ├── index.js           # API calls + webhook handler
│   └── .env.example
└── README.md

---

## How the Integration Works

### 1. Create a payment (server-side)

```javascript
const response = await fetch('https://api.arthaa.dev/v1/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ARTHAA_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount:      500,
    provider:    'esewa',
    order_id:    'order_001',
    success_url: 'http://localhost:5173/success',
    failure_url: 'http://localhost:5173/failed',
  }),
});

const { checkout_url } = await response.json();
// Redirect customer to checkout_url
```

### 2. Redirect customer

```typescript
window.location.assign(data.checkout_url);
```

### 3. Handle success redirect

After payment Arthaa redirects to your `success_url` with `?transaction_id=xxx`:

```typescript
const [params] = useSearchParams();
const txnId    = params.get('transaction_id');
```

### 4. Receive webhook events

```javascript
app.post('/api/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const event = JSON.parse(req.body);

    if (event.type === 'payment.completed') {
      console.log('Payment confirmed:', event.data.id);
      // Fulfil order here
    }

    res.json({ received: true });
  }
);
```

### 5. Verify webhook signature

Always verify the `Artha-Signature` header before processing:

```javascript
const parts    = Object.fromEntries(
  signature.split(',').map(p => p.split('='))
);
const expected = crypto
  .createHmac('sha256', process.env.ARTHAA_WEBHOOK_SECRET)
  .update(`${parts.t}.${req.body}`)
  .digest('hex');

const valid = crypto.timingSafeEqual(
  Buffer.from(parts.v1),
  Buffer.from(expected)
);
```

---

## Troubleshooting

**"Invalid API key format"**  
Your key must start with `arthaa_sandbox_sk_`. Create a new key from the Arthaa dashboard.

**"Could not connect to server"**  
Make sure `cd server && node index.js` is running on port 4000.

**Webhook not received**  
ngrok URL changes on every restart. Update the endpoint in your Arthaa dashboard after restarting ngrok.

**Payment page "Not Found"**  
Checkout tokens expire after 30 minutes. Create a fresh payment.

## Learn More

- [Arthaa Documentation](https://docs.arthaa.dev)
- [API Reference](https://docs.arthaa.dev/api-reference/overview)
- [Webhooks Guide](https://docs.arthaa.dev/webhooks)
- [Node.js Integration Guide](https://docs.arthaa.dev/guides/nodejs)