import React from 'react';
import './DoubtList.css';

const DoubtList = ({ doubts }) => {
  return (
    <div className="doubts-container">
      {doubts.map((doubt, index) => (
        <div key={index} className="doubt-item">
          {doubt}
        </div>
      ))}
    </div>
  );
};

export default DoubtList;
