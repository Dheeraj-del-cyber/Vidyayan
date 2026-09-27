import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gaps } from './data';
import { getStudent } from './studentsStore';
import DailyTasks from './DailyTasks';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const demoRoutine = {
  Monday: { hours: '1.5 hrs', topic1: 'Math · Fractions', topic2: 'Science · Plant growth' },
  Tuesday: { hours: '2 hrs', topic1: 'English · Reading comprehension', topic2: 'Social Studies · Local governance' },
  Wednesday: { hours: '1.5 hrs', topic1: 'Math · Decimals', topic2: 'Hindi · Grammar practice' },
  Thursday: { hours: '2 hrs', topic1: 'Science · Force and motion', topic2: 'Computer · Typing basics' },
  Friday: { hours: '1.5 hrs', topic1: 'English · Writing skills', topic2: 'Math · Word problems' },
  Saturday: { hours: '2.5 hrs', topic1: 'Science · Earth and sky', topic2: 'Art · Drawing exercises' },
  Sunday: { hours: '1 hr', topic1: 'Revision · Weekly recap', topic2: 'Learning · Reading time' },
};

export default function StudyRoutine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = (studentId && getStudent(studentId)) || state;
  const name = student?.name;

  const dailyStudyHours = student?.dailyStudyHours || {};

  const rows = weekdays.map((day, i) => {
    const saved = dailyStudyHours[day];
    const fallback = demoRoutine[day];
    const topic1 = gaps[i * 2];
    const topic2 = gaps[i * 2 + 1];

    return {
      day,
      hours: saved || fallback.hours,
      topic1: saved ? (topic1 ? `${topic1.subject} · ${topic1.topic}` : '') : (fallback.topic1 || ''),
      topic2: saved ? (topic2 ? `${topic2.subject} · ${topic2.topic}` : '') : (fallback.topic2 || ''),
    };
  });

  return <>
    <button className="back-link" onClick={() => studentId ? navigate(`/students/${studentId}`) : navigate(-1)}><ArrowRight size={15} className="back-arrow" /> Back to student details</button>
    <div className="page-intro"><div><div className="eyebrow">{name ? `For ${name}` : 'Weekly plan'}</div><h1>Study routine</h1><p>Study hours from the daily routine timetable, two focus topics a day from the identified gaps.</p></div></div>

    <table className="routine-table-wrap" aria-label="Study routine timetable">
      <thead>
        <tr className="routine-table-head">
          <th>Day</th>
          <th>Study hours</th>
          <th>Topic 1</th>
          <th>Topic 2</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr className="routine-table-row" key={row.day}>
            <td className="routine-day-name">{row.day}</td>
            <td><span className="routine-pill routine-hours">{row.hours || '1 hr review'}</span></td>
            <td><span className="routine-pill routine-topic">{row.topic1 || 'Reading practice'}</span></td>
            <td><span className="routine-pill routine-topic alt">{row.topic2 || 'Practice session'}</span></td>
          </tr>
        ))}
      </tbody>
    </table>

    <DailyTasks />
  </>;
}
