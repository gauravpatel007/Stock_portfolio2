import { useState, useEffect, useRef } from "react";
import { LogOut, Bell, CheckCheck, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import UserProfileModal from "../Profile/UserProfileModal";

function Navbar({ refreshTrigger }) {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token, refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <>
      <header className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-blue-100/50 dark:border-slate-700/50 shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Investment Portfolio
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your investments with confidence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all cursor-pointer text-slate-700 dark:text-slate-200 shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Notification Bell Center */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer text-blue-700 dark:text-blue-300 shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">
                        No notifications yet. Price & rebalance alerts will appear here!
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3 rounded-xl text-sm border transition ${
                            n.isRead
                              ? "bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-600/50 text-slate-600 dark:text-slate-400"
                              : "bg-blue-50/70 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-slate-900 dark:text-white font-medium"
                          }`}
                        >
                          <div className="font-bold mb-1">{n.title}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{n.message}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 mr-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 pl-1.5 pr-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold uppercase overflow-hidden shadow-inner ring-2 ring-white dark:ring-slate-800">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0) : "U"
                )}
              </div>
              <div className="flex flex-col items-start text-left justify-center">
                <span className="font-bold text-sm text-slate-900 dark:text-white leading-none">{user?.name || "User"}</span>
                {user?.age && <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-none mt-1">{user.age} yrs</span>}
              </div>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}

export default Navbar;