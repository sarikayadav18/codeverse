import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AskAnythingField from '../components/AskAnythingField';
import DoubtList from '../components/DoubtList';
import DoubtCreationModal from '../components/DoubtCreationModal';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [doubts, setDoubts] = useState([
    "What is React?",
    "How do I use hooks?",
    "What is state in React?",
  ]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const addDoubt = (doubt) => {
    setDoubts([doubt, ...doubts]);
    closeModal();
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <AskAnythingField onClick={openModal} />
        <DoubtList doubts={doubts} />
      </div>
      {showModal && (
        <DoubtCreationModal onClose={closeModal} onSubmit={addDoubt} />
      )}
    </div>
  );
};

export default LandingPage;
