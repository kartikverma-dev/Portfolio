import { ImageResponse } from "next/og";

export const alt = "Kartik Verma — AI, Cybersecurity & Creative Development";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B1220",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#E8EEF7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#2F6BFF",
            }}
          >
            KV
          </div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#FF7A59",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#457DFF",
              fontWeight: 600,
            }}
          >
            PORTFOLIO & FIELD DOSSIER
          </div>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            KARTIK VERMA
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              maxWidth: "900px",
              lineHeight: 1.3,
            }}
          >
            Building at the intersection of AI, security, and creative technology.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(232, 238, 247, 0.15)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#94A3B8",
          }}
        >
          <div>BCA Student @ IMS Ghaziabad • Class of 2028</div>
          <div>Ghaziabad, Uttar Pradesh, India</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
