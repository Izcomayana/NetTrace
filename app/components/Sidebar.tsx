"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: "▦", label: "Dashboard", href: "/dashboard" },
  // { icon: "◈", label: "Devices", href: "/dashboard/devices" },
  { icon: "◉", label: "Conflicts", href: "/dashboard/conflicts" },
  { icon: "◎", label: "Settings", href: "/dashboard/settings" },
];

function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: 28, height: 28,
        border: "1px solid var(--cyan)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{ width: 6, height: 6, background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
        <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(0,229,255,0.3)" }} />
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        Net<span style={{ color: "var(--cyan)" }}>Trace</span>
      </span>
    </Link>
  );
}

export default function Sidebar({
  conflictCount = 0,
}: {
  conflictCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarInner = () => (
    <aside style={{
      width: 220,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px", borderBottom: "1px solid var(--border)" }}>
        <Logo />
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 10px", flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", marginBottom: 2,
                background: active ? "rgba(0,229,255,0.08)" : "transparent",
                borderLeft: active ? "2px solid var(--cyan)" : "2px solid transparent",
                transition: "all 0.2s", cursor: "pointer",
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 14, color: active ? "var(--cyan)" : "var(--text-muted)" }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.04em", color: active ? "var(--cyan)" : "var(--text-secondary)" }}>
                  {item.label}
                </span>
                {item.label === "Conflicts" && conflictCount > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--danger)", color: "#fff", fontSize: 9, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 99 }}>
                    {conflictCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, background: "var(--surface-2)", border: "1px solid var(--border-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--cyan)", flexShrink: 0 }}>◎</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>admin@nettrace.io</div>
          </div>
        </div>
        <Link href="/" style={{ display: "block" }}>
          <button style={{
            width: "100%", background: "transparent",
            border: "1px solid var(--border)", color: "var(--text-muted)",
            fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px",
            cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
            Sign out
          </button>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Mobile overlay ── */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />
      )}

      {/* ── Mobile drawer ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }} className="sidebar-mobile">
        <SidebarInner />
      </div>

      {/* ── Desktop sidebar (always visible) ── */}
      <div className="sidebar-desktop">
        <SidebarInner />
      </div>

      {/* ── Hamburger button (mobile only) ── */}
      <div
        className="hamburger-container"
        style={{
          position: "fixed",
          top: 14,
          left: open ? 170 : 14, // 220 sidebar + 14px gap
          zIndex: 60,
          transition: "left 0.3s ease",
        }}
      >
        <button onClick={() => setOpen(o => !o)} className="hamburger-btn"
          aria-label="Toggle sidebar"
          style={{

            background: "var(--surface)", border: "1px solid var(--border-bright)",
            padding: "8px 10px", cursor: "pointer",
            flexDirection: "column", gap: 4,
          }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: 18, height: 1.5, background: "var(--cyan)",
              transition: "all 0.3s",
              transform: open
                ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                  : i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                    : "scaleX(0)"
                : "none",
              opacity: open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      <style>{`
        .sidebar-mobile { display: block; }
        .sidebar-desktop { display: none; }
        .hamburger-container {
          display: flex;
        }

        .hamburger-btn {
          display: flex;
        }

        @media (min-width: 768px) {
          .sidebar-mobile  { display: none; }
          .sidebar-desktop {
            display: block;
            position: sticky;
            top: 0;
            height: 100vh;
            flex-shrink: 0;
            width: 220px;
          }
          .hamburger-btn { display: none; }
        }
      `}</style>
    </>
  );
}