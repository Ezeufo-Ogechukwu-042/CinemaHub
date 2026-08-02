import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiFilm, FiArrowLeft, FiCheck, FiShield } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Button from '../../components/Button/Button';
import styles from './Register.module.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: '', width: 0, color: 'transparent' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { label: 'Weak', width: '25%', color: 'var(--error)' },
      { label: 'Fair', width: '50%', color: 'var(--warning)' },
      { label: 'Good', width: '75%', color: '#3b82f6' },
      { label: 'Strong', width: '100%', color: 'var(--success)' },
    ];
    return levels[Math.min(score, 3)];
  };

  const strength = getPasswordStrength(formData.password);

    

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setIsSubmitting(true);

    await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.name,
      },
    },
  });

    alert("Account created! Please check your email to verify your account.");
    navigate("/login");
  } catch (err) {
    setErrors({
      general: err.message,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={styles.page}>
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
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Back to CinemaHub
        </Link>

        <div className={styles.card}>
          <div className={styles.logo}>
            <FiFilm />
            <span>CinemaHub</span>
          </div>

          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Join millions of movie lovers. Start building your collection today.</p>
            {errors.general && (
              <div className={styles.authError}>
                {errors.general}
              </div>
            )}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <div className={`${styles.inputWrap} ${errors.name ? styles.error : ''}`}>
                <FiUser className={styles.inputIcon} />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span id="name-error" className={styles.errorText}>{errors.name}</span>}
            </div>

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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  autoComplete="new-password"
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

              {/* Strength meter */}
              {formData.password && (
                <div className={styles.strength}>
                  <div className={styles.strengthBar}>
                    <div className={styles.strengthFill} style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <span style={{ color: strength.color, fontSize: '0.75rem', fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={`${styles.inputWrap} ${errors.confirmPassword ? styles.error : ''}`}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <span id="confirm-error" className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            {/* Terms */}
            <div className={styles.field}>
              <label className={`${styles.checkbox} ${errors.agreeTerms ? styles.error : ''}`}>
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
                <span className={styles.checkmark}><FiCheck /></span>
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
              {errors.agreeTerms && <span className={styles.errorText}>{errors.agreeTerms}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className={styles.submit}
              loading={isSubmitting}
            >
              Create Account
            </Button>
          </form>

          <div className={styles.divider}>
            <span>or sign up with</span>
          </div>

          <div className={styles.social}>
            <button type="button" className={styles.socialBtn} aria-label="Sign up with Google">
              <FcGoogle />
              <span>Google</span>
            </button>
            <button type="button" className={styles.socialBtn} aria-label="Sign up with Apple">
              <FaApple />
              <span>Apple</span>
            </button>
          </div>

          <p className={styles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;



