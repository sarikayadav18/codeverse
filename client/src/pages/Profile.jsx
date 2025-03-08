// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import DoubtCard from '../components/DoubtCard';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [myDoubts, setMyDoubts] = useState([]);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res.data);
        // Save profile data to Redux
        dispatch(setUser(res.data));
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      }
    };

    const fetchMyDoubts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/doubts/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyDoubts(res.data);
      } catch (err) {
        console.error('Error fetching my doubts:', err);
        setError('Failed to load your doubts');
      }
    };

    fetchProfile();
    fetchMyDoubts();
  }, [dispatch]);

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Username:</strong> {profileData.username}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        {/* Additional fields if needed */}
      </div>
      <hr />
      <h3>My Doubts</h3>
      {myDoubts.length === 0 ? (
        <p>You haven't posted any doubts yet.</p>
      ) : (
        myDoubts.map((doubt) => (
          <DoubtCard key={doubt._id} doubt={doubt} refreshDoubts={() => {
            const token = localStorage.getItem('token');
            axios.get('/api/doubts/my', { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => setMyDoubts(res.data))
              .catch(err => console.error(err));
          }} />
        ))
      )}
    </div>
  );
};

export default Profile;
