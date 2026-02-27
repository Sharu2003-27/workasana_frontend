import axios from "axios";

const API = axios.create({
  baseURL: "https://workasana-backend-puce.vercel.app",
});

// DATA SHAPER & NORMALIZER
// This interceptor ensures that regardless of the backend version (local or deployed), 
// the frontend always receives data in a consistent format.
API.interceptors.response.use(
  (response) => {
    const normalizeTask = (task) => {
      if (!task || typeof task !== 'object') return task;

      // 1. Normalize Date
      task.dueDate = task.dueDate || task.DueDate || task.date || task.Date || task.due || task.due_date || task.dueOn || task.due_on || task.deadline || task.targetDate;

      // 2. Normalize Task Name
      task.taskName = task.taskName || task.TaskName || task.name || task.Title || task.title;

      // 3. Normalize Owners (Handle singular 'owner' from deployed backend)
      if (task.owner && !task.owners) {
        task.owners = Array.isArray(task.owner) ? task.owner : [task.owner];
      }

      // 4. Normalize Project Name
      if (task.project && typeof task.project === 'object') {
        task.project.name = task.project.name || task.project.projectName;
      }

      return task;
    };

    // Recursively normalize if it's an array or single object
    if (Array.isArray(response.data)) {
      response.data = response.data.map(normalizeTask);
    } else if (response.data && typeof response.data === 'object') {
      // Check if it's a project object with a tasks array
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
      // We don't alert here to avoid spamming, but we log for debugging.
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
