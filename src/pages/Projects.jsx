import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();
  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <h2>All Projects</h2>

        {projects.length === 0 ? (
          <p>No projects created yet</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <span className="badge yellow">{project.status}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
