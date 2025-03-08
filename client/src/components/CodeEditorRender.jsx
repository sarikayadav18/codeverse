import React, { useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { BiCopy } from 'react-icons/bi';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';
import './CodeEditor.css'; // Reuse existing CSS if available

const CodeEditorRender = ({ code: initialCode, language = 'cpp' }) => {
  // Code is provided via props and is read-only in the editor.
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const editorRef = useRef();

  // Toolbar functions
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleFontSizeChange = (increment) => {
    setFontSize(fontSize + increment);
  };

  const handleRunCode = async () => {
    const languageVersionMap = {
      javascript: '18.15.0',
      typescript: '5.0.3',
      python: '3.10.0',
      java: '15.0.2',
      csharp: '6.12.0',
      c: '10.2.0',
      cpp: '10.2.0',
    };

    const version = languageVersionMap[language];

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: language,
        version: version,
        files: [{ content: initialCode }],
        stdin: customInput,
      });
      setOutput(response.data.run.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
    }
  };

  return (
    <div className="code-editor-container">
      <div className="toolbar">
        <div className="controls">
          <button onClick={() => handleFontSizeChange(1)}><FiPlus /></button>
          <button onClick={() => handleFontSizeChange(-1)}><FiMinus /></button>
          <button onClick={handleThemeToggle}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <button onClick={() => handleCopy(initialCode)}><BiCopy /></button>
          <button onClick={handleRunCode}>Run Code</button>
        </div>
      </div>
      <div className="editor" style={{ height: '200px' }}>
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          value={initialCode}
          options={{
            fontSize,
            automaticLayout: true,
            readOnly: true,
          }}
        />
      </div>
      <div className="output-section">
        <div className="input-box">
          <h2>Custom Input</h2>
          <button onClick={() => handleCopy(customInput)}><BiCopy /></button>
          <textarea 
            value={customInput} 
            onChange={(e) => setCustomInput(e.target.value)} 
            rows="4" 
          />
        </div>
        <div className="output-box">
          <h2>Output</h2>
          <button onClick={() => handleCopy(output)}><BiCopy /></button>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorRender;
