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
    filteredTasks.sort((a, b) => {
      const da = a.dueDate || a.DueDate || a.date || a.Date || a.due || a.due_date || a.dueOn || a.due_on;
      const db = b.dueDate || b.DueDate || b.date || b.Date || b.due || b.due_date || b.dueOn || b.due_on;
      if (!da) return 1;
      if (!db) return -1;
      return new Date(da) - new Date(db);
    });
  } else if (sortOrder === "dateDesc") {
    filteredTasks.sort((a, b) => {
      const da = a.dueDate || a.DueDate || a.date || a.Date || a.due || a.due_date || a.dueOn || a.due_on;
      const db = b.dueDate || b.DueDate || b.date || b.Date || b.due || b.due_date || b.dueOn || b.due_on;
      if (!da) return 1;
      if (!db) return -1;
      return new Date(db) - new Date(da);
    });
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

            <div className="section-header">

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
              <div className="table-container">
                <table className="task-table">

                  <thead>
                    <tr>
                      <th>TASKS</th>
                      <th>OWNER</th>
                      <th>TAGS</th>
                      <th>TEAM</th>
                      <th>DUE ON</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => {
                      // EXHAUSTIVE FALLBACKS FOR DEPLOYED BACKEND
                      const dDate = task.dueDate || task.DueDate || task.date || task.Date || task.due || task.due_date || task.dueOn || task.due_on || task.deadline || task.targetDate;
                      const tName = task.taskName || task.TaskName || task.name || task.Title || task.title || "Untitled Task";

                      let teamDisplay = task.team?.name;
                      if (!teamDisplay && typeof task.team === 'string') {
                        const foundTeam = teams.find(t => t._id === task.team);
                        if (foundTeam) teamDisplay = foundTeam.name;
                      }

                      return (
                        <tr
                          key={task._id}
                          className="task-row-clickable"
                          onClick={() => navigate(`/tasks/${task._id}`)}
                        >
                          <td className="task-name-cell">
                            <strong>{tName}</strong>
                          </td>
                          <td>
                            <div className="owner-avatars">
                              {task.owners && task.owners.length > 0 ? (
                                task.owners.map((o, idx) => {
                                  const ownerName = typeof o === 'object' ? o.name : "User";
                                  return (
                                    <span key={o._id || idx} title={ownerName} className="owner-badge">
                                      {ownerName?.charAt(0).toUpperCase()}
                                    </span>
                                  );
                                })
                              ) : "No Owner"}
                            </div>
                          </td>
                          <td>
                            <div className="tags-container">
                              {task.tags?.map((tag, idx) => (
                                <span key={idx} className="tag-pill">{tag}</span>
                              ))}
                            </div>
                          </td>
                          <td>{teamDisplay || 'N/A'}</td>
                          <td className="due-date-cell">
                            {dDate ? new Date(dDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                          </td>
                          <td>
                            <span className={`badge ${task.status === "Completed" ? "green" :
                              task.status === "In Progress" ? "yellow" :
                                task.status === "Blocked" ? "red" : "blue"
                              }`}>{task.status}</span>
                          </td>
                        </tr>
                      );
                    })}



                  </tbody>
                </table>
              </div>

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
