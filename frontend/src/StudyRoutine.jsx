import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gaps } from './data';
import { getStudent } from './studentsStore';
import DailyTasks from './DailyTasks';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudyRoutine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = (studentId && getStudent(studentId)) || state;
  const name = student?.name;

  const dailyStudyHours = student?.dailyStudyHours || {};

  const rows = weekdays.map((day, i) => ({
    day,
    hours: dailyStudyHours[day] || '',
    topic1: gaps[i * 2] || null,
    topic2: gaps[i * 2 + 1] || null,
  }));

  return <>
    <button className="back-link" onClick={() => studentId ? navigate(`/students/${studentId}`) : navigate(-1)}><ArrowRight size={15} className="back-arrow" /> Back to student details</button>
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

    <DailyTasks />
  </>;
}
