import { ArrowRight, Check } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from './Login';
import { getApiErrorMessage, resetPassword } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(token ? '' : 'This password reset link is invalid or expired.');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm_password) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const result = await resetPassword({ token, ...form });
      setMessage(result.message);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'This password reset link is invalid or expired.'));
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Choose a new password" subtitle="Your new password will protect your CardioGuard workspace.">
    <form className="auth-form" onSubmit={submit}>
      <label className="auth-field"><span>New password</span><input required minLength="8" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="8+ characters" /></label>
      <label className="auth-field"><span>Confirm password</span><input required minLength="8" type="password" value={form.confirm_password} onChange={(event) => setForm({ ...form, confirm_password: event.target.value })} placeholder="Repeat your password" /></label>
      {message && <div className="password-note"><Check size={14} /> {message}</div>}
      {error && <div className="form-error">{error}</div>}
      <button className="btn btn-primary auth-submit" disabled={loading || !token}>{loading ? 'Updating password...' : 'Update password'} <ArrowRight size={17} /></button>
      <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
    </form>
  </AuthLayout>;
}