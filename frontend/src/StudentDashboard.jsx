import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

const bridgeLessons = [
  { title: 'Understanding decimals', meta: 'Mathematics · Chapter 4 · 70% complete' },
  { title: 'Fractions to decimals', meta: 'Mathematics · Chapter 3 · 55% complete' },
  { title: 'Working with percentages', meta: 'Mathematics · Chapter 5 · 40% complete' },
  { title: 'Ratio and proportion', meta: 'Mathematics · Chapter 6 · 25% complete' },
  { title: 'Introduction to algebra', meta: 'Mathematics · Chapter 7 · 10% complete' },
];

function BridgeLessonHero() {
  const navigate = useNavigate();
  const slides = [...bridgeLessons, bridgeLessons[0]];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex(i => i + 1), 1500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const handleTransitionEnd = () => {
    if (index === bridgeLessons.length) {
      setAnimate(false);
      setIndex(0);
    }
  };

  const goTo = i => { setAnimate(true); setIndex(i); startTimer(); };

  return <section className="student-hero">
    <div className="hero-carousel" onMouseEnter={() => clearInterval(timerRef.current)} onMouseLeave={startTimer}>
      <div className="hero-carousel-track" style={{ transform: `translateX(-${index * 100}%)`, transition: animate ? 'transform .6s cubic-bezier(.22,1,.36,1)' : 'none' }} onTransitionEnd={handleTransitionEnd}>
        {slides.map((slide, i) => <div className="hero-slide" key={i}>
          <span className="section-kicker">Your next bridge lesson</span>
          <h2>{slide.title}</h2>
          <p>{slide.meta}</p>
          <div className="student-hero-actions"><button className="primary-button" onClick={() => navigate('/learning/lesson')}>Continue lesson <ArrowRight size={16} /></button><button className="secondary-button" onClick={() => navigate('/translation')}>Change language</button></div>
        </div>)}
      </div>
      <div className="hero-dots">{bridgeLessons.map((_, i) => <button key={i} type="button" className={`hero-dot ${i === index % bridgeLessons.length ? 'active' : ''}`} aria-label={`Show bridge lesson ${i + 1}`} onClick={() => goTo(i)} />)}</div>
    </div>
    <div className="student-hero-mark"><Sparkles size={26} /></div>
  </section>;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = (user?.name || 'there').trim().split(/\s+/)[0];
  return <div className="student-home">
    <div className="student-welcome"><div><span className="eyebrow">Your learning space · {getTodayLabel()}</span><h1>{getGreeting()}, {firstName}</h1><p>Your family may move, but your learning keeps moving with you.</p></div><button className="primary-button" onClick={() => navigate('/learning/lesson')}><BookOpen size={18} /> Continue learning</button></div>
    <BridgeLessonHero />
  </div>;
}
