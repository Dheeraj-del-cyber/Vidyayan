import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { gaps } from './data';

// The home/destination topic lists mirror the same demo curriculum content
// used on the Curriculum gap page (App.jsx) - there is no real per-state
// curriculum database in this app, so this is the one existing dataset
// rather than something invented for this page. The gap count and topics
// come straight from data.js's `gaps` array.
const homeTopics = ['Numbers', 'Addition', 'Subtraction', 'Multiplication', 'Fractions'];

export default function StudentAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.name) {
    return <>
      <p>No student details were found for this page.</p>
      <button className="primary-button" onClick={() => navigate('/add-student')}>Add a student</button>
    </>;
  }

  const { name, photo, previousState, currentState, dailyStudyHours } = state;
  const mathGaps = gaps.filter(g => g.subject === 'Mathematics');
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase() || 'ST';

  return <>
    <button className="back-link" onClick={() => navigate('/')}><ArrowRight size={15} className="back-arrow" /> Back to dashboard</button>

    <div className="profile-hero">
      <div className="profile-hero-main">
        <span className="avatar avatar-coral">
          {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : initials}
        </span>
        <div><span className="eyebrow">Learning profile</span><h1>{name}</h1></div>
      </div>
    </div>

    <div className="gap-report">
      <div className="report-header">
        <div><span className="eyebrow">Analysis for {name}</span><h2>What needs bridging</h2></div>
        <span className="analysis-complete"><CheckCircle2 size={16} /> Analysis complete</span>
      </div>
      <div className="subject-comparison">
        <div className="subject-heading">
          <span className="subject-icon coral-bg"><BookOpen size={18} /></span>
          <div><h3>Mathematics</h3><span>{homeTopics.length} topics compared</span></div>
          <span className="subject-count">{mathGaps.length} gaps</span>
        </div>
        <div className="curriculum-columns">
          <div>
            <span className="column-label">Home curriculum · {previousState || 'Previous state'}</span>
            {homeTopics.map(x => <span className="topic complete" key={x}><Check size={15} />{x}</span>)}
          </div>
          <div>
            <span className="column-label">Destination curriculum · {currentState || 'Current state'}</span>
            {homeTopics.map(x => <span className="topic complete" key={x}><Check size={15} />{x}</span>)}
            {mathGaps.map(g => <span className="topic gap" key={g.topic}><AlertTriangle size={15} />{g.topic}</span>)}
          </div>
        </div>
      </div>
    </div>

    <div className="form-actions" style={{ justifyContent: 'flex-start', padding: '22px 0 0' }}>
      <button className="primary-button" onClick={() => navigate('/students/study-routine', { state: { name, dailyStudyHours } })}>
        <Sparkles size={17} /> Study routine
      </button>
    </div>
  </>;
}
