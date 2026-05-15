import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI, interviewAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { 
  Brain, Loader2, Zap, Target, CheckCircle, AlertTriangle, 
  Info, Lightbulb, Copy, RefreshCw, Sparkles, ChevronRight, 
  BrainCircuit, Rocket, Star, ShieldCheck, TrendingUp, Search,
  FileText, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIPage = () => {
  const [activeTab, setActiveTab] = useState('resume-match');
  const [loading, setLoading] = useState(false);

  // Resume Match
  const [jd, setJd] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  // Question Generator
  const [qForm, setQForm] = useState({ role: 'Full Stack Developer', techStack: [], roundType: 'Technical Round 1', companyType: 'Product' });
  const [questions, setQuestions] = useState(null);
  const [techInput, setTechInput] = useState('');

  // Insights
  const [insights, setInsights] = useState([]);
  const [insightsLoaded, setInsightsLoaded] = useState(false);

  const handleResumeMatch = async () => {
    if (!jd.trim() || !resumeText.trim()) return toast.error('Provide both Job Description and Resume data');
    setLoading(true);
    try {
      const res = await aiAPI.resumeMatch({ jobDescription: jd, resumeText });
      setMatchResult(res.data.data);
      toast.success('Neural Match Complete');
    } catch {
      toast.error('Analysis failed. Check your data stream.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.generateQuestions({ ...qForm, techStack: qForm.techStack });
      setQuestions(res.data.data);
      toast.success('Simulations Generated');
    } catch {
      toast.error('Simulation engine error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadInsights = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.getInsights();
      setInsights(res.data.data);
      setInsightsLoaded(true);
    } catch {
      toast.error('Insights retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setQForm({ ...qForm, techStack: [...qForm.techStack, techInput.trim()] });
      setTechInput('');
    }
  };

  const tabs = [
    { id: 'resume-match', label: 'ATS Neural Match', icon: Target, desc: 'Score your resume against any job' },
    { id: 'question-gen', label: 'Interview Prep', icon: Rocket, desc: 'AI-generated technical simulations' },
    { id: 'insights', label: 'Core Intelligence', icon: BrainCircuit, desc: 'Data-driven career insights' },
  ];

  const scoreColor = (score) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'indigo';
    if (score >= 40) return 'amber';
    return 'rose';
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Page Header */}
        <div className="section-header px-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-100 group">
              <Brain className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">AI Neural Engine</h1>
              <p className="page-subtitle font-bold text-slate-400 uppercase tracking-widest text-[10px]">High-Fidelity Career Intelligence Suite</p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-[11px] uppercase tracking-widest border border-indigo-100 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Neural Streams...
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-8 rounded-[3rem] border-2 transition-all duration-500 text-left group relative overflow-hidden ${
                activeTab === tab.id 
                ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' 
                : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 shadow-sm'
              }`}>
                <tab.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-black tracking-tight mb-1 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                {tab.label}
              </h3>
              <p className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">{tab.desc}</p>
              
              {activeTab === tab.id && (
                <div className="absolute top-4 right-6">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'resume-match' && (
            <motion.div
              key="resume-match"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-600" /> Input Data
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-3">Job Description Intelligence</label>
                      <textarea
                        rows={6}
                        className="input-field !rounded-[2rem] resize-none !p-6 !text-[13px] font-bold bg-slate-50/50"
                        placeholder="Paste the full job description here..."
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-3">Resume Content Stream</label>
                      <textarea
                        rows={6}
                        className="input-field !rounded-[2rem] resize-none !p-6 !text-[13px] font-bold bg-slate-50/50"
                        placeholder="Paste your resume text content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleResumeMatch}
                      disabled={loading}
                      className="btn-primary w-full py-5 text-xl rounded-[2rem] shadow-xl shadow-indigo-100"
                    >
                      {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Initializing Match...</> : <>Run Neural Analysis <Zap className="ml-2 w-6 h-6" /></>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                {matchResult ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    {/* Score Card */}
                    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 text-center relative overflow-hidden">
                      <div className={`absolute top-0 inset-x-0 h-2 bg-${scoreColor(matchResult.score)}-500`} />
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Neural Compatibility Score</p>
                      <div className="relative inline-block mb-8">
                        <svg className="w-48 h-48 -rotate-90">
                          <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                          <motion.circle
                            cx="96" cy="96" r="88" fill="none"
                            stroke={`var(--tw-stroke-${scoreColor(matchResult.score)}-500)`}
                            strokeWidth="12"
                            strokeDasharray={2 * Math.PI * 88}
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - matchResult.score / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-6xl font-black text-slate-900 font-display`}>{matchResult.score}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">% Match</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {matchResult.matchedKeywords.slice(0, 8).map((kw, i) => (
                          <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                      <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10 text-blue-400">
                        <Lightbulb className="w-6 h-6" /> Strategic Adjustments
                      </h3>
                      <div className="space-y-6 relative z-10">
                        {matchResult.suggestions.map((s, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                            <p className="text-[13px] font-bold opacity-80 leading-relaxed">{s}</p>
                          </motion.div>
                        ))}
                      </div>
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mb-32 -mr-32" />
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                    <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center mb-10 shadow-sm">
                      <Activity className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Engine Standby</h3>
                    <p className="text-slate-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest text-[10px]">Initialize match sequence to view ATS compatibility data</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'question-gen' && (
            <motion.div
              key="question-gen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-5">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm sticky top-8">
                  <h3 className="text-xl font-black text-slate-900 mb-10">Simulation Config</h3>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Persona</label>
                      <input className="input-field" value={qForm.role} onChange={e => setQForm({...qForm, role: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Knowledge Cluster (Enter to add)</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {qForm.techStack.map(t => (
                          <span key={t} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            {t} <button onClick={() => setQForm({...qForm, techStack: qForm.techStack.filter(x => x !== t)})} className="ml-1 hover:text-rose-500">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input className="input-field pl-12" value={techInput} onKeyDown={addTech} onChange={e => setTechInput(e.target.value)} placeholder="React, Node.js, System Design..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phase</label>
                        <select className="input-field" value={qForm.roundType} onChange={e => setQForm({...qForm, roundType: e.target.value})}>
                          <option>Technical Round 1</option>
                          <option>System Design</option>
                          <option>Hiring Manager</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company Scale</label>
                        <select className="input-field" value={qForm.companyType} onChange={e => setQForm({...qForm, companyType: e.target.value})}>
                          <option>Product Based</option>
                          <option>FAANG Elite</option>
                          <option>Growth Startup</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateQuestions}
                      disabled={loading}
                      className="btn-primary w-full py-5 text-xl rounded-[2rem] shadow-xl shadow-indigo-100 mt-4"
                    >
                      {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Booting simulation...</> : <>Generate Simulation <Rocket className="ml-2 w-6 h-6" /></>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                {questions ? (
                  <div className="space-y-6">
                    {questions.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 group"
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{q.question}</h4>
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Target className="w-3 h-3" /> Core Intent
                              </p>
                              <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic">"{q.expectedAnswer}"</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[4rem] border border-slate-100 h-full min-h-[600px] flex flex-col items-center justify-center p-20 text-center relative overflow-hidden group">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-700">
                      <Target className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">No Active Simulation</h3>
                    <p className="text-slate-400 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest text-[10px]">Configure your target persona and knowledge cluster to initialize technical interview questions</p>
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-50" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {!insightsLoaded ? (
                <div className="bg-white p-20 rounded-[4rem] border border-slate-100 shadow-sm text-center group">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-100 group-hover:scale-110 transition-transform duration-500">
                    <BrainCircuit className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Neural Insights Portal</h3>
                  <p className="text-slate-400 font-bold mb-12 max-w-md mx-auto leading-relaxed">Activate core intelligence to parse your entire application history and generate strategic career advice.</p>
                  <button
                    onClick={handleLoadInsights}
                    disabled={loading}
                    className="btn-primary px-12 py-5 text-xl rounded-full shadow-2xl shadow-indigo-100"
                  >
                    {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Accessing Core...</> : <>Access Intelligence Vault</>}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-10 rounded-[3.5rem] border-2 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${
                        insight.type === 'success' ? 'border-emerald-100 bg-white hover:border-emerald-200 shadow-emerald-50' :
                        insight.type === 'warning' ? 'border-amber-100 bg-white hover:border-amber-200 shadow-amber-50' :
                        insight.type === 'tip' ? 'border-purple-100 bg-white hover:border-purple-200 shadow-purple-50' :
                        'border-indigo-100 bg-white hover:border-indigo-200 shadow-indigo-50'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform ${
                        insight.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        insight.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                        insight.type === 'tip' ? 'bg-purple-50 text-purple-600' :
                        'bg-indigo-50 text-indigo-600'
                      }`}>
                        {insight.type === 'success' ? <CheckCircle className="w-7 h-7" /> :
                         insight.type === 'warning' ? <AlertTriangle className="w-7 h-7" /> :
                         insight.type === 'tip' ? <Lightbulb className="w-7 h-7" /> :
                         <Info className="w-7 h-7" />}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{insight.title}</h4>
                      <p className="text-[14px] font-bold text-slate-500 leading-relaxed mb-6">{insight.content}</p>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                        Explore Signal <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default AIPage;
