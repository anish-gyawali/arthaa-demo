import { useEffect, useState } from "react";

interface ProviderStatus {
  provider: string;
  status: string;
  response_time: number | null;
  uptime_24h: number | null;
  last_checked_at: string | null;
}

interface StatusData {
  overall: string;
  providers: ProviderStatus[];
}

const STATUS_COLOR: Record<string, string> = {
  up: "#0E9F6E",
  degraded: "#D97706",
  down: "#E02424",
  unknown: "#8888A0",
};

const STATUS_LABEL: Record<string, string> = {
  up: "Operational",
  degraded: "Degraded",
  down: "Outage",
  unknown: "Unknown",
};

export default function Status() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("http://localhost:4000/api/status");
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0F0F1A",
          marginBottom: 4,
        }}
      >
        Provider Status
      </h1>
      <p style={{ fontSize: 14, color: "#8888A0", marginBottom: 28 }}>
        Live status of eSewa and Khalti — checked every 5 minutes by Arthaa.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8888A0" }}>
          Loading...
        </div>
      ) : !data ? (
        <div style={{ textAlign: "center", padding: 40, color: "#E02424" }}>
          Could not load status
        </div>
      ) : (
        <>
          {/* Overall banner */}
          <div
            style={{
              background: "white",
              border: `1px solid ${data.overall === "operational" ? "#BBF7D0" : "#FECACA"}`,
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  data.overall === "operational" ? "#F0FDF4" : "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {data.overall === "operational" ? "✓" : "⚠"}
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: data.overall === "operational" ? "#0E9F6E" : "#E02424",
                }}
              >
                {data.overall === "operational"
                  ? "All Systems Operational"
                  : "Service Disruption"}
              </div>
              <div style={{ fontSize: 13, color: "#8888A0", marginTop: 2 }}>
                Arthaa payment infrastructure
              </div>
            </div>
          </div>

          {/* Providers */}
          <div
            style={{
              background: "white",
              border: "1px solid #EEEEF3",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {data.providers.map((p, i) => {
              const color = STATUS_COLOR[p.status] ?? "#8888A0";
              return (
                <div
                  key={p.provider}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom:
                      i < data.providers.length - 1
                        ? "1px solid #F6F6F9"
                        : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background:
                          p.provider === "esewa" ? "#16A34A" : "#7C3AED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {p.provider === "esewa" ? "e" : "K"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0F0F1A",
                          textTransform: "capitalize",
                        }}
                      >
                        {p.provider}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#8888A0", marginTop: 2 }}
                      >
                        {p.uptime_24h !== null ? `${p.uptime_24h}% uptime` : ""}
                        {p.response_time ? ` · ${p.response_time}ms` : ""}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: `${color}15`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 12,
              color: "#B8B8C8",
            }}
          >
            Auto-refreshes every 30 seconds ·{" "}
            <a
              href="https://status.arthaa.dev"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#635BFF", textDecoration: "none" }}
            >
              View full status page →
            </a>
          </div>
        </>
      )}
    </main>
  );
}
