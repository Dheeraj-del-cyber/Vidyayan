import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Languages, LockKeyhole, Route as RouteIcon, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interfaceLanguages, useLanguage } from './i18n';

export default function Login() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get('phone') || !form.get('password') || (isSignup && !form.get('name'))) return setError(isSignup ? 'Enter your name, phone number, and password to create an account.' : 'Enter your phone number and password to continue.');
    if (!/^\+?[0-9\s()-]{10,}$/.test(form.get('phone'))) return setError('Enter a valid phone number with at least 10 digits.');
    setError('');
    navigate('/');
  };

  return <main className="login-page"><section className="login-panel"><div className="login-brand"><span className="brand-mark"><RouteIcon size={21} /></span><strong>Vidyayan</strong></div><div className="login-copy"><span className="eyebrow">Learning continuity workspace</span><h1>{isSignup ? 'Create your account.' : 'Welcome back.'}</h1><p>{isSignup ? 'Set up a coordinator account to keep every learning journey connected.' : 'Pick up every child’s learning journey from where it belongs: with them.'}</p></div><form className="login-form" onSubmit={handleSubmit}>{isSignup && <label><span>Coordinator name</span><div className="login-input"><UserRound size={17} /><input name="name" type="text" placeholder="Enter your full name" autoComplete="name" /></div></label>}<label><span>Phone number</span><div className="login-input"><UserRound size={17} /><input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" /></div></label><label><span>Password</span><div className="login-input"><LockKeyhole size={17} /><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete={isSignup ? 'new-password' : 'current-password'} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>{error && <div className="login-error" role="alert">{error}</div>}<button className="primary-button login-submit" type="submit">{isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button></form><button className="auth-switch" onClick={() => { setIsSignup(!isSignup); setError(''); }}>{isSignup ? 'Already have an account? Sign in' : 'New to Vidyayan? Create an account'}</button><div className="login-footer"><span>Prototype access · no backend authentication</span><label className="login-language"><Languages size={15} /><select value={language} onChange={event => setLanguage(event.target.value)}>{interfaceLanguages.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label></div></section><aside className="login-aside"><div className="login-aside-content"><div className="login-aside-mark"><RouteIcon size={31} /></div><span className="eyebrow">Vidyayan</span><h2>Learning does not restart when a family moves.</h2><p>One calm workspace for the child, the coordinator, and every chapter still ahead.</p><div className="login-quote"><span>“</span><strong>A record that moves with them.</strong></div></div></aside></main>;
}
