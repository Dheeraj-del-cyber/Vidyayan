import { BookOpen, Gauge, Languages, MapPinned, Plus, Route as RouteIcon, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

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
  return <div className="student-home">
    <div className="student-welcome"><div><span className="eyebrow">Your learning space · {getTodayLabel()}</span><h1>{getGreeting()}, {firstName}</h1><p>Your family may move, but your learning keeps moving with you.</p></div><button className="primary-button" onClick={() => navigate('/learning/lesson')}><BookOpen size={18} /> Continue learning</button></div>
    <FeatureTicker />
    <div className="add-student-row"><button className="primary-button" onClick={() => navigate('/add-student')}><Plus size={18} /> Add Student</button></div>
  </div>;
}
