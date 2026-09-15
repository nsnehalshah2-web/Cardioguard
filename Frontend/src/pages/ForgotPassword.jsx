import { ArrowRight, Check, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from './Login';
import { getApiErrorMessage, requestPasswordReset } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const result = await requestPasswordReset(email.trim().toLowerCase());
      setMessage(result.message);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not process that request right now.'));
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Reset your password" subtitle="Enter your email and we will send a secure reset link.">
    <form className="auth-form" onSubmit={submit}>
      <label className="auth-field"><span>Email address</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
      {message && <div className="password-note"><Check size={14} /> {message}</div>}
      {error && <div className="form-error">{error}</div>}
      <button className="btn btn-primary auth-submit" disabled={loading}>{loading ? 'Sending link...' : 'Send reset link'} <ArrowRight size={17} /></button>
      <p className="auth-switch"><Link to="/login"><Mail size={14} /> Back to sign in</Link></p>
    </form>
  </AuthLayout>;
}