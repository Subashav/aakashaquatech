import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Droplets,
  Wrench,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  Building,
  KeyRound,
  X,
} from 'lucide-react';
import { useApp, DEMO_ACCOUNTS } from '../context/AppContext';
import { Button } from '../components/ui/Button';

export const LoginView: React.FC = () => {
  const { login, theme, setTheme, showToast } = useApp();

  const [email, setEmail] = useState('admin@aakashaqua.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login({ email, password, rememberMe });
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoUser = (accountKey: string) => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (acc) {
      setEmail(acc.user.email);
      setPassword(acc.pass);
      setErrorMessage(null);
    }
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      showToast('Please enter a valid business email address', 'error');
      return;
    }
    setRecoverySent(true);
    showToast(`Password recovery link dispatched to ${recoveryEmail}`, 'success');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-black text-black dark:text-white selection:bg-[#0369A1]/20 selection:text-[#0369A1] transition-colors duration-150">
      {/* LEFT SIDE: Brand & Technical Visual Identity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative lg:w-1/2 bg-white dark:bg-black text-black dark:text-white p-8 lg:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#222222]"
      >
        {/* Subtle Engineering Grid & Geometry Overlay */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none bg-[radial-gradient(#0369A1_1px,transparent_1px)] dark:bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Dynamic Abstract Technical Water Skid Graphic SVG */}
        <div className="absolute right-[-10%] top-[15%] w-[500px] h-[500px] pointer-events-none opacity-[0.08] dark:opacity-20">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-cyan-600 dark:stroke-cyan-400">
            <circle cx="200" cy="200" r="180" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="130" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="80" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="20" y1="200" x2="380" y2="200" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="200" y1="20" x2="200" y2="380" strokeWidth="1" strokeOpacity="0.4" />
            <rect x="140" y="140" width="120" height="120" rx="6" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="12" fill="#0891B2" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#0369A1] text-white flex items-center justify-center font-bold text-sm tracking-wider border border-[#0891B2]/50 shadow-sm">
              AA
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
                <span>Aakash Aqua Tech</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F0F9FF] dark:bg-[#111111] border border-[#BAE6FD] dark:border-[#333333] text-[#0369A1] dark:text-[#7DD3FC]">
                  Enterprise
                </span>
              </div>
              <div className="text-2xs text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
                Business Management Platform
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-2xs font-mono text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-black px-2.5 py-1 rounded border border-slate-200 dark:border-[#222222]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HQ Systems Active</span>
          </div>
        </div>

        {/* Core Value Proposition & Water Tech Pillars */}
        <div className="relative z-10 my-8 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#F0F9FF] dark:bg-black border border-[#BAE6FD] dark:border-[#222222] text-[#0369A1] dark:text-[#38BDF8]">
            <Droplets className="w-3.5 h-3.5" />
            <span>Industrial RO & Water Treatment Operations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black dark:text-white leading-tight">
            Precision Operations for Commercial Water Systems
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Integrated lifecycle management from initial site water testing and engineering quotes to field engineer dispatch, OTP authorization, spare parts inventory, and recurring AMC governance.
          </p>

          {/* Three Key Pillars (visible on tablet and desktop) */}
          <div className="hidden md:block space-y-3 pt-2">
            {[
              {
                icon: <Wrench className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />,
                title: 'Field Engineer OTP Dispatch',
                desc: 'Real-time job allocation, customer OTP confirmation, and digital service sign-off.',
              },
              {
                icon: <Activity className="w-4 h-4 text-[#0891B2] dark:text-sky-400" />,
                title: 'Multi-Branch Operations',
                desc: 'Centralized visibility across Coimbatore Hub, Salem, Tiruppur, and Chennai.',
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                title: 'AMC & Preventive Governance',
                desc: 'Automated contract renewals, membrane maintenance schedules, and GST billing.',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-3 p-3 rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#222222] hover:border-slate-300 dark:hover:border-[#333333] transition-colors"
              >
                <div className="p-1.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-[#333333] shrink-0 mt-0.5">
                  {pillar.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-black dark:text-white">{pillar.title}</div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">{pillar.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Uptime & Regional Compliance */}
        <div className="relative z-10 pt-6 border-t border-slate-200 dark:border-[#222222] flex flex-wrap items-center justify-between text-2xs text-slate-500 dark:text-zinc-400 gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>HQ: Peelamedu, Coimbatore, Tamil Nadu</span>
          </div>
          <div className="font-mono text-slate-600 dark:text-zinc-400">Platform v2.4.0 • ISO 9001:2015</div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white dark:bg-black">
        {/* Top bar on right: Theme Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pb-6">
          <div className="text-xs font-medium text-slate-600 dark:text-zinc-400 sm:hidden">
            Aakash Aqua Tech CRM
          </div>

          <div className="flex items-center gap-1 p-1 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-xs">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded text-xs transition-colors ${
                theme === 'light'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Light theme (Complete White)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Dark theme (Complete Black)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded text-xs transition-colors ${
                theme === 'system'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="System theme"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Sign In Form Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full max-w-md mx-auto my-auto space-y-6"
        >
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
              Sign in to your account
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Enter your credentials to access business operations, dispatch queues, and customer records.
            </p>
          </div>

          {/* Quick Demo Credentials Switcher */}
          <div className="p-3 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-xs space-y-2">
            <div className="flex items-center justify-between text-2xs">
              <span className="font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Demo Role Quick-Fill
              </span>
              <span className="text-[10px] text-[#0369A1] dark:text-[#38BDF8] font-mono">1-Click Test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoUser('admin@aakashaqua.com')}
                className={`py-1.5 px-2 text-2xs rounded font-medium border text-center transition-all ${
                  email === 'admin@aakashaqua.com'
                    ? 'bg-[#0369A1] text-white border-[#0369A1]'
                    : 'bg-white dark:bg-black text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-[#222222] hover:border-[#0369A1]'
                }`}
              >
                Admin Ops
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoUser('service@aakashaqua.com')}
                className={`py-1.5 px-2 text-2xs rounded font-medium border text-center transition-all ${
                  email === 'service@aakashaqua.com'
                    ? 'bg-[#0369A1] text-white border-[#0369A1]'
                    : 'bg-white dark:bg-black text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-[#222222] hover:border-[#0369A1]'
                }`}
              >
                Service Head
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoUser('arun.tech@aakashaqua.com')}
                className={`py-1.5 px-2 text-2xs rounded font-medium border text-center transition-all ${
                  email === 'arun.tech@aakashaqua.com'
                    ? 'bg-[#0369A1] text-white border-[#0369A1]'
                    : 'bg-white dark:bg-black text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-[#222222] hover:border-[#0369A1]'
                }`}
              >
                Field Eng
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black dark:text-white">
                Email Address or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aakashaqua.com"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md text-black dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0369A1]/30 focus:border-[#0369A1] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-black dark:text-white">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setForgotModalOpen(true);
                  }}
                  className="text-2xs font-medium text-[#0369A1] hover:text-[#075985] dark:text-[#38BDF8] dark:hover:text-[#7DD3FC] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-9 pr-10 py-2 text-xs font-medium bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md text-black dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0369A1]/30 focus:border-[#0369A1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-[#333333] text-[#0369A1] focus:ring-[#0369A1] accent-[#0369A1]"
                />
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-xs rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0369A1]/40"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Secure Note */}
          <div className="pt-2 text-center text-2xs text-slate-500 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>TLS 1.3 encrypted secure session management</span>
            </span>
          </div>
        </motion.div>

        {/* Bottom Help note */}
        <div className="text-center pt-6 text-2xs text-slate-500 dark:text-zinc-500 border-t border-slate-200 dark:border-[#222222]">
          Trouble logging in? Contact IT Operations desk: <span className="text-[#0369A1] dark:text-cyan-400 font-mono">support@aakashaqua.com</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => {
                setForgotModalOpen(false);
                setRecoverySent(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-modal p-6 text-left z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222222]">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-black dark:text-white">
                    Password Recovery
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setRecoverySent(false);
                  }}
                  className="text-slate-400 hover:text-black dark:text-zinc-400 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {recoverySent ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-black dark:text-white">
                    Instructions Sent
                  </div>
                  <p className="text-2xs text-slate-600 dark:text-zinc-400">
                    We have dispatched a password reset link to <strong className="text-black dark:text-white">{recoveryEmail}</strong>. Please check your inbox within 15 minutes.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      setForgotModalOpen(false);
                      setRecoverySent(false);
                    }}
                  >
                    Return to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendRecovery} className="py-4 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-zinc-400">
                    Enter your registered email address and our operational authentication service will dispatch a temporary recovery link.
                  </p>
                  <div>
                    <label className="block text-2xs font-semibold text-black dark:text-white mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="name@aakashaqua.com"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0369A1]/30 focus:border-[#0369A1]"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForgotModalOpen(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
