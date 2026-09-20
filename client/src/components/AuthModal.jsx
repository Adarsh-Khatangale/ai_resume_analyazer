import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Shield,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
  const {
    loginUser,
    registerUser,
    demoLogin,
    loginWithGoogle,
    authModalInitialTab = 'signin',
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(authModalInitialTab || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const modalRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    setActiveTab(authModalInitialTab || 'signin');
    setFormError('');
    if (isOpen) {
      setTimeout(() => emailInputRef.current?.focus(), 80);
    }
  }, [authModalInitialTab, isOpen]);

  // Handle Escape key to close (Light Dismiss)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setFormError('Please enter your account password.');
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser({ email, password });
      toast.success(`Welcome back, ${user.name ? user.name.split(' ')[0] : 'there'}!`);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser({ name, email, password });
      toast.success(`Account created successfully! Welcome, ${user.name}!`);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setFormError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setFormError(err.message || 'Google sign-in could not be completed.');
    }
  };

  const handleDemoClick = async () => {
    try {
      setLoading(true);
      await demoLogin();
      onClose();
      navigate('/dashboard');
    } catch (err) {
      toast.error('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Background Violet Ambient Glow */}
      <div className="absolute w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="w-full max-w-[420px] rounded-2xl sm:rounded-3xl bg-[#0c0f1d] border border-[#1e2538] shadow-2xl shadow-indigo-950/50 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 relative text-left"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161a32] border border-[#2d3563] flex items-center justify-center text-indigo-400 shadow-inner">
              <Shield className="w-5 h-5 text-indigo-400 stroke-[2]" />
            </div>
            <h2
              id="auth-modal-title"
              className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight"
            >
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Segmented Control Pill */}
        <div className="w-full bg-[#080b14] p-1 rounded-xl flex items-center border border-[#1a2034]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setFormError('');
            }}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex-1 text-center transition-all ${
              activeTab === 'signin'
                ? 'bg-[#5850ec] text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setFormError('');
            }}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex-1 text-center transition-all ${
              activeTab === 'signup'
                ? 'bg-[#5850ec] text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Active Tab Form */}
        {activeTab === 'signin' ? (
          /* Sign In Form */
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                PASSWORD
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Glowing Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#6366f1] via-[#5850ec] to-[#7c3aed] hover:from-[#5457e5] hover:to-[#6d28d9] shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                FULL NAME
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  ref={emailInputRef}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adarsh Khatangale"
                  className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  CONFIRM
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121626] border border-[#232a42] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#6366f1] via-[#5850ec] to-[#7c3aed] hover:from-[#5457e5] hover:to-[#6d28d9] shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>
        )}

        {/* Divider: OR CONTINUE WITH */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-[#1e2538]" />
          <span className="absolute px-3 bg-[#0c0f1d] text-[10px] font-bold uppercase tracking-widest text-slate-500">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#141829] hover:bg-[#1a2037] border border-[#232a42] hover:border-slate-600 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* 1-Click Instant Demo Button (For testing on Vercel without setup) */}
        <div className="pt-2 border-t border-[#1a2034] flex items-center justify-between text-[11px] text-slate-400">
          <span>Testing locally or on Vercel?</span>
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={loading}
            className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            1-Click Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
