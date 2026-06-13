import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "today",   icon: "📊", label: "Today"   },
  { key: "foods",   icon: "🍽️", label: "Foods"   },
  { key: "history", icon: "📅", label: "History" },
  { key: "profile", icon: "👤", label: "Profile" },
];

export default function Navbar({ tab, setTab }) {
  const { user } = useAuth();

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl
                      border-b border-white/6 px-4 py-3
                      flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-base">🥗</div>
          <div>
            <div className="text-white font-black text-sm leading-none">CalTrack</div>
            <div className="text-slate-600 text-xs leading-none mt-0.5">
              Hey {user?.profile?.name} 👋
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50
                      bg-dark-900/95 backdrop-blur-xl border-t border-white/6
                      flex sm:hidden">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors
              ${tab === t.key ? "text-indigo-400" : "text-slate-600 hover:text-slate-400"}`}>
            <span className="text-lg">{t.icon}</span>
            <span className="text-[10px] font-bold">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Top tab bar (desktop) */}
      <div className="hidden sm:flex border-b border-white/6 px-4 bg-dark-900/60 backdrop-blur">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all
              ${tab === t.key
                ? "text-indigo-400 border-indigo-500"
                : "text-slate-600 border-transparent hover:text-white"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </>
  );
}