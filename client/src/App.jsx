import React from 'react';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import CodeEditor from './components/CodeEditor';
function App() {
  return (
    <Router>
      <div >
        
        <Routes>
          <Route path= "/profile/:username" element = {<Profile />}></Route>
          <Route path = "/" element = {<LandingPage />}></Route>
          <Route path = "/code-editor" element = {<CodeEditor />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

