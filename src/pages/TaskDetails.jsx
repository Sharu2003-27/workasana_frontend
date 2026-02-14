import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function TaskDetails() {
  const { id } = useParams();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const task = tasks.find(t => t.id === Number(id));

  if (!task) return <h2>Task not found</h2>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <h2>{task.taskName}</h2>
        <p><b>Team:</b> {task.team}</p>
        <p><b>Owners:</b> {task.owners.join(", ")}</p>
        <p><b>Tags:</b> {task.tags.join(", ")}</p>
        <p><b>Due Date:</b> {task.dueDate}</p>
        <p><b>Status:</b> {task.status}</p>
      </div>
    </div>
  );
}

export default TaskDetails;
