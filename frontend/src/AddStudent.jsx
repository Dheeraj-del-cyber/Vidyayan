import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Check, FileText, Image, Sparkles, Trash2, UserRound, X } from 'lucide-react';
import { indianStates } from './indianStates';
import { deleteStudent, getStudent, makeStudentId, saveStudent } from './studentsStore';

const classOptions = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddStudent() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const isEditing = Boolean(studentId);
  const photoInputRef = useRef(null);
  const timetableInputRef = useRef(null);

  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [age, setAge] = useState('');
  const [previousState, setPreviousState] = useState('');
  const [migratedMonth, setMigratedMonth] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [photo, setPhoto] = useState(null);
  const [timetable, setTimetable] = useState(null);
  // Per-day study hours, typed in directly by whoever is filling this form.
  // There's no OCR/agent wired up yet to read hours off the uploaded
  // routine photo or PDF, so this is the only real source for "study
  // hours from the timetable" right now. Days left blank stay blank -
  // nothing here is guessed or defaulted.
  const [studyHours, setStudyHours] = useState({});

  // When arriving here to edit a previously saved student, load exactly
  // what was saved for them - nothing more. If the record can't be
  // found (e.g. a stale link), the form just stays blank rather than
  // guessing at values.
  useEffect(() => {
    if (!studentId) return;
    const existing = getStudent(studentId);
    if (!existing) return;
    setName(existing.name || '');
    setClassName(existing.className || '');
    setAge(existing.age || '');
    setPreviousState(existing.previousState || '');
    setCurrentState(existing.currentState || '');
    setMigratedMonth(existing.migratedMonth || '');
    setPhoto(existing.photo ? { name: 'Saved photo', dataUrl: existing.photo } : null);
    setTimetable(existing.timetableFileName ? { name: existing.timetableFileName, isPdf: false } : null);
    setStudyHours(existing.dailyStudyHours || {});
  }, [studentId]);

  const handlePhotoChange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readAsDataUrl(file);
    setPhoto({ name: file.name, dataUrl });
  };

  const handleTimetableChange = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setTimetable({ name: file.name, isPdf: file.type === 'application/pdf' });
  };

  const fillDemoData = () => {
    setName('Demo Student');
    setClassName('Class 8');
    setAge('13');
    setPreviousState('Bihar');
    setCurrentState('Karnataka');
    setMigratedMonth('2025-06');
    setPhoto(null);
    setTimetable(null);
    setStudyHours({ Monday: '2', Tuesday: '1.5', Wednesday: '2', Thursday: '1', Friday: '2', Saturday: '3', Sunday: '2' });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // No backend endpoint exists yet to persist a new student record or to
    // read hours/subjects off the uploaded routine file, so this only
    // carries forward what was actually typed into this form - nothing
    // here is invented. Blank days are dropped rather than filled in.
    const dailyStudyHours = Object.fromEntries(
      Object.entries(studyHours).filter(([, hours]) => hours != null && hours.trim() !== '')
    );
    const student = {
      id: studentId || makeStudentId(),
      name: name.trim(),
      className,
      age,
      previousState,
      currentState,
      migratedMonth,
      photo: photo?.dataUrl || null,
      timetableFileName: timetable?.name || null,
      dailyStudyHours,
    };
    saveStudent(student);
    navigate('/students/analysis', { state: student });
  };

  const handleDelete = () => {
    if (!studentId) return;
    if (window.confirm(`Are you sure you want to delete ${name || 'this student'}?`)) {
      deleteStudent(studentId);
      navigate('/');
    }
  };

  return <>
    <button className="back-link" onClick={() => navigate('/')}><X size={15} /> Cancel</button>
    <div className="page-intro"><div><div className="eyebrow">{isEditing ? 'Update a learning record' : 'Build a learning record'}</div><h1>{isEditing ? 'Edit student' : 'Add student'}</h1><p>{isEditing ? "Update this student's details." : "Add a student's details so their learning record can travel with them."}</p></div></div>

    <form className="form-layout" onSubmit={handleSubmit}>
      <div className="form-card">
        {!isEditing && <div className="demo-data-action">
          <button type="button" className="secondary-button" onClick={fillDemoData}><Sparkles size={16} /> Fill demo data</button>
        </div>}

        <section className="form-section">
          <div className="form-section-heading"><span className="form-section-icon"><UserRound size={17} /></span><h2>Photo &amp; basic details</h2></div>

          <div className="photo-upload">
            <div className="photo-upload-circle">
              {photo ? <img src={photo.dataUrl} alt="Student" /> : <UserRound size={28} />}
              <button type="button" className="photo-upload-camera" onClick={() => photoInputRef.current?.click()} aria-label="Choose a profile photo from your photos">
                <Camera size={15} />
              </button>
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            <div><strong>Profile photo</strong><span>Tap the camera to pick one from your photos.</span></div>
          </div>

          <div className="form-grid">
            <label className="field wide"><span>Name</span><input type="text" placeholder="e.g. Rahul Shetty" value={name} onChange={e => setName(e.target.value)} required /></label>
            <label className="field"><span>Class</span><div className="select-wrap"><select value={className} onChange={e => setClassName(e.target.value)} required><option value="" disabled>Select class</option>{classOptions.map(c => <option key={c}>{c}</option>)}</select></div></label>
            <label className="field"><span>Age</span><input type="number" min="3" max="21" placeholder="10" value={age} onChange={e => setAge(e.target.value)} required /></label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><span className="form-section-icon"><Image size={17} /></span><h2>Migration details</h2></div>
          <div className="form-grid">
            <label className="field"><span>Previous state</span><div className="select-wrap"><select value={previousState} onChange={e => setPreviousState(e.target.value)} required><option value="" disabled>Select state</option>{indianStates.map(s => <option key={s}>{s}</option>)}</select></div></label>
            <label className="field"><span>Migrated month</span><input type="month" value={migratedMonth} onChange={e => setMigratedMonth(e.target.value)} required /></label>
            <label className="field"><span>Current state</span><div className="select-wrap"><select value={currentState} onChange={e => setCurrentState(e.target.value)} required><option value="" disabled>Select state</option>{indianStates.map(s => <option key={s}>{s}</option>)}</select></div></label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><span className="form-section-icon"><FileText size={17} /></span><h2>Daily routine timetable</h2></div>
          <p className="field-hint">This is the child's own day - school, tuition, chores, travel - not their class timetable. It's what decides when they actually have time left to study.</p>
          <div className="file-upload">
            <button type="button" className="secondary-button" onClick={() => timetableInputRef.current?.click()}><Camera size={16} /> Import photo or PDF</button>
            <input ref={timetableInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleTimetableChange} />
            {timetable ? <span className="file-upload-name">{timetable.isPdf ? <FileText size={15} /> : <Image size={15} />} {timetable.name}</span> : <span className="file-upload-hint">Upload their daily routine, if you have it.</span>}
          </div>

          <div className="hours-block">
            <span className="hours-block-label">Study hours free each day (optional)</span>
            <p className="field-hint">Enter what's actually free that day. Leave a day blank if you don't know yet - we won't guess.</p>
            <div className="hours-grid">
              {weekdays.map(day => (
                <label className="hours-field" key={day}>
                  <span>{day}</span>
                  <input
                    type="number" min="0" max="12" step="0.5" placeholder="hrs"
                    value={studyHours[day] ?? ''}
                    onChange={e => setStudyHours(prev => ({ ...prev, [day]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="form-actions">
          {isEditing && (
            <button type="button" className="danger-button" onClick={handleDelete}>
              <Trash2 size={16} /> Delete student
            </button>
          )}
          <button type="button" className="quiet-button" onClick={() => navigate('/')}>Cancel</button>
          <button className="primary-button" type="submit"><Check size={18} /> {isEditing ? 'Save changes' : 'Enter'}</button>
        </div>
      </div>

      <aside className="form-aside">
        <div className="aside-illustration"><UserRound size={37} /></div>
        <span className="section-kicker">A record that moves</span>
        <h2>Start with what they already know.</h2>
        <p>Their photo, class and daily routine help Vidyayan set up the right lessons from day one.</p>
        <div className="mini-check"><Check size={16} /> Learning history stays intact</div>
        <div className="mini-check"><Check size={16} /> Gaps become clear and actionable</div>
      </aside>
    </form>
  </>;
}
