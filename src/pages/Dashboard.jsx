import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskList from "../components/TaskList";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");
  const [projectFilterTask, setProjectFilterTask] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("taskName"); // "taskName", "dueDate", "status"

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [projectRes, taskRes, teamRes] = await Promise.all([
          API.get("/projects"),
          API.get("/tasks"),
          API.get("/teams"),
        ]);

        setProjects(projectRes.data || []);
        setTasks(taskRes.data || []);
        setTeams(teamRes.data || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setError("Unable to load data. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // ADD PROJECT
  const addProject = async (projectData) => {
    try {
      const res = await API.post("/projects", projectData);
      setProjects((prev) => [...prev, res.data]);
      setShowProjectModal(false);
    } catch (err) {
      console.error("Create Project Error:", err);
    }
  };

  // ADD TASK
  const addTask = async (taskData) => {
    // taskData is already returned from backend in CreateTaskModal
    setTasks((prev) => [...prev, taskData]);
    setShowTaskModal(false);
  };

  // FILTER PROJECTS
  const filteredProjects = projects
    .filter((p) => projectFilter === "All" || p.status === projectFilter)
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // FILTER TASKS
  const filteredTasks = tasks
    .filter((t) => taskFilter === "All" || t.status === taskFilter)
    .filter((t) => {
      if (projectFilterTask === "All") return true;
      const tProjId = typeof t.project === 'object' ? t.project?._id : t.project;
      return tProjId === projectFilterTask;
    })
    .filter((t) => {
      const search = searchQuery.toLowerCase();
      const name = (t.taskName || t.TaskName || t.name || "").toLowerCase();
      const tags = t.tags?.some(tag => tag.toLowerCase().includes(search));
      return name.includes(search) || tags;
    })
    .sort((a, b) => {
      if (sortBy === "taskName") {
        const nameA = a.taskName || a.TaskName || a.name || "";
        const nameB = b.taskName || b.TaskName || b.name || "";
        return nameA.localeCompare(nameB);
      } else if (sortBy === "dueDate") {
        const da = a.dueDate || a.DueDate || a.date || a.Date || a.due || a.due_date || a.dueOn || a.due_on;
        const db = b.dueDate || b.DueDate || b.date || b.Date || b.due || b.due_date || b.dueOn || b.due_on;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(da) - new Date(db);
      } else if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }
      return 0;
    });


  // LOADING REMOVED FROM TOP LEVEL TO SHOW SIDEBAR

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {loading && <div className="loading-overlay">Loading Dashboard...</div>}
        {error && <p className="error-msg">{error}</p>}

        <div className="dashboard-header">
          <input
            className="search-box"
            placeholder="Search projects or tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* PROJECT SECTION */}
        <section>
          <div className="section-header">
            <h2>Projects</h2>

            <div className="section-left">
              <select
                className="filter"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                className="btn-primary"
                onClick={() => setShowProjectModal(true)}
              >
                + New Project
              </button>
            </div>
          </div>

          <div className="project-grid">
            {filteredProjects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="project-card"
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  <span
                    className={`badge ${project.status === "Completed"
                      ? "green"
                      : project.status === "In Progress"
                        ? "yellow"
                        : ""
                      }`}
                  >
                    {project.status}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* TASK SECTION */}
        <section>
          <div className="section-header">
            <h2>My Tasks</h2>

            <div className="section-left">
              <select
                className="filter"
                value={projectFilterTask}
                onChange={(e) => setProjectFilterTask(e.target.value)}
              >
                <option value="All">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>

              <select
                className="filter"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>

              <select
                className="filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="taskName">Sort by Name</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="status">Sort by Status</option>
              </select>

              <button
                className="btn-primary"
                onClick={() => setShowTaskModal(true)}
              >
                + New Task
              </button>
            </div>
          </div>

          <TaskList tasks={filteredTasks} teams={teams} />
        </section>
      </div>

      {/* MODALS */}
      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreate={addProject}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreate={addTask}
          projects={projects}
          teams={teams}
        />
      )}
    </div>
  );
}

export default Dashboard;
