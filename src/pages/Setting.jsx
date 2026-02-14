import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Setting.css"

export default function Setting() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) ?? true
  );
  const [compactMode, setCompactMode] = useState(
    JSON.parse(localStorage.getItem("compactMode")) ?? false
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("compactMode", compactMode);
  }, [notifications, compactMode]);

  return (
    <div className="team-layout">
  <Sidebar />

  <div className="team-main">
    <h2 className="team-title">Settings</h2>

    <div className="settings-card">
      {/* Theme */}
      <div className="setting-item">
        <div className="setting-text">
          <h4>Dark / Light Mode</h4>
          <p>Switch between dark and light appearance</p>
        </div>

        <button
          className="theme-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Notifications */}
      <div className="setting-item">
        <div className="setting-text">
          <h4>Enable Notifications</h4>
          <p>Get notified about updates</p>
        </div>

        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      {/* Compact Mode */}
      <div className="setting-item">
        <div className="setting-text">
          <h4>Compact Layout</h4>
          <p>Reduce spacing for dense view</p>
        </div>

        <input
          type="checkbox"
          checked={compactMode}
          onChange={() => setCompactMode(!compactMode)}
        />
      </div>
    </div>
  </div>
</div>
);
}
