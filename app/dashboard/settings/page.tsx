"use client";
import { useState } from "react";

type ToggleProps = { value: boolean; onChange: (v: boolean) => void; accent?: string };

function Toggle({ value, onChange, accent = "var(--cyan)" }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: value ? accent : "var(--surface-2)",
        border: `1px solid ${value ? accent : "var(--border-bright)"}`,
        position: "relative", cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: value ? `0 0 10px ${accent}60` : "none",
      }}>
      <div style={{
        position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%",
        background: value ? "#000" : "var(--text-muted)",
        left: value ? 20 : 2,
        transition: "left 0.25s ease",
      }} />
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border)", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-primary)", marginBottom: desc ? 4 : 0 }}>{label}</div>
        {desc && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card-net" style={{ padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 16, color: "var(--cyan)" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "var(--surface-2)", border: "1px solid var(--border-bright)",
  color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 12,
  padding: "8px 12px", outline: "none", width: "100%", maxWidth: 220,
  transition: "border-color 0.2s",
};

export default function SettingsPage() {
  // Network
  const [subnet, setSubnet] = useState("192.168.1.0/24");
  const [gateway, setGateway] = useState("192.168.1.1");
  const [scanRate, setScanRate] = useState("300");

  // Scan behaviour
  const [autoScan, setAutoScan] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [portScan, setPortScan] = useState(false);
  const [resolveHost, setResolveHost] = useState(true);

  // Alerts
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [alertEmail, setAlertEmail] = useState("admin@nettrace.io");
  const [conflictAlert, setConflictAlert] = useState(true);
  const [newDevice, setNewDevice] = useState(true);
  const [offlineAlert, setOfflineAlert] = useState(false);

  // Display
  const [compactView, setCompactView] = useState(false);
  const [showOffline, setShowOffline] = useState(true);
  const [showMAC, setShowMAC] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Page intro */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Configure your subnet, scan behaviour, and notification preferences.
          Changes apply to the next scan cycle.
        </p>
      </div>

      {/* Network configuration */}
      <SectionCard title="Network Configuration" icon="⬡">
        <SettingRow label="Subnet range" desc="CIDR notation for the LAN to scan">
          <input value={subnet} onChange={e => setSubnet(e.target.value)} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "var(--cyan)")}
            onBlur={e => (e.target.style.borderColor = "var(--border-bright)")} />
        </SettingRow>
        <SettingRow label="Default gateway" desc="Router IP used as scan anchor">
          <input value={gateway} onChange={e => setGateway(e.target.value)} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "var(--cyan)")}
            onBlur={e => (e.target.style.borderColor = "var(--border-bright)")} />
        </SettingRow>
        <SettingRow label="Scan interval (seconds)" desc="How often automatic scans run">
          <select value={scanRate} onChange={e => setScanRate(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", maxWidth: 220 }}>
            <option value="60">60s — every minute</option>
            <option value="300">300s — every 5 minutes</option>
            <option value="600">600s — every 10 minutes</option>
            <option value="1800">1800s — every 30 minutes</option>
            <option value="0">Manual only</option>
          </select>
        </SettingRow>
      </SectionCard>

      {/* Scan behaviour */}
      <SectionCard title="Scan Behaviour" icon="◈">
        <SettingRow label="Auto-scan on startup" desc="Run a scan automatically when the dashboard loads">
          <Toggle value={autoScan} onChange={setAutoScan} />
        </SettingRow>
        <SettingRow label="Hostname resolution" desc="Resolve hostnames via reverse DNS and mDNS">
          <Toggle value={resolveHost} onChange={setResolveHost} />
        </SettingRow>
        <SettingRow label="Deep scan" desc="Include SNMP and service fingerprinting (slower)">
          <Toggle value={deepScan} onChange={setDeepScan} accent="var(--warning)" />
        </SettingRow>
        <SettingRow label="Port scanning" desc="Check common ports on each discovered device">
          <Toggle value={portScan} onChange={setPortScan} accent="var(--warning)" />
        </SettingRow>
      </SectionCard>

      {/* Alerts */}
      <SectionCard title="Alerts & Notifications" icon="◉">
        <SettingRow label="Email alerts" desc="Send conflict and status notifications by email">
          <Toggle value={emailAlerts} onChange={setEmailAlerts} />
        </SettingRow>
        {emailAlerts && (
          <SettingRow label="Alert email address">
            <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)} type="email" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={e => (e.target.style.borderColor = "var(--border-bright)")} />
          </SettingRow>
        )}
        <SettingRow label="IP conflict alerts" desc="Notify immediately when a conflict is detected">
          <Toggle value={conflictAlert} onChange={setConflictAlert} accent="var(--danger)" />
        </SettingRow>
        <SettingRow label="New device alerts" desc="Notify when an unknown device joins the network">
          <Toggle value={newDevice} onChange={setNewDevice} />
        </SettingRow>
        <SettingRow label="Device offline alerts" desc="Notify when a tracked device goes offline">
          <Toggle value={offlineAlert} onChange={setOfflineAlert} />
        </SettingRow>
      </SectionCard>

      {/* Display */}
      <SectionCard title="Display" icon="▦">
        <SettingRow label="Compact table view" desc="Reduce row height in the device inventory">
          <Toggle value={compactView} onChange={setCompactView} />
        </SettingRow>
        <SettingRow label="Show offline devices" desc="Include offline devices in the inventory table">
          <Toggle value={showOffline} onChange={setShowOffline} />
        </SettingRow>
        <SettingRow label="Show MAC addresses" desc="Display MAC column in the device table">
          <Toggle value={showMAC} onChange={setShowMAC} />
        </SettingRow>
      </SectionCard>

      {/* Danger zone */}
      <div className="card-net" style={{ padding: "22px 24px", marginBottom: 32, borderColor: "rgba(255,77,106,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, paddingBottom: 16, borderBottom: "1px solid rgba(255,77,106,0.15)" }}>
          <span style={{ fontSize: 16, color: "var(--danger)" }}>⚠</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--danger)", letterSpacing: "-0.01em" }}>Danger Zone</span>
        </div>
        <SettingRow label="Clear scan history" desc="Permanently delete all scan logs and event history">
          <button style={{ background: "transparent", border: "1px solid rgba(255,77,106,0.4)", color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px 16px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,77,106,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            Clear history
          </button>
        </SettingRow>
        <SettingRow label="Reset to defaults" desc="Restore all settings to factory defaults">
          <button style={{ background: "transparent", border: "1px solid rgba(255,77,106,0.4)", color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px 16px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,77,106,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            Reset all
          </button>
        </SettingRow>
      </div>

      {/* Save bar */}
      <div style={{
        position: "sticky", bottom: 0,
        background: "rgba(3,7,15,0.95)", backdropFilter: "blur(10px)",
        borderTop: "1px solid var(--border)",
        padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          Changes apply on next scan cycle.
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.25)", animation: "fade-up 0.3s ease forwards" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--success)", letterSpacing: "0.06em" }}>Settings saved</span>
            </div>
          )}
          <button onClick={handleSave} className="btn-glow" style={{ padding: "10px 28px", fontSize: 12 }}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}