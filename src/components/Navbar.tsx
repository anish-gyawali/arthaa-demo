import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const loc = useLocation();
  const links = [
    { to: "/", label: "Store" },
    { to: "/payment-links", label: "Payment Links" },
    { to: "/subscriptions", label: "Subscriptions" },
    { to: "/status", label: "Provider Status" },
  ];
  return (
    <header
      style={{
        background: "white",
        borderBottom: "1px solid #EEEEF3",
        padding: "0 24px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "linear-gradient(135deg, #635BFF, #DC143C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "white",
          }}
        >
          S
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0F0F1A" }}>
          NepalStore
        </span>
      </div>
      <nav style={{ display: "flex", gap: 4 }}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              background: loc.pathname === l.to ? "#F0EFFF" : "transparent",
              color: loc.pathname === l.to ? "#635BFF" : "#8888A0",
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div
        style={{
          background: "#F0EFFF",
          color: "#635BFF",
          fontSize: 11,
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: 20,
          border: "1px solid #C7D2FE",
        }}
      >
        Powered by Arthaa
      </div>
    </header>
  );
}
