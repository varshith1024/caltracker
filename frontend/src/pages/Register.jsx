import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm]       = useState({ username: "", password: "", confirm: "" });
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handle = async () => {
    setErr("");
    if (!form.username || !form.password || !form.confirm)
      return setErr("All fields are required");
    if (form.password !== form.confirm)
      return setErr("Passwords do not match");
    if (form.password.length < 6)
      return setErr("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register(form.username, form.password);
      navigate("/setup");
    } catch (e) {
      setErr(e.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#13103a] to-slate-900
                    flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-3xl mx-auto mb-3">🥗</div>
          <h1 className="text-white text-3xl font-black">CalTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
          {[
            { label: "Username",         key: "username", type: "text",     ph: "choose_username" },
            { label: "Password",         key: "password", type: "password", ph: "min 6 characters" },
            { label: "Confirm Password", key: "confirm",  type: "password", ph: "repeat password"  },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.ph}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handle()}
                className="w-full mt-1.5 px-4 py-3 bg-slate-700 border border-slate-600
                           rounded-xl text-white text-sm outline-none placeholder-slate-500
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          ))}

          {err && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20
                            rounded-xl text-red-300 text-sm">
              ⚠️ {err}
            </div>
          )}

          <button
            onClick={handle}
            disabled={loading}
            className="w-full py-3 mt-1 bg-gradient-to-r from-indigo-500 to-purple-600
                       rounded-xl text-white font-black text-base
                       hover:-translate-y-0.5 active:scale-95 transition-all
                       duration-150 disabled:opacity-60">
            {loading ? "Creating…" : "Create Account →"}
          </button>
        </div>

        <p className="text-center text-slate-600 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}