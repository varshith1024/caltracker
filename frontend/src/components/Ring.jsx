export default function Ring({ consumed, goal }) {
  const pct   = Math.min(consumed / goal, 1);
  const r     = 52;
  const circ  = 2 * Math.PI * r;
  const color = pct < 0.5 ? "#f87171" : pct < 0.85 ? "#facc15" : "#4ade80";

  return (
    <svg width="136" height="136" viewBox="0 0 136 136" className="shrink-0">
      <circle cx="68" cy="68" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
      <circle cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 68 68)"
        style={{ transition: "stroke-dasharray 0.7s ease, stroke 0.3s" }} />
      <text x="68" y="62" textAnchor="middle" fill="white"
        fontSize="20" fontWeight="800" fontFamily="Inter,sans-serif">
        {Math.round(pct * 100)}%
      </text>
      <text x="68" y="80" textAnchor="middle" fill="#64748b"
        fontSize="11" fontFamily="Inter,sans-serif">of goal</text>
    </svg>
  );
}