import React, { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { BiCopy } from 'react-icons/bi';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCode } from '../redux/slices/codeSlice';
import './CodeEditor.css';

const CodeEditor = (props) => {
  // Get the current code from Redux
  const code = useSelector((state) => state.editor.code);
  const dispatch = useDispatch();

  // Local states for other editor settings
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const editorRef = useRef();
  const containerRef = useRef();
  const [editorHeight, setEditorHeight] = useState(70);

  const handleEditorChange = (value) => {
    dispatch(setCode(value)); // Update code in Redux
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleInput = (e) => {
    setCustomInput(e.target.value);
  };

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

  const handleRunCode = async (e) => {
    e.preventDefault();
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
        files: [{ content: code }],
        stdin: customInput,
      });
      setOutput(response.data.run.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
    }
  };

  return (
    <div ref={containerRef} className={`code-editor-container ${theme}`}>
      <div className="toolbar">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <div className="controls">
          <button onClick={() => handleFontSizeChange(1)}><FiPlus /></button>
          <button onClick={() => handleFontSizeChange(-1)}><FiMinus /></button>
          <button onClick={handleThemeToggle}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <button onClick={() => handleCopy(code)}><BiCopy /></button>
          <button onClick={handleRunCode}>Run Code</button>
        </div>
      </div>
      <div className="editor" style={{ height: `${editorHeight}%` }}>
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          value={code}
          onChange={handleEditorChange}
          options={{ fontSize, automaticLayout: true }}
        />
      </div>
      <div className="output-section">
        <div className="input-box">
          <h2>Custom Input</h2>
          <button onClick={() => handleCopy(customInput)}><BiCopy /></button>
          <textarea value={customInput} onChange={handleInput} rows="4" />
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

export default CodeEditor;
