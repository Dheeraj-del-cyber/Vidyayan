import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, LogOut, Pencil, UserRound, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import PasswordField from './PasswordField';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handleSubmit = async event => {
    event.preventDefault();
    if (!name.trim()) return setError('Enter your full name.');
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await updateProfile({ name });
      setSuccess('Your profile has been updated.');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const setPasswordField = (key, value) => setPasswordForm(prev => ({ ...prev, [key]: value }));

  const handlePasswordSubmit = async event => {
    event.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return setPasswordError('Fill in your current password and new password to continue.');
    }
    if (newPassword.length < 6) return setPasswordError('New password must be at least 6 characters.');
    if (newPassword !== confirmNewPassword) return setPasswordError('New password and re-entered password do not match.');

    setPasswordError('');
    setPasswordSuccess('');
    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmNewPassword });
      setPasswordSuccess('Your password has been changed.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
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
          <p>Update your name and password. Your phone number stays fixed since it's how you sign in.</p>
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

      <form className="form-layout profile-form" onSubmit={handlePasswordSubmit}>
        <div className="form-card">
          <section className="form-section">
            <div className="form-section-heading">
              <span className="form-section-icon"><Lock size={17} /></span>
              <h2>Change password</h2>
            </div>
            <div className="form-grid">
              <label className="field wide">
                <span>Current password</span>
                <PasswordField
                  name="currentPassword"
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordField('currentPassword', e.target.value)}
                />
              </label>
              <label className="field">
                <span>New password</span>
                <PasswordField
                  name="newPassword"
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordField('newPassword', e.target.value)}
                />
              </label>
              <label className="field">
                <span>Re-enter new password</span>
                <PasswordField
                  name="confirmNewPassword"
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  value={passwordForm.confirmNewPassword}
                  onChange={e => setPasswordField('confirmNewPassword', e.target.value)}
                />
              </label>
            </div>
          </section>

          {passwordError && <div className="login-error" role="alert">{passwordError}</div>}
          {passwordSuccess && <div className="profile-success"><Check size={15} /> {passwordSuccess}</div>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={changingPassword}>
              {changingPassword ? 'Changing…' : 'Change password'} <Check size={16} />
            </button>
          </div>
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
