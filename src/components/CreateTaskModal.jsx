import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/CreateTaskModal.css";

function CreateTaskModal({ onClose, onCreate, projects = [], teams = [] }) {
  const [projectId, setProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("To Do");
  const [timeToComplete, setTimeToComplete] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Owners
  const [users, setUsers] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);

  useEffect(() => {
    // Fetch users for the owners dropdown
    api.get("/auth/users").then(res => {
      if (res.data) setUsers(res.data);
    }).catch(err => console.error("Could not fetch users for owners", err));
  }, []);

  const handleOwnerChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOwners(value);
  };

  const handleCreate = async () => {
    if (!taskName.trim()) {
      alert("Task name is required");
      return;
    }

    if (!projectId) {
      alert("Please select a project");
      return;
    }

    if (!teamId) {
      alert("Please select a team");
      return;
    }

    if (selectedOwners.length === 0) {
      alert("Please select at least one owner");
      return;
    }

    if (!timeToComplete || Number(timeToComplete) <= 0) {
      alert("Please enter a valid time to complete (days)");
      return;
    }

    if (!tags.trim()) {
      alert("Please enter at least one tag");
      return;
    }

    if (!status) {
      alert("Please select a status");
      return;
    }

    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    try {
      setLoading(true);

      const newTask = {
        taskName: taskName,
        project: projectId,
        team: teamId,
        owners: selectedOwners,
        tags: tags
          ? tags.split(",").map((t) => t.trim())
          : [],
        status,
        timeToComplete: Number(timeToComplete) || 0,
        dueDate: dueDate,
      };

      const response = await api.post("/tasks", newTask);

      if (onCreate) {
        onCreate(response.data);
      }

      onClose();
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      alert(
        error.response?.data?.error ||
        "Something went wrong while creating task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* PROJECT DROPDOWN */}
          <div className="form-group">
            <label>Select Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* TASK NAME */}
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Enter Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          {/* TEAM DROPDOWN */}
          <div className="form-group">
            <label>Select Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* OWNERS (MULTI-SELECT) */}
          <div className="form-group">
            <label>Owners (Ctrl+Click to select multiple)</label>
            <select multiple={true} value={selectedOwners} onChange={handleOwnerChange} style={{ height: "80px" }}>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* TIME TO COMPLETE */}
          <div className="form-group">
            <label>Time to Complete (days)</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={timeToComplete}
              onChange={(e) => setTimeToComplete(e.target.value)}
            />
          </div>

          {/* DUE DATE */}
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* TAGS */}
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="UI, Bug, High Priority"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-create"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;
