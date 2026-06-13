import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ftToCm } from "../data/foodData";
import api from "../api/axios";

export default function Setup() {
  const [form, setForm] = useState({
    name: "", age: "", weight: "",
    heightFt: "5", heightIn: "4", gender: "female"
  });
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();
  const nav = useNavigate();

  const handle = async () => {
    if (!form.name || !form.age || !form.weight)
      return setErr("Please fill all fields");
    setLoading(true);
    try {
      const heightCm = ftToCm(form.heightFt, form.heightIn);
      const res = await api.put("/profile", {
        name: form.name, age: Number(form.age),
        weight: Number(form.weight), heightCm,
        gender: form.gender
      });
      updateProfile(res.data);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save profile");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-[#13103a] to-dark-900
                    flex items-center justify-center p-4">
      <div className="fade-up w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">👤</div>
          <h2 className="text-white text-2xl font-black">Set up your profile</h2>
          <p className="text-slate-500 text-sm mt-1">We'll calculate your personal goal</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {/* Name, Age, Weight */}
          {[
            { label: "Full Name",     key: "name",   type: "text",   ph: "e.g. Name" },
            { label: "Age",           key: "age",    type: "number", ph: "e.g. 22" },
            { label: "Weight (kg)",   key: "weight", type: "number", ph: "e.g. 50" },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">{f.label}</label>
              <input
                type={f.type}
                className="w-full mt-1.5 px-4 py-3 bg-slate-800 border border-slate-600
                           rounded-xl text-white text-sm outline-none
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder={f.ph}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}

          {/* Height */}
          <div className="mb-4">
            <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Height</label>
            <div className="flex gap-3 mt-1.5">
              <select value={form.heightFt}
                onChange={e => setForm(p => ({ ...p, heightFt: e.target.value }))}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600
                           rounded-xl text-white text-sm outline-none focus:border-indigo-500">
                {[4,5,6,7].map(v =>
                  <option key={v} value={v} className="bg-slate-800">{v} ft</option>)}
              </select>
              <select value={form.heightIn}
                onChange={e => setForm(p => ({ ...p, heightIn: e.target.value }))}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600
                           rounded-xl text-white text-sm outline-none focus:border-indigo-500">
                {[...Array(12).keys()].map(v =>
                  <option key={v} value={v} className="bg-slate-800">{v} in</option>)}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gender</label>
            <div className="flex gap-3 mt-1.5">
              {[{ v: "female", icon: "👩" }, { v: "male", icon: "👨" }].map(g => (
                <button key={g.v}
                  onClick={() => setForm(p => ({ ...p, gender: g.v }))}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all
                    ${form.gender === g.v
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-400"
                      : "border-slate-600 bg-white/3 text-slate-500 hover:text-white"}`}>
                  {g.icon} {g.v.charAt(0).toUpperCase() + g.v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {err && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20
                            rounded-xl text-red-300 text-sm">⚠️ {err}</div>
          )}

          <button onClick={handle} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                       rounded-xl text-white font-black text-base
                       hover:-translate-y-0.5 active:scale-95 transition-all
                       duration-150 disabled:opacity-60">
            {loading ? "Saving…" : "Start Tracking 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}