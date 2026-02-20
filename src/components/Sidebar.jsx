import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css"

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">workasana</h2>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <FiGrid className="icon" />
          Dashboard
        </NavLink>

        <NavLink to="/projects" className="sidebar-link">
          <FiFolder className="icon" />
          Projects
        </NavLink>

        <NavLink to="/teams" className="sidebar-link">
          <FiUsers className="icon" />
          Team
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          <FiBarChart2 className="icon" />
          Reports
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
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
  );
}

export default Sidebar;
