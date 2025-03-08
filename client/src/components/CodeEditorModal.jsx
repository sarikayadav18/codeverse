import React from 'react';
import CodeEditor from './CodeEditor';
import { useSelector } from 'react-redux';
import './CodeEditorModal.css';

const CodeEditorModal = ({ onCancel, onAdd }) => {
  // Retrieve the code from the Redux store
  const code = useSelector((state) => state.editor.code);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Code</h3>
        {/* Render CodeEditor. It will update Redux as the user types. */}
        <CodeEditor />
        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onAdd(code)}>Add Code</button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;
