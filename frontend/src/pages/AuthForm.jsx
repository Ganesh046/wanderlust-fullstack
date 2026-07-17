import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Compass, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signup, loading: authLoading } = useContext(AuthContext);

  // Detect mode based on routing path (/login or /signup)
  const isLoginMode = location.pathname === '/login';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/listings');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !password || (!isLoginMode && !email)) {
      toast.error('Please enter all required credentials.');
      return;
    }

    setSubmitting(true);
    let result;
    if (isLoginMode) {
      result = await login(username, password);
    } else {
      result = await signup(username, email, password);
    }

    if (result.success) {
      toast.success(result.message || 'Welcome to Wanderlust!');
      navigate('/listings');
    } else {
      toast.error(result.error || 'Authentication error.');
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-bg container" style={{ padding: '40px 24px' }}>
      <div className="auth-glass-card animate-scale-in" style={{ textAlign: 'center' }}>
        
        {/* Header (Compass logo + Airbnb-Style Bold Title) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <Compass size={44} strokeWidth={2.5} style={{ color: 'var(--color-primary)', marginBottom: '14px' }} className="logo-icon" />
          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: 0
          }}>
            {isLoginMode ? 'Log In' : 'Welcome to Wanderlust'}
          </h2>
        </div>

        <div style={{ height: '1px', background: 'var(--border-color)', width: '100%', marginBottom: '24px' }}></div>

        {/* Auth Form fields */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="e.g., adventurer101"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email (Signup only) */}
          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="e.g., explorer@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="password">
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit/Continue button */}
          <button 
            type="submit" 
            disabled={submitting} 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px',
              fontSize: '0.95rem'
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <span style={{ fontWeight: 700 }}>{isLoginMode ? 'Log In' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        {/* Footer Toggle links */}
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '24px' }}>
          {isLoginMode ? (
            <p>
              New explorer?{' '}
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 700 }} className="underline-hover">
                Create an account
              </Link>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }} className="underline-hover">
                Sign in here
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthForm;
