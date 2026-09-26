import { useState } from 'react';
import { ArrowRight, ChevronDown, Languages, Route as RouteIcon, UserRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { interfaceLanguages, useLanguage } from './i18n';
import { useAuth } from './AuthContext';
import { indianStates } from './indianStates';
import PasswordField from './PasswordField';

const nativeLanguages = ['English', 'Kannada', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    if (!payload.name || !payload.phone || !payload.password || !payload.confirmPassword) {
      return setError('Fill in your name, phone number and password to continue.');
    }
    if (payload.password !== payload.confirmPassword) {
      return setError('Password and re-entered password do not match.');
    }
    if (!payload.nativeLanguage || !payload.previousState || !payload.currentState || !payload.migratedMonth || !payload.migratedYear) {
      return setError('Fill in your language, migration states, and migration month and year.');
    }

    setError('');
    setSubmitting(true);
    try {
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel register-panel">
        <div className="login-brand"><span className="brand-mark"><RouteIcon size={21} /></span><strong>Vidyayan</strong></div>
        <div className="login-copy">
          <span className="eyebrow">Learning continuity workspace</span>
          <h1>Create your account.</h1>
          <p>Set up a profile so your learning record travels with you.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <div className="login-input">
              <UserRound size={17} />
              <input name="name" type="text" placeholder="Enter your full name" autoComplete="name" />
            </div>
          </label>

          <label>
            <span>Phone number</span>
            <div className="login-input">
              <UserRound size={17} />
              <input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
            </div>
          </label>

          <div className="field-row">
            <label>
              <span>Password</span>
              <PasswordField name="password" placeholder="Create a password" autoComplete="new-password" />
            </label>
            <label>
              <span>Re-enter password</span>
              <PasswordField name="confirmPassword" placeholder="Re-enter your password" autoComplete="new-password" />
            </label>
          </div>

          <label>
            <span>Native language</span>
            <div className="select-wrap">
              <select name="nativeLanguage" defaultValue="">
                <option value="" disabled>Select native language</option>
                {nativeLanguages.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <div className="field-row">
            <label>
              <span>Previous state</span>
              <div className="select-wrap">
                <select name="previousState" defaultValue="">
                  <option value="" disabled>Select previous state</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <label>
              <span>Current state</span>
              <div className="select-wrap">
                <select name="currentState" defaultValue="">
                  <option value="" disabled>Select current state</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
          </div>

          <div className="field-row">
            <label>
              <span>Migrated month</span>
              <div className="select-wrap">
                <select name="migratedMonth" defaultValue="">
                  <option value="" disabled>Select month</option>
                  {months.map(month => <option key={month} value={month}>{month}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <label>
              <span>Migrated year</span>
              <div className="select-wrap">
                <select name="migratedYear" defaultValue="">
                  <option value="" disabled>Select year</option>
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="primary-button login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'} <ArrowRight size={17} />
          </button>
        </form>
        <Link className="auth-switch" to="/login">Already have an account? Sign in</Link>
        <div className="login-footer">
          <span>Your data is stored in the Vidyayan database</span>
          <label className="login-language">
            <Languages size={15} />
            <select value={language} onChange={event => setLanguage(event.target.value)}>
              {interfaceLanguages.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </section>
      <aside className="login-aside">
        <div className="login-aside-content">
          <div className="login-aside-mark"><RouteIcon size={31} /></div>
          <span className="eyebrow">For every family on the move</span>
          <h2>Your education travels with your family.</h2>
          <p>Find your place in a new classroom without starting over. Your chapters, progress, and next lesson stay connected.</p>
          <div className="login-quote"><span>&ldquo;</span><strong>Keep going, wherever you are.</strong></div>
        </div>
      </aside>
    </main>
  );
}
