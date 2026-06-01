"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";

// Conflict count would come from real state/context in production.
// For now we pass the mock number directly.
const CONFLICT_COUNT = 2;

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Overview of your network" },
  "/dashboard/devices": { title: "Devices", sub: "All discovered devices" },
  "/dashboard/conflicts": { title: "Conflicts", sub: "IP conflicts requiring attention" },
  "/dashboard/settings": { title: "Settings", sub: "Subnet and scan configuration" },
};

function TopBar({ scanPulse, onScan }: { scanPulse: boolean; onScan: () => void }) {
  const pathname = usePathname();

  // For device detail pages like /dashboard/devices/3
  const isDetail = pathname.startsWith("/dashboard/devices/");
  const meta = isDetail
    ? { title: "Device Detail", sub: "Full device information" }
    : PAGE_TITLES[pathname] ?? { title: "NetTrace", sub: "" };

  return (
    <header style={{
      height: 60, borderBottom: "1px solid var(--border)",
      background: "rgba(8,15,30,0.92)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem 0 1rem",
      position: "sticky", top: 0, zIndex: 30,
    }}>
      {/* Title — left-padded on mobile to clear the hamburger */}
      <div style={{ paddingLeft: "clamp(48px, 5vw, 0px)" }} className="topbar-title">
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {meta.title}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
          {meta.sub}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {CONFLICT_COUNT > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.35)" }} className="conflict-pill">
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--danger)", animation: "blink 1s step-end infinite" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--danger)", letterSpacing: "0.06em" }}>
              {CONFLICT_COUNT} CONFLICTS
            </span>
          </div>
        )}
        {/* <button onClick={onScan} className="btn-glow"
          style={{ padding: "8px 16px", fontSize: 11, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{
            display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#000",
            boxShadow: scanPulse ? "0 0 0 6px rgba(0,0,0,0.3)" : "none", transition: "box-shadow 0.3s",
          }} />
          {scanPulse ? "Scanning..." : "Scan now"}
        </button> */}
      </div>

      <style>{`
        .conflict-pill { display: none; }
        .topbar-title  { padding-left: 80px; }
        @media (min-width: 768px) {
          .conflict-pill { display: flex; }
          .topbar-title  { padding-left: 0; }
        }
      `}</style>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Scan pulse state lives here so TopBar and any child can use it
  const [scanPulse, setScanPulse] = useState(false);

  const triggerScan = () => {
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 2000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      <Sidebar conflictCount={CONFLICT_COUNT} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar scanPulse={scanPulse} onScan={triggerScan} />
        <main style={{ flex: 1, padding: "1.5rem", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}