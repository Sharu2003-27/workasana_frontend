import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Teams from "./pages/Teams";
import CreateTeam from "./components/CreateTeamModal";
import TeamDetails from "./pages/TeamDetails";
import Reports from "./pages/Reports";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";
import Setting from "./pages/Setting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/new" element={<CreateTeam />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
