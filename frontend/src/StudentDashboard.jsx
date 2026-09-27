import { BookOpen, Gauge, Languages, MapPinned, Pencil, Plus, Route as RouteIcon, Target, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getStudents } from './studentsStore';

// Good morning / afternoon / evening / night, based on the time right now.
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// What the app can do for a student, shown as a non-stop scrolling strip
// rather than a rotating "here's a lesson" carousel - this is about
// surfacing the product's features, not any one piece of content.
const features = [
  { icon: Target, title: 'Curriculum gap mapping', desc: "Pinpoints exactly what's different between your old and new state board." },
  { icon: BookOpen, title: 'Bridge lessons', desc: 'Short, focused lessons built to close each gap quickly.' },
  { icon: Languages, title: 'Learn in your language', desc: "Switch a lesson's language any time you like." },
  { icon: Gauge, title: 'Progress tracking', desc: 'Watch your subject-wise progress grow week by week.' },
  { icon: MapPinned, title: 'Nothing restarts', desc: 'Completed chapters travel with you when your family moves.' },
  { icon: RouteIcon, title: 'Migration history', desc: 'A full timeline of your learning journey, state to state.' },
];

// Duplicated once so the strip can loop seamlessly: the CSS animation
// slides the track exactly half its width, then jumps back unnoticed.
const tickerFeatures = [...features, ...features];

function FeatureTicker() {
  return (
    <section className="feature-ticker" aria-label="What Vidyayan offers">
      <div className="feature-ticker-track">
        {tickerFeatures.map((feature, i) => (
          <div className="feature-box" key={i} aria-hidden={i >= features.length}>
            <span className="feature-box-icon"><feature.icon size={18} /></span>
            <strong>{feature.title}</strong>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = (user?.name || 'there').trim().split(/\s+/)[0];
  // Read on mount - this page remounts on every visit to "/", which is
  // enough to pick up students saved or edited on the Add student page.
  // Nothing is shown here beyond what was actually saved there.
  const [students, setStudents] = useState(() => getStudents());
  useEffect(() => { setStudents(getStudents()); }, []);

  return <div className="student-home">
    <div className="student-welcome"><div><span className="eyebrow">Your learning space · {getTodayLabel()}</span><h1>{getGreeting()}, {firstName}</h1><p>Your family may move, but your learning keeps moving with you.</p></div><button className="primary-button" onClick={() => navigate('/learning/lesson')}><BookOpen size={18} /> Continue learning</button></div>
    <FeatureTicker />
    <div className="add-student-row"><button className="primary-button" onClick={() => navigate('/add-student')}><Plus size={18} /> Add Student</button></div>

    {students.length > 0 && <section className="student-cards">
      {students.map(student => (
        <div className="student-flash-card" key={student.id}>
          <span className="student-flash-avatar">
            {student.photo ? <img src={student.photo} alt={student.name} /> : <UserRound size={20} />}
          </span>
          <div className="student-flash-info">
            <strong>{student.name || 'Unnamed student'}</strong>
            <span>{student.className || ''}</span>
          </div>
          <button className="student-flash-edit" onClick={() => navigate(`/add-student/${student.id}`)}>
            <Pencil size={14} /> Edit
          </button>
        </div>
      ))}
    </section>}
  </div>;
}
