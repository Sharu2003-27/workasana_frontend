import { useState } from "react";
import "../styles/CreateMemberModal.css";
import API from "../api/axios";

function CreateMemberModal({ teamId, onClose, onAdded }) {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;

    const res = await API.post(`/teams/${teamId}/add-member`, { name });

    onAdded(res.data);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add New Member</h3>
          <span className="close-btn" onClick={onClose}>×</span>
        </div>

        <div className="modal-body">
          <label>Members Name</label>
          <input
            placeholder="Member Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMemberModal;
