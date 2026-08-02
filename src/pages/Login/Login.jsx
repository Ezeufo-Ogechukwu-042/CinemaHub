import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiFilm, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Button from '../../components/Button/Button';
import { checkRateLimit, clearRateLimit, recordRateLimitAttempt } from '../../utils/rateLimit';
import styles from './Login.module.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const emailKey = formData.email.trim().toLowerCase();
    const rateLimitCheck = checkRateLimit('login', emailKey);

    if (!rateLimitCheck.allowed) {
      setErrors({ general: rateLimitCheck.message });
      return;
    }

    try {
      setIsSubmitting(true);

      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      clearRateLimit('login', emailKey);
      navigate('/');
    } catch (err) {
      const nextAttempt = recordRateLimitAttempt('login', emailKey);
      setErrors({
        general: nextAttempt.allowed ? (err?.message || 'Unable to sign in right now.') : nextAttempt.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Cinematic background */}
      <div className={styles.backdrop}>
        <div className={styles.gradient} />
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <span key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }} />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        {/* Back to store */}
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Back to CinemaHub
        </Link>

        {/* Card */}
        <div className={styles.card}>
          {/* Logo */}
          <div className={styles.logo}>
            <FiFilm />
            <span>CinemaHub</span>
          </div>

          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to access your collection, wishlist, and orders.</p>
          {errors.general && (
              <div className={styles.authError}>
                {errors.general}
              </div>
            )}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <div className={`${styles.inputWrap} ${errors.email ? styles.error : ''}`}>
                <FiMail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span id="email-error" className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={`${styles.inputWrap} ${errors.password ? styles.error : ''}`}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span id="password-error" className={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Remember + Forgot */}
            <div className={styles.row}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                />
                <span className={styles.checkmark}><FiCheck /></span>
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              className={styles.submit}
              loading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span>or continue with</span>
          </div>

          {/* Social */}
          <div className={styles.social}>
            <button type="button" className={styles.socialBtn} aria-label="Sign in with Google">
              <FcGoogle />
              <span>Google</span>
            </button>
            <button type="button" className={styles.socialBtn} aria-label="Sign in with Apple">
              <FaApple />
              <span>Apple</span>
            </button>
          </div>

          {/* Footer */}
          <p className={styles.footer}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
