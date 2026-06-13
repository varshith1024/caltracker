import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async () => {
    setErr(""); setLoading(true);
    try {
      const data = await login(form.username, form.password);
      nav(data.profileComplete ? "/" : "/setup");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-[#13103a] to-dark-900
                    flex items-center justify-center p-4">
      <div className="pop w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-3xl mx-auto mb-3">🥗</div>
          <h1 className="text-white text-3xl font-black">CalTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Track. Eat well. Feel great.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-5">Sign In</h2>

          <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Username</label>
          <input
  className="w-full mt-1.5 mb-4 px-4 py-3 bg-slate-800 border border-slate-600
             rounded-xl text-white text-sm outline-none placeholder-slate-500
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  placeholder="your_username"
  value={form.username}
  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
  onKeyDown={e => e.key === "Enter" && handle()}
/>

          <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Password</label>
          <input
  type="password"
  className="w-full mt-1.5 mb-5 px-4 py-3 bg-slate-800 border border-slate-600
             rounded-xl text-white text-sm outline-none placeholder-slate-500
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  placeholder="••••••••"
  value={form.password}
  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
  onKeyDown={e => e.key === "Enter" && handle()}
/>

          {err && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20
                            rounded-xl text-red-300 text-sm">⚠️ {err}</div>
          )}

          <button
            onClick={handle} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                       rounded-xl text-white font-black text-base
                       hover:-translate-y-0.5 active:scale-95
                       transition-all duration-150 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>

        <p className="text-center text-slate-600 text-sm mt-5">
          No account?{" "}
          <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}