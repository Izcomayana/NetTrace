"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 40;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 30);
      }
    }, { threshold: .5 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export function StatsBar() {
  const stats = [
    { label: "Devices per scan", value: 254, suffix: "+" },
    { label: "Avg scan time (ms)", value: 1800, suffix: "" },
    { label: "Conflict accuracy", value: 99, suffix: "%" },
    { label: "Device types", value: 50, suffix: "+" },
  ];

  return (
    <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-cell" style={{ borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "var(--cyan)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .stat-cell {
          padding: 28px 16px;
          text-align: center;
        }
        .stats-grid > .stat-cell:nth-child(2) { border-right: none !important; }
        .stats-grid > .stat-cell:nth-child(3) { border-top: 1px solid var(--border); }
        .stats-grid > .stat-cell:nth-child(4) { border-top: 1px solid var(--border); border-right: none !important; }

        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4,1fr); }
          .stat-cell { padding: 36px 20px; }
          .stats-grid > .stat-cell:nth-child(2) { border-right: 1px solid var(--border) !important; }
          .stats-grid > .stat-cell:nth-child(3) { border-top: none; }
          .stats-grid > .stat-cell:nth-child(4) { border-top: none; }
        }
      `}</style>
    </div>
  );
}

export function CTA() {
  return (
    <section id="get-started" style={{ padding: "80px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: "radial-gradient(ellipse,rgba(0,229,255,.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ textAlign: "center", position: "relative" }}>
        <div className="tag tag-cyan" style={{ display: "inline-flex", marginBottom: 22 }}>Ready to start?</div>

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 18, lineHeight: 1.1 }}>
          Your network shouldn't be a<br />
          <span className="gradient-text">mystery.</span>
        </h2>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
          Start scanning your LAN in under 60 seconds. No agents. No cloud. Just clarity.
        </p>

        <div className="cta-btns">
          <Link href="/login"><button className="btn-glow" style={{ padding: "13px 32px", fontSize: 14 }}>Launch NetTrace →</button></Link>
          <a href="#how-it-works"><button className="btn-outline" style={{ padding: "13px 32px", fontSize: 14 }}>Read the docs</button></a>
        </div>

        <div style={{ marginTop: 48, background: "var(--surface)", border: "1px solid var(--border)", padding: "14px 20px", display: "inline-block", maxWidth: "100%", textAlign: "left", overflowX: "auto" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>$ </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cyan)", wordBreak: "break-all" }}>nettrace scan --subnet 192.168.1.0/24</span><br />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>✓ 24 devices found. 2 conflicts detected.</span>
          <span className="animate-blink" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cyan)", marginLeft: 2 }}>_</span>
        </div>
      </div>

      <style>{`
        .cta-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 0;
        }
      `}</style>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="container">
        <div className="footer-inner">
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, border: "1px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 6, height: 6, background: "var(--cyan)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
              Net<span style={{ color: "var(--cyan)" }}>Trace</span>
            </span>
          </div>

          {/* Tagline — hidden on very small screens */}
          <div className="footer-tagline" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
            Final Year Project · Network Device Auto-Inventory System
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {["Features", "How it works", "Login"].map(l => (
              <a key={l} href={l === "Login" ? "/login" : `#${l.toLowerCase().replace(/ /g, "-")}`}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 32px 0;
          text-align: center;
        }
        .footer-tagline { display: none; }

        @media (min-width: 768px) {
          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
          .footer-tagline { display: block; }
        }
      `}</style>
    </footer>
  );
}
