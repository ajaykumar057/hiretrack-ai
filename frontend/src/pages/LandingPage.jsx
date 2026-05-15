import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, BarChart3, Briefcase, KanbanSquare, Users,
  Brain, Target, Shield, Zap, Star, CheckCircle2, ChevronDown,
  TrendingUp, Globe, Rocket, Code2, FileText, Play, Menu, X,
  Search, Bell, LayoutDashboard, MessageSquare, ClipboardCheck, History
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Resources', href: '#resources' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
  ];

  const bottomFeatures = [
    { icon: Target, title: 'Smart Tracking', desc: 'Track every application in one place' },
    { icon: TrendingUp, title: 'AI Insights', desc: 'Get AI-powered insights to improve' },
    { icon: FileText, title: 'Resume Analysis', desc: 'Analyze and optimize your resume' },
    { icon: Users, title: 'Interview Prep', desc: 'Prepare better with AI interview coach' },
    { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a follow-up or opportunity' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[20%] left-[10%] w-[20%] h-[20%] bg-blue-50 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <span className="font-black text-xl italic">HT</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">
              HireTrack <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                {link.name}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login" className="btn-ghost-light text-[15px] font-bold">Log in</Link>
            <Link to="/signup" className="btn-primary-light text-[15px] px-6">Sign up</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <span className="font-black text-sm italic">HT</span>
                </div>
                <span className="font-bold text-xl">HireTrack AI</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-xl font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>{link.name}</a>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Link to="/login" className="btn-secondary-light text-center py-4 text-lg">Log in</Link>
              <Link to="/signup" className="btn-primary-light text-center py-4 text-lg">Sign up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative pt-32 lg:pt-48 pb-20 z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-indigo-50 text-indigo-600 text-[13px] font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 fill-indigo-600" />
                AI-Powered Career Intelligence
              </div>
              
              <h1 className="text-[52px] lg:text-[84px] font-black leading-[0.95] tracking-tight text-slate-900 mb-8">
                Track. Analyze.<br />
                Optimize.<br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent italic pr-2">Get Hired.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-500 mb-12 max-w-xl lg:mx-0 mx-auto font-medium leading-relaxed">
                HireTrack AI helps you track applications, analyze your progress, optimize your resume, and land your dream role faster with AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center mb-16">
                <Link to="/signup" className="btn-primary-light px-10 py-5 text-lg group w-full sm:w-auto">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn-secondary-light px-10 py-5 text-lg flex items-center justify-center gap-3 w-full sm:w-auto">
                  <Play className="w-5 h-5 fill-slate-700" />
                  Explore Features
                </button>
              </div>

              {/* Trusted by */}
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  Trusted by <span className="text-indigo-600 font-bold">10,000+</span> job seekers
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 relative w-full max-w-[640px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Dashboard UI */}
              <div className="relative">
                {/* Colorful Background Blob */}
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-[3rem] overflow-hidden -z-10 shadow-2xl shadow-indigo-200/50">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
                  {/* Decorative dots */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>)}
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full border border-white/20"></div>
                    <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] rounded-full border border-white/10"></div>
                  </div>
                </div>

                {/* Dashboard Container */}
                <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden flex border border-slate-100 ml-4 lg:ml-12 mt-8 lg:mt-12 h-[450px] w-full transform origin-top-left scale-[0.85] sm:scale-100 lg:scale-[0.9] xl:scale-100">
                  
                  {/* Sidebar */}
                  <div className="w-20 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-6 gap-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                      <span className="font-black text-lg italic">HT</span>
                    </div>
                    <div className="flex flex-col gap-6 w-full items-center">
                      {[LayoutDashboard, Briefcase, BarChart3, Users, Target, Shield].map((Icon, i) => (
                        <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors ${i === 0 ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 bg-white p-6 md:p-8 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600">
                          This Month <ChevronDown className="w-3 h-3" />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 relative">
                          <Bell className="w-4 h-4" />
                          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <img src="https://i.pravatar.cc/150?u=aditya" alt="User" className="w-8 h-8 rounded-full" />
                      </div>
                    </div>

                    {/* Welcome */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-800">Welcome back, Aditya 👋</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Here's what's happening with your job search.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {[
                        { title: 'Applications', val: '48', inc: '12%', color: 'emerald' },
                        { title: 'Interviews', val: '12', inc: '8%', color: 'emerald' },
                        { title: 'Offers', val: '3', inc: '50%', color: 'emerald' },
                        { title: 'Success Rate', val: '25%', inc: '10%', color: 'emerald' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-24">
                          <span className="text-[10px] font-bold text-slate-500">{stat.title}</span>
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-black text-slate-800 leading-none">{stat.val}</span>
                            <span className={`text-[10px] font-bold text-${stat.color}-500 flex items-center`}>
                              ↑ {stat.inc}
                            </span>
                          </div>
                          {/* Mini Sparkline Chart */}
                          <svg className="w-full h-4 mt-2" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,20 Q10,10 20,15 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                          </svg>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Area */}
                    <div className="flex gap-4 flex-1">
                      {/* Application Status */}
                      <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                        <span className="text-[11px] font-bold text-slate-800 mb-4">Application Status</span>
                        <div className="flex items-center gap-4 flex-1">
                          {/* Donut Chart */}
                          <div className="relative w-20 h-20 shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#6366f1" strokeWidth="12" strokeDasharray="201" strokeDashoffset="50" />
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="201" strokeDashoffset="120" />
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="201" strokeDashoffset="180" />
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="201" strokeDashoffset="195" />
                            </svg>
                          </div>
                          {/* Legend */}
                          <div className="space-y-2 flex-1">
                            {[
                              { label: 'Applied', val: 48, color: 'bg-indigo-500' },
                              { label: 'Interview', val: 12, color: 'bg-emerald-500' },
                              { label: 'Assessment', val: 8, color: 'bg-amber-500' },
                              { label: 'Offer', val: 3, color: 'bg-orange-500' },
                              { label: 'Rejected', val: 15, color: 'bg-red-500' },
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                  <span className="text-[9px] font-bold text-slate-600">{item.label}</span>
                                </div>
                                <span className="text-[9px] font-bold text-slate-800">{item.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent Applications */}
                      <div className="flex-[1.2] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                        <span className="text-[11px] font-bold text-slate-800 mb-3">Recent Applications</span>
                        <div className="space-y-3">
                          {[
                            { role: 'Frontend Developer', comp: 'Google', time: '2d ago', status: 'Applied', color: 'indigo', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
                            { role: 'Product Analyst', comp: 'Microsoft', time: '5d ago', status: 'Interview', color: 'purple', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
                            { role: 'SDE Intern', comp: 'Amazon', time: '1w ago', status: 'Assessment', color: 'amber', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg' },
                          ].map((job, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100">
                                  <img src={job.icon} alt={job.comp} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{job.role}</p>
                                  <p className="text-[8px] font-medium text-slate-500">{job.comp} &bull; {job.time}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full bg-${job.color}-50 text-${job.color}-600 text-[8px] font-bold`}>
                                {job.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Score Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -left-12 bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-50 z-20 w-44"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">AI Resume Score</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray={176} strokeDashoffset={176 * 0.18} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800 leading-none">82</span>
                      <span className="text-[8px] font-bold text-slate-400">/100</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-800 text-center mb-1">Strong resume!</p>
                <div className="h-1.5 w-12 bg-indigo-50 rounded-full mx-auto" />
              </motion.div>

              {/* Floating Match Score Card */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-20 bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 z-20 w-56"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">Match Score</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 78%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full mb-4 overflow-hidden">
                  <div className="h-full w-[78%] bg-indigo-500 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Good Match</p>
                    <p className="text-[9px] font-medium text-slate-400">Keep optimizing skills</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Insights Card */}
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-16 bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 z-20 w-64"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">AI Insights</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1" />
                    <p className="text-[11px] font-medium text-slate-500">Add 3 more projects to your resume</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1" />
                    <p className="text-[11px] font-medium text-slate-500">Improve your resume keywords</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                    <p className="text-[11px] font-medium text-slate-500">Apply to similar roles at Stripe</p>
                  </div>
                </div>
              </motion.div>

              {/* Connective Lines (Approximated with CSS) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible" style={{ strokeDasharray: "4 4" }}>
                <path d="M-10,50 Q40,40 40,80" stroke="#e2e8f0" strokeWidth="2" fill="none" />
                <path d="M500,100 Q550,150 550,250" stroke="#e2e8f0" strokeWidth="2" fill="none" />
                <path d="M100,450 Q200,480 200,550" stroke="#e2e8f0" strokeWidth="2" fill="none" />
              </svg>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Feature Bar */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-50 p-6 lg:p-10 flex flex-wrap justify-between items-center gap-8 lg:gap-4">
            {bottomFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">{feature.title}</h3>
                  <p className="text-xs text-slate-400 font-medium whitespace-nowrap">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Re-implementing the other sections in the same premium style */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to land your dream job</h2>
            <p className="text-lg text-slate-500 font-medium">From tracking your first application to comparing multiple offers — HireTrack AI has every feature you need.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Briefcase, title: 'Application Tracker', desc: 'Track every job application with rich details, notes, and status updates in one place.', color: 'bg-indigo-50 text-indigo-600' },
              { icon: KanbanSquare, title: 'Kanban Board', desc: 'Visual drag-and-drop workflow to move applications through stages effortlessly.', color: 'bg-purple-50 text-purple-600' },
              { icon: BarChart3, title: 'Deep Analytics', desc: 'Understand your job search patterns with beautiful charts and actionable insights.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Brain, title: 'AI Resume Match', desc: 'AI-powered ATS score checker that analyzes your resume against job descriptions.', color: 'bg-orange-50 text-orange-600' },
              { icon: Users, title: 'Networking CRM', desc: 'Manage recruiters, alumni, and contacts with follow-up reminders and notes.', color: 'bg-pink-50 text-pink-600' },
              { icon: Target, title: 'Career Goals', desc: 'Set daily, weekly, and monthly goals and track your progress with streaks.', color: 'bg-blue-50 text-blue-600' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 px-6 relative bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Built for every career stage</h2>
            <p className="text-lg text-slate-500 font-medium">Whether you're looking for your first internship or your next executive role, we've got you covered.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Rocket, title: 'Students & Grads', desc: 'Land your first role with AI-optimized resumes and interview prep.', color: 'indigo' },
              { icon: Target, title: 'Career Switchers', desc: 'Highlight transferable skills and discover adjacent career paths.', color: 'purple' },
              { icon: Shield, title: 'Professionals', desc: 'Manage your network and track high-stakes executive applications.', color: 'blue' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-6`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Free resources to boost your search</h2>
              <p className="text-lg text-slate-500 font-medium mb-8">Access our library of ATS-friendly resume templates, interview guides, and salary negotiation scripts.</p>
              <ul className="space-y-4 mb-8">
                {['ATS Resume Templates', 'Tech Interview Guides', 'Salary Data 2024'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-secondary-light px-8 py-4 text-sm font-bold">Explore All Resources</button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="bg-indigo-50 p-6 rounded-[2rem] aspect-square flex flex-col justify-end">
                 <FileText className="w-8 h-8 text-indigo-600 mb-4" />
                 <h4 className="font-bold text-indigo-900">Resume Guide</h4>
               </div>
               <div className="bg-purple-50 p-6 rounded-[2rem] aspect-square flex flex-col justify-end mt-8">
                 <MessageSquare className="w-8 h-8 text-purple-600 mb-4" />
                 <h4 className="font-bold text-purple-900">Interview Prep</h4>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-400 font-medium">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700">
              <h3 className="text-xl font-bold text-slate-200 mb-2">Starter</h3>
              <div className="text-4xl font-black mb-6">$0<span className="text-lg text-slate-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Up to 50 active applications', 'Basic Kanban board', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-slate-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold border border-slate-600 hover:bg-slate-700 transition-colors">Get Started Free</button>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/20 relative">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">Most Popular</div>
              <h3 className="text-xl font-bold text-white/90 mb-2">Pro</h3>
              <div className="text-4xl font-black mb-6">$12<span className="text-lg text-white/70 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited applications', 'AI Resume Match (Unlimited)', 'Networking CRM', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-white text-indigo-600 hover:bg-indigo-50 transition-colors">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-100 text-slate-600 text-[13px] font-bold tracking-wide uppercase">
            <Globe className="w-4 h-4" /> Our Mission
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Leveling the playing field</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
            Job hunting shouldn't feel like throwing resumes into a black hole. We built HireTrack AI to give candidates the same powerful tools that recruiters have been using for years.
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-indigo-100 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-24 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <span className="font-black text-xl italic">HT</span>
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-800">HireTrack AI</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Empowering job seekers with AI-driven career intelligence to organize, analyze, and optimize their journey to success.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                <ul className="space-y-4">
                  {['Features', 'Analytics', 'Kanban', 'AI Resume'].map(item => (
                    <li key={item}><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                <ul className="space-y-4">
                  {['About', 'Careers', 'Blog', 'Contact'].map(item => (
                    <li key={item}><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
                <div className="flex gap-4">
                  {[Globe, Users, Sparkles].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 font-medium text-sm">© 2024 HireTrack AI. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
