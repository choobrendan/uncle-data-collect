import React, { useState, useEffect, useRef } from 'react';
import Basketball from './Basketball';
import './App.css';
import CommunityCenter from './Community';

const App = () => {
  const [latestData, setLatestData] = useState({});
  const dataRef = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const lastHoverElement = useRef(null);
  const [nextGame,setNextGame] = useState(1)
  // Categorize elements based on their characteristics
  const getHoverType = (element) => {
    if (!element) return 'none';
    
    // Check class names first
    const classList = element.classList?.toString() || '';
    if (classList.includes('button')) return 'button';
    if (classList.includes('title') || classList.includes('message')) return 'text';
    if (classList.includes('ball') || classList.includes('hoop')) return 'game-object';
    
    // Then check tag name
    switch(element.tagName.toLowerCase()) {
      case 'button': return 'button';
      case 'img': return 'image';
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3': return 'text';
      default: return 'object';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      lastHoverElement.current = document.elementFromPoint(e.clientX, e.clientY);
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      lastHoverElement.current = document.elementFromPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      lastHoverElement.current = document.elementFromPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
    };

    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Set up continuous data collection
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString();
      const currentElement = document.elementFromPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
      
      const newEntry = {
        time: timestamp,
        positionX: mousePosition.current.x,
        positionY: mousePosition.current.y,
        hoverType: getHoverType(currentElement),
        isMouseDown: isMouseDown.current
      };

      dataRef.current = [...dataRef.current, newEntry];
      setLatestData(newEntry);
    }, 10000); // 0.1 seconds

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  const handleDownload = () => {
    // Convert data to JSON string
    const jsonString = JSON.stringify(dataRef.current, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interaction-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  console.log(nextGame)
  return (
    <div className="app-container">
      <div className="data-panel">
        <h3>Real-time Interaction Data</h3>
        <div className="data-entry">
          <div>Time: {latestData.time}</div>
          <div>Position X: {latestData.positionX}</div>
          <div>Position Y: {latestData.positionY}</div>
          <div>Hover Type: {latestData.hoverType}</div>
          <div>Mouse Down: {latestData.isMouseDown ? 'Yes' : 'No'}</div>
        </div>

        <button 
          onClick={handleDownload}
          className="download-button"
        >
          Download Data
        </button>
      </div>
      {(nextGame===0)&&<Basketball setNextGame={setNextGame} />}
      <CommunityCenter></CommunityCenter>
    </div>
  );
};

export default App;