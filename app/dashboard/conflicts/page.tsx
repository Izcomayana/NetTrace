"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEVICES } from "../page";

type Severity = "critical" | "warning";

type ConflictEvent = {
  id: number;
  ip: string;
  devices: { hostname: string; mac: string; vendor: string; status: string }[];
  severity: Severity;
  firstSeen: string;
  lastSeen: string;
  duration: string;
  resolved: boolean;
};

const CONFLICT_LOG: ConflictEvent[] = [
  {
    id: 1,
    ip: "192.168.1.105",
    devices: [
      { hostname: "dell-pc-finance", mac: "AA:BB:CC:11:22:33", vendor: "Dell", status: "online" },
      { hostname: "unknown-device", mac: "FF:EE:DD:44:55:66", vendor: "Unknown", status: "unstable" },
    ],
    severity: "critical",
    firstSeen: "Today, 11:42 AM",
    lastSeen: "Today, 02:18 PM",
    duration: "2h 36m",
    resolved: false,
  },
  {
    id: 2,
    ip: "192.168.1.88",
    devices: [
      { hostname: "laptop-dev-03", mac: "CA:FE:00:11:22:33", vendor: "Lenovo", status: "offline" },
      { hostname: "ipad-boardroom", mac: "DE:AD:00:44:55:66", vendor: "Apple", status: "offline" },
    ],
    severity: "warning",
    firstSeen: "Yesterday, 09:15 AM",
    lastSeen: "Yesterday, 09:58 AM",
    duration: "43m",
    resolved: true,
  },
  {
    id: 3,
    ip: "192.168.1.22",
    devices: [
      { hostname: "cam-hallway", mac: "BA:BE:00:11:22:33", vendor: "Hikvision", status: "online" },
      { hostname: "voip-phone-02", mac: "C0:FF:EE:44:55:66", vendor: "Cisco", status: "offline" },
    ],
    severity: "warning",
    firstSeen: "2 days ago, 03:30 PM",
    lastSeen: "2 days ago, 04:01 PM",
    duration: "31m",
    resolved: true,
  },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "var(--danger)",
  warning: "var(--warning)",
};
const SEVERITY_BG: Record<Severity, string> = {
  critical: "rgba(255,77,106,0.08)",
  warning: "rgba(255,181,71,0.08)",
};
const STATUS_COLOR: Record<string, string> = {
  online: "var(--success)",
  offline: "var(--text-muted)",
  unstable: "var(--warning)",
};

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px",
      background: SEVERITY_BG[severity],
      border: `1px solid ${SEVERITY_COLOR[severity]}40`,
      fontFamily: "var(--font-mono)", fontSize: 10,
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: SEVERITY_COLOR[severity],
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: SEVERITY_COLOR[severity], display: "inline-block" }} />
      {severity}
    </span>
  );
}

function ConflictCard({ event, onSelect, selected }: {
  event: ConflictEvent;
  onSelect: (id: number) => void;
  selected: boolean;
}) {
  const router = useRouter();
  const color = SEVERITY_COLOR[event.severity];

  return (
    <div
      onClick={() => onSelect(event.id)}
      className="card-net"
      style={{
        padding: "20px 22px",
        cursor: "pointer",
        borderColor: selected ? color : event.resolved ? "var(--border)" : `${color}50`,
        background: selected ? `${color}06` : event.resolved ? "var(--surface)" : SEVERITY_BG[event.severity],
        opacity: event.resolved ? 0.65 : 1,
        transition: "all 0.2s",
      }}>

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!event.resolved && (
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0, animation: "blink 1s step-end infinite" }} />
          )}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: event.resolved ? "var(--text-secondary)" : color, letterSpacing: "0.04em" }}>
            {event.ip}
          </span>
          <SeverityBadge severity={event.severity} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {event.resolved ? (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--success)", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.25)", padding: "3px 10px", letterSpacing: "0.06em" }}>
              ✓ RESOLVED
            </span>
          ) : (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--danger)", background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.3)", padding: "3px 10px", letterSpacing: "0.06em", animation: "blink 2s step-end infinite" }}>
              ● ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Conflicting devices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {event.devices.map((d, i) => (
          <>
            <div key={d.mac} style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              padding: "10px 12px",
              borderLeft: i === 0 ? `2px solid ${color}` : "1px solid var(--border)",
              borderRight: i === 1 ? `2px solid ${color}` : "1px solid var(--border)",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", marginBottom: 4 }}>{d.hostname}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.04em" }}>{d.mac}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[d.status] ?? "var(--text-muted)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: STATUS_COLOR[d.status] ?? "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.status}</span>
              </div>
            </div>
            {i === 0 && (
              <div key="vs" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 1, height: 12, background: color, opacity: 0.5 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color, background: `${color}15`, border: `1px solid ${color}40`, padding: "2px 6px" }}>VS</span>
                <div style={{ width: 1, height: 12, background: color, opacity: 0.5 }} />
              </div>
            )}
          </>
        ))}
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          { label: "First seen", value: event.firstSeen },
          { label: "Last seen", value: event.lastSeen },
          { label: "Duration", value: event.duration },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Expanded detail */}
      {selected && (
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${color}30`, animation: "fade-up 0.25s ease forwards" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Resolution steps
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Log into your DHCP server and check for duplicate reservations.",
              `Release the IP lease for ${event.ip} and force a renewal on both devices.`,
              "Assign a static IP to the legitimate device to prevent recurrence.",
              "Run a new scan to confirm the conflict is cleared.",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color, background: `${color}15`, border: `1px solid ${color}30`, padding: "1px 7px", flexShrink: 0, marginTop: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {event.devices.map(d => {
              const match = DEVICES.find(dev => dev.hostname === d.hostname);
              if (!match) return null;
              return (
                <button key={d.mac}
                  onClick={e => { e.stopPropagation(); router.push(`/dashboard/devices/${match.id}`); }}
                  style={{ background: "transparent", border: `1px solid ${color}40`, color, fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px 14px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  View {d.hostname} →
                </button>
              );
            })}
            {!event.resolved && (
              <button
                onClick={e => e.stopPropagation()}
                style={{ background: "var(--success)", border: "none", color: "#000", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, padding: "7px 14px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                Mark resolved ✓
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConflictsPage() {
  const [selected, setSelected] = useState<number | null>(1);
  const [showResolved, setShowResolved] = useState(true);

  const active = CONFLICT_LOG.filter(c => !c.resolved);
  const resolved = CONFLICT_LOG.filter(c => c.resolved);
  const visible = showResolved ? CONFLICT_LOG : active;

  const toggle = (id: number) => setSelected(prev => prev === id ? null : id);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Summary strip */}
      <div className="conflict-summary">
        {[
          { label: "Active conflicts", value: active.length, accent: "var(--danger)" },
          { label: "Resolved (all time)", value: resolved.length, accent: "var(--success)" },
          { label: "Devices affected", value: active.reduce((a, c) => a + c.devices.length, 0), accent: "var(--warning)" },
        ].map(s => (
          <div key={s.label} className="card-net" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: s.accent }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>
          {visible.length} conflict{visible.length !== 1 ? "s" : ""}
          <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>· Click a card to expand</span>
        </div>
        <button
          onClick={() => setShowResolved(p => !p)}
          style={{ background: "transparent", border: "1px solid var(--border-bright)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px 14px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
          {showResolved ? "Hide resolved" : "Show resolved"}
        </button>
      </div>

      {/* Active conflicts */}
      {active.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)", animation: "blink 1s step-end infinite" }} />
            Active — requires action
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {active.map(e => <ConflictCard key={e.id} event={e} onSelect={toggle} selected={selected === e.id} />)}
          </div>
        </div>
      )}

      {/* Resolved conflicts */}
      {showResolved && resolved.length > 0 && (
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
            Resolved
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {resolved.map(e => <ConflictCard key={e.id} event={e} onSelect={toggle} selected={selected === e.id} />)}
          </div>
        </div>
      )}

      <style>{`
        .conflict-summary {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (min-width: 540px) {
          .conflict-summary { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}