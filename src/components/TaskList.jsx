import { useNavigate } from "react-router-dom";

function TaskList({ tasks, teams = [], users = [] }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return <p className="empty-text">No tasks yet. Click + New Task</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="task-grid">
      {tasks.map((task) => {
        // EXHAUSTIVE DATE FALLBACKS
        const dDate = task.dueDate || task.DueDate || task.date || task.Date || task.due || task.due_date || task.dueOn || task.due_on || task.deadline || task.targetDate;
        const tName = task.taskName || task.TaskName || task.name || task.Title || task.title || "Untitled Task";

        // MANUAL POPULATION FALLBACK (If backend returns IDs instead of objects)
        let teamDisplay = task.team?.name;
        if (!teamDisplay && typeof task.team === 'string' && teams.length > 0) {
          const foundTeam = teams.find(t => t._id === task.team);
          if (foundTeam) teamDisplay = foundTeam.name;
        }

        let ownerDisplay = task.owners?.map(o => typeof o === 'object' ? o.name : null).filter(Boolean).join(", ");
        if (!ownerDisplay && Array.isArray(task.owners) && task.owners.length > 0 && users.length > 0) {
          ownerDisplay = task.owners.map(id => {
            const found = users.find(u => u._id === id);
            return found ? found.name : id;
          }).join(", ");
        }

        return (
          <div
            key={task._id}
            className="task-card"
            onClick={() => navigate(`/tasks/${task._id}`)}
          >
            <div className="task-card-header">
              <h4>{tName}</h4>
              <span className={`badge ${task.status === "Completed" ? "green" :
                task.status === "In Progress" ? "yellow" :
                  task.status === "Blocked" ? "red" : "blue"
                }`}>{task.status}</span>
            </div>
            <div className="task-card-body">
              <p><strong>Team:</strong> {teamDisplay || 'No Team'}</p>
              <p><strong>Owners:</strong> {ownerDisplay || 'No Owner'}</p>
              <p><strong>Due:</strong> {formatDate(dDate)}</p>
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="task-card-tags">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;

