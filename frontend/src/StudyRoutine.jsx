import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gaps } from './data';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudyRoutine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name;
  // Study hours come only from what was actually entered against the
  // child's daily routine timetable on the Add student page. A day with
  // no entry stays blank here - it is never filled in with a guessed or
  // default number.
  const dailyStudyHours = state?.dailyStudyHours || {};

  // Topics come from the real identified gaps (data.js `gaps`), two per
  // day, taken in order. Once the gap list runs out, remaining topic
  // cells for later days are left blank rather than inventing more
  // topics that were never part of the gap analysis.
  const rows = weekdays.map((day, i) => ({
    day,
    hours: dailyStudyHours[day] || '',
    topic1: gaps[i * 2] || null,
    topic2: gaps[i * 2 + 1] || null,
  }));

  return <>
    <button className="back-link" onClick={() => navigate(-1)}><ArrowRight size={15} className="back-arrow" /> Back to analysis</button>
    <div className="page-intro"><div><div className="eyebrow">{name ? `For ${name}` : 'Weekly plan'}</div><h1>Study routine</h1><p>Study hours from the daily routine timetable, two focus topics a day from the identified gaps.</p></div></div>

    <div className="routine-table-wrap">
      <div className="routine-table-head">
        <span>Day</span><span>Study hours</span><span>Topic 1</span><span>Topic 2</span>
      </div>
      {rows.map(row => (
        <div className="routine-table-row" key={row.day}>
          <span className="routine-day-name">{row.day}</span>
          <span>{row.hours ? `${row.hours} hrs` : ''}</span>
          <span>{row.topic1 ? `${row.topic1.subject} · ${row.topic1.topic}` : ''}</span>
          <span>{row.topic2 ? `${row.topic2.subject} · ${row.topic2.topic}` : ''}</span>
        </div>
      ))}
    </div>
  </>;
}
