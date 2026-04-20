import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  productName: string;
  amount: number;
  status: string;
}

export default function Success() {
  const [params] = useSearchParams();
  const txnId = params.get("transaction_id");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (txnId) {
      fetch(`http://localhost:4000/api/order/${txnId}`)
        .then((r) => r.json())
        .then(setOrder)
        .catch(() => {});
    }
  }, [txnId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F6F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #EEEEF3",
          borderRadius: 12,
          padding: 40,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(15,15,26,0.06)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#0F0F1A",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          Payment Successful!
        </h1>

        {order && (
          <div
            style={{
              background: "#F6F6F9",
              borderRadius: 8,
              padding: "12px 16px",
              margin: "16px 0",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 13, color: "#8888A0", marginBottom: 4 }}>
              Order details
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0F0F1A" }}>
              {order.productName}
            </div>
            <div style={{ fontSize: 14, color: "#635BFF", fontWeight: 600 }}>
              NPR {order.amount?.toLocaleString()}
            </div>
          </div>
        )}

        <p style={{ fontSize: 14, color: "#8888A0", margin: "0 0 24px" }}>
          Your payment has been confirmed. Check the server terminal to see the
          webhook event that triggered order fulfilment.
        </p>

        {txnId && (
          <div
            style={{
              background: "#F6F6F9",
              borderRadius: 6,
              padding: "8px 12px",
              marginBottom: 24,
              fontFamily: "monospace",
              fontSize: 11,
              color: "#8888A0",
              wordBreak: "break-all",
              textAlign: "left",
            }}
          >
            txn: {txnId}
          </div>
        )}

        <Link
          to="/"
          style={{
            display: "inline-block",
            background: "#635BFF",
            color: "white",
            padding: "10px 24px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Back to Store
        </Link>

        <div style={{ marginTop: 20, fontSize: 12, color: "#B8B8C8" }}>
          Powered by{" "}
          <a
            href="https://arthaa.dev"
            style={{ color: "#635BFF", textDecoration: "none" }}
          >
            Arthaa
          </a>
        </div>
      </div>
    </div>
  );
}
