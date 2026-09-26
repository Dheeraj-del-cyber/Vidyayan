import { useState } from 'react';
import { ArrowRight, Languages, Route as RouteIcon, UserRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { interfaceLanguages, useLanguage } from './i18n';
import { useAuth } from './AuthContext';
import PasswordField from './PasswordField';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = form.get('phone');
    const password = form.get('password');

    if (!phone || !password) return setError('Enter your phone number and password to continue.');

    setError('');
    setSubmitting(true);
    try {
      await login({ phone, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand"><span className="brand-mark"><RouteIcon size={21} /></span><strong>Vidyayan</strong></div>
        <div className="login-copy">
          <span className="eyebrow">Learning continuity workspace</span>
          <h1>Welcome back.</h1>
          <p>Pick up every child's learning journey from where it belongs: with them.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Phone number</span>
            <div className="login-input">
              <UserRound size={17} />
              <input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
            </div>
          </label>
          <label>
            <span>Password</span>
            <PasswordField name="password" placeholder="Enter your password" autoComplete="current-password" />
          </label>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="primary-button login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={17} />
          </button>
        </form>
        <Link className="auth-switch" to="/register">New to Vidyayan? Create an account</Link>
        <div className="login-footer">
          <span>Your data is stored in the Vidyayan database</span>
          <label className="login-language">
            <Languages size={15} />
            <select aria-label="Interface language" value={language} onChange={event => setLanguage(event.target.value)}>
              {interfaceLanguages.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </section>
      <aside className="login-aside">
        <div className="login-aside-content">
          <div className="login-aside-mark"><RouteIcon size={31} /></div>
          <span className="eyebrow">Vidyayan</span>
          <h2>Learning does not restart when a family moves.</h2>
          <p>One calm workspace for the child, the coordinator, and every chapter still ahead.</p>
          <div className="login-quote"><span>&ldquo;</span><strong>A record that moves with them.</strong></div>
        </div>
      </aside>
    </main>
  );
}
