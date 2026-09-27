import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { gaps } from './data';
import { getStudent } from './studentsStore';
import DailyTasks from './DailyTasks';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatHours(value) {
  if (value === undefined || value === null || value === '') return 'No time logged';
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 'No time logged';
  return `${numeric} hrs`;
}

export default function StudyRoutine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = (studentId && getStudent(studentId)) || state;
  const name = student?.name;
  const scheduleRef = useRef(null);

  const dailyStudyHours = student?.dailyStudyHours || {};

  const exportPdf = () => {
    window.print();
  };

  const exportImage = async () => {
    const table = scheduleRef.current;
    if (!table) return;

    const canvas = await html2canvas(table, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fffaf5',
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${(name || 'study-routine').replace(/\s+/g, '-').toLowerCase()}-timetable.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const rows = weekdays.map((day, i) => {
    const savedHours = dailyStudyHours[day];
    const topic1 = gaps[i * 2];
    const topic2 = gaps[i * 2 + 1];

    return {
      day,
      hours: formatHours(savedHours),
      topic1: topic1 ? `${topic1.subject} · ${topic1.topic}` : 'Needs topic review',
      topic2: topic2 ? `${topic2.subject} · ${topic2.topic}` : 'Needs topic review',
    };
  });

  return <>
    <button className="back-link" onClick={() => studentId ? navigate(`/students/${studentId}`) : navigate(-1)}><ArrowRight size={15} className="back-arrow" /> Back to student details</button>
    <div className="page-intro"><div><div className="eyebrow">{name ? `For ${name}` : 'Weekly plan'}</div><h1>Study routine</h1><p>Study hours from the daily routine timetable, two focus topics a day from the identified gaps.</p></div></div>

    <div className="routine-actions">
      <button className="secondary-button" type="button" onClick={exportPdf}><Printer size={16} /> Export PDF</button>
      <button className="primary-button" type="button" onClick={exportImage}><Download size={16} /> Export image</button>
    </div>

    <div ref={scheduleRef} className="routine-table-panel">
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
              <td><span className="routine-pill routine-hours">{row.hours}</span></td>
              <td><span className="routine-pill routine-topic">{row.topic1}</span></td>
              <td><span className="routine-pill routine-topic alt">{row.topic2}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <DailyTasks />
  </>;
}
