import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2, Star, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Left Panel - Visuals */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center p-12 z-10">
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
              Unlock your <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">career potential.</span>
            </h2>
            <p className="text-lg font-bold text-slate-400 mb-12 max-w-md leading-relaxed">
              Track applications, optimize resumes, and master interviews with our high-fidelity career intelligence suite.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { val: '50K+', label: 'Successful Hires', icon: Star, color: 'text-amber-500' },
                { val: '94%', label: 'ATS Match Rate', icon: Zap, color: 'text-indigo-600' },
                { val: '2M+', label: 'Jobs Tracked', icon: CheckCircle, color: 'text-emerald-500' },
                { val: 'Secure', label: 'Encrypted Data', icon: ShieldCheck, color: 'text-blue-500' },
              ].map((s, i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">{s.val}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
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
          className="w-full max-w-md bg-white p-10 lg:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-indigo-100/50"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <span className="font-black text-lg italic">HT</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">HireTrack <span className="text-indigo-600">AI</span></span>
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-400 font-bold text-sm">Sign in to your career command center</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoading(true);
                  try {
                    await loginWithGoogle(credentialResponse.credential);
                    navigate('/dashboard');
                  } catch (error) {
                    toast.error('Google login failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => {
                  toast.error('Google Login Failed');
                }}
                theme="outline"
                shape="pill"
                size="large"
                width="350"
              />
            </div>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Secure Email Portal</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Identification</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your registered email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                  <Link to="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 text-lg group"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Authorizing...</>
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>



            <p className="text-center text-[13px] font-bold text-slate-400 mt-8">
              New to the platform?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-black transition-colors">
                Initialize Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
