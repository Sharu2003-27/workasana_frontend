import axios from "axios";

const API = axios.create({
  baseURL: "https://workasana-backend-puce.vercel.app",
});

API.interceptors.response.use(
  (response) => {
    const normalizeTask = (task) => {
      if (!task || typeof task !== 'object') return task;

      task.dueDate = task.dueDate || task.DueDate || task.date || task.Date || task.due || task.due_date || task.dueOn || task.due_on || task.deadline || task.targetDate;

      task.taskName = task.taskName || task.TaskName || task.name || task.Title || task.title;

      if (task.owner && !task.owners) {
        task.owners = Array.isArray(task.owner) ? task.owner : [task.owner];
      }

      if (task.project && typeof task.project === 'object') {
        task.project.name = task.project.name || task.project.projectName;
      }

      return task;
    };

    if (Array.isArray(response.data)) {
      response.data = response.data.map(normalizeTask);
    } else if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.tasks)) {
        response.data.tasks = response.data.tasks.map(normalizeTask);
      }
      normalizeTask(response.data);
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 500) {
      console.error("Critical Backend Error (500):", error.response.data);
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
