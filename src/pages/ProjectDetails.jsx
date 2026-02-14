import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const project = projects.find((p) => p.id === Number(id));

  const [statusFilter, setStatusFilter] = useState("All");

  const projectTasks = tasks.filter(
    (task) =>
      task.projectId === Number(id) &&
      (statusFilter === "All" || task.status === statusFilter)
  );

  if (!project) {
    return <h2>Project not found</h2>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <h2>{project.name}</h2>
        <p className="project-desc">{project.description}</p>

        {/* Toolbar */}
        <div className="task-toolbar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            className="btn-primary"
            onClick={() => navigate(`/project/${id}/new-task`)}
          >
            + New Task
          </button>
        </div>

        {/* Task Table */}
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Team</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {projectTasks.length === 0 ? (
              <tr>
                <td colSpan="4">No tasks yet</td>
              </tr>
            ) : (
              projectTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.taskName}</td>
                  <td>{task.team}</td>
                  <td>{task.dueDate}</td>
                  <td>
                    <span className={`status ${task.status.toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectDetails;
