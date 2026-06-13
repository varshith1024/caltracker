import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HistoryTab({ goal }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/logs/history")
      .then(res => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="text-indigo-400 text-sm">Loading history…</div>
    </div>
  );

  return (
    <div className="fade-up space-y-4">
      <div>
        <h2 className="text-white font-black text-xl">📅 History</h2>
        <p className="text-slate-500 text-sm mt-1">Last 30 days</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-slate-700">
          <div className="text-5xl mb-3">📭</div>
          <div>No history yet — start logging today!</div>
        </div>
      ) : history.map(log => {
        const pct = Math.min(log.totalCalories / goal, 1);
        const color = pct < 0.7 ? "#f87171" : pct < 0.9 ? "#facc15" : "#4ade80";
        const textColor = pct < 0.7 ? "text-red-400" : pct < 0.9 ? "text-yellow-400" : "text-green-400";
        return (
          <div key={log.date}
            className="bg-white/4 border border-white/8 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-white font-bold text-sm">{log.date}</div>
                <div className="text-slate-600 text-xs mt-0.5">
                  {log.entries.length} items logged
                </div>
              </div>
              <div className="text-right">
                <div className={`${textColor} font-black text-base`}>{log.totalCalories}</div>
                <div className="text-slate-600 text-xs">of {goal} kcal</div>
              </div>
            </div>
            <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct * 100}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}