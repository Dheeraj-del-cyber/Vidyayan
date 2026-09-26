import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

export default function PasswordField({ name, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="login-input">
      <LockKeyhole size={17} />
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
