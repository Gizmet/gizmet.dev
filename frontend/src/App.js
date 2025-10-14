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
    "> GIZMET.DEV  [creative systems lab]",
    "",
    "initialising systems...",
    "handshake verified.",
    "workspace environment active.",
    "",
    "Integrated infrastructure for high-trust creative work.",
    "Secure, efficient — fewer steps from idea to execution.",
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
        <div className="console-line">We remove friction between idea and creation.</div>
        <div className="console-line">Fewer logins. Fewer meetings. Faster output.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">For producers, journalists and creative leads who need work that moves at the speed of thought.</div>
        <div className="console-line">We integrate tools and systems into a single workspace that remembers context, runs background research, and delivers previewed outputs — on your terms.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">No public portfolios. No case studies posted here.</div>
        <div className="console-line">Everything is confidential by default. Access is by introduction.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">GIZMET.DEV builds systems that work in production: reliable infrastructure, versioned source, secure sync, and scripted previews you can send to a client in hours not days.</div>
        <div className="console-line">&nbsp;</div>
        <div className="console-line">This is practical R&D for people who make things happen.</div>
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