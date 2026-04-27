import { useSearchParams, Link } from "react-router-dom";

export default function Failed() {
  const [params] = useSearchParams();
  const txnId = params.get("transaction_id");
  const reason = params.get("reason");
  const checkoutToken = params.get("checkout_token");

  const messages: Record<string, string> = {
    user_canceled: "You cancelled the payment.",
    payment_failed: "The payment could not be completed.",
  };

  const retryUrl = checkoutToken
    ? `https://api.arthaa.dev/pay/${checkoutToken}`
    : null;

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
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 26,
            color: "#E02424",
          }}
        >
          ✕
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
          Payment Failed
        </h1>

        <p style={{ fontSize: 14, color: "#8888A0", margin: "0 0 24px" }}>
          {reason
            ? (messages[reason] ?? "Something went wrong.")
            : "Something went wrong with your payment."}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {retryUrl && (
            <a
              href={retryUrl}
              style={{
                display: "block",
                background: "#635BFF",
                color: "white",
                padding: "10px 24px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ← Try again
            </a>
          )}
          <Link
            to="/"
            style={{
              display: "block",
              background: "white",
              color: "#635BFF",
              padding: "10px 24px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              border: "1px solid #635BFF",
            }}
          >
            Back to Store
          </Link>
        </div>

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
