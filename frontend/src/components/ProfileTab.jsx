import { useAuth } from "../context/AuthContext";

export default function ProfileTab({ goal, historyCount, daysHit }) {
  const { user, logout } = useAuth();
  const p = user?.profile;

  const items = [
    { label: "Name",   value: p?.name },
    { label: "Age",    value: `${p?.age} years` },
    { label: "Weight", value: `${p?.weight} kg` },
    { label: "Height", value: `${p?.heightCm} cm` },
    { label: "Gender", value: p?.gender?.charAt(0).toUpperCase() + p?.gender?.slice(1) },
    { label: "Daily Goal", value: `${goal} kcal/day` },
  ];

  return (
    <div className="fade-up space-y-4">
      <div>
        <h2 className="text-white font-black text-xl">👤 Profile</h2>
        <p className="text-slate-500 text-sm mt-1">@{user?.username}</p>
      </div>

      <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map(r => (
            <div key={r.label}
              className="bg-white/3 rounded-xl p-3">
              <div className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                {r.label}
              </div>
              <div className="text-white font-black text-sm sm:text-base">{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
          📊 Stats
        </div>
        {[
          { label: "Days logged",       value: historyCount, color: "text-white" },
          { label: "Days hitting goal", value: daysHit,      color: "text-green-400" },
        ].map(s => (
          <div key={s.label}
            className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-slate-400 text-sm">{s.label}</span>
            <span className={`${s.color} font-black text-sm`}>{s.value}</span>
          </div>
        ))}
      </div>

      <button onClick={logout}
        className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl
                   text-red-400 font-black text-sm hover:bg-red-500/20 transition-colors">
        Sign Out
      </button>
    </div>
  );
}