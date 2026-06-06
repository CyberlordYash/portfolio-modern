import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yash Sachan - Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          gap: "60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>
            Yash Sachan
          </div>
          <div style={{ fontSize: 24, color: "#a78bfa", fontWeight: 500 }}>
            Software Engineer · Backend & Systems
          </div>
          <div style={{ fontSize: 20, color: "#9ca3af", lineHeight: 1.6 }}>
            Building high-performance backend systems, low-latency HFT infrastructure,
            and scalable distributed services with Golang and Java at Zanskar Research.
          </div>
          <div style={{ fontSize: 16, color: "#6d28d9", marginTop: "8px" }}>
            yashsachan.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
