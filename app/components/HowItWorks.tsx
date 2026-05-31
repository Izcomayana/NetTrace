"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  { num: "01", title: "Network Scan Initiated", desc: "Admin triggers a scan from the dashboard. NetTrace sends ARP requests across the configured subnet range — no agent installation required on target devices.", code: `> nettrace scan --subnet 192.168.1.0/24\n  Sending ARP requests...\n  Sweep complete: 254 hosts\n  Responded: 24 devices` },
  { num: "02", title: "Device Data Captured", desc: "For each responding device, NetTrace records the IP address, MAC address, response time, and resolves the hostname via reverse DNS and mDNS where available.", code: `IP: 192.168.1.34\n  MAC: A4:C3:F0:12:8E:91\n  HOST: macbook-marketing\n  VENDOR: Apple Inc.\n  STATUS: online` },
  { num: "03", title: "Conflict Analysis", desc: "The scan results are cross-checked for duplicate IP assignments. If two devices share an IP, both are flagged immediately with a conflict badge and admin alert.", code: `⚠ CONFLICT DETECTED\n  IP: 192.168.1.105\n  Device A: AA:BB:CC:11:22:33\n  Device B: FF:EE:DD:44:55:66\n  Action required.` },
  { num: "04", title: "Dashboard Updated", desc: "The live dashboard refreshes with the latest inventory. Conflicts surface at the top as urgent alerts. Admins can drill into any device or export the full report.", code: `Dashboard refreshed.\n  24 devices total\n  21 online / 3 offline\n  ⚠ 2 IP conflicts\n  Report: nettrace_2024.csv` },
];

function Step({ s, i }: { s: typeof steps[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className={`step-row ${i % 2 === 1 ? "step-row--reverse" : ""}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `all .7s ease ${i * .1}s`, marginBottom: 64 }}>

      {/* Text */}
      <div className="step-text">
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(52px,8vw,72px)", color: "transparent", WebkitTextStroke: "1px var(--border-bright)", lineHeight: 1, marginBottom: 14, letterSpacing: "-0.04em" }}>
          {s.num}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2.5vw,24px)", color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>{s.title}</h3>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8, color: "var(--text-secondary)" }}>{s.desc}</p>
      </div>

      {/* Code block */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ height: 32, background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <div style={{ width: 8, height: 8, background: "var(--cyan)", opacity: .5 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>step_{s.num}.log</span>
        </div>
        <pre style={{ padding: "18px 20px", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9, color: "var(--cyan)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {s.code}
        </pre>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "80px 0", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="tag tag-cyan" style={{ display: "inline-flex", marginBottom: 18 }}>How it works</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            From scan to insight in seconds
          </h2>
        </div>
        {steps.map((s, i) => <Step key={s.num} s={s} i={i} />)}
      </div>

      <style>{`
        .step-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: center;
        }
        .step-text { order: 1; }
        .step-row > div:last-child { order: 2; }

        @media (min-width: 768px) {
          .step-row {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
          .step-row--reverse .step-text      { order: 2; }
          .step-row--reverse > div:last-child { order: 1; }
        }
      `}</style>
    </section>
  );
}
