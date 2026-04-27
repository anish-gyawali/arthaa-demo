import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  amount: number;
  interval: string;
  provider: string | null;
}

export default function Subscriptions() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", name: "", provider: "esewa" });

  useEffect(() => {
    fetch("http://localhost:4000/api/plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubscribe(plan: Plan) {
    if (!form.email) {
      setError("Please enter customer email");
      return;
    }
    setSubscribing(plan.id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:4000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan.id,
          customer_email: form.email,
          customer_name: form.name || undefined,
          provider: form.provider,
          success_url: "http://localhost:5173/success",
          failure_url: "http://localhost:5173/failed",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to subscribe");
        return;
      }
      setSuccess(
        `✓ ${form.email} subscribed to ${plan.name}! Arthaa will send a webhook when billing is due.`,
      );
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0F0F1A",
          marginBottom: 4,
        }}
      >
        Subscription Billing
      </h1>
      <p style={{ fontSize: 14, color: "#8888A0", marginBottom: 28 }}>
        Subscribe a customer to a recurring plan. Arthaa tracks billing cycles
        and notifies you when payment is due.
      </p>

      {/* Customer info */}
      <div
        style={{
          background: "white",
          border: "1px solid #EEEEF3",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0F0F1A",
            marginBottom: 14,
          }}
        >
          Customer details
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 4 }}>
              Email *
            </div>
            <input
              type="email"
              placeholder="customer@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #EEEEF3",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 4 }}>
              Name
            </div>
            <input
              placeholder="Ram Bahadur"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #EEEEF3",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 4 }}>
              Provider
            </div>
            <select
              value={form.provider}
              onChange={(e) =>
                setForm((f) => ({ ...f, provider: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #EEEEF3",
                fontSize: 13,
                background: "white",
                outline: "none",
              }}
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 13,
            color: "#E02424",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 13,
            color: "#166534",
            marginBottom: 16,
          }}
        >
          {success}
        </div>
      )}

      {/* Plans */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8888A0" }}>
          Loading plans...
        </div>
      ) : plans.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "#8888A0",
            fontSize: 14,
          }}
        >
          No plans found. Create a plan in your{" "}
          <a
            href="https://arthaa.dev/subscriptions"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#635BFF" }}
          >
            Arthaa dashboard
          </a>
          .
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "white",
                border: "1px solid #EEEEF3",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F0F1A",
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0F0F1A",
                  marginBottom: 2,
                }}
              >
                NPR {Number(plan.amount).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 16 }}>
                per {plan.interval}{" "}
                {plan.provider ? `· ${plan.provider} only` : ""}
              </div>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={!!subscribing}
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: 8,
                  border: "none",
                  background: "#635BFF",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  opacity: subscribing === plan.id ? 0.7 : 1,
                }}
              >
                {subscribing === plan.id
                  ? "Subscribing..."
                  : "Subscribe Customer"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div
        style={{
          marginTop: 24,
          background: "#F0EFFF",
          border: "1px solid #C7D2FE",
          borderRadius: 8,
          padding: "14px 16px",
          fontSize: 13,
          color: "#4338CA",
        }}
      >
        <strong>How subscription billing works:</strong> Arthaa tracks billing
        cycles and fires a{" "}
        <code
          style={{ background: "#E0E7FF", padding: "1px 5px", borderRadius: 3 }}
        >
          subscription.payment_due
        </code>{" "}
        webhook when payment is due. Your server receives the event with a{" "}
        <code
          style={{ background: "#E0E7FF", padding: "1px 5px", borderRadius: 3 }}
        >
          payment_url
        </code>{" "}
        — send it to your customer to collect payment.
      </div>
    </main>
  );
}
