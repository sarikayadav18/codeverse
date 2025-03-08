import React, { useState } from 'react';
import CodeEditorModal from './CodeEditorModal';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCode } from '../redux/slices/codeSlice';

// Set Axios base URL using environment variable (adjust if needed)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DoubtCreation = () => {
  const [text, setText] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const dispatch = useDispatch();
  const code = useSelector((state) => state.editor.code);

  const handlePost = async () => {
    if (!text.trim()) {
      setError('Doubt text is required.');
      return;
    }
    
    // Retrieve the token from localStorage (adjust key name if needed)
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        '/api/doubts',
        { text, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Posted doubt:', res.data);
      setSuccess('Doubt posted successfully!');
      setError('');
      // Reset form text and clear the code in Redux
      setText('');
      dispatch(setCode(''));
    } catch (err) {
      console.error('Error posting doubt:', err);
      setError(err.response?.data?.message || 'Posting doubt failed');
    }
  };

  return (
    <div>
      <h2>Create Doubt</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your doubt here..."
        rows={10}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />

      <br /><br />
      <button onClick={() => setShowCodeEditor(true)}>Add Code</button>
      {showCodeEditor && (
        <CodeEditorModal 
          onCancel={() => setShowCodeEditor(false)}
          onAdd={(addedCode) => {
            // Code is already updated in Redux, so we simply close the modal.
            setShowCodeEditor(false);
          }}
        />
      )}
      <br /><br />
      <button onClick={handlePost}>Post Doubt</button>
    </div>
  );
};

export default DoubtCreation;
