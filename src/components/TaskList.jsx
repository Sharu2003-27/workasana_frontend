import { useNavigate } from "react-router-dom";

function TaskList({ tasks }) {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return <p className="empty-text">No tasks yet. Click + New Task</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="task-card"
          onClick={() => navigate(`/task/${task._id}`)}
        >
          <h4>{task.name}</h4>
          <p>Team: {task.team?.name}</p>
          <p>Due: {task.dueDate?.substring(0, 10)}</p>
          <span className="badge yellow">{task.status}</span>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
