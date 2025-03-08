// src/components/DoubtCard.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CodeEditorRender from './CodeEditorRender';
import CodeEditor from './CodeEditor';
import axios from 'axios';
import ReplyForm from './ReplyForm';
import { FaEdit, FaTrashAlt, FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './DoubtCard.css';

const DoubtCard = ({ doubt, refreshDoubts }) => {
  // Get current user from Redux
  const currentUser = useSelector((state) => state.user.user);
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editText, setEditText] = useState(doubt.text);
  const [editCode, setEditCode] = useState(doubt.code || '');
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Compare the creator's id with current user's id
  const isCreator =
    currentUser &&
    doubt.creator &&
    doubt.creator.username === currentUser.username;

  const handleReply = async (replyText, replyCode, parentReplyId = null) => {
    if (!replyText.trim()) {
      setReplyError('Reply text is required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/doubts/${doubt._id}/reply`,
        { text: replyText, code: replyCode, parentReplyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Reply added:', res.data);
      setReplySuccess('Reply added successfully!');
      setReplyError('');
      setShowReplyForm(false);
      if (refreshDoubts) refreshDoubts();
    } catch (err) {
      console.error('Error adding reply:', err);
      setReplyError(err.response?.data?.message || 'Error adding reply');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this doubt?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/doubts/${doubt._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (refreshDoubts) refreshDoubts();
      } catch (err) {
        console.error('Error deleting doubt:', err);
      }
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      setEditError('Doubt text is required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/doubts/${doubt._id}`,
        { text: editText, code: editCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Doubt updated:', res.data);
      setEditSuccess('Doubt updated successfully!');
      setEditError('');
      setShowEditForm(false);
      if (refreshDoubts) refreshDoubts();
    } catch (err) {
      console.error('Error updating doubt:', err);
      setEditError(err.response?.data?.message || 'Error updating doubt');
    }
  };

  return (
    <div className="doubt-card">
      {/* Header with clickable avatar and creation date */}
      <div className="doubt-header">
        {doubt.creator && doubt.creator.avatar ? (
          <Link to={`/profile/${doubt.creator.username}`}>
            <img
              src={doubt.creator.avatar}
              alt={`${doubt.creator.username}'s avatar`}
              className="avatar"
            />
          </Link>
        ) : (
          <Link to={`/profile/${doubt.creator?.username || 'unknown'}`}>
            <div className="avatar placeholder">
              {doubt.creator?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        )}
        <div className="header-info">
          <span className="username">{doubt.creator?.username || 'Unknown'}</span>
          <span className="created-at">
            {new Date(doubt.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {showEditForm ? (
        <div>
          <h3>Edit Doubt</h3>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
            placeholder="Edit doubt text..."
          />
          <div style={{ marginBottom: '10px' }}>
            <CodeEditor 
              initialCode={editCode}
              onChange={(newCode) => setEditCode(newCode)}
            />
          </div>
          {editError && <p className="error-message">{editError}</p>}
          {editSuccess && <p className="success-message">{editSuccess}</p>}
          <button className="icon-btn" onClick={handleEdit}>
            <FaEdit /> Save
          </button>
          <button className="icon-btn" onClick={() => setShowEditForm(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <div className="doubt-content">
            <p>{doubt.text}</p>
          </div>
          {doubt.code && (
            <div>
              <button
                className="toggle-btn"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? (
                  <>
                    <FaChevronUp /> Hide Code
                  </>
                ) : (
                  <>
                    <FaChevronDown /> Show Code
                  </>
                )}
              </button>
              {showCode && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Code:</h4>
                  <CodeEditorRender code={doubt.code} language="cpp" />
                </div>
              )}
            </div>
          )}
          {isCreator && (
            <div className="button-group">
              <button className="icon-btn" onClick={() => setShowEditForm(true)}>
                <FaEdit />
              </button>
              <button className="icon-btn delete" onClick={handleDelete}>
                <FaTrashAlt />
              </button>
            </div>
          )}
          <button className="icon-btn reply-btn" onClick={() => setShowReplyForm(!showReplyForm)}>
            <FaReply />
          </button>
          {showReplyForm && (
            <ReplyForm onSubmit={handleReply} onCancel={() => setShowReplyForm(false)} />
          )}
          {doubt.replies && doubt.replies.length > 0 && (
            <div className="replies-section">
              <button className="toggle-btn" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? (
                  <>
                    <FaChevronUp /> Hide Replies
                  </>
                ) : (
                  <>
                    <FaChevronDown /> Show Replies
                  </>
                )}
              </button>
              {showReplies && (
                <div>
                  <h4>Replies:</h4>
                  <ul>
                    {doubt.replies.map((reply) => (
                      <li key={reply._id}>
                        <p>{reply.text}</p>
                        {reply.code && (
                          <div>
                            <ReplyCodeToggle code={reply.code} />
                          </div>
                        )}
                        <small>
                          Replied by {reply.responder?.username || 'Unknown'} on{' '}
                          {new Date(reply.createdAt).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReplyCodeToggle = ({ code }) => {
  const [showCode, setShowCode] = useState(false);
  return (
    <div>
      <button className="reply-toggle-btn" onClick={() => setShowCode(!showCode)}>
        {showCode ? 'Hide Code' : 'Show Code'}
      </button>
      {showCode && (
        <div style={{ marginTop: '5px' }}>
          <CodeEditorRender code={code} language="cpp" />
        </div>
      )}
    </div>
  );
};

export default DoubtCard;
