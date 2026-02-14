import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/TeamDetails.css";
import CreateMemberModal from "../components/CreateMemberModal"

function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
  const fetchTeam = async () => {
    const res = await fetch(`https://workasana-backend-puce.vercel.app/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setTeam(data);
  };

  fetchTeam();
}, [id]);

  if (!team) return <p>Loading...</p>;

  return (
    <div className="team-layout">
      <Sidebar />

      <div className="team-main">
        <p className="back-link" onClick={() => window.history.back()}>
          ← Back to Teams
        </p>

        <h2 className="team-title">{team.name}</h2>

        <div className="members-header">
          <span className="members-label">MEMBERS</span>
        </div>

        <div className="members-list">
          {team.members.map((m, i) => (
            <div key={i} className="member-row">
              <div className="member-avatar">
                {m.name.charAt(0).toUpperCase()}
              </div>
              <span className="member-name">{m.name}</span>
            </div>
          ))}
        </div>

        <button
          className="add-member-btn add-member-bottom"
          onClick={() => setShowAdd(true)}
        >
          + Member
        </button>
      </div>

      {showAdd && (
        <CreateMemberModal
          teamId={id}
          onClose={() => setShowAdd(false)}
          onAdded={(newMember) =>
            setTeam({ ...team, members: [...team.members, newMember] })
          }
        />
      )}
    </div>
  );
}

export default TeamDetails;
