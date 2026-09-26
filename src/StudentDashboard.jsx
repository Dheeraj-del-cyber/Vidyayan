import { ArrowRight, BookOpen, CheckCircle2, MapPinned, Sparkles, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const subjects = [
  { name: 'Mathematics', progress: 72, color: 'coral' },
  { name: 'Science', progress: 61, color: 'teal' },
  { name: 'English', progress: 80, color: 'blue' },
];

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
  return <div className="student-home">
    <div className="student-welcome"><div><span className="eyebrow">Your learning space · Saturday, 12 December 2026</span><h1>Good morning, Rahul</h1><p>Your family may move, but your learning keeps moving with you.</p></div><button className="primary-button" onClick={() => navigate('/learning/lesson')}><BookOpen size={18} /> Continue learning</button></div>
    <BridgeLessonHero />
    <div className="student-summary"><div><span className="stat-icon coral"><BookOpen size={19} /></span><span>Lessons completed</span><strong>18</strong><small>+3 this month</small></div><div><span className="stat-icon teal"><Target size={19} /></span><span>Learning progress</span><strong>68%</strong><small>4 bridge lessons</small></div><div><span className="stat-icon yellow"><MapPinned size={19} /></span><span>Current journey</span><strong>Karnataka → Maharashtra</strong><small>Record carried forward</small></div><div><span className="stat-icon blue"><CheckCircle2 size={19} /></span><span>Learning streak</span><strong>7 days</strong><small>Keep it going</small></div></div>
    <div className="student-columns"><section className="panel student-subjects"><div className="panel-heading"><div><span className="section-kicker">Keep exploring</span><h2>Subject progress</h2></div><button className="text-button" onClick={() => navigate('/progress')}>See all progress <ArrowRight size={15} /></button></div>{subjects.map(subject => <div className="student-subject" key={subject.name}><div><strong>{subject.name}</strong><span>{subject.progress}% complete</span></div><div className="progress-track"><span className={`progress-fill ${subject.color}`} style={{ width: `${subject.progress}%` }} /></div></div>)}</section><section className="student-record"><div className="student-record-icon"><MapPinned size={22} /></div><span className="section-kicker">Your learning record</span><h2>Nothing restarts when you move.</h2><p>Your completed chapters and bridge lessons stay with you when your family travels to a new state.</p><button className="text-button" onClick={() => navigate('/migration-history')}>View migration history <ArrowRight size={15} /></button></section></div>
  </div>;
}
