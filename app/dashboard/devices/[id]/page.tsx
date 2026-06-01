"use client";
import { useParams, useRouter } from "next/navigation";
import { DEVICES } from "../../page";

const STATUS_COLOR = { online: "var(--success)", offline: "var(--text-muted)", unstable: "var(--warning)" };
const STATUS_BG = { online: "rgba(0,229,160,.08)", offline: "rgba(61,84,112,.12)", unstable: "rgba(255,181,71,.08)" };
const DEVICE_ICONS: Record<string, string> = { Router: "◈", Switch: "⬡", Server: "▦", PC: "▣", Laptop: "▤", Printer: "◫", Mobile: "▯", Tablet: "▭", NAS: "◩", Camera: "◎", Unknown: "◌" };

// Mock scan history per device
const HISTORY = [
  { time: "Today, 14:32", ip: "192.168.1.x", event: "Device detected on scan", type: "info" },
  { time: "Today, 12:10", ip: "192.168.1.x", event: "Status changed to online", type: "success" },
  { time: "Today, 09:45", ip: "192.168.1.x", event: "IP lease renewed", type: "info" },
  { time: "Yesterday", ip: "192.168.1.x", event: "Device went offline", type: "warning" },
  { time: "Yesterday", ip: "192.168.1.x", event: "Device detected on scan", type: "info" },
  { time: "2 days ago", ip: "192.168.1.x", event: "First seen on network", type: "success" },
];

const EVENT_COLOR: Record<string, string> = { info: "var(--cyan)", success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)" };

function InfoRow({ label, value, mono = true, accent }: { label: string; value: string; mono?: boolean; accent?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid var(--border)", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-display)", fontSize: 13, color: accent ?? "var(--text-primary)", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

export default function DeviceDetail() {
  const { id } = useParams();
  const router = useRouter();
  const device = DEVICES.find(d => d.id === Number(id));

  if (!device) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
      <div style={{ fontSize: 40, color: "var(--text-muted)" }}>◌</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-secondary)" }}>Device not found.</div>
      <button onClick={() => router.back()} className="btn-outline" style={{ padding: "8px 20px", fontSize: 12 }}>← Go back</button>
    </div>
  );

  // Patch history IPs to match this device
  const history = HISTORY.map(h => ({ ...h, ip: device.ip }));
  const statusColor = STATUS_COLOR[device.status];
  const statusBg = STATUS_BG[device.status];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Back button */}
      <button onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 24, padding: 0, letterSpacing: "0.04em", transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
        ← Back to dashboard
      </button>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52,
            border: `1px solid ${device.conflict ? "rgba(255,77,106,0.5)" : "var(--border-bright)"}`,
            background: device.conflict ? "rgba(255,77,106,0.08)" : "var(--surface)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            color: device.conflict ? "var(--danger)" : "var(--cyan)",
          }}>
            {DEVICE_ICONS[device.type] ?? "◌"}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>
              {device.hostname}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cyan)" }}>{device.ip}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>·</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{device.type}</span>
              {device.conflict && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--danger)", background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)", padding: "2px 8px", letterSpacing: "0.06em" }}>
                  ⚠ IP CONFLICT
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: statusBg, border: `1px solid ${statusColor}30` }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor, boxShadow: `0 0 6px ${statusColor}`, animation: device.status === "online" ? "blink 2s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: statusColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>{device.status}</span>
        </div>
      </div>

      {/* Conflict warning */}
      {device.conflict && (
        <div style={{ background: "rgba(255,77,106,0.07)", border: "1px solid rgba(255,77,106,0.35)", padding: "14px 18px", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--danger)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>⚠ IP Address Conflict</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            This device shares IP address <span style={{ color: "var(--danger)" }}>{device.ip}</span> with another device on the network.
            This causes intermittent connectivity loss for both devices. To resolve: assign a unique static IP or check your DHCP server configuration.
          </div>
        </div>
      )}

      {/* Two-column layout on desktop */}
      <div className="detail-grid">

        {/* Left column — device info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Identity card */}
          <div className="card-net" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Identity</div>
            <InfoRow label="Hostname" value={device.hostname} />
            <InfoRow label="IP Address" value={device.ip} accent={device.conflict ? "var(--danger)" : "var(--cyan)"} />
            <InfoRow label="MAC Address" value={device.mac} accent="var(--text-secondary)" />
            <InfoRow label="Vendor" value={device.vendor} />
            <InfoRow label="Device Type" value={device.type} />
            <InfoRow label="Last Seen" value={device.lastSeen} accent="var(--text-secondary)" />
          </div>

          {/* Network card */}
          <div className="card-net" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Network</div>
            <InfoRow label="Subnet" value="192.168.1.0/24" />
            <InfoRow label="Gateway" value="192.168.1.1" accent="var(--cyan)" />
            <InfoRow label="VLAN" value="Default (1)" />
            <InfoRow label="Open Ports" value="22, 80, 443" accent="var(--text-secondary)" />
            <InfoRow label="Response Time" value="4 ms" accent="var(--success)" />
          </div>

          {/* Quick actions */}
          <div className="card-net" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Ping device", icon: "◎", accent: "var(--cyan)" },
                { label: "Run port scan", icon: "◈", accent: "var(--warning)" },
                { label: "Block device", icon: "◉", accent: "var(--danger)" },
                { label: "Assign static IP", icon: "▦", accent: "var(--success)" },
              ].map(a => (
                <button key={a.label}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", padding: "10px 14px", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = a.accent; e.currentTarget.style.background = `${a.accent}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface-2)"; }}>
                  <span style={{ color: a.accent, fontSize: 13 }}>{a.icon}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — history */}
        <div className="card-net" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Scan History</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{history.length} events</span>
          </div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 1, background: "var(--border)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, position: "relative" }}>
                  {/* Dot */}
                  <div style={{ width: 15, height: 15, borderRadius: "50%", background: "var(--surface)", border: `1.5px solid ${EVENT_COLOR[h.type]}`, flexShrink: 0, marginTop: 2, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: EVENT_COLOR[h.type] }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", marginBottom: 4 }}>{h.event}</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{h.time}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cyan)", opacity: 0.7 }}>{h.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw data terminal block */}
          <div style={{ marginTop: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ height: 30, background: "var(--background)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
              <div style={{ width: 7, height: 7, background: "var(--cyan)", opacity: 0.5 }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>arp_table.log</span>
            </div>
            <pre style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--cyan)", lineHeight: 1.8, margin: 0, overflowX: "auto" }}>
              {`? (${device.ip}) at ${device.mac}
  [ether] on eth0
  iface: 192.168.1.0/24
  ttl: 64  rtt: 4ms`}
            </pre>
          </div>
        </div>
      </div>

      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .detail-grid {
            grid-template-columns: 340px 1fr;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}