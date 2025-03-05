import React, { useState, useEffect, useRef } from 'react';
import './Community.css';

const TASKS = [
  {
    id: 'yoga',
    description: 'Locate the Gentle Yoga for Seniors Workshop Details',
    hints: [
      'Check multiple sections carefully',
      'Look beyond the main navigation',
      'Some information might be hidden in sidebars or smaller text'
    ],
    additionalContext: 'This special workshop is designed for seniors with limited mobility. It\'s part of our wellness program and space is limited.'
  },
  {
    id: 'art',
    description: 'Find and Register for the Watercolor Painting Class',
    hints: [
      'Navigate through multiple dropdowns',
      'Read small print carefully',
      'Registration might require multiple steps'
    ],
    additionalContext: 'The class is taught by a local artist and includes all materials. Limited spots available for seniors interested in exploring their creativity.'
  },
  {
    id: 'contact',
    description: 'Discover Special Parking Arrangements for Mobility-Impaired Visitors',
    hints: [
      'Check footer links',
      'Explore accessibility information',
      'Look for small, easily missed details'
    ],
    additionalContext: 'We offer specialized parking for visitors with mobility challenges. The information is crucial but intentionally not prominently displayed.'
  },
  {
    id: 'map',
    description: 'Locate Accessible Entrance for Community Center',
    hints: [
      'Expand interactive elements',
      'Look for accessibility symbols',
      'Read between the lines of map information'
    ],
    additionalContext: 'The main entrance has specific accessibility features. Finding the exact location requires careful navigation.'
  }
];

const EVENTS_DATA = [
  {
    category: 'Wellness',
    events: [
      { 
        name: 'Gentle Yoga for Seniors', 
        description: 'Low-impact yoga for mobility and relaxation',
        time: 'Tuesdays 10:00 AM',
        location: 'Wellness Studio'
      },
      { 
        name: 'Meditation Workshop', 
        description: 'Mindfulness techniques for stress relief',
        time: 'Thursdays 2:00 PM',
        location: 'Quiet Room'
      }
    ]
  },
  {
    category: 'Arts & Crafts',
    events: [
      { 
        name: 'Watercolor Painting Class', 
        description: 'Explore watercolor techniques for beginners',
        time: 'Wednesdays 1:00 PM',
        location: 'Art Studio'
      },
      { 
        name: 'Knitting Circle', 
        description: 'Social knitting and craft sharing',
        time: 'Mondays 11:00 AM',
        location: 'Community Room'
      }
    ]
  }
];

const CommunityCenter = () => {
  const [currentTask, setCurrentTask] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [taskComplete, setTaskComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [interactionLog, setInteractionLog] = useState([]);
  const [taskStartTime, setTaskStartTime] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    setCurrentTask(randomTask);
    setTaskComplete(false);
    setShowHints(false);
    setInteractionLog([]);
    setTaskStartTime(Date.now());
  }, []);

  const logInteraction = (type, details) => {
    const newLog = [
      ...interactionLog,
      { 
        timestamp: Date.now() - taskStartTime, 
        type, 
        details 
      }
    ];
    setInteractionLog(newLog);
  };

  const handleTaskComplete = () => {
    const endTime = Date.now() - taskStartTime;
    setTaskComplete(true);
    logInteraction('task_complete', {
      taskId: currentTask.id,
      duration: endTime
    });
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'events':
        return (
          <div className="section">
            <h2>Upcoming Events and Workshops</h2>
            {EVENTS_DATA.map((category, index) => (
              <div key={index}>
                <h3>{category.category}</h3>
                {category.events.map((event, eventIndex) => (
                  <div 
                    key={eventIndex} 
                    className="section-item"
                    onClick={() => {
                      logInteraction('event_click', { event: event.name });
                      if (currentTask.id === 'yoga' && event.name.includes('Yoga')) {
                        handleTaskComplete();
                      }
                    }}
                  >
                    <h4>{event.name}</h4>
                    <p>{event.description}</p>
                    <p className="text-small">{event.time} | {event.location}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      case 'classes':
        return (
          <div className="section">
            <h2>Class Registration</h2>
            <form 
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                logInteraction('form_submit', { form: 'class_registration' });
                if (currentTask.id === 'art') {
                  handleTaskComplete();
                }
              }}
            >
              <input 
                type="text" 
                placeholder="Full Name" 
                required
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
              />
              <select 
                onChange={(e) => logInteraction('class_selection', { class: e.target.value })}
              >
                <option>Select Class</option>
                {EVENTS_DATA.flatMap(category => 
                  category.events.map(event => (
                    <option key={event.name} value={event.name}>
                      {event.name}
                    </option>
                  ))
                )}
              </select>
              <textarea 
                placeholder="Additional Notes" 
                rows="3"
              ></textarea>
              <button type="submit">
                Register for Class
              </button>
            </form>
          </div>
        );
      case 'contact':
        return (
          <div className="section">
            <h2>Contact & Accessibility</h2>
            <div 
              className="section-item"
              onClick={() => {
                logInteraction('contact_detail', { section: 'parking' });
                if (currentTask.id === 'contact') {
                  handleTaskComplete();
                }
              }}
            >
              <h3>Parking Accessibility</h3>
              <p>
                Special parking arrangements available for mobility-impaired visitors.
                Please inquire at front desk for detailed information.
              </p>
            </div>
            <div className="text-small">
              <p>123 Community Lane</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: accessibility@communitycenter.org</p>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="section">
            <h2>Center Location & Accessibility</h2>
            <div 
              className="map-interaction"
              onClick={() => {
                logInteraction('map_interaction', { action: 'expand' });
                if (currentTask.id === 'map') {
                  handleTaskComplete();
                }
              }}
            >
              <p>Click to Expand Accessibility Map</p>
            </div>
            <div className="section-item">
              <h3>Accessibility Features</h3>
              <ul>
                <li>Wheelchair Accessible Entrance</li>
                <li>Elevator Access</li>
                <li>Handicap Parking Available</li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="section">
            <h2>Welcome to Community Center</h2>
            <p>Discover programs, classes, and resources designed for our community.</p>
            <div className="grid">
              <div className="section-item">
                <h3>Latest News</h3>
                <p>New wellness programs starting this month!</p>
              </div>
              <div className="section-item">
                <h3>Upcoming Events</h3>
                <p>Check out our exciting community activities.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div>
          <h1>Community Center</h1>
          <div>
            {[
              { icon: '🏠', name: 'home', label: 'Home' },
              { icon: '📅', name: 'events', label: 'Events' },
              { icon: '🎨', name: 'classes', label: 'Classes' },
              { icon: '📞', name: 'contact', label: 'Contact' },
              { icon: '📍', name: 'map', label: 'Location' }
            ].map((item) => (
              <button
                key={item.name}
                className={activeSection === item.name ? 'active' : ''}
                onClick={() => {
                  setActiveSection(item.name);
                  logInteraction('navigation', { section: item.name });
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search events, classes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              logInteraction('search', { query: e.target.value });
            }}
          />
        </div>
      </nav>

      <div className="task-display">
        <div className="task-header">
          <span className="alert-circle">⚠️</span>
          <h2>Current Task: {currentTask?.description}</h2>
        </div>
        <p>{currentTask?.additionalContext}</p>
        <button onClick={() => setShowHints(!showHints)}>
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>

        {showHints && (
          <div className="hints">
            <h3>Hints:</h3>
            <ul>
              {currentTask?.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {renderSection()}

      {taskComplete && (
        <div className="task-completed">
          <h2>Task Completed!</h2>
          <p>Great job navigating the website!</p>
          <p>Time Taken: {((Date.now() - taskStartTime) / 1000).toFixed(2)} seconds</p>
          <button onClick={() => window.location.reload()}>Try Another Task</button>
          <button onClick={() => {
            const logBlob = new Blob(
              [JSON.stringify(interactionLog, null, 2)], 
              { type: 'application/json' }
            );
            const logUrl = URL.createObjectURL(logBlob);
            const a = document.createElement('a');
            a.href = logUrl;
            a.download = `interaction_log_${Date.now()}.json`;
            a.click();
          }}>
            Export Interaction Log
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityCenter;
