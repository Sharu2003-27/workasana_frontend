import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateTaskModal from "../components/CreateTaskModal";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [projects, setProjects] = useState(() => {
    return JSON.parse(localStorage.getItem("projects")) || [];
  });

  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const filteredProjects = projects
    .filter(
      (project) =>
        projectFilter === "All" || project.status === projectFilter
    )
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredTasks = tasks
    .filter(
      (task) => taskFilter === "All" || task.status === taskFilter
    )
    .filter(
      (task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* Search Bar */}
        <div className="dashboard-header">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-box"
              placeholder="Search projects or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Projects */}
        <section>
          <div className="section-header">
            <div className="section-left">
              <h2>Projects</h2>

              <select
                className="filter"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              + New Project
            </button>
          </div>

          <div className="project-grid">
            {filteredProjects.length === 0 ? (
              <p className="empty-text">
                No matching projects found.
              </p>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <span className="badge yellow">{project.status}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tasks */}
        <section>
          <div className="section-header">
            <div className="section-left">
              <h2>My Tasks</h2>

              <select
                className="filter"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              className="btn-secondary"
              onClick={() => setShowTaskModal(true)}
            >
              + New Task
            </button>
          </div>

          <TaskList tasks={filteredTasks} />
        </section>
      </div>

      {/* Modals */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={addProject}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreate={addTask}
          projects={projects}
        />
      )}
    </div>
  );
}

export default Dashboard;
