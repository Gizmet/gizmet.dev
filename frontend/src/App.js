import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Console = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);

  const consoleLines = [
    "> GIZMET.DEV  [creative skunkworks]",
    "",
    "initialising systems...",
    "handshake verified.",
    "local intelligence active.",
    "",
    "Private infrastructure for off-record projects.",
    "No dashboards. No clients. No noise.",
    "",
    "contact: gizmet@protonmail.com"
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentLine >= consoleLines.length) {
      setBootComplete(true);
      return;
    }

    const line = consoleLines[currentLine];
    
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev];
          if (!newLines[currentLine]) {
            newLines[currentLine] = "";
          }
          newLines[currentLine] = line.substring(0, currentChar + 1);
          return newLines;
        });
        setCurrentChar(currentChar + 1);
      }, 30); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(currentLine + 1);
        setCurrentChar(0);
      }, 200); // Pause between lines
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, consoleLines]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="console-container">
      <Link to="/manifesto" className="manifesto-link">
        [manifesto]
      </Link>
      
      <div className="console-content">
        {lines.map((line, index) => (
          <div key={index} className="console-line">
            {index === 9 ? (
              <>
                contact:{" "}
                <a 
                  href="mailto:gizmet@protonmail.com" 
                  className="console-email"
                >
                  gizmet@protonmail.com
                </a>
              </>
            ) : (
              line
            )}
            {index === currentLine && !bootComplete && (
              <span className={`cursor ${showCursor ? 'visible' : ''}`}>▮</span>
            )}
          </div>
        ))}
        {bootComplete && (
          <span className={`cursor ${showCursor ? 'visible' : ''}`}>▮</span>
        )}
      </div>
    </div>
  );
};

const Manifesto = () => {
  return (
    <div className="console-container">
      <Link to="/" className="manifesto-link">
        [back]
      </Link>
      
      <div className="console-content manifesto-content">
        <div className="console-line">&gt; MANIFESTO</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">We build in private.</div>
        <div className="console-line">No timelines. No milestones. No visibility.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">This is infrastructure for experiments that don't need permission.</div>
        <div className="console-line">For work that happens off-grid, outside business hours,</div>
        <div className="console-line">in the margins where curious people operate best.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">No portfolios. No case studies. No proof of concept.</div>
        <div className="console-line">Just quiet momentum and deliberate craft.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">If you need a dashboard, this isn't for you.</div>
        <div className="console-line">If you need validation, you're in the wrong lab.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">GIZMET.DEV operates on trust and discretion.</div>
        <div className="console-line">No noise. No theatre. No exit strategy.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">This is the skunkworks.</div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Console />} />
          <Route path="/manifesto" element={<Manifesto />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;