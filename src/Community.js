import React, { useState, useEffect, useRef } from 'react';
import './Community.css';

const TASKS = [
  {
    id: 'yoga',
    description: 'Locate the Gentle Yoga for Seniors Workshop Details',
    hints: [
      'Check multiple sections carefully',
      'Look beyond the main navigation',
      'Information might be in wellness events'
    ],
    additionalContext: 'Special workshop for seniors with limited mobility, part of our wellness program.'
  },
  {
    id: 'art',
    description: 'Find and Register for the Watercolor Painting Class',
    hints: [
      'Check class registration forms',
      'Look in arts & crafts section',
      'Complete all form fields'
    ],
    additionalContext: 'Beginner-friendly class with materials provided. Limited spots available.'
  },
  {
    id: 'facility',
    description: 'Locate the Wheelchair-Accessible Restroom Information',
    hints: [
      'Check accessibility sections',
      'Look in location maps',
      'Might be in small print'
    ],
    additionalContext: 'Important accessibility feature often overlooked by new visitors.'
  },
  {
    id: 'emergency',
    description: 'Find Emergency Exit Locations Floor Plan',
    hints: [
      'Check safety information',
      'Look in hidden menus',
      'Might require map interaction'
    ],
    additionalContext: 'Critical safety information required by law but not prominently displayed.'
  },
  {
    id: 'volunteer',
    description: 'Sign Up for Community Volunteering Opportunities',
    hints: [
      'Check secondary navigation',
      'Look for forms with time commitments',
      'Might be in multiple sections'
    ],
    additionalContext: 'We need helpers for events and daily operations. Background check required.'
  },
  {
    id: 'transport',
    description: 'Find Public Transportation Schedule to Center',
    hints: [
      'Check location section',
      'Look for PDF downloads',
      'Might be in accessibility info'
    ],
    additionalContext: 'Updated bus schedules available but not prominently featured.'
  },
  {
    id: 'donation',
    description: 'Make a Virtual Donation to the Center',
    hints: [
      'Look for payment forms',
      'Check secondary menus',
      'Might require multiple steps'
    ],
    additionalContext: 'We rely on community support. All donations are tax-deductible.'
  },
  {
    id: 'bookclub',
    description: 'Join the Senior Fiction Book Discussion Group',
    hints: [
      'Check events calendar',
      'Look in special programs',
      'Might be in newsletter'
    ],
    additionalContext: 'Monthly literary discussion group meeting in the community library.'
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
  },
  {
    category: 'Special Programs',
    events: [
      { 
        name: 'Senior Fiction Book Club', 
        description: 'Monthly literary discussion group',
        time: 'Last Friday 3:00 PM',
        location: 'Community Library'
      },
      { 
        name: 'Community Volunteer Orientation', 
        description: 'Learn about volunteering opportunities',
        time: 'First Monday 10:00 AM',
        location: 'Main Hall'
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
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                {category.events.map((event, eventIndex) => (
                  <div  style={{width: "335px"}}
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
        case 'about':
          return (
            <div className="section">
              <h2>About Us</h2>
              <div className="section-item">
                <h3>Volunteer Opportunities</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentTask.id === 'volunteer') handleTaskComplete();
                  }}
                >
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Email" required />
                  <button type="submit">Sign Up to Volunteer</button>
                </form>
              </div>
            </div>
          );
        case 'support':
          return (
            <div className="section">
              <h2>Support the Center</h2>
              <div 
                className="section-item"
                onClick={() => {
                  if (currentTask.id === 'donation') handleTaskComplete();
                }}
              >
                <h3>Make a Donation</h3>
                <form>
                  <input type="number" placeholder="Amount ($)" required />
                  <input type="text" placeholder="Card Number" required />
                  <button type="submit">Donate Now</button>
                </form>
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
        <div style={{display:"flex",flexDirection:"row",width:"100%", justifyContent:"space-between"}}> 
          <h1>Community Center</h1>
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

        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between" ,width:"100%"}}>
        {[
  { icon: '🏠', name: 'home', label: 'Home' },
  { icon: '📅', name: 'events', label: 'Events' },
  { icon: '🎨', name: 'classes', label: 'Classes' },
  { icon: '❤️', name: 'support', label: 'Support' },
  { icon: '👥', name: 'about', label: 'About' },
  { icon: '📞', name: 'contact', label: 'Contact' },
  { icon: '📍', name: 'map', label: 'Location' }
            ].map((item) => (
              <button style={{margin:"5px"}}
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
