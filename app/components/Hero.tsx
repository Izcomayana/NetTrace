"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    type Node = { x: number; y: number; vx: number; vy: number; r: number; label: string; pulse: number; conflict?: boolean };

    const mkNodes = (): Node[] => {
      const W = canvas.width, H = canvas.height;
      return [
        { x: W * .5, y: H * .45, vx: 0, vy: 0, r: 7, label: "192.168.1.1", pulse: 0 },
        { x: W * .25, y: H * .3, vx: .2, vy: .1, r: 5, label: "192.168.1.12", pulse: Math.PI * .3 },
        { x: W * .72, y: H * .28, vx: -.15, vy: .2, r: 5, label: "192.168.1.34", pulse: Math.PI * .7 },
        { x: W * .2, y: H * .65, vx: .1, vy: -.15, r: 4, label: "192.168.1.55", pulse: Math.PI },
        { x: W * .78, y: H * .62, vx: -.2, vy: -.1, r: 5, label: "192.168.1.78", pulse: Math.PI * 1.3 },
        { x: W * .45, y: H * .72, vx: .15, vy: .05, r: 4, label: "192.168.1.105", pulse: Math.PI * .5, conflict: true },
        { x: W * .55, y: H * .72, vx: -.1, vy: .1, r: 4, label: "192.168.1.105", pulse: Math.PI * 1.5, conflict: true },
        { x: W * .88, y: H * .45, vx: -.05, vy: .2, r: 3, label: "192.168.1.90", pulse: Math.PI * .2 },
        { x: W * .12, y: H * .45, vx: .05, vy: -.2, r: 3, label: "192.168.1.22", pulse: Math.PI * 1.8 },
      ];
    };

    let nodes = mkNodes();
    let frame = 0, raf: number;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      frame++;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 220) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            const bothConflict = a.conflict && b.conflict;
            const oneConflict = (a.conflict || b.conflict) && !bothConflict;
            if (bothConflict) { ctx.strokeStyle = `rgba(255,77,106,${.6 - dist / 400})`; ctx.setLineDash([4, 6]); }
            else if (oneConflict) { ctx.strokeStyle = `rgba(255,181,71,${.4 - dist / 600})`; ctx.setLineDash([3, 8]); }
            else { ctx.strokeStyle = `rgba(0,229,255,${.18 - dist / 1600})`; ctx.setLineDash([]); }
            ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
          }
        }
      }

      nodes.forEach(n => {
        n.pulse += .035;
        const ring = Math.sin(n.pulse) * .5 + .5;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 6 + ring * 12, 0, Math.PI * 2);
        ctx.strokeStyle = n.conflict ? `rgba(255,77,106,${.5 - ring * .5})` : `rgba(0,229,255,${(.5 - ring * .5) * .6})`;
        ctx.lineWidth = 1; ctx.stroke();

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.conflict) { ctx.fillStyle = "#ff4d6a"; ctx.shadowBlur = 12; ctx.shadowColor = "#ff4d6a"; }
        else if (n.label === "192.168.1.1") { ctx.fillStyle = "#00e5ff"; ctx.shadowBlur = 16; ctx.shadowColor = "#00e5ff"; }
        else { ctx.fillStyle = "rgba(0,229,255,.7)"; ctx.shadowBlur = 8; ctx.shadowColor = "rgba(0,229,255,.5)"; }
        ctx.fill(); ctx.shadowBlur = 0;

        ctx.font = "9px 'Space Mono',monospace";
        ctx.fillStyle = n.conflict ? "rgba(255,77,106,.8)" : "rgba(0,229,255,.5)";
        ctx.fillText(n.label, n.x + n.r + 5, n.y + 3);

        n.x += n.vx; n.y += n.vy;
        if (n.x < 20 || n.x > W - 20) n.vx *= -1;
        if (n.y < 20 || n.y > H - 20) n.vy *= -1;
      });

      const scanY = ((frame * 1.2) % (H + 40)) - 20;
      const g = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      g.addColorStop(0, "transparent"); g.addColorStop(.5, "rgba(0,229,255,.04)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, scanY - 20, W, 40);

      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => { resize(); nodes = mkNodes(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

export default function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: .4 }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle,rgba(0,229,255,.06) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ width: "100%", paddingTop: 88, paddingBottom: 60 }}>
        {/* ── Two-column on desktop, stacked on mobile ── */}
        <div className="hero-grid">
          {/* Copy */}
          <div>
            <div className="tag tag-cyan animate-fade-up opacity-0" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)", display: "inline-block" }} />
              Network Intelligence Platform
            </div>

            <h1 className="animate-fade-up opacity-0 delay-100 "
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,6vw,62px)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
              <span className="gradient-text">See every device</span><br />
              <span style={{ color: "var(--text-primary)" }}>on your network.</span><br />
              <span style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.75em" }}>Instantly.</span>
            </h1>

            <p className="animate-fade-up opacity-0 delay-200"
              style={{ fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 440 }}>
              NetTrace auto-discovers every device on your LAN, captures MAC addresses, hostnames, and vendor data — and alerts you the moment an IP conflict is detected.
            </p>

            <div className="animate-fade-up opacity-0 delay-300 hero-btns">
              <Link href="/login"><button className="btn-glow">Start scanning →</button></Link>
              <a href="#how-it-works"><button className="btn-outline">See how it works</button></a>
            </div>

            <div className="animate-fade-up opacity-0 delay-400 hero-stats">
              {[{ val: "< 2s", label: "Scan time" }, { val: "99.9%", label: "Conflict accuracy" }, { val: "LAN-only", label: "No cloud needed" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--cyan)" }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas viz */}
          <div className="animate-fade-in opacity-0 delay-500 hero-canvas-wrap"
            style={{ border: "1px solid var(--border)", background: "var(--surface)", position: "relative", overflow: "hidden" }}>
            <div style={{ height: 36, background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 14px", gap: 10, flexShrink: 0 }}>
              {["#ff5f57", "#ffbd2e", "#28c940"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>nettrace — live scan — 192.168.1.0/24</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 6px var(--success)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--success)" }}>SCANNING</span>
              </div>
            </div>
            <div style={{ position: "absolute", top: 52, right: 12, zIndex: 10, background: "rgba(255,77,106,.1)", border: "1px solid rgba(255,77,106,.4)", padding: "5px 10px", fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--danger)", animation: "blink 1s step-end infinite" }} />
              2 IP CONFLICTS DETECTED
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <NetworkCanvas />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
          align-items: center;
        }
        .hero-canvas-wrap {
          display: flex;
          flex-direction: column;
          height: 320px;
        }
        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
        }
        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
        }
        @media (min-width: 900px) {
          .hero-grid {
            gap: 45px;
          }
          .hero-canvas-wrap {
            height: 480px;
          }
        }
          @media (min-width: 1200px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
