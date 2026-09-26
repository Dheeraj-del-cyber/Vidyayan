import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { gaps } from './data';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudyRoutine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name;

  // Each identified gap (from data.js's real `gaps` list) gets its own
  // weekday, in order. Once every gap has a day, the remaining days are
  // left as review/rest rather than inventing extra topics that were
  // never part of the gap analysis.

  return <>
    <button className="back-link" onClick={() => navigate(-1)}><ArrowRight size={15} className="back-arrow" /> Back to analysis</button>
    <div className="page-intro"><div><div className="eyebrow">{name ? `For ${name}` : 'Weekly plan'}</div><h1>Study routine</h1><p>One identified gap at a time, spread across the week.</p></div></div>

    <div className="routine-list">
      {weekdays.map((day, i) => {
        const gap = gaps[i];
        return <div className="routine-day" key={day}>
          <span className="routine-day-name">{day}</span>
          {gap
            ? <span className="routine-day-target"><BookOpen size={15} /> {gap.subject} · {gap.topic}</span>
            : <span className="routine-day-target rest">No new topic scheduled — review &amp; practice</span>}
        </div>;
      })}
    </div>
  </>;
}
