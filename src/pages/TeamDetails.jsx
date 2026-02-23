import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/TeamDetails.css";
import CreateMemberModal from "../components/CreateMemberModal"
import API from "../api/axios";

function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/teams/${id}`);
        setTeam(res.data);
      } catch (err) {
        console.error("Fetch team details failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  // LOADING REMOVED FROM TOP LEVEL

  return (
    <div className="team-layout">
      <Sidebar />

      <div className="team-main">
        {!team ? (
          <div className="loading-overlay">Loading Team Details...</div>
        ) : (
          <>
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
          </>
        )}
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
