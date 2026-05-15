"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Lock, User, ArrowRight, AlertCircle, Fingerprint, ShieldCheck } from 'lucide-react';

// Demo credentials mapped to blockchain identities
const VALID_CREDENTIALS = {
  admin:       { password: 'admin123',    role: 'employer',   org: 'EmployerMSP',   label: 'Government Authority' },
  contractor:  { password: 'contractor1', role: 'contractor', org: 'ContractorMSP', label: 'Contractor' },
  auditor:     { password: 'auditor1',    role: 'engineer',   org: 'AuditorMSP',    label: 'Engineer / Auditor' },
  citizen:     { password: 'public',      role: 'citizen',    org: 'PublicAccess',   label: 'Citizen (View Only)' },
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cred = VALID_CREDENTIALS[username.toLowerCase().trim()];

    if (!cred) {
      setError('Invalid username. User not enrolled on Fabric CA.');
      return;
    }

    if (cred.password !== password) {
      setError('Invalid password. Authentication failed.');
      return;
    }

    setIsLoggingIn(true);

    // Store identity in localStorage
    localStorage.setItem('govtracker_role', cred.role);
    localStorage.setItem('govtracker_org', cred.org);
    localStorage.setItem('govtracker_user', cred.label);
    localStorage.setItem('govtracker_username', username.toLowerCase().trim());

    // Simulate blockchain enrollment delay
    await new Promise(res => setTimeout(res, 1800));

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#02060f] relative overflow-hidden flex items-center justify-center">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,242,254,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <Hexagon size={28} className="text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">GovTracker</h1>
          <p className="text-[11px] text-cyan-400/60 uppercase tracking-[0.25em] font-semibold mb-4">Blockchain Infrastructure Portal</p>
          <p className="text-sm text-slate-400">Sign in with your organization credentials</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleLogin}
          className="bg-[#060d1a]/80 border border-white/[0.06] rounded-xl p-8 backdrop-blur-sm"
        >
          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
              User ID
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full bg-[#02060f] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-[#02060f] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 mb-5"
              >
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoggingIn || !username || !password}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all
              ${isLoggingIn
                ? 'bg-cyan-500/20 text-cyan-400 cursor-wait'
                : 'bg-cyan-500 text-[#02060f] hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {isLoggingIn ? (
              <>
                <Fingerprint size={16} className="animate-spin" />
                Enrolling on Fabric CA...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Enrollment Progress */}
          <AnimatePresence>
            {isLoggingIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-cyan-400 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">Connecting to peer nodes...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Demo Credentials Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-[#060d1a]/50 border border-white/[0.04] rounded-lg p-5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <ShieldCheck size={10} /> Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(VALID_CREDENTIALS).map(([user, cred]) => (
                <button
                  key={user}
                  onClick={() => { setUsername(user); setPassword(cred.password); setError(''); }}
                  className="text-left px-3 py-2 rounded border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.02] transition-all group"
                >
                  <p className="text-[11px] text-slate-300 font-medium group-hover:text-cyan-300 transition-colors">{user}</p>
                  <p className="text-[9px] text-slate-600 font-mono">{cred.org}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/5">
            <Lock size={10} className="text-slate-600" />
            <p className="text-[9px] text-slate-600">Hyperledger Fabric v2.5 • TLS Encrypted • RBAC Enforced</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
