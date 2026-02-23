import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateTaskModal from "../components/CreateTaskModal";
import API from "../api/axios";
import "../styles/ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const loadData = async () => {
    try {
      const [projectRes, taskRes, teamRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks?project=${id}`),
        API.get(`/teams`)
      ]);
      setProject(projectRes.data);
      setTasks(taskRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      console.error("Error loading project details", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateProjectStatus = async (status) => {
    try {
      await API.put(`/projects/${id}`, { status });
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error updating project status", err);
    }
  };

  const addTask = async (taskData) => {
    // taskData is already returned from backend in CreateTaskModal
    setTasks((prev) => [...prev, taskData]);
    setShowTaskModal(false);
  };

  // LOADING REMOVED FROM TOP LEVEL

  let filteredTasks = tasks.filter(t => statusFilter === "All" || t.status === statusFilter);

  if (tagFilter) {
    filteredTasks = filteredTasks.filter(t =>
      t.tags && t.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  }

  if (sortOrder === "dateAsc") {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortOrder === "dateDesc") {
    filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {!project ? (
          <h2>Loading Project Details...</h2>
        ) : (
          <>
            <div className="project-card">
              <h2>{project.name}</h2>
              <p className="project-desc">{project.description}</p>

              <div className="project-status">
                <label>Project Status:</label>
                <select
                  value={project.status || "Planning"}
                  onChange={(e) => updateProjectStatus(e.target.value)}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            <div className="section-header" style={{ marginTop: "20px" }}>
              <h3>Tasks</h3>

              <div className="section-left">
                <input
                  type="text"
                  placeholder="Filter by Tag..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="filter"
                />
                <select className="filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <select className="filter" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="">Sort By</option>
                  <option value="dateAsc">Due Date (Asc)</option>
                  <option value="dateDesc">Due Date (Desc)</option>
                </select>

                <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                  + New Task
                </button>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              <ul className="task-list-simple">
                {filteredTasks.map((task) => (
                  <li
                    key={task._id || task.id}
                    className="task-item-clickable"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    style={{ padding: "10px", borderBottom: "1px solid #eee", listStyleType: "none", backgroundColor: "white", marginBottom: "5px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    <strong>{task.taskName}</strong> — <span className={`badge ${task.status === "Completed" ? "green" : "yellow"}`}>{task.status}</span>
                    {task.dueDate && <span style={{ marginLeft: "10px", fontSize: "0.9em", color: "#666" }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreate={addTask}
          projects={[project]}
          teams={teams}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
