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
        <div className="console-line">We build systems that remove drag.</div>
        <div className="console-line">Less process. More progress.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">For people who think faster than meetings move.</div>
        <div className="console-line">For ideas that can't sit in decks waiting for approval.</div>
        <div className="console-line">For work that needs to exist now — not after procurement.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">No dashboards. No forms. No second-guessing.</div>
        <div className="console-line">Just clear paths from concept to creation.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">GIZMET.DEV exists in the background —</div>
        <div className="console-line">quiet infrastructure for restless minds.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">No press. No spectacle.</div>
        <div className="console-line">Only the work, built clean and fast.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">This is where creative momentum lives.</div>
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