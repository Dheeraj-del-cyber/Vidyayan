import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './student-details.css';
import { AlertTriangle, ArrowRight, BookOpen, CalendarDays, Check, CheckCircle2, MapPinned, Sparkles } from 'lucide-react';
import { gaps } from './data';
import { getStudent } from './studentsStore';

// The home/destination topic lists mirror the same demo curriculum content
// used on the Curriculum gap page (App.jsx) - there is no real per-state
// curriculum database in this app, so this is the one existing dataset
// rather than something invented for this page. The gap count and topics
// come straight from data.js's `gaps` array.
const homeTopics = ['Numbers', 'Addition', 'Subtraction', 'Multiplication', 'Fractions'];

// The actual student-detail + gap-report markup, split out from the routed
// page below so it can also be reused on the Curriculum gap menu page
// (App.jsx), which shows the same per-student analysis without needing a
// /students/:id route param.
export function StudentAnalysisView({ student, onBack }) {
  const navigate = useNavigate();
  const { id, name, photo, className, age, previousState, currentState, migratedMonth } = student;
  const mathGaps = gaps.filter(g => g.subject === 'Mathematics');
  const missingMathGaps = mathGaps.filter(g => g.status === 'Missing').length;
  const studentKey = id;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase() || 'ST';

  return <>
    {onBack && <button className="back-link" onClick={onBack}><ArrowRight size={15} className="back-arrow" /> Back to dashboard</button>}

    <div className="profile-hero">
      <div className="profile-hero-main">
        <span className="avatar avatar-coral">
          {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : initials}
        </span>
        <div><span className="eyebrow">Student details</span><h1>{name}</h1><p>{[className, age ? `${age} years old` : ''].filter(Boolean).join(' · ')}</p></div>
      </div>
    </div>

    <section className="student-detail-overview" aria-label={`${name}'s learning and migration details`}>
      <article className="student-detail-card">
        <span className="student-detail-label">LEARNING STATUS</span>
        <div className="student-learning-status"><span className="student-status-dot" /><strong>{missingMathGaps ? 'Bridge lessons needed' : 'No learning gaps identified'}</strong></div>
        <p>{missingMathGaps} curriculum topics flagged for review in the current comparison.</p>
        <button className="text-button" onClick={() => document.querySelector('.gap-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>View learning analysis <ArrowRight size={15} /></button>
      </article>
      <article className="student-detail-card">
        <span className="student-detail-label">MIGRATION HISTORY</span>
        <div className="student-migration-route">
          <div><small>FROM</small><strong>{previousState || 'Not recorded'}</strong></div>
          <ArrowRight size={17} />
          <div><small>TO</small><strong>{currentState || 'Not recorded'}</strong></div>
        </div>
        <p><MapPinned size={14} /> {migratedMonth ? `Moved ${new Date(`${migratedMonth}-01T12:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}` : 'Migration date not recorded'}</p>
      </article>
    </section>

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
      <button className="primary-button" onClick={() => navigate(studentKey ? `/students/${studentKey}/study-routine` : '/students/study-routine', { state: student })}>
        <CalendarDays size={17} /> Generate schedule
      </button>
    </div>
  </>;
}

export default function StudentAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = (studentId && getStudent(studentId)) || state;

  if (!student?.name) {
    return <>
      <p>No student details were found for this page.</p>
      <button className="primary-button" onClick={() => navigate('/add-student')}>Add a student</button>
    </>;
  }

  return <StudentAnalysisView student={student} onBack={() => navigate('/')} />;
}
