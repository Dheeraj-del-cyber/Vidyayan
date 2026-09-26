import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, LogOut, Pencil, UserRound, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
  }, [user]);

  const initials = (name || '').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'VY';

  const startEditing = () => {
    setName(user?.name || '');
    setError('');
    setSuccess('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setName(user?.name || '');
    setError('');
    setEditing(false);
  };

  // Always submits, whether or not the name was actually changed - there's
  // no reason "Save changes" should silently do nothing just because the
  // person opened edit mode and clicked save without changing anything.
  const handleSubmit = async event => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return setError('Enter your full name.');
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await updateProfile({ name: trimmedName });
      setSuccess('Your profile has been updated.');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => { logout(); navigate('/login'); };

  return (
    <>
      <button className="back-link" onClick={() => navigate('/settings')}>
        <ArrowRight size={15} className="back-arrow" /> Back to settings
      </button>

      <div className="page-intro">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Edit profile</h1>
          <p>Update your name. Your phone number stays fixed since it's how you sign in.</p>
        </div>
      </div>

      <form className="form-layout profile-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <section className="form-section profile-avatar-section">
            <span className="avatar avatar-teal avatar-xl">{initials}</span>
            <div className="profile-avatar-copy">
              <strong>{user?.name || 'Your name'}</strong>
              <span>{user?.phone}</span>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="form-section-icon"><UserRound size={17} /></span>
              <h2>Personal details</h2>
              {!editing && (
                <button type="button" className="text-button" style={{ marginLeft: 'auto' }} onClick={startEditing}>
                  <Pencil size={14} /> Edit
                </button>
              )}
            </div>
            <div className="form-grid">
              <label className="field wide">
                <span>Full name</span>
                {editing
                  ? <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" autoFocus />
                  : <div className="login-input input-locked"><UserRound size={15} /><input type="text" value={user?.name || ''} disabled readOnly /></div>}
              </label>
              <label className="field">
                <span>Phone number</span>
                <div className="login-input input-locked">
                  <Lock size={15} />
                  <input type="tel" value={user?.phone || ''} disabled readOnly />
                </div>
                <small className="field-note">Can't be changed</small>
              </label>
            </div>
          </section>

          {error && <div className="login-error" role="alert">{error}</div>}
          {success && <div className="profile-success"><Check size={15} /> {success}</div>}

          {editing && (
            <div className="form-actions">
              <button type="button" className="quiet-button" onClick={cancelEditing}><X size={15} /> Cancel</button>
              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save changes'} <Check size={16} />
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="form-layout profile-form">
        <div className="form-card">
          <section className="form-section">
            <div className="form-section-heading">
              <span className="form-section-icon"><LogOut size={17} /></span>
              <h2>Log out</h2>
            </div>
            <p>Sign out of Vidyayan on this device.</p>
            <div className="form-actions">
              <button type="button" className="quiet-button danger" onClick={handleSignOut}>
                <LogOut size={15} /> Log out
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
