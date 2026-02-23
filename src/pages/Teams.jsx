import Sidebar from "../components/Sidebar";
import "../styles/Teams.css";
import "../styles/CreateTaskModal.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Teams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await API.get("/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Fetch teams failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);


  return (
    <div className="team-layout">
      <Sidebar />

      <div className="team-main">
        {loading && <div className="loading-overlay">Loading Teams...</div>}
        <div className="team-header">
          <h2>Teams</h2>
          <button
            className="primary-btn"
            onClick={() => navigate("/teams/new")}
          >
            + New Team
          </button>
        </div>

        <div className="team-grid">
          {teams.length === 0 ? (
            <p className="empty-text">No teams created yet</p>
          ) : (
            teams.map((team) => (
              <div key={team._id} className="team-card"
                onClick={() => navigate(`/teams/${team._id}`)}
                style={{ cursor: "pointer" }} >
                <h4>{team.name}</h4>

                <div className="avatar-group">
                  {team.members?.slice(0, 3).map((m, i) => (
                    <div key={i} className="avatar">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {team.members?.length > 3 && (
                    <span className="more">
                      +{team.members.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams;
