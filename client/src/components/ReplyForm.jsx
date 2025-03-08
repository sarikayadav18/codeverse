// // src/components/ReplyForm.jsx
// import React, { useState } from 'react';
// import CodeEditorModal from './CodeEditorModal';

// const ReplyForm = ({ onSubmit, onCancel }) => {
//   const [replyText, setReplyText] = useState('');
//   const [replyCode, setReplyCode] = useState('');
//   const [showCodeEditorModal, setShowCodeEditorModal] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(replyText, replyCode);
//     setReplyText('');
//     setReplyCode('');
//   };

//   return (
//     <div style={{ marginTop: '10px', border: '1px solid #eee', padding: '10px' }}>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={replyText}
//           onChange={(e) => setReplyText(e.target.value)}
//           placeholder="Write your reply here..."
//           rows={5}
//           style={{ width: '100%', padding: '10px', fontSize: '14px' }}
//         />
//         <br />
//         <button type="button" onClick={() => setShowCodeEditorModal(true)}>
//           Add Code
//         </button>
//         {showCodeEditorModal && (
//           <CodeEditorModal 
//             onCancel={() => setShowCodeEditorModal(false)}
//             onAdd={(code) => {
//               setReplyCode(code);
//               setShowCodeEditorModal(false);
//             }}
//           />
//         )}
//         <br />
//         <button type="submit">Post Reply</button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default ReplyForm;
// src/components/ReplyForm.jsx
import React, { useState } from 'react';
import CodeEditorModal from './CodeEditorModal';

const ReplyForm = ({ onSubmit, onCancel }) => {
  const [replyText, setReplyText] = useState('');
  const [replyCode, setReplyCode] = useState('');
  const [showCodeEditorModal, setShowCodeEditorModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(replyText, replyCode);
    setReplyText('');
    setReplyCode('');
  };

  return (
    <div style={{ marginTop: '10px', border: '1px solid #eee', padding: '10px' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply here..."
          rows={5}
          style={{ width: '100%', padding: '10px', fontSize: '14px' }}
        />
        <br />
        <button type="button" onClick={() => setShowCodeEditorModal(true)}>
          Add Code
        </button>
        {showCodeEditorModal && (
          <CodeEditorModal 
            onCancel={() => setShowCodeEditorModal(false)}
            onAdd={(code) => {
              setReplyCode(code);
              setShowCodeEditorModal(false);
            }}
          />
        )}
        <br />
        <button type="submit">Post Reply</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ReplyForm;

