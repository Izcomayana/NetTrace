"use client";
import { useEffect, useRef, useState } from "react";

const features = [
  { icon: "◈", title: "Auto Device Discovery", desc: "NetTrace scans your entire LAN subnet in seconds. Every connected device — router, PC, printer, IoT — is automatically catalogued.", detail: ["ARP-based scanning", "ICMP ping sweep", "mDNS hostname resolution"], accent: "var(--cyan)" },
  { icon: "⬡", title: "MAC & Vendor Capture", desc: "Beyond IP addresses — capture full hardware identity. MAC addresses are cross-referenced against a global OUI database to identify the manufacturer.", detail: ["Full MAC address logging", "OUI vendor lookup", "Device type classification"], accent: "var(--success)" },
  { icon: "◉", title: "IP Conflict Detection", desc: "Two devices claiming the same IP causes silent network chaos. NetTrace detects conflicts the moment they happen and flags the offending devices.", detail: ["Real-time conflict alerts", "Conflicting device pair display", "Timestamped history"], accent: "var(--danger)" },
  { icon: "▦", title: "Admin Dashboard", desc: "Everything in one view. Filter by status, vendor, or conflict state. Export reports. Set alert thresholds. Manage your network with clarity.", detail: ["Live device table", "Conflict alert center", "CSV/JSON export"], accent: "var(--warning)" },
];

function FeatureCard({ f, index }: { f: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className="card-net" style={{
      padding: "28px 24px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `all .6s ease ${index * .12}s`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `linear-gradient(225deg,${f.accent}18 0%,transparent 60%)` }} />
      <div style={{ fontSize: 26, marginBottom: 14, color: f.accent, lineHeight: 1 }}>{f.icon}</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 18 }}>{f.desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {f.detail.map(d => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 4, background: f.accent, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" style={{ padding: "80px 0", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag tag-cyan" style={{ display: "inline-flex", marginBottom: 18 }}>Features</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 14 }}>
            Everything your network needs
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
            Built specifically for network admins who need fast, accurate visibility — without complex setup or cloud dependency.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => <FeatureCard key={f.title} f={f} index={i} />)}
        </div>
      </div>

      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
