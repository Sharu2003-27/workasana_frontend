import Sidebar from "../components/Sidebar";
import "../styles/Teams.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateTeamModal() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["", "", ""]);

  const handleCreateTeam = async () => {
  try {
    const res = await fetch("https://workasana-backend-puce.vercel.app/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: teamName,
        members: members
          .filter(m => m.trim() !== "")
          .map(m => ({ name: m }))
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message); 
      return;
    }

    navigate("/teams");

  } catch (err) {
    console.error(err);
    alert("Server down");
  }
};

  return (
    <div className="team-layout">
      <Sidebar />

      <div className="team-main">
        <div className="back-link" onClick={() => navigate("/teams")}>
          ← Back to Teams
        </div>

        <div className="create-team-wrapper">
          <div className="create-team-card">
            <h2>Create New Team</h2>

            <div className="form-group">
              <label>Team Name</label>
              <input
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Add Members</label>
              {members.map((m, i) => (
                <input
                  key={i}
                  placeholder="Member Name"
                  value={m}
                  onChange={(e) => {
                    const copy = [...members];
                    copy[i] = e.target.value;
                    setMembers(copy);
                  }}
                />
              ))}
            </div>

            <div className="form-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/teams")}
              >
                Cancel
              </button>
              <button className="primary-btn" onClick={handleCreateTeam}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
