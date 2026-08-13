// frontend/src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import logoImage from '../assets/logo.jpeg';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG       = '#090F16';   // Deep Navy Slate  – main background
const PANEL    = '#0E1720';   // Dark Panel       – card
const TEXT     = '#EEF7FC';   // Ice White        – primary text
const TEAL     = '#45A79A';   // Clinical Teal    – brand / buttons
const ACCENT   = '#4DC4B5';   // Bright Teal      – title text / glow
const MUTED    = '#8FA8B4';   // Muted Text       – secondary text
const BORDER   = '#253642';   // Border           – dividers
const DANGER   = '#EF4444';   // Destructive Red  – errors
const GRAD_FROM = '#55B5A7';  // Gradient from
const GRAD_TO   = '#5593B5';  // Gradient to

export const Login: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailFocus, setEmailFocus]       = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const navigate       = useNavigate();
  const loginMutation  = useLogin();
  const { login: contextLogin } = useAuthContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          contextLogin(data.user, data.token);
          
          // If login is successful, check the role and navigate accordingly
          if (data.user.role === 'MANAGER') {
              navigate('/');
            } else if (data.user.role === 'INVESTIGATOR') {
              navigate('/investigator');
            } else if (data.user.role === 'STAFF') {
              navigate('/submit-incident');
            } else if (data.user.role === 'ACTION_OWNER') {
              navigate('/action-owner');
            } else {
              navigate('/login');
            }
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
          setErrorMsg(message);
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased relative overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Background ambient glow – Clinical Teal */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${GRAD_FROM}18 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      {/* Secondary glow – Slate Blue */}
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${GRAD_TO}12 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* ── Login Card ──────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-8 relative z-10"
        style={{
          backgroundColor: PANEL,
          border: `1px solid ${BORDER}`,
          boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${TEAL}12`,
        }}
      >
        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo ring */}
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5 p-1.5"
            style={{
              backgroundColor: `${TEAL}18`,
              border: `1.5px solid ${TEAL}55`,
              boxShadow: `0 0 20px ${TEAL}30`,
            }}
          >
            <img
              src={logoImage}
              alt="KAIROS Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Title with gradient */}
          <h2
            className="text-2xl font-extrabold tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            KAIROS HIMS
          </h2>
          <p className="text-sm mt-1.5" style={{ color: MUTED }}>
            Sign in to your account
          </p>
        </div>

        {/* ── Form ── */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Error Banner */}
          {errorMsg && (
            <div
              className="rounded-lg p-3 flex items-start gap-2"
              style={{ backgroundColor: `${DANGER}15`, border: `1px solid ${DANGER}50` }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: DANGER }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: DANGER }}>{errorMsg}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              className="block text-sm font-semibold mb-1.5"
              style={{ color: TEXT }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              placeholder="Enter your email"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: BG,
                border: `1.5px solid ${emailFocus ? TEAL : BORDER}`,
                color: TEXT,
                caretColor: ACCENT,
                boxShadow: emailFocus ? `0 0 0 3px ${TEAL}18` : 'none',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-semibold mb-1.5"
              style={{ color: TEXT }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: BG,
                border: `1.5px solid ${passwordFocus ? TEAL : BORDER}`,
                color: TEXT,
                caretColor: ACCENT,
                boxShadow: passwordFocus ? `0 0 0 3px ${TEAL}18` : 'none',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-2 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${TEAL}, #3d9990)`,
              color: '#090F16',
              boxShadow: `0 4px 20px ${TEAL}40`,
            }}
            onMouseEnter={(e) => {
              if (!loginMutation.isPending)
                (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px ${TEAL}60`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${TEAL}40`;
            }}
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: MUTED }}>
            Hospital Incident Management System &bull; AI-Powered Safety Platform
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            <span className="text-[10px] font-mono" style={{ color: ACCENT }}>SECURE CONNECTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
