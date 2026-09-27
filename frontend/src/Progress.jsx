import { useState } from 'react';
import { Download, BookOpen, Flame, Award, Clock, ArrowRight, TrendingUp, Sparkles, CheckCircle2, Target } from 'lucide-react';
import './progress.css';

const subjectData = [
  { 
    name: 'Mathematics', 
    progress: 72, 
    completed: 8, 
    total: 12, 
    color: 'coral', 
    tone: '#0f172a', 
    stops: ['#0f172a', '#334155'], 
    history: [40, 48, 55, 62, 68, 72] 
  },
  { 
    name: 'Science', 
    progress: 61, 
    completed: 6, 
    total: 10, 
    color: 'teal', 
    tone: '#0f172a', 
    stops: ['#0f172a', '#334155'], 
    history: [30, 35, 42, 50, 56, 61] 
  },
  { 
    name: 'English', 
    progress: 80, 
    completed: 9, 
    total: 11, 
    color: 'blue', 
    tone: '#0f172a', 
    stops: ['#0f172a', '#334155'], 
    history: [50, 58, 65, 72, 76, 80] 
  },
  { 
    name: 'Social Science', 
    progress: 54, 
    completed: 5, 
    total: 9, 
    color: 'yellow', 
    tone: '#0f172a', 
    stops: ['#0f172a', '#334155'], 
    history: [25, 30, 38, 44, 48, 54] 
  },
];

const weeklyMilestones = [
  { week: 'Week 1', total: 36, math: 40, science: 30, english: 50, social: 25 },
  { week: 'Week 2', total: 43, math: 48, science: 35, english: 58, social: 30 },
  { week: 'Week 3', total: 50, math: 55, science: 42, english: 65, social: 38 },
  { week: 'Week 4', total: 57, math: 62, science: 50, english: 72, social: 44 },
  { week: 'Week 5', total: 62, math: 68, science: 56, english: 76, social: 48 },
  { week: 'Week 6 (Current)', total: 68, math: 72, science: 61, english: 80, social: 54 },
];

export default function Progress() {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Overall statistics
  const overallPercentage = 68;

  // Graph calculations
  const activeSubjectObj = subjectData.find(s => s.name === selectedSubject);
  const graphValues = activeSubjectObj
    ? activeSubjectObj.history
    : weeklyMilestones.map(m => m.total);

  // Calculate statistics for header summary badges
  const currentScore = graphValues[graphValues.length - 1];
  const startScore = graphValues[0];
  const totalGrowth = currentScore - startScore;

  // Generate SVG path for liquid curve graph
  const points = graphValues.map((val, idx) => {
    const x = 55 + idx * 110;
    const y = 215 - (val / 100) * 165;
    return { x, y, val, label: weeklyMilestones[idx].week };
  });

  // Smooth SVG Bezier Path with tension
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) * 0.45;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) * 0.55;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},235 L ${points[0].x},235 Z`;

  return (
    <div className="progress-page">
      {/* Page Header */}
      <div className="page-intro">
        <div>
          <div className="eyebrow">A record that remembers</div>
          <h1>Learning Progress &amp; Analytics</h1>
          <p>Track child-wise chapter completions, bridge milestones, and real-time skill velocity.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => window.print()}>
          <Download size={16} /> Export Progress Report
        </button>
      </div>

      {/* Main Liquid Hero Banner */}
      <div className="liquid-hero-banner">
        <div className="hero-copy-cluster">
          <span className="section-kicker">Rahul Shetty · Class 5</span>
          <h2>Overall Learning Mastery</h2>
          <p>8 of 12 chapters completed across 4 subjects. Learning continuity remains intact across migrations.</p>
          
          <div className="hero-metrics-grid">
            <div className="hero-metric-pill">
              <Flame size={16} className="pill-icon flame" />
              <div><strong>12 Days</strong><span>Active Streak</span></div>
            </div>
            <div className="hero-metric-pill">
              <Award size={16} className="pill-icon award" />
              <div><strong>4 Bridged</strong><span>Completed Gaps</span></div>
            </div>
            <div className="hero-metric-pill">
              <Clock size={16} className="pill-icon clock" />
              <div><strong>18.5 Hrs</strong><span>Study Time</span></div>
            </div>
          </div>
        </div>

        {/* Liquid Wave Circular Gauge */}
        <div className="liquid-gauge-container">
          <div className="liquid-gauge-card">
            <div className="liquid-gauge-wrapper">
              <div className="liquid-fill-bg" style={{ height: `${overallPercentage}%` }}>
                {/* Wave 1 */}
                <svg className="liquid-wave wave-one" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,-20 1200,40 L1200,120 L0,120 Z" />
                </svg>
                {/* Wave 2 */}
                <svg className="liquid-wave wave-two" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M0,40 C200,-30 400,90 600,20 C800,-50 1000,70 1200,10 L1200,120 L0,120 Z" />
                </svg>
                {/* Bubbles */}
                <div className="liquid-bubble b1" />
                <div className="liquid-bubble b2" />
                <div className="liquid-bubble b3" />
              </div>
              <div className="liquid-gauge-center">
                <strong>{overallPercentage}<span>%</span></strong>
                <small>Mastery Achieved</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Liquid Graph Section */}
      <section className="moving-graph-section">
        <div className="graph-header-bar">
          <div>
            <span className="section-kicker"><TrendingUp size={14} /> Performance Trajectory</span>
            <h2>Weekly Mastery Graph</h2>
          </div>

          {/* Graph Metric Badges & Subject Filter Tabs */}
          <div className="graph-controls-wrapper">
            <div className="graph-stat-badge">
              <Sparkles size={13} style={{ color: '#0f172a' }} />
              <span>Growth: <strong>+{totalGrowth}%</strong></span>
            </div>

            <div className="graph-subject-tabs">
              <button
                type="button"
                className={`graph-tab ${selectedSubject === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedSubject('All')}
              >
                Overall
              </button>
              {subjectData.map(subj => (
                <button
                  key={subj.name}
                  type="button"
                  className={`graph-tab ${selectedSubject === subj.name ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subj.name)}
                >
                  {subj.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Liquid Line & Area Graph */}
        <div className="svg-graph-card">
          <div className="svg-graph-container">
            <svg className="liquid-svg-chart" viewBox="0 0 660 260" preserveAspectRatio="none">
              <defs>
                {/* Light area fill keeps the line and weekly movement easy to read. */}
                <linearGradient id="activeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#54ad8e" stopOpacity="0.17" />
                    <stop offset="70%" stopColor="#54ad8e" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#54ad8e" stopOpacity="0.0" />
                </linearGradient>

                  {/* Clear teal stroke contrasts against the pale chart fill. */}
                <linearGradient id="activeLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#287b64" />
                    <stop offset="100%" stopColor="#55a889" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Scale */}
              {[35, 85, 135, 185, 235].map((y, i) => (
                <g key={i}>
                  <line x1="45" y1={y} x2="635" y2={y} className="chart-grid-line" />
                  <text x="32" y={y + 4} textAnchor="end" fill="#82918a" fontSize="10" fontWeight="600">
                    {100 - i * 25}%
                  </text>
                </g>
              ))}

              {/* Translucent Dark Fill Area */}
              <path 
                key={`area-${selectedSubject}`} 
                d={areaPath} 
                fill="url(#activeAreaGradient)" 
                className="liquid-area-path animated-fade-in" 
              />

                {/* Animated mastery trend line */}
              <path
                key={`line-${selectedSubject}`}
                d={linePath}
                fill="none"
                stroke="url(#activeLineGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="liquid-animated-line animated-draw-path"
              />

              {/* Interactive Data Nodes */}
              {points.map((pt, idx) => (
                <g 
                  key={idx} 
                  className="graph-point-group" 
                  onMouseEnter={() => setHoveredPointIndex(idx)} 
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  {/* Subtle Pulse outer ring */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="10" 
                    fill="#b8dfcf" 
                    className="point-pulse-ring" 
                  />
                  
                  {/* Outer circle - crisp dark border */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="6" 
                    fill="#ffffff" 
                    stroke="#328b70" 
                    strokeWidth="3" 
                    className="point-circle-outer" 
                  />

                  {/* Center Black Dot */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="2.5" 
                    fill="#287b64" 
                  />
                  
                  {/* Hover Tooltip Popover */}
                  {hoveredPointIndex === idx && (
                    <g transform={`translate(${pt.x}, ${pt.y - 32})`} className="tooltip-group">
                      <rect 
                        x="-38" 
                        y="-26" 
                        width="76" 
                        height="30" 
                        rx="8" 
                        fill="#f2faf6" 
                        stroke="#bfddcd"
                        className="tooltip-box" 
                      />
                      <path d="M -5 4 L 0 9 L 5 4 Z" fill="#f2faf6" stroke="#bfddcd" />
                      <text x="0" y="-7" textAnchor="middle" fill="#285b49" fontSize="12" fontWeight="700">
                        {pt.val}% score
                      </text>
                    </g>
                  )}

                  {/* X Axis Labels */}
                  <text x={pt.x} y="254" textAnchor="middle" fill="#718078" fontSize="11" fontWeight="600">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Subject Cards Grid with Liquid Progress Bars */}
      <section className="subject-cards-section">
        <div className="section-title-bar">
          <span className="section-kicker"><BookOpen size={14} /> Subject Breakdown</span>
          <h2>Subject-wise Mastery &amp; Liquid Progress</h2>
        </div>

        <div className="subject-grid">
          {subjectData.map(subject => (
            <div className="subject-card" key={subject.name}>
              <div className="subject-card-top">
                <span className={`subject-icon ${subject.color}-bg`}>
                  <BookOpen size={18} />
                </span>
                <span className="subject-percentage">{subject.progress}%</span>
              </div>
              
              <h3>{subject.name}</h3>
              <p>{subject.completed} of {subject.total} chapters completed</p>

              {/* Liquid Wave Progress Bar */}
              <div className="liquid-progressbar-track">
                <div
                  className={`liquid-progressbar-fill ${subject.color}`}
                  style={{ width: `${subject.progress}%` }}
                >
                  <span className="liquid-bar-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Persistent Record Panel */}
      <section className="panel record-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker"><Target size={14} /> Persistent Learning Record</span>
            <h2>What Stays Carried Forward with Rahul</h2>
          </div>
          <button type="button" className="text-button" onClick={() => window.print()}>
            View full record <ArrowRight size={15} />
          </button>
        </div>

        <div className="record-grid">
          <div>
            <span>Completed chapters</span>
            <strong>18</strong>
          </div>
          <div>
            <span>Bridged gaps</span>
            <strong>4</strong>
          </div>
          <div>
            <span>Pending gaps</span>
            <strong className="highlight-number">2</strong>
          </div>
          <div>
            <span>Record Status</span>
            <strong className="status-live-pill"><CheckCircle2 size={13} /> Synchronized</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
