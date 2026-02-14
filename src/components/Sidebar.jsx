import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiBarChart2,
  FiSettings
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">workasana</h2>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <FiGrid className="icon" />
          Dashboard
        </NavLink>

        <NavLink to="/projects">
          <FiFolder className="icon" />
          Project
        </NavLink>

        <NavLink to="/teams">
          <FiUsers className="icon" />
          Team
        </NavLink>

        <NavLink to="/reports">
          <FiBarChart2 className="icon" />
          Reports
        </NavLink>

        <NavLink to="/settings">
          <FiSettings className="icon" />
          Setting
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;
