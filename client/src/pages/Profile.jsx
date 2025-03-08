// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import DoubtCard from '../components/DoubtCard';
import './Profile.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { username: visitingUsername } = useParams();
  const dispatch = useDispatch();
  const [visitingUser, setVisitingUser] = useState(null);
  const [doubts, setDoubts] = useState(null); // Doubts start as null instead of empty array
  const [error, setError] = useState('');

  // Get logged-in user from Redux
  const loggedUser = useSelector((state) => state.user.user);

  // Fetch logged-in user's profile using token and store in Redux
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchLoggedUser = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(res.data.user));
      } catch (err) {
        console.error('Error fetching logged-in user:', err);
      }
    };
    fetchLoggedUser();
  }, [dispatch]);

  // Fetch visiting user's profile by username
  useEffect(() => {
    const fetchVisitingUser = async () => {
      try {
        const res = await axios.get(`/api/auth/profile/${visitingUsername}`);
        setVisitingUser(res.data.user);
      } catch (err) {
        console.error("Error fetching visiting user's profile:", err);
        setError('Failed to load visiting user profile');
      }
    };
    fetchVisitingUser();
  }, [visitingUsername]);

  // Fetch doubts for visiting user
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/doubts/${visitingUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(res.data.length > 0 ? res.data : null); // Set null if no doubts
      } catch (err) {
        console.error('Error fetching doubts:', err);
      }
    };
    fetchDoubts();
  }, [visitingUsername]);

  // Follow/Unfollow functionality
  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const isFollowing = visitingUser.followers.some(
        (followerId) => followerId.toString() === loggedUser._id.toString()
      );

      if (isFollowing) {
        await axios.delete(`/api/users/${visitingUser._id}/follow`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisitingUser((prev) => ({
          ...prev,
          followers: prev.followers.filter(
            (id) => id.toString() !== loggedUser._id.toString()
          ),
        }));
      } else {
        await axios.post(
          `/api/users/${visitingUser._id}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVisitingUser((prev) => ({
          ...prev,
          followers: [...prev.followers, loggedUser._id],
        }));
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!visitingUser) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Determine if the profile being visited is the logged-in user's own profile.
  const isOwnProfile = loggedUser && loggedUser._id === visitingUser._id;
  // Determine if current user follows visiting user.
  const isFollowing =
    loggedUser &&
    visitingUser.followers.some(
      (followerId) => followerId.toString() === loggedUser._id.toString()
    );

  return (
    <div className="profile-container">
      <h2>{visitingUser.username}'s Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Username:</strong> {visitingUser.username}
        </p>
        <p>
          <strong>Email:</strong> {visitingUser.email}
        </p>
        <p>
          <strong>Followers:</strong> {visitingUser.followers.length}
        </p>
        <p>
          <strong>Following:</strong> {visitingUser.following.length}
        </p>
      </div>

      {!isOwnProfile && (
        <button className="follow-btn" onClick={handleFollowToggle}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      {doubts !== null && doubts.length > 0 && (
        <>
          <hr />
          <h3>Doubts</h3>
          {doubts.map((doubt) => (
            <DoubtCard key={doubt._id} doubt={doubt} refreshDoubts={() => {}} />
          ))}
        </>
      )}
    </div>
  );
};

export default Profile;
