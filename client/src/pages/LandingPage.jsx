// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import "./LandingPage.css";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/slices/userSlice';
import Navbar from '../components/Navbar';
import AskAnythingField from '../components/AskAnythingField';
import DoubtList from '../components/DoubtList';
import DoubtCreationModal from '../components/DoubtCreationModal';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setUser(res.data));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const addDoubt = (doubt) => {
    setDoubts([doubt, ...doubts]);
    closeModal();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <AskAnythingField onClick={openModal} />
        {showModal && (
          <DoubtCreationModal onClose={closeModal} onSubmit={addDoubt} />
        )}
      </div>
      <DoubtList doubts={doubts} />
    </div>
  );
};

export default LandingPage;
