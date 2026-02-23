import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import CreateProjectModal from "../components/CreateProjectModal";
import "../styles/Project.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      await API.post("/projects", projectData);
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/projects/${id}`, { status });
      fetchProjects();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filteredProjects =
    statusFilter === "All"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h2>Projects</h2>
            <p className="sub-text">Manage and track your projects</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Project
          </button>
        </div>

        {/* Filter */}
        <div className="projects-toolbar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        {/* Modal */}
        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onCreate={createProject}
          />
        )}

        {/* Content */}
        {loading && <div className="loading-overlay">Loading projects...</div>}
        {!loading && filteredProjects.length === 0 ? (
          <div className="empty-state">
            <h3>No Projects Yet 🚀</h3>
            <p>Create your first project to get started</p>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Create Project
            </button>
          </div>
        ) : (
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="project-card"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="card-header">
                  <span
                    className={`status-badge ${project.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3>{project.name}</h3>
                <p>
                  {project.description || "No description provided"}
                </p>

                <div className="card-footer">
                  <select
                    value={project.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateStatus(project._id, e.target.value)
                    }
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
