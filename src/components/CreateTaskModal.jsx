import { useState } from "react";
import "../styles/CreateTaskModal.css";

function CreateTaskModal({ onClose, onCreate, projects = [] }) {
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = () => {
    if (!title.trim()) {
      alert("Task name is required");
      return;
    }

    const newTask = {
      id: Date.now(),
      projectId: Number(projectId), 
      title,
      team,
      dueDate,
      status,
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          <div className="form-group">
            <label>Select Project</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Enter Task Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Team</label>
            <input
              type="text"
              placeholder="UI / Backend / QA"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleCreate}>Create Task</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;
