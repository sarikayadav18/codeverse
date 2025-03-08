// src/components/DoubtList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoubtCard from './DoubtCard';

// Set Axios base URL using environment variable (for Create React App or Vite)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DoubtList = () => {
  const [doubts, setDoubts] = useState([]);
  const [error, setError] = useState('');

  const fetchDoubts = async () => {
    try {
      const res = await axios.get('/api/doubts');
      setDoubts(res.data);
    } catch (err) {
      console.error('Error fetching doubts:', err);
      setError('Error fetching doubts');
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div>
      <h2>All Doubts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {doubts.length === 0 ? (
        <p>No doubts available.</p>
      ) : (
        doubts.map((doubt) => (
          <DoubtCard key={doubt._id} doubt={doubt} refreshDoubts={fetchDoubts} />
        ))
      )}
    </div>
  );
};

export default DoubtList;
