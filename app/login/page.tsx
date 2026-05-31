"use client";
import { useState } from "react";
import Link from "next/link";

type Mode = "login" | "register";

function NetLogo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30,
        border: "1px solid var(--cyan)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{ width: 7, height: 7, background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }} />
        <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(0,229,255,0.3)" }} />
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        Net<span style={{ color: "var(--cyan)" }}>Trace</span>
      </span>
    </Link>
  );
}

function InputField({
  label, type = "text", placeholder, value, onChange, autoComplete,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--text-secondary)", letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: 8,
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "var(--surface-2)",
          border: `1px solid ${focused ? "var(--cyan)" : "var(--border-bright)"}`,
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          padding: "11px 14px",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(0,229,255,0.08), 0 0 20px rgba(0,229,255,0.06)" : "none",
          borderRadius: 0,
        }}
      />
    </div>
  );
}

function ScanLine() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
        opacity: 0.15,
        animation: "login-scan 4s linear infinite",
      }} />
      <style>{`
        @keyframes login-scan {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function NodeDot({ top, left, size, delay, conflict }: { top: string; left: string; size: number; delay: string; conflict?: boolean }) {
  return (
    <div style={{
      position: "absolute", top, left,
      width: size, height: size, borderRadius: "50%",
      background: conflict ? "var(--danger)" : "var(--cyan)",
      boxShadow: conflict ? "0 0 12px var(--danger)" : "0 0 12px var(--cyan)",
      opacity: 0.5,
      animation: `pulse-node 3s ease-in-out ${delay} infinite`,
    }}>
      <style>{`
        @keyframes pulse-node {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.4); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) return;
    setLoading(true);
    // Simulate auth — swap this with your real auth logic
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
    // TODO: redirect to dashboard → router.push("/dashboard")
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden" }}>

      {/* ── Left panel — branding ── */}
      <div className="login-left">
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
        <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Decorative node dots */}
        <NodeDot top="18%" left="20%" size={8} delay="0s" />
        <NodeDot top="35%" left="65%" size={5} delay="0.8s" />
        <NodeDot top="55%" left="30%" size={6} delay="1.4s" />
        <NodeDot top="70%" left="72%" size={4} delay="0.4s" conflict />
        <NodeDot top="82%" left="18%" size={5} delay="2s" />
        <NodeDot top="25%" left="80%" size={4} delay="1.8s" conflict />

        {/* SVG connector lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
          <line x1="20%" y1="18%" x2="65%" y2="35%" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="65%" y1="35%" x2="30%" y2="55%" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="30%" y1="55%" x2="72%" y2="70%" stroke="var(--danger)" strokeWidth="1" strokeDasharray="3 8" />
          <line x1="20%" y1="18%" x2="80%" y2="25%" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="18%" y1="82%" x2="30%" y2="55%" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 6" />
        </svg>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 2.5rem", maxWidth: 420 }}>
          <div style={{ marginBottom: 48 }}>
            <NetLogo />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.1,
            letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 18,
          }}>
            Your network,<br />
            <span className="gradient-text">fully visible.</span>
          </h2>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 40 }}>
            Sign in to access your device inventory, monitor live scans, and resolve IP conflicts before they cause downtime.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "◈", text: "Auto LAN discovery" },
              { icon: "◉", text: "Real-time IP conflict alerts" },
              { icon: "▦", text: "Full device inventory dashboard" },
            ].map(f => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 30, height: 30, border: "1px solid var(--border-bright)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cyan)", fontSize: 14, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="login-right">
        <ScanLine />

        <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>

          {/* Mobile logo (only shows on small screens) */}
          <div className="mobile-logo">
            <NetLogo />
          </div>

          {/* Mode toggle */}
          <div style={{
            display: "flex", marginBottom: 36,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            padding: 4,
          }}>
            {(["login", "register"] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setDone(false); }}
                style={{
                  flex: 1, padding: "9px 0",
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: "none", cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: mode === m ? "var(--cyan)" : "transparent",
                  color: mode === m ? "#000" : "var(--text-secondary)",
                  fontWeight: mode === m ? 700 : 400,
                }}>
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-0.02em",
              color: "var(--text-primary)", marginBottom: 8,
            }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
              {mode === "login"
                ? "Enter your credentials to access the dashboard."
                : "Set up your NetTrace admin account."}
            </p>
          </div>

          {/* Success state */}
          {done ? (
            <div style={{
              border: "1px solid rgba(0,229,160,0.4)", background: "rgba(0,229,160,0.06)",
              padding: "20px 18px", marginBottom: 24,
              animation: "fade-up 0.4s ease forwards",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {mode === "login" ? "Authenticated" : "Account created"}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {mode === "login"
                  ? "Redirecting you to the dashboard..."
                  : "Account ready. Redirecting to dashboard..."}
              </p>
            </div>
          ) : (
            <>
              {/* Form fields */}
              {mode === "register" && (
                <InputField
                  label="Full name"
                  placeholder="John Adeyemi"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
              )}

              <InputField
                label="Email address"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <InputField
                label="Password"
                type="password"
                placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                value={password}
                onChange={setPassword}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: -12, marginBottom: 24 }}>
                  <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-glow"
                style={{ width: "100%", padding: "13px", fontSize: 13, marginTop: 4, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{
                      width: 12, height: 12, border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#000", borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    {mode === "login" ? "Authenticating..." : "Creating account..."}
                  </span>
                ) : (
                  mode === "login" ? "Sign in →" : "Create account →"
                )}
              </button>

              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* SSO placeholder */}
              <button
                style={{
                  width: "100%", padding: "11px", background: "transparent",
                  border: "1px solid var(--border-bright)", cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--text-secondary)", letterSpacing: "0.04em",
                  transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Footer switch */}
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 28 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setDone(false); }}
              style={{ background: "none", border: "none", color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer", padding: 0 }}>
              {mode === "login" ? "Register here" : "Sign in instead"}
            </button>
          </p>

          {/* Back link */}
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 16 }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              ← Back to home
            </Link>
          </p>

        </div>
      </div>

      {/* ── Layout styles ── */}
      <style>{`
        .login-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: var(--surface);
          border-right: 1px solid var(--border);
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .login-right {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          background: var(--background);
          min-height: 100vh;
        }
        .mobile-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        @media (min-width: 768px) {
          .login-left  { display: flex; flex: 0 0 45%; }
          .login-right { flex: 1; padding: 3rem 4rem; }
          .mobile-logo { display: none; }
        }
        @media (min-width: 1024px) {
          .login-left { flex: 0 0 50%; }
        }
      `}</style>
    </div>
  );
}