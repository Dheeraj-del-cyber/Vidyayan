import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Check, ChevronDown, Lock, UserRound } from 'lucide-react';
import { useAuth } from './AuthContext';
import { indianStates } from './indianStates';

const nativeLanguages = ['English', 'Kannada', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

// Shrinks and crops whatever photo the person picks down to a small square
// JPEG, so the profile photo stays quick to upload and store.
function readAsAvatar(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That does not look like a valid image.'));
      img.onload = () => {
        const size = 320;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', nativeLanguage: '', previousState: '',
    currentState: '', migratedMonth: '', migratedYear: '',
  });
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      nativeLanguage: user.native_language || '',
      previousState: user.previous_state || '',
      currentState: user.current_state || '',
      migratedMonth: user.migrated_month || '',
      migratedYear: user.migrated_year ? String(user.migrated_year) : '',
    });
    setAvatar(user.avatar || '');
  }, [user]);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handlePhotoPick = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    try {
      setAvatar(await readAsAvatar(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!form.name.trim()) return setError('Enter your full name.');
    if (!form.nativeLanguage || !form.previousState || !form.currentState || !form.migratedMonth || !form.migratedYear) {
      return setError('Fill in your native language and migration details to continue.');
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await updateProfile({ ...form, avatar });
      setSuccess('Your profile has been updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (form.name || '').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'VY';

  return (
    <>
      <button className="back-link" onClick={() => navigate('/settings')}>
        <ArrowRight size={15} className="back-arrow" /> Back to settings
      </button>

      <div className="page-intro">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Edit profile</h1>
          <p>Update your photo and details. Your phone number stays fixed since it's how you sign in.</p>
        </div>
      </div>

      <form className="form-layout profile-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <section className="form-section profile-avatar-section">
            <div className="profile-avatar-wrap">
              {avatar
                ? <img src={avatar} alt="" className="profile-avatar-img" />
                : <span className="avatar avatar-teal avatar-xl">{initials}</span>}
              <button
                type="button"
                className="avatar-camera-button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
              >
                <Camera size={15} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoPick} />
            </div>
            <div className="profile-avatar-copy">
              <strong>{form.name || 'Your name'}</strong>
              <span>{user?.phone}</span>
              {avatar && <button type="button" className="text-button" onClick={() => setAvatar('')}>Remove photo</button>}
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="form-section-icon"><UserRound size={17} /></span>
              <h2>Personal details</h2>
            </div>
            <div className="form-grid">
              <label className="field wide">
                <span>Full name</span>
                <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Enter your full name" />
              </label>
              <label className="field">
                <span>Phone number</span>
                <div className="login-input input-locked">
                  <Lock size={15} />
                  <input type="tel" value={user?.phone || ''} disabled readOnly />
                </div>
                <small className="field-note">Can't be changed</small>
              </label>
              <label className="field">
                <span>Native language</span>
                <div className="select-wrap">
                  <select value={form.nativeLanguage} onChange={e => setField('nativeLanguage', e.target.value)}>
                    <option value="" disabled>Select native language</option>
                    {nativeLanguages.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="form-section-icon"><ArrowRight size={17} /></span>
              <h2>Migration details</h2>
            </div>
            <div className="form-grid">
              <label className="field">
                <span>Previous state</span>
                <div className="select-wrap">
                  <select value={form.previousState} onChange={e => setField('previousState', e.target.value)}>
                    <option value="" disabled>Select previous state</option>
                    {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="field">
                <span>Current state</span>
                <div className="select-wrap">
                  <select value={form.currentState} onChange={e => setField('currentState', e.target.value)}>
                    <option value="" disabled>Select current state</option>
                    {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="field">
                <span>Migrated month</span>
                <div className="select-wrap">
                  <select value={form.migratedMonth} onChange={e => setField('migratedMonth', e.target.value)}>
                    <option value="" disabled>Select month</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="field">
                <span>Migrated year</span>
                <div className="select-wrap">
                  <select value={form.migratedYear} onChange={e => setField('migratedYear', e.target.value)}>
                    <option value="" disabled>Select year</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
            </div>
          </section>

          {error && <div className="login-error" role="alert">{error}</div>}
          {success && <div className="profile-success"><Check size={15} /> {success}</div>}

          <div className="form-actions">
            <button type="button" className="quiet-button" onClick={() => navigate('/settings')}>Cancel</button>
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'} <Check size={16} />
            </button>
          </div>
        </div>

        <aside className="form-aside">
          <div className="aside-illustration"><UserRound size={27} /></div>
          <span className="section-kicker">Your learning record</span>
          <h2>Keep your details current.</h2>
          <p>Your name and photo appear across your dashboard. Your migration details help keep your curriculum gap analysis accurate.</p>
          <div className="mini-check"><Check size={16} /> Your phone number never changes</div>
          <div className="mini-check"><Check size={16} /> Everything else is yours to update</div>
        </aside>
      </form>
    </>
  );
}
