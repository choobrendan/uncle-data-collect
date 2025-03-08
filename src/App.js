import React, { useState, useEffect, useRef } from "react";
import Basketball from "./Basketball";
import "./App.css";
import CommunityCenter from "./Community";
import Survey from "./Survey";

const App = () => {
  const [latestData, setLatestData] = useState({});
  const dataRef = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const lastHoverElement = useRef(null);
  const [nextGame, setNextGame] = useState(0);
  const eyeMovement = useRef({ x: null, y: null });
  const lastScrollPosition = useRef(0); // Store last scroll position
  const scrollDirection = useRef("none"); // Store current scroll direction

  // Function to determine scroll direction


  // Eye movement tracking (this is commented out in your provided code)
  // useEffect(() => {
  //   const webgazer = window.webgazer;

  //   // Start webgazer and set gaze listener
  //   webgazer
  //     .setGazeListener((data, clock) => {
  //       if (data) {
  //         eyeMovement.current = {
  //           x: data.x,
  //           y: data.y,
  //         };
  //       }
  //       console.log(data, clock);
  //     })
  //     .begin();

  //   return () => {
  //     if (window.webgazer) {
  //       try {
  //         window.webgazer.end();
  //       } catch (error) {
  //         console.warn("Error ending webgazer:", error);
  //       }
  //     }
  //   };
  // }, []);

  const getHoverType = (element) => {
    if (!element) return "none";
  
    // Check ARIA roles first for accessibility
    const role = element.getAttribute?.('role') || '';
    const classList = element.classList?.toString().toLowerCase() || "";
    const tagName = element.tagName?.toLowerCase() || "";
    const inputType = element.type?.toLowerCase() || "";
    const parent = element.parentElement;
  
    // Check for interactive elements first
    if (role === 'button' || classList.includes('btn') || classList.includes('button')) 
      return "button";
    if (role === 'link' || tagName === 'a') return "link";
    if (classList.includes('icon')) return "icon";
    
    // Form elements
    if (tagName === 'input') {
      if (inputType === 'search' || classList.includes('search')) return "search-bar";
      if (inputType === 'checkbox') return "checkbox";
      if (inputType === 'radio') return "radio";
      return "text-input";
    }
    if (tagName === 'textarea') return "text-area";
    if (tagName === 'select') return "dropdown";
  
    // Navigation elements
    if (role === 'navigation' || classList.includes('nav')) return "navigation-container";
    if (classList.includes('navbar-item') || classList.includes('nav-item')) return "navbar-item";
    if (classList.includes('breadcrumb')) return "breadcrumb";
    if (classList.includes('pagination')) return "pagination";
  
    // Text content types
    if (['h1','h2','h3','h4','h5','h6'].includes(tagName)) return "text";
    if (tagName === 'p' ) return "text";
    if (classList.includes('caption')) return "text";
    if (tagName === 'button') return "button";
    // Media elements
    if (tagName === 'img') return classList.includes('icon') ? "icon" : "image";
    if (tagName === 'video') return "video";
    if (tagName === 'audio') return "audio";
  
    // Containers and layout
    if (['header','footer','aside','main','section'].includes(tagName)) return "layout-container";
    if (classList.includes('card')) return "card-container";
    if (classList.includes('modal') || classList.includes('dialog')) return "modal";
    if (classList.includes('tooltip')) return "tooltip";
    
    // Lists and tables
    if (tagName === 'li') return "list-item";
    if (tagName === 'tr') return "table-row";
    if (tagName === 'td') return "table-cell";
    
    // Special cases
    if (classList.includes('spinner')) return "loader";
    if (classList.includes('progress')) return "progress-indicator";
    if (classList.includes('badge')) return "status-badge";
    
    // Text within interactive elements
    if (parent) {
      const parentType = getHoverType(parent);
      if (parentType === 'button') return "button-text";
      if (parentType === 'link') return "link-text";
      if (parentType === 'card') return "card-text";
    }
  
    // Fallback to generic types
    if (classList.includes('text')) return "static-text";
    if (element.isContentEditable) return "editable-content";
    
    return "container"; // Default for unclassified elements
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      lastHoverElement.current = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    const getScrollDirection = () => {
      const currentScrollPosition = window.scrollY;
      if (currentScrollPosition > lastScrollPosition.current) {
        scrollDirection.current = "down";
      } else if (currentScrollPosition < lastScrollPosition.current) {
        scrollDirection.current = "up";
      } else {
        scrollDirection.current = "none";
      }
      lastScrollPosition.current = currentScrollPosition;
    };
    
    // Set up continuous data collection
    const interval = setInterval(() => {
      // Update the scroll direction every 0.1 seconds
      getScrollDirection();
    
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
        isMouseDown: isMouseDown.current,
        eyeX: eyeMovement.current.x, // Add the eye movement X coordinate
        eyeY: eyeMovement.current.y, // Add the eye movement Y coordinate
        scrollDirection: scrollDirection.current, // Add the scroll direction
      };
    
      dataRef.current = [...dataRef.current, newEntry];
      setLatestData(newEntry);
    }, 100); // 0.1 seconds
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", getScrollDirection);
    };
  }, []);

  const handleDownload = () => {
    // Convert data to JSON string
    const jsonString = JSON.stringify(dataRef.current, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interaction-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="data-panel">
        <h3>Real-time Interaction Data</h3>
        <div className="data-entry">
          <div>Time: {latestData.time}</div>
          <div>Position X: {latestData.positionX}</div>
          <div>Position Y: {latestData.positionY}</div>
          <div>Hover Type: {latestData.hoverType}</div>
          <div>Mouse Down: {latestData.isMouseDown ? "Yes" : "No"}</div>
          <div>Eye X: {latestData.eyeX}</div> {/* Display eye movement X */}
          <div>Eye Y: {latestData.eyeY}</div> {/* Display eye movement Y */}
          <div>Scroll Direction: {latestData.scrollDirection}</div> {/* Display scroll direction */}
        </div>

        <button onClick={handleDownload} className="download-button">
          Download Data
        </button>
      </div>
      {nextGame === 0 && <Basketball setNextGame={setNextGame} />}
      {nextGame === 1 && <CommunityCenter setNextGame={setNextGame} />}
      {nextGame === 2 && <Survey setNextGame={setNextGame} />}
    </div>
  );
};

export default App;
