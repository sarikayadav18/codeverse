// src/components/DoubtCard.jsx
import React, { useState } from 'react';
import CodeEditorRender from './CodeEditorRender';
import axios from 'axios';
import ReplyForm from './ReplyForm';

const DoubtCard = ({ doubt, refreshDoubts }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // Toggle replies visibility
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState('');

  const handleReply = async (replyText, replyCode, parentReplyId = null) => {
    if (!replyText.trim()) {
      setReplyError('Reply text is required.');
      return;
    }
    try {
      // Retrieve token from localStorage if needed
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
      // Optionally refresh the doubts list
      if (refreshDoubts) refreshDoubts();
    } catch (err) {
      console.error('Error adding reply:', err);
      setReplyError(err.response?.data?.message || 'Error adding reply');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
      <div>
        <h3>Doubt:</h3>
        <p>{doubt.text}</p>
      </div>
      {doubt.code && (
        <div>
          <button onClick={() => setShowCode(!showCode)}>
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
          {showCode && (
            <div style={{ marginTop: '10px' }}>
              <h4>Code:</h4>
              <CodeEditorRender code={doubt.code} language="cpp" />
            </div>
          )}
        </div>
      )}
      <div>
        <small>
          Posted by {doubt.creator?.username || 'Unknown'} on {new Date(doubt.createdAt).toLocaleString()}
        </small>
      </div>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {showReplyForm && (
        <ReplyForm onSubmit={handleReply} onCancel={() => setShowReplyForm(false)} />
      )}
      {replyError && <p style={{ color: 'red' }}>{replyError}</p>}
      {replySuccess && <p style={{ color: 'green' }}>{replySuccess}</p>}
      {doubt.replies && doubt.replies.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? 'Hide Replies' : 'Show Replies'}
          </button>
          {showReplies && (
            <div>
              <h4>Replies:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {doubt.replies.map((reply) => (
                  <li key={reply._id} style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
                    <p>{reply.text}</p>
                    {reply.code && (
                      <div style={{ marginTop: '5px' }}>
                        <button onClick={() => reply.showCode = !reply.showCode}>
                          {reply.showCode ? 'Hide Code' : 'Show Code'}
                        </button>
                        {reply.showCode && (
                          <div style={{ marginTop: '5px' }}>
                            <CodeEditorRender code={reply.code} language="cpp" />
                          </div>
                        )}
                      </div>
                    )}
                    <small>
                      Replied by {reply.responder?.username || 'Unknown'} on {new Date(reply.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoubtCard;
