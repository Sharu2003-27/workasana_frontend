import Sidebar from "../components/Sidebar";
import "../styles/Report.css";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Reports() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // 1. Completed tasks last 7 days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const completedLastWeek = tasks.filter(
    t =>
      t.status === "Completed" &&
      new Date(t.updatedAt) >= lastWeek
  ).length;

  // 2. Pending work (days)
  const pendingDays = tasks
    .filter(t => t.status !== "Completed")
    .reduce((sum, t) => sum + Number(t.timeToComplete || 0), 0);

  // 3. Closed by team
  const closedByTeam = {};
  const closedByOwner = {};
  const closedByProject = {};

  tasks.forEach(t => {
    if (t.status === "Completed") {
      // Team
      closedByTeam[t.team] = (closedByTeam[t.team] || 0) + 1;

      // Project
      closedByProject[t.project] =
        (closedByProject[t.project] || 0) + 1;

      // Owners
      t.owners?.forEach(o => {
        closedByOwner[o] = (closedByOwner[o] || 0) + 1;
      });
    }
  });

  const bar = (label, value) => ({
    labels: [label],
    datasets: [{ label, data: [value] }]
  });

  const pie = obj => ({
    labels: Object.keys(obj),
    datasets: [{ data: Object.values(obj) }]
  });

  return (
    <div className="dashboard-layout reports-container">
      <Sidebar />

      <div className="reports-main">
        <h2>Workasana Reports</h2>

        <div className="report-summary">
          <div className="summary-card">
            <span>Completed Last Week</span>
            <h3>{completedLastWeek}</h3>
          </div>

          <div className="summary-card">
            <span>Pending Work (Days)</span>
            <h3>{pendingDays}</h3>
          </div>

          <div className="summary-card">
            <span>Total Tasks</span>
            <h3>{tasks.length}</h3>
          </div>
        </div>

        <div className="report-section">
          <h4>Total Work Done Last Week</h4>
          <div className="chart-wrapper">
            <Bar data={bar("Completed Tasks", completedLastWeek)} />
          </div>
        </div>

        <div className="report-section">
          <h4>Total Days of Work Pending</h4>
          <div className="chart-wrapper">
            <Bar data={bar("Pending Days", pendingDays)} />
          </div>
        </div>

        <div className="report-grid">
          <div className="report-section">
            <h4>Tasks Closed by Team</h4>
            <div className="chart-wrapper">
              <Pie data={pie(closedByTeam)} />
            </div>
          </div>

          <div className="report-section">
            <h4>Tasks Closed by Owner</h4>
            <div className="chart-wrapper">
              <Pie data={pie(closedByOwner)} />
            </div>
          </div>
        </div>

        <div className="report-section">
          <h4>Tasks Closed by Project</h4>
          <div className="chart-wrapper">
            <Bar data={pie(closedByProject)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
