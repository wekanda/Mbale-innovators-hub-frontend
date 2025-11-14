import React, { useState } from 'react';

const RejectionModal = ({ onSubmit, onClose }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please provide a comment for rejection.');
      return;
    }
    onSubmit(comment);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Reject Project</h2>
        <p>Please provide a reason for rejecting this project.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., Project scope is unclear, more details needed..."
              required
              rows="4"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-reject">
              Submit Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionModal;

