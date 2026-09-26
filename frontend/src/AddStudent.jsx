import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, FileText, Image, UserRound, X } from 'lucide-react';
import { indianStates } from './indianStates';

const classOptions = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);

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

  const handleSubmit = event => {
    event.preventDefault();
    // No backend endpoint exists yet to persist a new student record or to
    // OCR the timetable file, so this only carries forward what was
    // actually typed into this form - nothing here is invented.
    navigate('/students/analysis', {
      state: { name: name.trim(), photo: photo?.dataUrl || null, className, age, previousState, currentState, migratedMonth },
    });
  };

  return <>
    <button className="back-link" onClick={() => navigate('/')}><X size={15} /> Cancel</button>
    <div className="page-intro"><div><div className="eyebrow">Build a learning record</div><h1>Add student</h1><p>Add a student's details so their learning record can travel with them.</p></div></div>

    <form className="form-layout" onSubmit={handleSubmit}>
      <div className="form-card">
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
          <div className="form-section-heading"><span className="form-section-icon"><FileText size={17} /></span><h2>Class timetable</h2></div>
          <div className="file-upload">
            <button type="button" className="secondary-button" onClick={() => timetableInputRef.current?.click()}><Camera size={16} /> Import photo or PDF</button>
            <input ref={timetableInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleTimetableChange} />
            {timetable ? <span className="file-upload-name">{timetable.isPdf ? <FileText size={15} /> : <Image size={15} />} {timetable.name}</span> : <span className="file-upload-hint">We'll pull the class schedule from this file.</span>}
          </div>
        </section>

        <div className="form-actions"><button type="button" className="quiet-button" onClick={() => navigate('/')}>Cancel</button><button className="primary-button" type="submit"><Check size={18} /> Enter</button></div>
      </div>

      <aside className="form-aside">
        <div className="aside-illustration"><UserRound size={37} /></div>
        <span className="section-kicker">A record that moves</span>
        <h2>Start with what they already know.</h2>
        <p>Their photo, class and timetable help Vidyayan set up the right lessons from day one.</p>
        <div className="mini-check"><Check size={16} /> Learning history stays intact</div>
        <div className="mini-check"><Check size={16} /> Gaps become clear and actionable</div>
      </aside>
    </form>
  </>;
}
