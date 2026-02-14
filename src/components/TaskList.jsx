function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-text">No tasks yet. Click + New Task</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h4>{task.taskName}</h4>
          <p>Team: {task.team}</p>
          <p>Due: {task.dueDate}</p>
          <span className="badge yellow">{task.status}</span>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
