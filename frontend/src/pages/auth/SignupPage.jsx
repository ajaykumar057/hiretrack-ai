import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Star, Rocket, ShieldCheck, Zap, UserPlus, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Mobile Developer', 'DevOps Engineer', 'UI/UX Designer', 'Product Manager', 'Other'];

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', targetRole: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.targetRole) return toast.error('Please select your target role');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.targetRole);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Intelligent Application Pipeline',
    'Real-time ATS Score Engine',
    'AI-Powered Interview Simulations',
    'Networking CRM & Referral Tracking',
  ];

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Left Panel - Visuals */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center p-12 z-10 border-r border-slate-50">
        <div className="relative w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <span className="font-black text-xl italic">HT</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">HireTrack <span className="text-indigo-600">AI</span></span>
            </Link>

            <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
              Start your <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">elite journey.</span>
            </h2>
            <p className="text-lg font-bold text-slate-400 mb-12 max-w-md leading-relaxed">
              Join 50,000+ top-tier professionals using AI to dominate their job search and land dream roles at FAANG & startups.
            </p>

            <div className="space-y-4 mb-12">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[15px] font-black text-slate-700 tracking-tight">{perk}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" className="w-12 h-12 rounded-full border-4 border-white shadow-sm" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Highly rated by top developers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/50"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <span className="font-black text-lg italic">HT</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">HireTrack <span className="text-indigo-600">AI</span></span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 px-2">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all duration-500 ${
                    step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {s === 1 ? 'Credential' : 'Identity'}
                  </span>
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-1000 ${step > 1 ? 'bg-indigo-600' : 'bg-slate-50'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {step === 1 ? 'Create Workspace' : 'Target Identity'}
            </h1>
            <p className="text-slate-400 font-bold text-sm">
              {step === 1 ? 'Start your high-performance tracking today' : 'Help us configure your AI experience'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      setLoading(true);
                      try {
                        await loginWithGoogle(credentialResponse.credential);
                        navigate('/dashboard');
                      } catch (error) {
                        toast.error('Google signup failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={() => {
                      toast.error('Google Signup Failed');
                    }}
                    theme="outline"
                    shape="pill"
                    size="large"
                    width="350"
                    text="signup_with"
                  />
                </div>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Secure Direct Channel</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <form onSubmit={handleStep1} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Legal Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600"><UserPlus className="w-4 h-4" /></div>
                      <input
                        type="text"
                        className="input-field pl-11"
                        placeholder="e.g. Sarah Connor"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Email</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="you@domain.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Access Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-field pr-12"
                        placeholder="Secure sequence (min 6 chars)"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-5 text-lg group">
                    Next Phase <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 block text-center">Select your target discipline</label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, targetRole: role })}
                        className={`px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 flex items-center justify-between group ${
                          form.targetRole === role
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{role}</span>
                        {form.targetRole === role && <Target className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                  >
                    {loading ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> Initializing Core...</>
                    ) : (
                      <>Initialize Account <Rocket className="w-6 h-6" /></>
                    )}
                  </button>

                  <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    ← Back to Step 1
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-[13px] font-bold text-slate-400 mt-10">
            Existing operative?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-black transition-colors">
              Access Vault
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
