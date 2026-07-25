import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdvancedFeatures from "./pages/AdvancedFeatures";

function App() {
  const [notifTrigger, setNotifTrigger] = useState(0);

  const handleRefreshNotifs = () => {
    setNotifTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar refreshTrigger={notifTrigger} />
                <Dashboard triggerNotificationRefresh={handleRefreshNotifs} />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced"
          element={
            <ProtectedRoute>
              <>
                <Navbar refreshTrigger={notifTrigger} />
                <AdvancedFeatures triggerNotificationRefresh={handleRefreshNotifs} />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;