import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Setup     from "./pages/Setup";
import Dashboard from "./pages/Dashboard";

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3">🥗</div>
        <div className="text-indigo-400 text-sm">Loading...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (!user.profileComplete) return <Navigate to="/setup" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup"    element={<Setup />} />
          <Route path="/*"        element={<Guard><Dashboard /></Guard>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}