"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route-link click
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled || menuOpen ? "rgba(3,7,15,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "1px solid transparent",
        padding: "0 1.25rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" onClick={close} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, border: "1px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 7, height: 7, background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }} />
              <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(0,229,255,0.3)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Net<span style={{ color: "var(--cyan)" }}>Trace</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ alignItems: "center", gap: 32 }} className="desktop-nav">
            {["Features", "How it works", "Get started"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--text-secondary)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
                {item}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div style={{ alignItems: "center", gap: 10 }} className="desktop-nav">
            <Link href="/login">
              <button className="btn-glow" style={{ padding: "8px 18px", fontSize: 12 }}>Log in →</button>
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="hamburger"
            aria-label="Toggle menu"
            style={{ background: "none", border: "1px solid var(--border-bright)", padding: "8px 10px", cursor: "pointer", flexDirection: "column", gap: 5 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 1.5, background: "var(--cyan)",
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(4.5px,4.5px)"
                    : i === 2 ? "rotate(-45deg) translate(4.5px,-4.5px)"
                      : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div style={{
          maxHeight: menuOpen ? 320 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
          borderTop: menuOpen ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ padding: "1.25rem 0", display: "flex", flexDirection: "column", gap: 0 }}>
            {["Features", "How it works", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={close}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.06em", color: "var(--text-secondary)", textDecoration: "none", textTransform: "uppercase", padding: "12px 4px", borderBottom: "1px solid var(--border)" }}>
                {item}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Link href="/login" onClick={close} style={{ flex: 1 }}>
                <button className="btn-outline" style={{ width: "100%", padding: "10px", fontSize: 12 }}>Log in</button>
              </Link>
              <Link href="/login" onClick={close} style={{ flex: 1 }}>
                <button className="btn-glow" style={{ width: "100%", padding: "10px", fontSize: 12 }}>Get started →</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .desktop-nav { display: none; }
        .hamburger   { display: flex;  }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .hamburger   { display: none; }
        }
      `}</style>
    </>
  );
}
