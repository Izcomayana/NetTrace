"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type DeviceStatus = "online" | "offline" | "unstable";
type Device = {
  id: number; hostname: string; ip: string; mac: string;
  vendor: string; type: string; status: DeviceStatus;
  lastSeen: string; conflict: boolean;
};

export const DEVICES: Device[] = [
  { id: 1, hostname: "gateway-01", ip: "192.168.1.1", mac: "A1:B2:C3:D4:E5:F6", vendor: "Cisco", type: "Router", status: "online", lastSeen: "Just now", conflict: false },
  { id: 2, hostname: "dell-pc-finance", ip: "192.168.1.105", mac: "AA:BB:CC:11:22:33", vendor: "Dell", type: "PC", status: "online", lastSeen: "1 min ago", conflict: true },
  { id: 3, hostname: "unknown-device", ip: "192.168.1.105", mac: "FF:EE:DD:44:55:66", vendor: "Unknown", type: "Unknown", status: "unstable", lastSeen: "3 min ago", conflict: true },
  { id: 4, hostname: "hp-printer-02", ip: "192.168.1.40", mac: "11:22:33:44:55:66", vendor: "HP", type: "Printer", status: "online", lastSeen: "5 min ago", conflict: false },
  { id: 5, hostname: "macbook-hr", ip: "192.168.1.78", mac: "CA:FE:BA:BE:00:01", vendor: "Apple", type: "Laptop", status: "offline", lastSeen: "2 hrs ago", conflict: false },
  { id: 6, hostname: "server-main", ip: "192.168.1.10", mac: "DE:AD:BE:EF:00:01", vendor: "Dell", type: "Server", status: "online", lastSeen: "Just now", conflict: false },
  { id: 7, hostname: "iphone-ceo", ip: "192.168.1.90", mac: "AA:11:BB:22:CC:33", vendor: "Apple", type: "Mobile", status: "online", lastSeen: "8 min ago", conflict: false },
  { id: 8, hostname: "switch-floor2", ip: "192.168.1.2", mac: "BB:CC:DD:EE:FF:00", vendor: "Cisco", type: "Switch", status: "online", lastSeen: "Just now", conflict: false },
  { id: 9, hostname: "laptop-dev-01", ip: "192.168.1.55", mac: "12:34:56:78:9A:BC", vendor: "Lenovo", type: "Laptop", status: "online", lastSeen: "12 min ago", conflict: false },
  { id: 10, hostname: "nas-storage", ip: "192.168.1.20", mac: "AA:BB:CC:DD:EE:01", vendor: "Synology", type: "NAS", status: "online", lastSeen: "Just now", conflict: false },
  { id: 11, hostname: "ipad-reception", ip: "192.168.1.112", mac: "FA:CE:B0:0C:00:01", vendor: "Apple", type: "Tablet", status: "offline", lastSeen: "1 day ago", conflict: false },
  { id: 12, hostname: "cam-entrance", ip: "192.168.1.200", mac: "CA:M1:00:00:00:01", vendor: "Hikvision", type: "Camera", status: "online", lastSeen: "Just now", conflict: false },
];

const STATUS_COLOR: Record<DeviceStatus, string> = { online: "var(--success)", offline: "var(--text-muted)", unstable: "var(--warning)" };
const STATUS_BG: Record<DeviceStatus, string> = { online: "rgba(0,229,160,.08)", offline: "rgba(61,84,112,.12)", unstable: "rgba(255,181,71,.08)" };
const DEVICE_ICONS: Record<string, string> = { Router: "◈", Switch: "⬡", Server: "▦", PC: "▣", Laptop: "▤", Printer: "◫", Mobile: "▯", Tablet: "▭", NAS: "◩", Camera: "◎", Unknown: "◌" };

function StatCard({ label, value, sub, accent = "var(--cyan)", icon }: { label: string; value: string | number; sub?: string; accent?: string; icon: string }) {
  return (
    <div className="card-net" style={{ padding: "22px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, background: `linear-gradient(225deg,${accent}18,transparent 60%)` }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 18, color: accent }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", color: accent, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function ConflictBanner({ conflicts }: { conflicts: Device[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || conflicts.length === 0) return null;
  return (
    <div style={{ background: "rgba(255,77,106,0.07)", border: "1px solid rgba(255,77,106,0.35)", padding: "14px 18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 200 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", boxShadow: "0 0 8px var(--danger)", flexShrink: 0, marginTop: 4, animation: "blink 1s step-end infinite" }} />
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--danger)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>⚠ IP Conflict Detected</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Address <span style={{ color: "var(--danger)" }}>{conflicts[0].ip}</span> is claimed by{" "}
            <span style={{ color: "var(--text-primary)" }}>{conflicts.length} devices</span>
            {" "}— {conflicts.map(d => d.hostname).join(" and ")}. Resolve immediately to avoid downtime.
          </div>
        </div>
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: STATUS_BG[status], border: `1px solid ${STATUS_COLOR[status]}30`, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: STATUS_COLOR[status] }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[status], display: "inline-block" }} />
      {status}
    </span>
  );
}

const STORAGE_KEY = "nettrace_removed_devices";

export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [typeFilter, setType] = useState("all");

  const [removedIds, setRemovedIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const removeDevice = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRemovedIds(prev => {
      const updated = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const restoreAll = () => {
    setRemovedIds([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const visibleDevices = DEVICES.filter(d => !removedIds.includes(d.id));

  const conflicts = visibleDevices.filter(d => d.conflict);

  const online = visibleDevices.filter(d => d.status === "online").length;
  const offline = visibleDevices.filter(d => d.status === "offline").length;
  const types = ["all", ...Array.from(new Set(visibleDevices.map(d => d.type)))];

  const filtered = useMemo(() => visibleDevices.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.hostname.includes(q) || d.ip.includes(q) || d.mac.toLowerCase().includes(q) || d.vendor.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchType = typeFilter === "all" || d.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }), [search, statusFilter, typeFilter, removedIds]);

  const selectStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--border-bright)",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    padding: "7px 10px",
    outline: "none",
    cursor: "pointer"
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <ConflictBanner conflicts={conflicts} />

      {/* Stat cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total devices" value={DEVICES.length} sub="on this subnet" icon="◈" accent="var(--cyan)" />
        <StatCard label="Online" value={online} sub={`${offline} offline`} icon="◉" accent="var(--success)" />
        <StatCard label="IP Conflicts" value={conflicts.length} sub="require attention" icon="⚠" accent="var(--danger)" />
        <StatCard label="Vendors" value={new Set(DEVICES.map(d => d.vendor)).size} sub="manufacturers" icon="⬡" accent="var(--warning)" />
      </div>

      {/* Device table */}
      <div className="card-net" style={{ overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Device Inventory</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: 10 }}>{filtered.length} of {DEVICES.length} devices</span>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 5, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>◎</span>
              <span>Double-tap any row to view full device details</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)" }}>◎</span>
              <input placeholder="Search hostname, IP, MAC..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...selectStyle, paddingLeft: 28, width: 220, color: "var(--text-primary)" }} />
            </div>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="all">All status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="unstable">Unstable</option>
            </select>
            <select value={typeFilter} onChange={e => setType(e.target.value)} style={selectStyle}>
              {types.map(t => <option key={t} value={t}>{t === "all" ? "All types" : t}</option>)}
            </select>
          </div>
        </div>

        {/* Scrollable table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Hostname", "IP Address", "MAC Address", "Vendor", "Type", "Status", "Last Seen", ""].map(col => (
                  <th key={col} style={{ textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontWeight: 400 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>No devices match your search.</td></tr>
              ) : filtered.map((d, i) => (
                <tr key={d.id}
                  onClick={() => router.push(`/dashboard/devices/${d.id}`)}
                  style={{ background: d.conflict ? "rgba(255,77,106,0.04)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", borderBottom: "1px solid var(--border)", transition: "background 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = d.conflict ? "rgba(255,77,106,0.09)" : "rgba(0,229,255,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = d.conflict ? "rgba(255,77,106,0.04)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)")}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 28, height: 28, border: `1px solid ${d.conflict ? "rgba(255,77,106,0.4)" : "var(--border-bright)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: d.conflict ? "rgba(255,77,106,0.08)" : "var(--surface-2)", fontSize: 14 }}>
                        {DEVICE_ICONS[d.type] ?? "◌"}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)" }}>{d.hostname}</div>
                        {d.conflict && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--danger)" }}>⚠ conflict</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: d.conflict ? "var(--danger)" : "var(--cyan)" }}>{d.ip}</span></td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{d.mac}</span></td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{d.vendor}</span></td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", padding: "2px 8px" }}>{d.type}</span></td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{d.lastSeen}</span></td>
                  <td style={{ padding: "11px 14px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{d.lastSeen}</span></td>
                  <td style={{ padding: "11px 10px", textAlign: "center" }}>
                    <button
                      onClick={(e) => removeDevice(e, d.id)}
                      title="Remove device"
                      style={{
                        width: 26, height: 26,
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: 13,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                        lineHeight: 1,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "var(--danger)";
                        e.currentTarget.style.color = "var(--danger)";
                        e.currentTarget.style.background = "rgba(255,77,106,0.1)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-muted)";
                        e.currentTarget.style.background = "transparent";
                      }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            Showing {filtered.length} of {visibleDevices.length} device{visibleDevices.length !== 1 ? "s" : ""}
            {removedIds.length > 0 && (
              <button
                onClick={restoreAll}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer", marginLeft: 10, padding: 0, letterSpacing: "0.04em", transition: "color 0.2s", textDecoration: "underline" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                Restore {removedIds.length} removed
              </button>
            )}
            {conflicts.length > 0 && <span style={{ color: "var(--danger)", marginLeft: 10 }}>· {conflicts.length} conflict{conflicts.length !== 1 ? "s" : ""} require attention</span>}
          </span>
          <button style={{ background: "transparent", border: "1px solid var(--border-bright)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 11, padding: "6px 14px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            Export CSV ↓
          </button>
        </div>
      </div>

      <style>{`
        .stat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        @media(min-width:900px){ .stat-grid{ grid-template-columns:repeat(4,1fr); } }
      `}</style>
    </div>
  );
}