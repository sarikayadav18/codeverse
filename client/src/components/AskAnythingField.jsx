import React from 'react';
import './AskAnythingField.css';

const AskAnythingField = ({ onClick }) => {
  return (
    <div className="ask-container" onClick={onClick}>
      <input 
        type="text" 
        placeholder="Ask anything..." 
        className="ask-input"
        readOnly
      />
    </div>
  );
};

export default AskAnythingField;
