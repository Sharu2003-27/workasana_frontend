import Sidebar from "../components/Sidebar";
import "../styles/Report.css";
import { useEffect, useState } from "react";
import API from "../api/axios";

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
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/tasks")
      .then(res => setTasks(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Completed Last 7 Days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const completedLastWeek = tasks.filter((t) => {
    if (!t.updatedAt) return false;

    return (
      t.status === "Completed" &&
      new Date(t.updatedAt) >= lastWeek
    );
  }).length;

  // Pending Work (Days)
  const pendingDays = tasks
    .filter((t) => t.status !== "Completed")
    .reduce((sum, t) => sum + Number(t.timeToComplete || 0), 0);

  // Closed by Team/Owner/Project
  const closedByTeam = {};
  const closedByOwner = {};
  const closedByProject = {};

  tasks.forEach((t) => {
    if (t.status === "Completed") {
      // Team
      if (t.team) {
        const teamName = typeof t.team === 'object' ? t.team.name : t.team;
        closedByTeam[teamName] = (closedByTeam[teamName] || 0) + 1;
      }

      // Project
      if (t.project) {
        const projectName = typeof t.project === 'object' ? (t.project.name || t.project.projectName) : t.project;
        closedByProject[projectName] = (closedByProject[projectName] || 0) + 1;
      }

      // Owners
      if (Array.isArray(t.owners)) {
        t.owners.forEach((o) => {
          if (!o) return;
          const ownerName = typeof o === 'object' ? (o.name || "User") : o;
          closedByOwner[ownerName] = (closedByOwner[ownerName] || 0) + 1;
        });
      }
    }
  });

  // Chart Helpers
  const barChartData = (label, value) => ({
    labels: [label],
    datasets: [
      {
        label,
        data: [value],
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }
    ]
  });

  const dynamicBarData = (label, obj) => ({
    labels: Object.keys(obj),
    datasets: [
      {
        label,
        data: Object.values(obj),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  });

  const pieChartData = (obj) => ({
    labels: Object.keys(obj),
    datasets: [
      {
        data: Object.values(obj),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ]
      }
    ]
  });

  return (
    <div className="dashboard-layout reports-container">
      <Sidebar />

      <div className="reports-main">
        {loading && <div className="loading-overlay">Loading Reports...</div>}
        <h2>Workasana Reports</h2>

        {/* SUMMARY */}
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

        {/* BAR CHARTS */}
        <div className="report-section">
          <h4>Total Work Done Last Week</h4>
          <div className="chart-wrapper">
            <Bar data={barChartData("Completed Tasks", completedLastWeek)} />
          </div>
        </div>

        <div className="report-section">
          <h4>Total Days of Work Pending</h4>
          <div className="chart-wrapper">
            <Bar data={barChartData("Pending Days", pendingDays)} />
          </div>
        </div>

        {/* PIE CHARTS */}
        <div className="report-grid">
          <div className="report-section">
            <h4>Tasks Closed by Team</h4>
            <div className="chart-wrapper">
              {Object.keys(closedByTeam).length ? (
                <Pie data={pieChartData(closedByTeam)} />
              ) : (
                <p>No completed tasks</p>
              )}
            </div>
          </div>

          <div className="report-section">
            <h4>Tasks Closed by Owner</h4>
            <div className="chart-wrapper">
              {Object.keys(closedByOwner).length ? (
                <Pie data={pieChartData(closedByOwner)} />
              ) : (
                <p>No completed tasks</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= PROJECT BAR ================= */}
        <div className="report-section">
          <h4>Tasks Closed by Project</h4>
          <div className="chart-wrapper">
            {Object.keys(closedByProject).length ? (
              <Bar
                data={dynamicBarData(
                  "Tasks Closed",
                  closedByProject
                )}
              />
            ) : (
              <p>No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
