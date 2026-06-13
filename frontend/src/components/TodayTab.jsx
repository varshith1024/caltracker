import { useState, useRef, useEffect } from "react";
import { FOOD_DB, todayStr } from "../data/foodData";
import Ring from "./Ring";
import api  from "../api/axios";

export default function TodayTab({ goal, log, setLog, onNeedMore }) {
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [grams, setGrams]     = useState("");
  const [drop, setDrop]       = useState(false);
  const [toast, setToast]     = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const entries  = log?.entries || [];
  const consumed = entries.reduce((a, b) => a + b.calories, 0);
  const remaining = goal - consumed;
  

  const statusColor = remaining > 300 ? "text-red-400" : remaining > 0 ? "text-yellow-400" : "text-green-400";
  const statusMsg   = remaining > 400 ? `Need ${remaining} more kcal 🍽️`
    : remaining > 0 ? `Almost there — ${remaining} kcal to go 💪`
    : consumed === goal ? "Goal reached! 🎉"
    : `${Math.abs(remaining)} kcal over goal`;

  const filtered = FOOD_DB.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()));
  const preview  = selected && grams
    ? Math.round((selected.calories / 100) * Number(grams)) : null;

  const showToast = (msg) => {
    setToast(msg); setTimeout(() => setToast(""), 2500);
  };

  const addEntry = async () => {
    if (!selected || !grams) return showToast("Pick a food and enter weight!");
    const calories = Math.round((selected.calories / 100) * Number(grams));
    setLoading(true);
    try {
      const res = await api.post("/logs/entry", {
        foodName: selected.name, emoji: selected.emoji,
        grams: Number(grams), calories
      });
      setLog(res.data);
      setSelected(null); setGrams(""); setSearch(""); setDrop(false);
      showToast(`${selected.emoji} ${selected.name} added!`);
    } catch { showToast("Failed to add. Try again."); }
    finally { setLoading(false); }
  };

  const removeEntry = async (entryId) => {
    try {
      const res = await api.delete(`/logs/entry/${entryId}?date=${todayStr()}`);
      setLog(res.data);
    } catch { showToast("Failed to remove."); }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="fade-up space-y-4">
      {/* Toast */}
      {toast && (
        <div className="toast fixed top-5 left-1/2 -translate-x-1/2
                        bg-gradient-to-r from-green-400 to-emerald-500
                        text-green-950 px-5 py-2.5 rounded-full font-bold
                        text-sm z-50 shadow-lg shadow-green-500/30 whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Goal",    value: goal,              color: "text-indigo-400" },
          { label: "Eaten",   value: consumed,           color: "text-green-400"  },
          { label: remaining >= 0 ? "Left" : "Over",
                              value: Math.abs(remaining), color: remaining > 300 ? "text-red-400" : remaining > 0 ? "text-yellow-400" : "text-green-400" },
        ].map(s => (
          <div key={s.label}
            className="bg-white/4 border border-white/8 rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1">
              {s.label}
            </div>
            <div className={`${s.color} text-xl sm:text-2xl font-black`}>{s.value}</div>
            <div className="text-slate-700 text-[10px]">kcal</div>
          </div>
        ))}
      </div>

      {/* Ring + status */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 sm:p-5
                      flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <Ring consumed={consumed} goal={goal} />
        <div className="flex-1 min-w-0">
          <div className={`${statusColor} font-black text-sm sm:text-base mb-3 leading-snug`}>
            {statusMsg}
          </div>
          <div className="bg-white/4 rounded-xl p-3 text-xs space-y-1">
            <div className="text-slate-600 font-bold uppercase tracking-wider text-[10px] mb-1">
              Goal Info
            </div>
            <div className="text-slate-400">
              Daily goal: <span className="text-indigo-400 font-bold">{goal} kcal</span>
            </div>
          </div>
          {remaining > 300 && (
            <button onClick={onNeedMore}
              className="mt-3 px-4 py-1.5 bg-indigo-500/15 border border-indigo-500/30
                         rounded-full text-indigo-400 text-xs font-bold hover:bg-indigo-500/25
                         transition-colors">
              See filling foods →
            </button>
          )}
        </div>
      </div>

      {/* Add Food */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 sm:p-5">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
          ➕ Log Food
        </div>

        {/* Search */}
        <div ref={ref} className="relative mb-3">
          <input
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl
                       text-white text-sm outline-none placeholder-slate-700
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="🔍 Search food name…"
            value={search}
            onChange={e => { setSearch(e.target.value); setDrop(true); if (!e.target.value) setSelected(null); }}
            onFocus={() => setDrop(true)}
          />
          {drop && search && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900
                            border border-white/8 rounded-xl z-40 max-h-48 overflow-y-auto
                            shadow-xl shadow-black/50">
              {filtered.length === 0
                ? <div className="p-4 text-slate-500 text-sm text-center">No food found</div>
                : filtered.map(f => (
                  <button key={f.name}
                    onClick={() => { setSelected(f); setSearch(f.name); setDrop(false); setGrams(""); }}
                    className="w-full px-4 py-2.5 flex justify-between items-center
                               border-b border-white/5 last:border-0
                               hover:bg-indigo-500/15 transition-colors text-left">
                    <span className="text-sm text-white">{f.emoji} {f.name}</span>
                    <div className="text-green-400 font-bold text-sm">
                    {f.calories} kcal
                  </div>

                  <div className="text-[10px] sm:text-xs text-slate-400">
                    P:{f.protein}g | C:{f.carbs}g | F:{f.fat}g
                  </div>

                  <div className="text-[10px] text-slate-500">
  {f.servingSize
    ? `${f.servingCalories} kcal • ${f.servingSize}`
    : "per 100g"}
</div>
                  </button>
                ))
              }
            </div>
          )}
        </div>

        {/* Weight input */}
        {selected && (
          <div className="fade-up">
            <div className="flex justify-between items-center bg-indigo-500/10
                            border border-indigo-500/20 rounded-xl p-3 mb-3">
              <div>
                <div className="text-white font-bold text-sm">{selected.emoji} {selected.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">
  {selected.servingSize
    ? `${selected.servingCalories} kcal • ${selected.servingSize}`
    : `${selected.calories} kcal per 100g`}
</div>

<div className="text-slate-400 text-xs">
  P:{selected.protein}g • C:{selected.carbs}g • F:{selected.fat}g
</div>
              </div>
              {preview && (
                <div className="text-right">
                  <div className="text-green-400 font-black text-xl">{preview}</div>
                  <div className="text-slate-600 text-xs">kcal</div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Weight (grams)
                </label>
                <input type="number"
                  className="w-full mt-1.5 px-4 py-3 bg-slate-800 border border-slate-600
                             rounded-xl text-white text-sm outline-none
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. 150"
                  value={grams}
                  onChange={e => setGrams(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEntry()}
                />
              </div>
              <button onClick={addEntry} disabled={loading}
                className="mt-7 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                           rounded-xl text-white font-black text-sm
                           hover:-translate-y-0.5 active:scale-95 transition-all
                           disabled:opacity-60 whitespace-nowrap">
                {loading ? "…" : "Add →"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Today's Log */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 sm:p-5">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
          📋 Today — {todayStr()}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-700">
            <div className="text-4xl mb-2">🍽️</div>
            <div className="text-sm">Nothing logged yet. Start above!</div>
          </div>
        ) : (
          <>
            {entries.map(e => (
              <div key={e._id}
                className="group flex justify-between items-center py-2.5 px-2
                           rounded-xl hover:bg-white/4 transition-colors
                           border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{e.emoji}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{e.foodName}</div>
                    <div className="text-slate-600 text-xs">{e.grams}g</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-black text-sm">{e.calories} kcal</span>
                  <button onClick={() => removeEntry(e._id)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-1
                               bg-red-500/15 rounded-lg text-red-400 text-xs
                               hover:bg-red-500/25 transition-all">✕</button>
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-white/8 flex justify-between items-center">
              <span className="text-slate-500 text-sm font-bold">Total</span>
              <span className="text-white font-black text-lg">
                {consumed} <span className="text-slate-600 text-xs font-normal">kcal</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}