import React, { useState } from 'react';
import './DoubtCreationModal.css';

const DoubtCreationModal = ({ onClose, onSubmit }) => {
  const [doubtText, setDoubtText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(doubtText);
    setDoubtText('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Doubt</h2>
        <form onSubmit={handleSubmit}>
          <textarea 
            className="modal-textarea"
            placeholder="Enter your doubt here..."
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="submit-button">Submit</button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoubtCreationModal;
