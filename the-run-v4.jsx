import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  accent: "#E8FF47",
  accentDim: "#E8FF4722",
  bg: "#080808",
  card: "#111111",
  card2: "#161616",
  border: "#1e1e1e",
  border2: "#2a2a2a",
  muted: "#444444",
  dim: "#666666",
  white: "#ffffff",
  red: "#ff4444",
  green: "#22c55e",
  nike: "#ffffff",
  nikeOrange: "#FF6B35",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SD_COURTS = [
  { id: 1, name: "Balboa Park Courts", neighborhood: "Balboa Park", lat: 32.7341, lng: -117.1449, rating: 4.8, hoops: 4, lighting: true, surface: "Asphalt", indoor: false, checkins: 287, partner: false },
  { id: 2, name: "LA Fitness Mission Valley", neighborhood: "Mission Valley", lat: 32.7678, lng: -117.1500, rating: 4.6, hoops: 3, lighting: true, surface: "Hardwood", indoor: true, checkins: 412, partner: true, partnerName: "LA Fitness" },
  { id: 3, name: "NTC Park Courts", neighborhood: "Liberty Station", lat: 32.7316, lng: -117.2076, rating: 4.7, hoops: 6, lighting: true, surface: "Concrete", indoor: false, checkins: 198, partner: false },
  { id: 4, name: "24 Hour Fitness Kearny Mesa", neighborhood: "Kearny Mesa", lat: 32.8234, lng: -117.1500, rating: 4.4, hoops: 2, lighting: true, surface: "Hardwood", indoor: true, checkins: 321, partner: true, partnerName: "24 Hour Fitness" },
  { id: 5, name: "Morley Field Courts", neighborhood: "North Park", lat: 32.7449, lng: -117.1287, rating: 4.5, hoops: 8, lighting: false, surface: "Asphalt", indoor: false, checkins: 156, partner: false },
  { id: 6, name: "Mission Beach Boardwalk", neighborhood: "Mission Beach", lat: 32.7731, lng: -117.2534, rating: 4.9, hoops: 4, lighting: false, surface: "Asphalt", indoor: false, checkins: 534, partner: false },
];

const INITIAL_RUNS = [
  { id: 1, host: "SD_KingDre", hostInitials: "KD", hostRep: 94, courtName: "Balboa Park Courts", courtId: 1, lat: 32.7341, lng: -117.1449, status: "live", startTime: null, scheduledFor: null, players: 11, maxPlayers: 16, level: "Pro / Semi-Pro", description: "Winners stay. Full court 5v5. No ball hogs.", isInviteOnly: false, inviteCode: null, joined: false, tags: ["5v5", "Winners Stay"], startedAt: Date.now() - 1000 * 60 * 18, sponsored: false },
  { id: 2, host: "Nike SD", hostInitials: "NK", hostRep: 100, courtName: "Mission Beach Boardwalk", courtId: 6, lat: 32.7731, lng: -117.2534, status: "scheduled", startTime: "5:00 PM", scheduledFor: new Date(Date.now() + 1000 * 60 * 120), players: 18, maxPlayers: 40, level: "Open", description: "Nike Summer Run Series. Free gear raffle. All hoopers welcome.", isInviteOnly: false, inviteCode: null, joined: false, tags: ["Sponsored", "Free Gear", "All Welcome"], startedAt: null, sponsored: true, sponsorBrand: "Nike", sponsorColor: "#111" },
  { id: 3, host: "Loso_SD", hostInitials: "LS", hostRep: 88, courtName: "NTC Park Courts", courtId: 3, lat: 32.7316, lng: -117.2076, status: "scheduled", startTime: "7:00 PM", scheduledFor: new Date(Date.now() + 1000 * 60 * 200), players: 6, maxPlayers: 12, level: "College", description: "Invite only. SD's finest.", isInviteOnly: true, inviteCode: "NTC24", joined: false, tags: ["Invite Only", "🔒 Private", "Elite"], startedAt: null, sponsored: false },
  { id: 4, host: "BigT_619", hostInitials: "BT", hostRep: 79, courtName: "LA Fitness Mission Valley", courtId: 2, lat: 32.7678, lng: -117.1500, status: "scheduled", startTime: "6:30 PM", scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 8), players: 10, maxPlayers: 20, level: "High School", description: "Indoor hardwood. Organized runs, good vibes.", isInviteOnly: false, inviteCode: null, joined: true, tags: ["Indoor", "Organized", "Refs"], startedAt: null, sponsored: false },
];

const PARTNER_GYMS = [
  { id: 1, name: "LA Fitness Mission Valley", type: "Gym Chain", courts: 3, monthlyFee: 1200, members: 8400, activeUsers: 312, runCount: 47, status: "active", joined: "Jan 2025", logo: "LAF" },
  { id: 2, name: "24 Hour Fitness Kearny Mesa", type: "Gym Chain", courts: 2, monthlyFee: 900, members: 6200, activeUsers: 198, runCount: 28, status: "active", joined: "Feb 2025", logo: "24H" },
  { id: 3, name: "Morley Field Recreation", type: "City Courts", courts: 8, monthlyFee: 500, members: null, activeUsers: 445, runCount: 89, status: "active", joined: "Mar 2025", logo: "MF" },
];

const NOTIFICATIONS = [
  { id: 1, type: "run_live", title: "Run just went live 🔥", body: "Balboa Park — 11 players in. Spots filling fast.", time: "2m ago", read: false, icon: "🏀" },
  { id: 2, type: "invite", title: "You got invited", body: "Loso_SD invited you to a private run at NTC Park.", time: "14m ago", read: false, icon: "🔒" },
  { id: 3, type: "sponsor", title: "Nike Run tonight 👟", body: "Nike Summer Series at Mission Beach — 5PM. Free gear.", time: "1h ago", read: true, icon: "✓" },
  { id: 4, type: "rep", title: "Rep score update", body: "KingDre rated you ⭐⭐⭐⭐⭐ after last night's run.", time: "3h ago", read: true, icon: "⭐" },
  { id: 5, type: "run_fill", title: "Run almost full", body: "Big T's indoor run — 2 spots left. Join now.", time: "5h ago", read: true, icon: "⚡" },
];

const STATS_DATA = {
  gamesPlayed: 47, points: 18.4, assists: 6.2, rebounds: 4.1, winRate: "68%", streak: 5,
  recentGames: [
    { court: "Balboa Park", result: "W", pts: 22, ast: 8, reb: 3, date: "Mar 7" },
    { court: "Mission Beach", result: "W", pts: 17, ast: 5, reb: 6, date: "Mar 5" },
    { court: "NTC Park", result: "L", pts: 14, ast: 4, reb: 2, date: "Mar 3" },
    { court: "LA Fitness MV", result: "W", pts: 24, ast: 9, reb: 5, date: "Mar 1" },
  ],
  badges: ["🔥 5-Game Streak", "🎯 Sharp Shooter", "🃏 Playmaker", "👑 Court King"],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  return m < 60 ? `${m}m live` : `${Math.floor(m / 60)}h ${m % 60}m live`;
}
function countdown(t) {
  if (!t) return "";
  const d = t - Date.now();
  if (d <= 0) return "Starting now";
  const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000);
  return h > 0 ? `in ${h}h ${m}m` : `in ${m}m`;
}

function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 420px)");
    const update = () => setCompact(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);
  return compact;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = {
  Search: ({ c = C.dim }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Users: ({ c = C.dim }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Map: ({ c = C.dim }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Bar: ({ c = C.dim }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  User: ({ c = C.dim }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Bell: ({ c = C.dim, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Lock: ({ c = C.accent, size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: ({ c = "#000", size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Close: ({ c = C.dim }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: ({ c = "#000" }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Arrow: ({ c = C.dim }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Trend: ({ c = C.green }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Avatar({ initials, size = 40, bg = C.accent }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.3, color: "#000", flexShrink: 0 }}>{initials}</div>;
}
function Pill({ children, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 100, border: active ? "none" : `1px solid ${C.border}`, background: active ? C.accent : C.card, color: active ? "#000" : C.dim, fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.15s" }}>{children}</button>;
}
function LiveDot({ size = 8 }) {
  return <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}><span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.accent, animation: "ping 1.8s ease-out infinite", opacity: 0.5 }}/><span style={{ width: size, height: size, borderRadius: "50%", background: C.accent, position: "relative" }}/></span>;
}
function SLabel({ children, right }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.muted, letterSpacing: 2.5, fontWeight: 800 }}>{children}</div>{right && <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, cursor: "pointer" }}>{right}</div>}</div>;
}

function RunCard({ run, onJoin, onCode, isPremium }) {
  const compact = useCompact();
  const isLive = run.status === "live";
  const fill = (run.players / run.maxPlayers) * 100;
  const cardPadding = compact ? "12px 14px 14px" : "16px 18px 18px";
  const titleSize = compact ? 15 : 17;
  const bodySize = compact ? 12 : 13;
  const labelSize = compact ? 9 : 10;

  if (run.sponsored) {
    return (
      <div style={{ borderRadius: 22, overflow: "hidden", border: `1px solid #333`, background: "#0a0a0a", position: "relative" }}>
        {/* Nike header */}
        <div style={{ background: "#111", padding: "14px 18px 12px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 10, color: "#000", letterSpacing: -0.5 }}>NIKE</div>
          <div>
            <div style={{ fontSize: 10, color: C.accent, fontWeight: 800, letterSpacing: 1.5 }}>SPONSORED RUN</div>
            <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Nike Summer Run Series · San Diego</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, color: C.accent, fontWeight: 700 }}>{run.startTime} · {countdown(run.scheduledFor)}</div>
        </div>
        <div style={{ padding: cardPadding }}>
          <div style={{ fontSize: titleSize, fontWeight: 900, color: "#fff", marginBottom: 6, letterSpacing: -0.3 }}>Nike x The Run</div>
          <div style={{ fontSize: bodySize, color: "#888", marginBottom: 14, lineHeight: 1.6 }}>{run.description}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {run.tags.map(t => <span key={t} style={{ fontSize: labelSize, padding: "4px 10px", borderRadius: 100, background: "#1a1a1a", color: C.dim, border: `1px solid #222`, fontWeight: 600 }}>{t}</span>)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: labelSize, color: C.dim }}><span style={{ color: fill >= 75 ? C.accent : C.dim, fontWeight: 700 }}>{run.players}</span>/{run.maxPlayers} players</div>
            <button onClick={() => onJoin(run.id)} style={{ background: run.joined ? "#1a1a1a" : "#fff", color: run.joined ? "#fff" : "#000", fontWeight: 800, fontSize: compact ? 11 : 12, padding: compact ? "8px 16px" : "10px 20px", borderRadius: 100, border: run.joined ? `1px solid #333` : "none", cursor: "pointer", fontFamily: "inherit" }}>
              {run.joined ? "✓ LOCKED IN" : "JOIN FREE 🏀"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, borderRadius: 22, overflow: "hidden", border: run.joined ? `1.5px solid ${C.accent}` : `1px solid ${C.border}` }}>
      <div style={{ padding: compact ? "8px 14px" : "10px 18px", display: "flex", alignItems: "center", gap: 8, background: isLive ? "#0d1a00" : "#0e0e0e", borderBottom: `1px solid ${isLive ? "#1e3300" : C.border}` }}>
        {isLive ? <><LiveDot /><span style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: 1 }}>LIVE NOW</span><span style={{ fontSize: 11, color: C.dim, marginLeft: "auto" }}>{timeAgo(run.startedAt)}</span></>
          : <><span style={{ fontSize: 11, fontWeight: 800, color: "#888", letterSpacing: 1 }}>⏱ SCHEDULED</span><span style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginLeft: "auto" }}>{run.startTime} · {countdown(run.scheduledFor)}</span></>}
      </div>
      <div style={{ padding: cardPadding }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Avatar initials={run.hostInitials} size={38} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: titleSize, fontWeight: 800, color: "#fff" }}>{run.host}</span>
                {run.hostRep >= 90 && <span style={{ fontSize: labelSize, background: "#1a2e00", color: C.accent, padding: "2px 7px", borderRadius: 100, fontWeight: 700, border: `1px solid #2a4400` }}>REP {run.hostRep}</span>}
              </div>
              <div style={{ fontSize: labelSize, color: C.dim, marginTop: 2 }}>{run.courtName}</div>
            </div>
          </div>
          {run.isInviteOnly && <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#1a1a00", border: `1px solid #3a3a00`, borderRadius: 100, padding: "5px 10px" }}><Ic.Lock /><span style={{ fontSize: 10, color: C.accent, fontWeight: 800, letterSpacing: 0.5 }}>INVITE ONLY</span></div>}
        </div>
        <p style={{ fontSize: bodySize, color: "#888", marginBottom: 12, lineHeight: 1.55 }}>{run.description}</p>

        {/* Level badge */}
        <div style={{ marginBottom: 12 }}>
          {(() => {
            const lvlMap = {
              "Open":          { bg: "#0d1a0d", border: "#1a4400", color: "#4ade80", emoji: "🟢" },
              "High School":   { bg: "#0d0d1a", border: "#2a2a55", color: "#818cf8", emoji: "🎒" },
              "College":       { bg: "#1a0d1a", border: "#441a44", color: "#c084fc", emoji: "🎓" },
              "Collegiate":    { bg: "#1a0d1a", border: "#441a44", color: "#c084fc", emoji: "🎓" },
              "Pro / Semi-Pro":{ bg: "#1a1200", border: "#443300", color: C.accent,  emoji: "👑" },
            };
            const s = lvlMap[run.level] || { bg: "#1a1a1a", border: "#333", color: "#aaa", emoji: "🏀" };
            return (
              <span style={{ fontSize: labelSize, fontWeight: 800, padding: "5px 12px", borderRadius: 100, background: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: 0.5 }}>
                {s.emoji} {run.level}
              </span>
            );
          })()}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {run.tags.map(t => <span key={t} style={{ fontSize: labelSize, padding: "4px 10px", borderRadius: 100, background: "#1a1a1a", color: C.dim, border: `1px solid #222`, fontWeight: 600 }}>{t}</span>)}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: labelSize, color: C.dim }}>{run.level}</span>
            <span style={{ fontSize: labelSize, color: fill >= 75 ? C.accent : C.dim, fontWeight: fill >= 75 ? 700 : 400 }}>{run.players}/{run.maxPlayers}{fill >= 75 ? " · Almost full!" : ""}</span>
          </div>
          <div style={{ height: 3, borderRadius: 100, background: "#1e1e1e" }}><div style={{ height: "100%", borderRadius: 100, background: C.accent, width: `${fill}%` }}/></div>
        </div>
        {run.isInviteOnly && !run.joined
          ? <button onClick={() => onCode(run)} style={{ width: "100%", background: "#111", color: C.accent, fontWeight: 800, fontSize: compact ? 12 : 13, padding: compact ? "11px" : "13px", borderRadius: compact ? 12 : 14, border: `1px solid ${C.accent}44`, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Ic.Lock /> Enter Invite Code</button>
          : <button onClick={() => onJoin(run.id)} style={{ width: "100%", background: run.joined ? "#1a1a1a" : C.accent, color: run.joined ? C.accent : "#000", fontWeight: 800, fontSize: compact ? 12 : 13, padding: compact ? "11px" : "13px", borderRadius: compact ? 12 : 14, border: run.joined ? `1px solid ${C.accent}33` : "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{run.joined ? <><Ic.Check c={C.accent} /> LOCKED IN</> : isLive ? "JOIN NOW 🏀" : "JOIN RUN"}</button>}
      </div>
    </div>
  );
}

function InviteModal({ run, onClose, onJoin }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => { code.toUpperCase() === run.inviteCode ? (onJoin(run.id), onClose()) : setErr(true); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 430, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div><div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 3 }}>🔒 Enter Invite Code</div><div style={{ fontSize: 12, color: C.dim }}>{run.courtName} · {run.host}'s run</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic.Close c="#555" /></button>
        </div>
        <input value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setErr(false); }} placeholder="ENTER CODE" maxLength={10}
          style={{ width: "100%", background: err ? "#1a0000" : "#1a1a1a", border: `1.5px solid ${err ? C.red : code ? C.accent : "#2a2a2a"}`, borderRadius: 14, padding: "16px", color: "#fff", fontSize: 20, fontFamily: "inherit", fontWeight: 800, letterSpacing: 6, textAlign: "center", outline: "none", boxSizing: "border-box" }}/>
        {err && <div style={{ fontSize: 12, color: C.red, textAlign: "center", marginTop: 8 }}>Wrong code. You're not on the list 😤</div>}
        <button onClick={submit} style={{ width: "100%", background: C.accent, color: "#000", fontWeight: 800, fontSize: 14, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 16 }}>SUBMIT CODE</button>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 10 }}>Get the code from the run host</div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const compact = useCompact();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", age: "", city: "", position: "", level: "" });
  const [animating, setAnimating] = useState(false);

  const next = () => {
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 200);
  };

  const steps = [
    // Splash
    <div key="splash" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: compact ? "32px 24px" : "40px 32px", textAlign: "center" }}>
      <div style={{ fontSize: compact ? 56 : 64, marginBottom: 24, animation: "bounceIn 0.6s ease" }}>🏀</div>
      <div style={{ fontSize: compact ? 36 : 42, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1.1, marginBottom: 16 }}>THE<br/><span style={{ color: C.accent }}>RUN</span></div>
      <div style={{ fontSize: compact ? 14 : 16, color: C.dim, lineHeight: 1.7, maxWidth: 280, marginBottom: 48 }}>Find pickup games. Organize your crew. Track your game.</div>
      <button onClick={next} style={{ background: C.accent, color: "#000", fontWeight: 900, fontSize: 16, padding: "16px 48px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3 }}>Let's Run 🏀</button>
      <div style={{ marginTop: 20, fontSize: 12, color: C.muted }}>San Diego, CA · Beta Launch</div>
    </div>,

    // Step 1 — Name
    <div key="name" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>STEP 1 OF 6</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>What's your<br/>name?</div>
      <div style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>Your name on the court.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {[["firstName","First name"],["lastName","Last name"]].map(([key, ph]) => (
          <div key={key}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>{ph.toUpperCase()}</div>
            <input autoFocus={key === "firstName"} value={data[key]} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
              style={{ width: "100%", background: "#1a1a1a", border: `1.5px solid ${data[key] ? C.accent : C.border2}`, borderRadius: 14, padding: "16px 16px", color: "#fff", fontSize: 16, fontFamily: "inherit", fontWeight: 700, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}/>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto" }}>
        <button onClick={next} disabled={!data.firstName || !data.lastName} style={{ width: "100%", background: data.firstName && data.lastName ? C.accent : "#1a1a1a", color: data.firstName && data.lastName ? "#000" : C.muted, fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: data.firstName && data.lastName ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>,

    // Step 2 — Email + Age + Password
    <div key="account" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>STEP 2 OF 6</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>Create your<br/>account</div>
      <div style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>Your info stays private.</div>
      {[["EMAIL","email","email","Your email address"],["PASSWORD","password","password","Create a password"],["AGE","age","number","Your age"]].map(([label, key, type, ph]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>{label}</div>
          <input type={type} value={data[key] || ""} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
            style={{ width: "100%", background: "#1a1a1a", border: `1.5px solid ${data[key] ? C.accent : C.border2}`, borderRadius: 14, padding: "16px 16px", color: "#fff", fontSize: 16, fontFamily: "inherit", fontWeight: 600, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}/>
        </div>
      ))}
      <div style={{ marginTop: "auto" }}>
        <button onClick={next} disabled={!data.email || !data.password || !data.age} style={{ width: "100%", background: data.email && data.password && data.age ? C.accent : "#1a1a1a", color: data.email && data.password && data.age ? "#000" : C.muted, fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: data.email && data.password && data.age ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>,

    // Step 3 — City
    <div key="city" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>STEP 3 OF 6</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>Where do<br/>you hoop?</div>
      <div style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>We'll find runs in your city.</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>YOUR CITY</div>
        <input value={data.city} onChange={e => setData(p => ({ ...p, city: e.target.value }))} placeholder="e.g. San Diego"
          style={{ width: "100%", background: "#1a1a1a", border: `1.5px solid ${data.city ? C.accent : C.border2}`, borderRadius: 14, padding: "16px 16px", color: "#fff", fontSize: 18, fontFamily: "inherit", fontWeight: 700, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}/>
      </div>
      {/* Quick city picks */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {["San Diego","Los Angeles","New York","Chicago","Atlanta","Houston"].map(c => (
          <button key={c} onClick={() => setData(p => ({ ...p, city: c }))}
            style={{ padding: "8px 16px", borderRadius: 100, border: `1px solid ${data.city === c ? C.accent : C.border2}`, background: data.city === c ? C.accentDim : "#1a1a1a", color: data.city === c ? C.accent : C.dim, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
        ))}
      </div>
      <div style={{ marginTop: "auto" }}>
        <button onClick={next} disabled={!data.city} style={{ width: "100%", background: data.city ? C.accent : "#1a1a1a", color: data.city ? "#000" : C.muted, fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: data.city ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>,

    // Step 4 — Position
    <div key="position" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>STEP 4 OF 6</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>What's your<br/>position?</div>
      <div style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>This helps match you to the right runs.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[["PG", "Point Guard", "🎯"], ["SG", "Shooting Guard", "🏹"], ["SF", "Small Forward", "⚡"], ["PF", "Power Forward", "💪"], ["C", "Center", "🗼"]].map(([pos, label, emoji]) => (
          <div key={pos} onClick={() => setData(p => ({ ...p, position: pos }))}
            style={{ background: data.position === pos ? C.accentDim : "#1a1a1a", borderRadius: 16, padding: "18px 16px", border: `1.5px solid ${data.position === pos ? C.accent : "#222"}`, cursor: "pointer", transition: "all 0.15s", gridColumn: pos === "C" ? "1 / -1" : "auto" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: data.position === pos ? C.accent : "#fff" }}>{pos}</div>
            <div style={{ fontSize: 11, color: C.dim }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto" }}>
        <button onClick={next} disabled={!data.position} style={{ width: "100%", background: data.position ? C.accent : "#1a1a1a", color: data.position ? "#000" : C.muted, fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: data.position ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>,

    // Step 5 — Level
    <div key="level" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>STEP 5 OF 6</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>How's your<br/>game?</div>
      <div style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>Be honest. Nobody likes a ball hog who can't shoot.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          ["Just for fun", "I play for the love of the game.", "😎"],
          ["Recreational", "I'm solid. I know the game.", "💪"],
          ["Competitive", "I play to win.", "🔥"],
          ["Collegiate", "I play or played at the college level.", "🎓"],
          ["Semi-Pro / Pro", "I've played at a high level.", "👑"]
        ].map(([lvl, desc, emoji]) => (
          <div key={lvl} onClick={() => setData(p => ({ ...p, level: lvl }))}
            style={{ background: data.level === lvl ? C.accentDim : "#1a1a1a", borderRadius: 16, padding: "18px 20px", border: `1.5px solid ${data.level === lvl ? C.accent : "#222"}`, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26 }}>{emoji}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: data.level === lvl ? C.accent : "#fff", marginBottom: 2 }}>{lvl}</div>
              <div style={{ fontSize: 12, color: C.dim }}>{desc}</div>
            </div>
            {data.level === lvl && <div style={{ marginLeft: "auto" }}><Ic.Check c={C.accent} /></div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={next} disabled={!data.level} style={{ width: "100%", background: data.level ? C.accent : "#1a1a1a", color: data.level ? "#000" : C.muted, fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: data.level ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>,

    // Step 6 — Location + Notifications
    <div key="location" style={{ padding: compact ? "48px 24px 30px" : "72px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 32 }}>STEP 6 OF 6</div>
      <div style={{ fontSize: 52, marginBottom: 20 }}>📍</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 10, lineHeight: 1.2 }}>Find runs<br/>near you</div>
      <div style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, maxWidth: 280, marginBottom: 32 }}>Allow location access so we can show you live runs and courts within your area in real time.</div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {[["📍", "Live runs 0.3mi away"], ["🔒", "Private run invites near you"], ["⚡", "Court alerts in real time"]].map(([icon, text]) => (
          <div key={text} style={{ background: C.card, borderRadius: 14, padding: "14px 18px", border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center", textAlign: "left" }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{text}</div>
          </div>
        ))}
      </div>
      <button onClick={() => onComplete(data)} style={{ width: "100%", background: C.accent, color: "#000", fontWeight: 900, fontSize: 15, padding: "16px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 12 }}>Allow Location & Notifications 📍</button>
      <button onClick={() => onComplete(data)} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Skip for now</button>
    </div>,
  ];

  return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif", opacity: animating ? 0 : 1, transition: "opacity 0.2s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input::placeholder{color:#333;}input:focus{border-color:#E8FF47!important;}@keyframes bounceIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
      {step > 0 && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#1a1a1a" }}>
          <div style={{ height: "100%", background: C.accent, width: `${(step / 6) * 100}%`, transition: "width 0.3s" }}/>
        </div>
      )}
      {steps[step]}
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ─────────────────────────────────────────────────────
function NotifPanel({ onClose, notifs, setNotifs }) {
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 1500, display: "flex", alignItems: "flex-start", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0d0d0d", width: "100%", maxWidth: 430, minHeight: "60vh", maxHeight: "90vh", overflowY: "auto", borderRadius: "0 0 28px 28px", border: `1px solid ${C.border}`, borderTop: "none" }}>
        <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "#0d0d0d", zIndex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Notifications</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={markAll} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic.Close /></button>
          </div>
        </div>
        <div style={{ padding: "8px 0" }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              style={{ padding: "14px 20px", display: "flex", gap: 14, alignItems: "flex-start", background: n.read ? "transparent" : `${C.accent}08`, borderBottom: `1px solid #111`, cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: n.read ? "#1a1a1a" : "#1e2e00", border: `1px solid ${n.read ? C.border : "#2a4400"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: n.read ? 600 : 800, color: n.read ? "#aaa" : "#fff", marginBottom: 3 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 5, letterSpacing: 0.5 }}>{n.time}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, flexShrink: 0, marginTop: 4 }}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PARTNER DASHBOARD ────────────────────────────────────────────────────────
function PartnerDashboard({ onClose }) {
  const [activeGym, setActiveGym] = useState(PARTNER_GYMS[0]);
  const [view, setView] = useState("overview");
  const totalRevenue = PARTNER_GYMS.reduce((s, g) => s + g.monthlyFee, 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, zIndex: 1500, overflowY: "auto", maxWidth: 430, margin: "0 auto" }}>
      <style>{`::-webkit-scrollbar{display:none;}`}</style>
      {/* Header */}
      <div style={{ padding: "52px 20px 16px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.bg, zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 4 }}>PARTNER PORTAL</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>The Run <span style={{ color: C.accent }}>for Business</span></div>
          </div>
          <button onClick={onClose} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ic.Close /></button>
        </div>
      </div>

      <div style={{ padding: "20px 16px 80px" }}>
        {/* Revenue overview */}
        <div style={{ background: "linear-gradient(135deg, #0f1a00, #1a2e00)", borderRadius: 22, padding: "22px 20px", marginBottom: 20, border: `1px solid #2a4400` }}>
          <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 16 }}>SAN DIEGO NETWORK · MARCH 2025</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>${totalRevenue.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>Monthly partner revenue</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}><Ic.Trend /><span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>+23% MoM</span></div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.accent, letterSpacing: -1 }}>{PARTNER_GYMS.length}</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>Active gym partners</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>+2 pending approval</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[["955", "Active Users"], ["164", "Runs Hosted"], ["4.7★", "Avg Rating"]].map(([v, l]) => (
              <div key={l} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "12px 0", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 9, color: C.dim, marginTop: 2, letterSpacing: 0.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["overview", "Overview"], ["gyms", "Gyms"], ["runs", "Runs"], ["add", "+ Add Gym"]].map(([v, l]) => (
            <Pill key={v} active={view === v} onClick={() => setView(v)}>{l}</Pill>
          ))}
        </div>

        {view === "overview" && (
          <>
            <SLabel>PARTNER GYMS</SLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {PARTNER_GYMS.map(gym => (
                <div key={gym.id} onClick={() => { setActiveGym(gym); setView("gyms"); }}
                  style={{ background: C.card, borderRadius: 18, padding: "16px 18px", border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: "#1a1a1a", border: `1px solid ${C.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: C.accent }}>{gym.logo}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{gym.name}</div>
                        <div style={{ fontSize: 11, color: C.dim }}>{gym.type} · {gym.courts} courts</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: C.accent }}>${gym.monthlyFee.toLocaleString()}/mo</div>
                      <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "#0d1a00", color: C.green, border: `1px solid #1a3300`, display: "inline-block", marginTop: 4 }}>● ACTIVE</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[[gym.activeUsers, "Users"], [gym.runCount, "Runs"], ["4.6★", "Rating"]].map(([v, l]) => (
                      <div key={l} style={{ background: "#1a1a1a", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{v}</div>
                        <div style={{ fontSize: 9, color: C.dim, letterSpacing: 0.5 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pending gyms */}
            <SLabel>PENDING APPROVAL</SLabel>
            {[{ name: "Chuze Fitness Chula Vista", type: "Gym Chain" }, { name: "Aztec Recreation Center", type: "University" }].map(g => (
              <div key={g.name} style={{ background: C.card, borderRadius: 18, padding: "16px 18px", border: `1px solid ${C.border}`, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa" }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{g.type} · Submitted 2d ago</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ background: "#1a1a1a", color: C.red, fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 100, border: `1px solid #2a2a2a`, cursor: "pointer", fontFamily: "inherit" }}>Deny</button>
                  <button style={{ background: C.accent, color: "#000", fontSize: 11, fontWeight: 800, padding: "7px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Approve</button>
                </div>
              </div>
            ))}
          </>
        )}

        {view === "gyms" && (
          <div>
            <div style={{ background: C.card, borderRadius: 20, padding: "20px", marginBottom: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{activeGym.name}</div>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 16 }}>Partner since {activeGym.joined}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Monthly Revenue", `$${activeGym.monthlyFee.toLocaleString()}`], ["Active Users", activeGym.activeUsers], ["Runs Hosted", activeGym.runCount], ["Courts Listed", activeGym.courts]].map(([l, v]) => (
                  <div key={l} style={{ background: "#1a1a1a", borderRadius: 14, padding: "14px 14px" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.accent, marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 10, color: C.dim, letterSpacing: 0.5 }}>{l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Simple bar chart */}
            <SLabel>WEEKLY ACTIVE USERS</SLabel>
            <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
                {[45, 62, 58, 71, 89, 76, 94].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: i === 6 ? C.accent : "#2a2a2a", height: `${(v / 94) * 70}px`, transition: "height 0.3s" }}/>
                    <div style={{ fontSize: 9, color: C.muted }}>{"SMTWTFS"[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <button style={{ width: "100%", background: C.card, color: C.dim, fontWeight: 700, fontSize: 13, padding: "14px", borderRadius: 14, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit" }}>📧 Send Monthly Report</button>
          </div>
        )}

        {view === "add" && (
          <div>
            <SLabel>LIST YOUR FACILITY</SLabel>
            <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}` }}>
              {[["GYM / COURT NAME", "e.g. Planet Fitness Downtown"], ["CONTACT NAME", "e.g. John Smith"], ["EMAIL", "e.g. john@gym.com"], ["PHONE", "e.g. (619) 555-0100"], ["# OF COURTS", "e.g. 3"]].map(([label, ph]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>{label}</div>
                  <input placeholder={ph} style={{ width: "100%", background: "#1a1a1a", border: `1px solid ${C.border2}`, borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}/>
                </div>
              ))}
              <div style={{ background: "#0d1a00", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: `1px solid #1a3300` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.accent, marginBottom: 4 }}>Partnership Pricing</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>2 courts — $500/mo · 3–5 courts — $900/mo · 6+ courts — $1,500/mo</div>
              </div>
              <button style={{ width: "100%", background: C.accent, color: "#000", fontWeight: 900, fontSize: 14, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Submit Application</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAP TAB ──────────────────────────────────────────────────────────────────
function MapTab({ runs, onJoin, isPremium, setInviteRun }) {
  const compact = useCompact();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [activeCity, setActiveCity] = useState("San Diego");

  useEffect(() => {
    if (window._leafletLoaded) { setMapReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => { window._leafletLoaded = true; setMapReady(true); };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([32.7731, -117.2534], 12);
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19, subdomains: "abcd" }).addTo(map);

    SD_COURTS.forEach(court => {
      const run = runs.find(r => r.courtId === court.id);
      const isLive = run?.status === "live";
      const isSponsored = run?.sponsored;
      const html = `<div style="width:${isLive ? 44 : 30}px;height:${isLive ? 44 : 30}px;border-radius:50%;background:${isSponsored ? "#fff" : isLive ? C.accent : court.partner ? "#1a1a00" : "#181818"};border:2px solid ${isSponsored ? C.accent : isLive ? "#fff" : court.partner ? C.accent : "#333"};display:flex;align-items:center;justify-content:center;font-size:${isLive ? 18 : 13}px;box-shadow:${isLive ? `0 0 20px ${C.accent}88` : "0 2px 8px #0008"};cursor:pointer;">${isSponsored ? "👟" : "🏀"}</div>`;
      const icon = L.divIcon({ html, className: "", iconSize: [isLive ? 44 : 30, isLive ? 44 : 30], iconAnchor: [isLive ? 22 : 15, isLive ? 22 : 15] });
      L.marker([court.lat, court.lng], { icon }).addTo(map).on("click", () => setSelectedCourt({ court, run }));
    });

    navigator.geolocation?.getCurrentPosition(pos => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      const youHtml = `<div style="width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid ${C.accent};box-shadow:0 0 16px ${C.accent}aa;"></div>`;
      L.marker([pos.coords.latitude, pos.coords.longitude], { icon: L.divIcon({ html: youHtml, className: "", iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(map);
    }, () => {});
  }, [mapReady, runs]);

  const filtered = filter === "all" ? runs : filter === "live" ? runs.filter(r => r.status === "live") : filter === "soon" ? runs.filter(r => r.status === "scheduled") : runs.filter(r => r.sponsored);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: compact ? 220 : 280, background: "#0a0a0a" }}>
        {!mapReady && <div style={{ height: compact ? 220 : 280, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}><div style={{ fontSize: compact ? 24 : 28 }}>🏀</div><div style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>LOADING MAP · SAN DIEGO</div></div>}
      </div>

      <div style={{ position: "absolute", top: compact ? 58 : 72, left: 14, zIndex: 500 }}>
        <div style={{ background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)", borderRadius: 100, padding: "7px 14px", fontSize: 11, color: C.accent, fontWeight: 800, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
          <LiveDot size={7} /> {runs.filter(r => r.status === "live").length} LIVE
        </div>
      </div>

      {selectedCourt && (
        <div style={{ position: "absolute", top: compact ? 292 : 352, left: 16, right: 16, zIndex: 600, background: "#111", borderRadius: 20, padding: "16px 18px", border: `1px solid ${selectedCourt.run?.sponsored ? "#fff3" : selectedCourt.run?.status === "live" ? C.accent : C.border}`, boxShadow: "0 8px 32px #000a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{selectedCourt.court.name}</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{selectedCourt.court.neighborhood} · ★ {selectedCourt.court.rating}{selectedCourt.court.partner && <span style={{ color: C.accent }}> · ✓ Partner</span>}</div>
            </div>
            <button onClick={() => setSelectedCourt(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic.Close /></button>
          </div>
          {selectedCourt.run
            ? <div style={{ background: selectedCourt.run.status === "live" ? "#0d1a00" : "#0e0e0e", borderRadius: 12, padding: "10px 14px", border: `1px solid ${selectedCourt.run.status === "live" ? "#1e3300" : C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>{selectedCourt.run.status === "live" ? <div style={{ fontSize: 11, color: C.accent, fontWeight: 800 }}><LiveDot size={7} /> &nbsp;LIVE · {selectedCourt.run.players}/{selectedCourt.run.maxPlayers}</div> : <div style={{ fontSize: 11, color: "#888" }}>⏱ {selectedCourt.run.startTime} · {countdown(selectedCourt.run.scheduledFor)}</div>}</div>
                <button onClick={() => { selectedCourt.run.isInviteOnly && !selectedCourt.run.joined ? setInviteRun(selectedCourt.run) : onJoin(selectedCourt.run.id); setSelectedCourt(null); }}
                  style={{ background: C.accent, color: "#000", fontWeight: 800, fontSize: 12, padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  {selectedCourt.run.joined ? "✓ In" : selectedCourt.run.isInviteOnly ? "🔒 Code" : "JOIN"}
                </button>
              </div>
            : <div style={{ fontSize: 12, color: C.dim }}>No active run · <span style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}>Start one →</span></div>}
        </div>
      )}

      <div style={{ padding: "20px 16px 0" }}>
        {/* Pro city switcher */}
        {isPremium ? (
          <div style={{ marginBottom: 16 }}>
            {!showCitySearch ? (
              <div onClick={() => setShowCitySearch(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{activeCity}</div>
                  <div style={{ fontSize: 10, color: C.dim, letterSpacing: 0.5 }}>TAP TO SEARCH ANY CITY · PRO</div>
                </div>
                <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>Change →</span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input autoFocus value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Search any city..."
                  style={{ flex: 1, background: "#1a1a1a", border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: "12px 16px", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none" }}/>
                <button onClick={() => { if (cityInput) setActiveCity(cityInput); setShowCitySearch(false); setCityInput(""); }}
                  style={{ background: C.accent, color: "#000", fontWeight: 800, fontSize: 13, padding: "12px 18px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Go</button>
              </div>
            )}
            {showCitySearch && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {["New York","Los Angeles","Chicago","Atlanta","Houston","Miami"].map(c => (
                  <button key={c} onClick={() => { setActiveCity(c); setShowCitySearch(false); setCityInput(""); }}
                    style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${C.border2}`, background: "#1a1a1a", color: C.dim, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.border}`, marginBottom: 16, cursor: "default" }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>San Diego, CA</div>
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: 0.5 }}>YOUR CITY</div>
            </div>
            <span style={{ fontSize: 10, background: "#1a1400", color: C.accent, padding: "3px 9px", borderRadius: 100, border: `1px solid ${C.accent}33`, fontWeight: 700 }}>TRAVEL WITH PRO</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
          {[["all", "All"], ["live", "🔥 Live"], ["soon", "⏱ Soon"], ["sponsored", "👟 Nike"]].map(([v, l]) => (
            <Pill key={v} active={filter === v} onClick={() => setFilter(v)}>{l}</Pill>
          ))}
        </div>
        <SLabel right="See all courts →">RUNS NEAR YOU</SLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(r => <RunCard key={r.id} run={r} onJoin={onJoin} onCode={setInviteRun} isPremium={isPremium} />)}
        </div>
      </div>
    </div>
  );
}

// ─── RUNS TAB ─────────────────────────────────────────────────────────────────
function RunsTab({ runs, setRuns, onJoin, isPremium, setInviteRun }) {
  const compact = useCompact();
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState("all");
  const [form, setForm] = useState({ court: "", time: "", date: "", maxPlayers: "16", level: "Mixed", description: "", isInvite: false });

  const handleCreate = () => {
    if (!form.court || !form.time) return;
    const code = form.isInvite ? Math.random().toString(36).substring(2, 8).toUpperCase() : null;
    setRuns(prev => [{
      id: Date.now(), host: "Jay Buckets", hostInitials: "JB", hostRep: 82,
      courtName: form.court, courtId: null, lat: 32.7731, lng: -117.2534,
      status: "scheduled", startTime: form.time, scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 3),
      players: 1, maxPlayers: parseInt(form.maxPlayers), level: form.level,
      description: form.description || "Come hoop.", isInviteOnly: form.isInvite, inviteCode: code,
      joined: true, tags: [form.level, form.isInvite ? "🔒 Private" : "Open Run"], startedAt: null, sponsored: false,
    }, ...prev]);
    setShowCreate(false);
    setForm({ court: "", time: "", date: "", maxPlayers: "16", level: "Mixed", description: "", isInvite: false });
  };

  const display = tab === "all" ? runs : tab === "live" ? runs.filter(r => r.status === "live") : tab === "mine" ? runs.filter(r => r.host === "Jay Buckets") : runs.filter(r => r.joined);

  return (
    <div style={{ padding: compact ? "0 12px 18px" : "0 16px 24px" }}>
      {!showCreate ? (
        <div style={{ background: "linear-gradient(135deg, #111 0%, #0d1a00 100%)", borderRadius: 22, padding: "20px", marginBottom: 20, border: `1px solid #1e3300`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: `${C.accent}08` }}/>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 800, letterSpacing: 1.5, marginBottom: 6 }}>GOT NEXT?</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 14, letterSpacing: -0.5 }}>Drop Your Run</div>
          <button onClick={() => setShowCreate(true)} style={{ background: C.accent, color: "#000", fontWeight: 800, fontSize: 13, padding: "11px 22px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}><Ic.Plus /> Create a Run</button>
        </div>
      ) : (
        <div style={{ background: C.card, borderRadius: 22, padding: "20px", marginBottom: 20, border: `1.5px solid ${C.accent}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>NEW RUN</div>
            <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic.Close /></button>
          </div>
          {[["COURT NAME", "court", "e.g. Balboa Park Courts"], ["DATE", "date", "e.g. Saturday Mar 15"], ["START TIME", "time", "e.g. 6:00 PM"], ["MAX PLAYERS", "maxPlayers", "e.g. 16"]].map(([label, key, ph]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>{label}</div>
              <input placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: "100%", background: "#1a1a1a", border: `1px solid ${C.border2}`, borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}/>
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>RUN LEVEL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Open", "🟢", "All skill levels"],
                ["High School", "🎒", "HS level play"],
                ["College", "🎓", "College level"],
                ["Pro / Semi-Pro", "👑", "High level only"],
              ].map(([l, emoji, sub]) => (
                <div key={l} onClick={() => setForm(p => ({ ...p, level: l }))}
                  style={{ background: form.level === l ? C.accentDim : "#1a1a1a", borderRadius: 12, padding: "12px 14px", border: `1.5px solid ${form.level === l ? C.accent : "#222"}`, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: form.level === l ? C.accent : "#fff" }}>{l}</div>
                  <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>VIBE / RULES</div>
            <textarea placeholder="Winners stay, no soft fouls..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2} style={{ width: "100%", background: "#1a1a1a", border: `1px solid ${C.border2}`, borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none", resize: "none" }}/>
          </div>
          <div onClick={() => isPremium && setForm(p => ({ ...p, isInvite: !p.isInvite }))}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 14, padding: "14px 16px", marginBottom: 16, cursor: isPremium ? "pointer" : "default", border: `1px solid ${form.isInvite ? C.accent + "44" : "#222"}` }}>
            <div>
              <div style={{ fontSize: 13, color: isPremium ? "#fff" : C.dim, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <Ic.Lock c={isPremium ? C.accent : C.muted} /> Invite Only {!isPremium && <span style={{ fontSize: 10, background: "#1a1400", color: C.accent, padding: "2px 8px", borderRadius: 100, border: `1px solid ${C.accent}33` }}>PRO</span>}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{isPremium ? "Generate a private code" : "Upgrade to unlock"}</div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 100, background: form.isInvite ? C.accent : "#2a2a2a", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.isInvite ? 23 : 3, transition: "left 0.2s" }}/>
            </div>
          </div>
          <button onClick={handleCreate} style={{ width: "100%", background: C.accent, color: "#000", fontWeight: 900, fontSize: 14, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>DROP THE RUN 🏀</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
        {[["all", "All"], ["live", `🔥 Live (${runs.filter(r => r.status === "live").length})`], ["joined", "My Runs"], ["mine", "Hosted"]].map(([v, l]) => (
          <Pill key={v} active={tab === v} onClick={() => setTab(v)}>{l}</Pill>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
        {display.map(r => <RunCard key={r.id} run={r} onJoin={onJoin} onCode={setInviteRun} isPremium={isPremium} />)}
      </div>
    </div>
  );
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
function StatsTab({ isPremium, goToProfile }) {
  const compact = useCompact();
  if (!isPremium) return (
    <div style={{ padding: compact ? "28px 20px" : "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: compact ? 44 : 52, marginBottom: 20 }}>📊</div>
      <div style={{ fontSize: compact ? 20 : 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 10 }}>Your Game, Tracked</div>
      <div style={{ fontSize: compact ? 13 : 14, color: C.dim, lineHeight: 1.7, marginBottom: 32, maxWidth: 280 }}>Full stats, game logs, win rate, and badges. Plus find runs in any city and message players — all with Pro.</div>
      <button onClick={goToProfile} style={{ background: C.accent, color: "#000", fontWeight: 800, fontSize: compact ? 13 : 14, padding: compact ? "12px 28px" : "14px 32px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Upgrade · $7.99/mo</button>
      <div style={{ marginTop: compact ? 32 : 40, width: "100%", filter: "blur(5px)", opacity: 0.35, pointerEvents: "none" }}>
        <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>47 Games · 68% W</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["18.4","PTS"],["6.2","AST"],["4.1","REB"]].map(([v, l]) => (
            <div key={l} style={{ background: C.card, borderRadius: 14, padding: "16px 0", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 10, color: C.dim }}>{l}/GAME</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: compact ? "0 12px 18px" : "0 16px 24px" }}>
      <div style={{ background: "linear-gradient(135deg, #0f1a00, #1a2e00)", borderRadius: 24, padding: compact ? "20px 16px" : "24px 20px", marginBottom: 20, border: `1px solid #2a4400` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, fontWeight: 800, marginBottom: 6 }}>2025 SEASON</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>{STATS_DATA.gamesPlayed} Games</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>🔥 {STATS_DATA.streak}-game win streak</div>
          </div>
          <div style={{ background: C.accent, borderRadius: 16, padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#000", letterSpacing: 1 }}>WIN RATE</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#000" }}>{STATS_DATA.winRate}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["PTS", STATS_DATA.points], ["AST", STATS_DATA.assists], ["REB", STATS_DATA.rebounds]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: "14px 0", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: 1, marginTop: 2 }}>{l}/GAME</div>
            </div>
          ))}
        </div>
      </div>
      <SLabel>BADGES</SLabel>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
        {STATS_DATA.badges.map(b => <div key={b} style={{ background: C.card, borderRadius: 14, padding: "10px 14px", border: `1px solid ${C.border}`, fontSize: 12, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{b}</div>)}
      </div>
      <SLabel>RECENT GAMES</SLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STATS_DATA.recentGames.map((g, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 16, padding: "14px 18px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: g.result === "W" ? "#0d1a00" : "#1a0000", border: `1.5px solid ${g.result === "W" ? C.accent : C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: g.result === "W" ? C.accent : C.red, flexShrink: 0 }}>{g.result}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{g.court}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{g.date}</div>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {[["PTS",g.pts],["AST",g.ast],["REB",g.reb]].map(([l,v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: 9, color: C.dim, letterSpacing: 0.5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ isPremium, setIsPremium, user, setShowPartner }) {
  const compact = useCompact();
  return (
    <div style={{ padding: compact ? "0 12px 18px" : "0 16px 24px" }}>
      <div style={{ background: "linear-gradient(160deg, #111 0%, #0d1a00 100%)", borderRadius: 24, padding: "28px 24px", marginBottom: 20, border: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ position: "relative", width: compact ? 70 : 80, margin: compact ? "0 auto 12px" : "0 auto 14px" }}>
          <Avatar initials={user.initials} size={compact ? 70 : 80} />
          {isPremium && <div style={{ position: "absolute", bottom: 0, right: 0, background: C.accent, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}`, fontSize: compact ? 10 : 12 }}>✦</div>}
        </div>
        <div style={{ fontSize: compact ? 20 : 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 2 }}>{user.name}</div>
        {isPremium && <div style={{ fontSize: compact ? 10 : 11, color: C.accent, fontWeight: 800, letterSpacing: 1.5, marginBottom: 6 }}>✦ THE RUN PRO</div>}
        <div style={{ fontSize: compact ? 11 : 12, color: C.dim, marginBottom: 6 }}>San Diego, CA · {user.position} · {user.level}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {["🔥 On Fire", "💪 Consistent", "🎯 Scorer"].map(b => <span key={b} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 100, background: "#1a1a1a", color: C.accent, border: `1px solid #2a2a2a` }}>{b}</span>)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[["Games", "47"], ["Win Rate", "68%"], ["Home Court", "Balboa Park"], ["Rep Score", "94"]].map(([l, v]) => (
          <div key={l} style={{ background: C.card, borderRadius: 18, padding: "18px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.accent, marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 0.5 }}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {!isPremium ? (
        <div style={{ background: `linear-gradient(135deg, ${C.accent}, #c8e800)`, borderRadius: 24, padding: "22px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#000", letterSpacing: 2, marginBottom: 6 }}>THE RUN PRO</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#000", marginBottom: 10, letterSpacing: -0.5 }}>Hoop anywhere</div>
          <div style={{ fontSize: 12, color: "#333", lineHeight: 1.9, marginBottom: 14 }}>
            ✓ Find runs in any city — travel ready<br/>
            ✓ Message players directly<br/>
            ✓ Invite-only private runs with codes<br/>
            ✓ Verified Hooper badge<br/>
            ✓ Full stats & game history
          </div>
          <button onClick={() => setIsPremium(true)} style={{ background: "#000", color: C.accent, fontWeight: 800, fontSize: 13, padding: "12px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Upgrade · $7.99/mo</button>
        </div>
      ) : (
        <div style={{ background: "#111", borderRadius: 20, padding: "16px 20px", marginBottom: 20, border: `1px solid ${C.accent}33`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 26 }}>✦</div>
          <div><div style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>The Run Pro — Active</div><div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>All features unlocked · $7.99/mo</div></div>
          <button onClick={() => setIsPremium(false)} style={{ marginLeft: "auto", background: "none", border: `1px solid #333`, color: C.dim, fontSize: 11, padding: "6px 12px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit" }}>Manage</button>
        </div>
      )}

      {/* Partner portal entry */}
      <div onClick={() => setShowPartner(true)} style={{ background: C.card, borderRadius: 18, padding: "16px 18px", marginBottom: 20, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 2 }}>🏢 Partner Portal</div>
          <div style={{ fontSize: 11, color: C.dim }}>Gym & court partnerships · Revenue dashboard</div>
        </div>
        <Ic.Arrow c={C.accent} />
      </div>

      <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {["Edit Profile", "My Courts", "Notifications", "Privacy", "Invite Friends", "Help", "Sign Out"].map((item, i, arr) => (
          <div key={item} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid #141414` : "none", cursor: "pointer" }}>
            <span style={{ fontSize: 14, color: item === "Sign Out" ? C.red : "#aaa" }}>{item}</span>
            {item !== "Sign Out" && <Ic.Arrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COURTS TAB ──────────────────────────────────────────────────────────────
function CourtsTab({ runs, onJoin }) {
  const compact = useCompact();
  return (
    <div style={{ padding: compact ? "0 12px 18px" : "0 16px 24px" }}>
      <SLabel>SAN DIEGO COURTS & GYMS</SLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SD_COURTS.map(c => {
          const run = runs.find(r => r.courtId === c.id);
          return (
            <div key={c.id} style={{ background: C.card, borderRadius: 20, padding: "18px 20px", border: `1px solid ${run ? C.accent + "44" : C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{c.name}</span>
                    {c.indoor && <span style={{ fontSize: 9, background: "#1a1a1a", color: C.dim, padding: "2px 7px", borderRadius: 100, border: `1px solid #222` }}>INDOOR</span>}
                    {c.partner && <span style={{ fontSize: 9, background: "#1a2e00", color: C.accent, padding: "2px 7px", borderRadius: 100, border: `1px solid #2a4400` }}>✓ PARTNER</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.dim }}>{c.neighborhood}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>★ {c.rating}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{c.checkins} check-ins</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: run ? 12 : 0 }}>
                {[`${c.hoops} hoops`, c.surface, c.lighting ? "💡 Night lit" : "No lights"].map((t, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 100, background: "#1a1a1a", color: C.dim, border: `1px solid #222` }}>{t}</span>
                ))}
              </div>
              {run && (
                <div style={{ background: run.status === "live" ? "#0d1a00" : "#0e0e0e", borderRadius: 12, padding: "10px 14px", border: `1px solid ${run.status === "live" ? "#1e3300" : C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {run.status === "live" ? <div style={{ fontSize: 11, color: C.accent, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}><LiveDot size={7} /> LIVE · {run.players}/{run.maxPlayers}</div>
                      : <div style={{ fontSize: 11, color: "#888" }}>⏱ {run.startTime} · {countdown(run.scheduledFor)}</div>}
                  </div>
                  <button onClick={() => onJoin(run.id)} style={{ background: run.joined ? "#1a1a1a" : C.accent, color: run.joined ? C.accent : "#000", fontWeight: 800, fontSize: 12, padding: "8px 16px", borderRadius: 100, border: run.joined ? `1px solid ${C.accent}33` : "none", cursor: "pointer", fontFamily: "inherit" }}>
                    {run.joined ? "✓ IN" : "JOIN"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "map", label: "Find", icon: (a) => <Ic.Search c={a ? C.accent : C.muted} /> },
  { id: "runs", label: "Runs", icon: (a) => <Ic.Users c={a ? C.accent : C.muted} /> },
  { id: "courts", label: "Courts", icon: (a) => <Ic.Map c={a ? C.accent : C.muted} /> },
  { id: "stats", label: "Stats", icon: (a) => <Ic.Bar c={a ? C.accent : C.muted} /> },
  { id: "profile", label: "Me", icon: (a) => <Ic.User c={a ? C.accent : C.muted} /> },
];

export default function TheRun() {
  const compact = useCompact();
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState({ name: "Jay Buckets", initials: "JB", position: "PG", level: "Competitive", city: "San Diego" });
  const [tab, setTab] = useState("map");
  const [runs, setRuns] = useState(INITIAL_RUNS);
  const [isPremium, setIsPremium] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [showPartner, setShowPartner] = useState(false);
  const [inviteRun, setInviteRun] = useState(null);

  const unread = notifs.filter(n => !n.read).length;

  const handleJoin = (id) => setRuns(prev => prev.map(r => r.id === id ? { ...r, joined: !r.joined, players: r.joined ? r.players - 1 : r.players + 1 } : r));

  const handleOnboardComplete = (data) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim() || "Jay Buckets";
    const initials = `${data.firstName?.[0] || "J"}${data.lastName?.[0] || "B"}`.toUpperCase();
    setUser({ name: fullName, initials, position: data.position || "PG", level: data.level || "Competitive", city: data.city || "San Diego" });
    setOnboarded(true);
  };

  if (!onboarded) return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800;9..40,900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}`}</style>
      <Onboarding onComplete={handleOnboardComplete} />
    </div>
  );

  const tabLabels = { map: "FIND YOUR GAME", runs: "UPCOMING RUNS", courts: "SAN DIEGO COURTS", stats: "YOUR STATS", profile: "YOUR PROFILE" };

  return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        @keyframes ping{75%,100%{transform:scale(2.2);opacity:0;}}
        input::placeholder,textarea::placeholder{color:#333;}
        input:focus,textarea:focus{border-color:#E8FF47!important;}
        button:active{opacity:0.82;}
      `}</style>

      {/* Status */}
      <div style={{ padding: compact ? "10px 16px 0" : "14px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: compact ? 11 : 12, fontWeight: 700, color: "#444" }}>9:41</span>
        <span style={{ fontSize: compact ? 10 : 11, color: "#222" }}>●●●</span>
      </div>

      {/* Header */}
      <div style={{ padding: compact ? "6px 16px 14px" : "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: compact ? 22 : 26, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
            THE <span style={{ color: C.accent }}>RUN</span>
            {isPremium && <span style={{ fontSize: compact ? 10 : 11, color: C.accent, fontWeight: 800, marginLeft: 8, letterSpacing: 1.5 }}>PRO</span>}
          </div>
          <div style={{ fontSize: compact ? 9 : 10, color: C.muted, letterSpacing: 2, marginTop: 1 }}>{tabLabels[tab]}</div>
        </div>
        <div style={{ display: "flex", gap: compact ? 8 : 10, alignItems: "center" }}>
          <button onClick={() => setShowNotifs(true)} style={{ position: "relative", width: compact ? 34 : 40, height: compact ? 34 : 40, borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Ic.Bell c={unread > 0 ? C.accent : "#555"} />
            {unread > 0 && <div style={{ position: "absolute", top: 1, right: 1, width: 16, height: 16, borderRadius: "50%", background: C.accent, border: `2px solid ${C.bg}`, fontSize: 9, fontWeight: 900, color: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</div>}
          </button>
          <Avatar initials={user.initials} size={compact ? 34 : 40} />
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingBottom: 88, overflowY: "auto" }}>
        {tab === "map" && <MapTab runs={runs} onJoin={handleJoin} isPremium={isPremium} setInviteRun={setInviteRun} />}
        {tab === "runs" && <RunsTab runs={runs} setRuns={setRuns} onJoin={handleJoin} isPremium={isPremium} setInviteRun={setInviteRun} />}
        {tab === "courts" && <CourtsTab runs={runs} onJoin={handleJoin} />}
        {tab === "stats" && <StatsTab isPremium={isPremium} goToProfile={() => setTab("profile")} />}
        {tab === "profile" && <ProfileTab isPremium={isPremium} setIsPremium={setIsPremium} user={user} setShowPartner={setShowPartner} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(8,8,8,0.97)", backdropFilter: "blur(24px)", borderTop: `1px solid #161616`, padding: compact ? "8px 0 16px" : "10px 0 22px", display: "flex", justifyContent: "space-around", zIndex: 200 }}>
        {NAV.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "4px 14px", fontFamily: "inherit", position: "relative" }}>
            {icon(tab === id)}
            <span style={{ fontSize: 9, fontWeight: 800, color: tab === id ? C.accent : "#333", letterSpacing: 1 }}>{label.toUpperCase()}</span>
            {tab === id && <div style={{ position: "absolute", bottom: -6, width: 4, height: 4, borderRadius: "50%", background: C.accent }}/>}
          </button>
        ))}
      </div>

      {/* Overlays */}
      {showNotifs && <NotifPanel onClose={() => setShowNotifs(false)} notifs={notifs} setNotifs={setNotifs} />}
      {showPartner && <PartnerDashboard onClose={() => setShowPartner(false)} />}
      {inviteRun && <InviteModal run={inviteRun} onClose={() => setInviteRun(null)} onJoin={handleJoin} />}
    </div>
  );
}
