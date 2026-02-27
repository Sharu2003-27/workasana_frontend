import { useState } from "react";
import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css"

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Fixed token key
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-header">
        <h2 className="logo">workasana</h2>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="logo desktop-logo">workasana</h2>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <FiGrid className="icon" />
            Dashboard
          </NavLink>

          <NavLink to="/projects" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <FiFolder className="icon" />
            Projects
          </NavLink>

          <NavLink to="/teams" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <FiUsers className="icon" />
            Team
          </NavLink>

          <NavLink to="/reports" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <FiBarChart2 className="icon" />
            Reports
          </NavLink>

          <NavLink to="/settings" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <FiSettings className="icon" />
            Settings
          </NavLink>

          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <FiLogOut className="icon" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}

export default Sidebar;

