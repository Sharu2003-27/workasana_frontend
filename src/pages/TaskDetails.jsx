import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css" // For basic button styles

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
        const taskFetched = res.data;
        setEditData({
          taskName: taskFetched.taskName || taskFetched.name || "",
          status: taskFetched.status || "To Do",
          dueDate: taskFetched.dueDate ? new Date(taskFetched.dueDate).toISOString().substring(0, 10) : "",
          tags: taskFetched.tags ? taskFetched.tags.join(", ") : "",
          timeToComplete: taskFetched.timeToComplete || 0
        });

      } catch (err) {
        console.error("Error loading task:", err);
      }
    };

    loadTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const dataToSend = {
        ...editData,
        tags: editData.tags ? editData.tags.split(",").map(t => t.trim()) : [],
        timeToComplete: Number(editData.timeToComplete)
      };
      const res = await API.post(`/tasks/${id}`, dataToSend);
      setTask(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  // LOADING REMOVED FROM TOP LEVEL

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        {!task ? (
          <h2>Loading...</h2>
        ) : isEditing ? (
          <div style={{ padding: "20px", background: "white", borderRadius: "8px", maxWidth: "600px" }}>
            <h2>Edit Task</h2>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Task Name</label>
              <input
                type="text"
                value={editData.taskName}
                onChange={e => setEditData({ ...editData, taskName: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Due Date</label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Time to Complete (days)</label>
              <input
                type="number"
                value={editData.timeToComplete}
                onChange={e => setEditData({ ...editData, timeToComplete: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Tags (comma separated)</label>
              <input
                type="text"
                value={editData.tags}
                onChange={e => setEditData({ ...editData, tags: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Status</label>
              <select
                value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
            <button className="btn-cancel" style={{ marginLeft: "10px" }} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div style={{ padding: "20px", background: "white", borderRadius: "8px", maxWidth: "600px" }}>
            <h2>{task.taskName || task.name}</h2>
            <p><b>Team:</b> {task.team?.name}</p>
            <p><b>Owners:</b> {task.owners?.map(o => o.name).join(", ")}</p>
            <p><b>Tags:</b> {task.tags?.join(", ")}</p>
            <p><b>Due Date:</b> {(task.dueDate || task.date || task.due_date) ? new Date(task.dueDate || task.date || task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'}</p>
            <p><b>Time To Complete:</b> {task.timeToComplete} days</p>
            <p><b>Status:</b> <span className="badge yellow">{task.status}</span></p>

            <button className="btn-primary" style={{ marginTop: "20px" }} onClick={() => setIsEditing(true)}>Edit Task</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
