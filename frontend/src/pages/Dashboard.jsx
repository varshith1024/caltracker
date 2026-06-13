import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar     from "../components/Navbar";
import TodayTab   from "../components/TodayTab";
import FoodsTab   from "../components/FoodsTab";
import HistoryTab from "../components/HistoryTab";
import ProfileTab from "../components/ProfileTab";
import { todayStr } from "../data/foodData";
import api from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab]       = useState("today");
  const [log, setLog]       = useState(null);
  const [history, setHistory] = useState([]);
  const goal = user?.profile?.goal || 1800;

  useEffect(() => {
    api.get(`/logs?date=${todayStr()}`).then(r => setLog(r.data));
    api.get("/logs/history").then(r => setHistory(r.data));
  }, []);

  const daysHit = history.filter(l => l.totalCalories >= goal * 0.9).length;

  // When "Log" tapped from FoodsTab, jump to today with food pre-filled
  const handleFoodSelect = () => setTab("today");

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-[#13103a] to-dark-900">
      <Navbar tab={tab} setTab={setTab} />

      {/* Page content — extra bottom padding on mobile for fixed nav */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-24 sm:pb-6">
        {tab === "today" && (
          <TodayTab
            goal={goal}
            log={log}
            setLog={setLog}
            onNeedMore={() => setTab("foods")}
          />
        )}
        {tab === "foods" && (
          <FoodsTab onSelect={handleFoodSelect} />
        )}
        {tab === "history" && (
          <HistoryTab goal={goal} />
        )}
        {tab === "profile" && (
          <ProfileTab
            goal={goal}
            historyCount={history.length}
            daysHit={daysHit}
          />
        )}
      </div>
    </div>
  );
}