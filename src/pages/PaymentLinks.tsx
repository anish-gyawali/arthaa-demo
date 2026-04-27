import { useEffect, useState } from "react";

interface PaymentLink {
  id: string;
  slug: string;
  title: string;
  amount: number | null;
  provider: string | null;
  is_active: boolean;
  use_count: number;
}

export default function PaymentLinks() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", amount: "", provider: "" });

  async function load() {
    try {
      const res = await fetch("http://localhost:4000/api/payment-links");
      const data = await res.json();
      setLinks(data.payment_links ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await fetch("http://localhost:4000/api/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          amount: form.amount ? Number(form.amount) : undefined,
          provider: form.provider || undefined,
        }),
      });
      setForm({ title: "", amount: "", provider: "" });
      await load();
    } finally {
      setCreating(false);
    }
  }

  function getLinkUrl(slug: string) {
    return `https://api.arthaa.dev/l/${slug}`;
  }

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(getLinkUrl(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
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
        Payment Links
      </h1>
      <p style={{ fontSize: 14, color: "#8888A0", marginBottom: 28 }}>
        Create shareable payment links — no code required on the customer side.
      </p>

      {/* Create form */}
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
          Create a link
        </div>
        <form
          onSubmit={handleCreate}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: "1 1 180px" }}>
            <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 4 }}>
              Title *
            </div>
            <input
              required
              placeholder="Invoice #001"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
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
          <div style={{ flex: "1 1 120px" }}>
            <div style={{ fontSize: 12, color: "#8888A0", marginBottom: 4 }}>
              Amount (NPR)
            </div>
            <input
              type="number"
              placeholder="Leave blank"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
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
              <option value="">Any</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "none",
              background: "#635BFF",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      {/* Links list */}
      <div
        style={{
          background: "white",
          border: "1px solid #EEEEF3",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #EEEEF3",
            fontSize: 13,
            fontWeight: 600,
            color: "#0F0F1A",
          }}
        >
          Your Links
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#8888A0" }}>
            Loading...
          </div>
        ) : links.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#8888A0",
              fontSize: 14,
            }}
          >
            No links yet — create one above
          </div>
        ) : (
          links.map((link, i) => (
            <div
              key={link.id}
              style={{
                padding: "14px 20px",
                borderBottom:
                  i < links.length - 1 ? "1px solid #F6F6F9" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0F0F1A",
                    marginBottom: 4,
                  }}
                >
                  {link.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#8888A0",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  {link.amount && (
                    <span>NPR {Number(link.amount).toLocaleString()}</span>
                  )}
                  {link.provider && (
                    <span style={{ textTransform: "capitalize" }}>
                      {link.provider} only
                    </span>
                  )}
                  <span>{link.use_count} uses</span>
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "#635BFF",
                    background: "#F0EFFF",
                    padding: "3px 8px",
                    borderRadius: 4,
                    display: "inline-block",
                  }}
                >
                  {getLinkUrl(link.slug)}
                </div>
              </div>
              <button
                onClick={() => handleCopy(link.slug)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #EEEEF3",
                  background: "white",
                  color: copied === link.slug ? "#0E9F6E" : "#635BFF",
                  cursor: "pointer",
                }}
              >
                {copied === link.slug ? "✓ Copied" : "Copy link"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div
        style={{
          marginTop: 20,
          background: "#F0EFFF",
          border: "1px solid #C7D2FE",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 13,
          color: "#4338CA",
        }}
      >
        <strong>How it works:</strong> Share the link via WhatsApp, email, or
        anywhere. Customer opens it → pays with eSewa or Khalti → you get a
        webhook notification. No integration needed on the customer side.
      </div>
    </main>
  );
}
