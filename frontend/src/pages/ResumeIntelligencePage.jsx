import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import { resumeIntelligenceAPI, resumeAPI } from '../lib/api';
import { 
  FileSearch, Upload, BrainCircuit, CheckCircle, 
  AlertTriangle, Target, Loader2, Sparkles, TrendingUp, ChevronRight,
  Brain, Zap, ArrowRight, ShieldCheck, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper for circular progress
const CircularProgress = ({ value, label, color }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle cx="64" cy="64" r={radius} stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
        <circle 
          cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${color}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px currentColor)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900">{value}%</span>
      </div>
      <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

const ResumeIntelligencePage = () => {
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [analysis, setAnalysis] = useState(null);
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  React.useEffect(() => {
    resumeAPI.getAll().then(res => setResumes(res.data.data)).catch(() => {});
  }, []);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSelectedResumeId('');
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file && !selectedResumeId) {
      return toast.error('Please upload a resume or select a saved one');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append('resume', file);
      if (selectedResumeId) formData.append('resumeId', selectedResumeId);
      formData.append('targetRole', targetRole);

      const res = await resumeIntelligenceAPI.analyze(formData);
      setAnalysis(res.data.data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="section-header">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="page-title">Resume Intelligence</h1>
              <p className="page-subtitle">Deep AI analysis and ATS optimization</p>
            </div>
          </div>
        </div>

        {!analysis ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mt-12">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
                  <BrainCircuit className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">AI Resume Score</h2>
                <p className="text-slate-400 font-bold max-w-md mx-auto">
                  Get instant feedback on your resume's ATS compatibility and role match percentage.
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="label-field pl-1">Target Role</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Target className="w-4 h-4" /></div>
                      <input 
                        type="text" 
                        className="input-field pl-11" 
                        placeholder="e.g. Senior Frontend Engineer" 
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="label-field pl-1">Saved Resume</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FileSearch className="w-4 h-4" /></div>
                      <select 
                        className="input-field pl-11 appearance-none" 
                        value={selectedResumeId}
                        onChange={e => { setSelectedResumeId(e.target.value); setFile(null); }}
                      >
                        <option value="">Upload new PDF below</option>
                        {resumes.map(r => (
                          <option key={r._id} value={r._id}>{r.name} ({r.targetRole || 'General'})</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                    </div>
                  </div>
                </div>

                {!selectedResumeId && (
                  <div 
                    className={`group border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300 cursor-pointer ${file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'}`}
                    onClick={() => document.getElementById('resume-upload').click()}
                  >
                    <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className={`w-8 h-8 ${file ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </div>
                    <p className={`text-lg font-black ${file ? 'text-indigo-600' : 'text-slate-900'}`}>{file ? file.name : 'Choose Resume PDF'}</p>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Maximum size 5MB</p>
                  </div>
                )}

                <button 
                  onClick={handleAnalyze} 
                  disabled={loading || (!file && !selectedResumeId)}
                  className="btn-primary w-full py-5 text-xl"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  {loading ? 'AI Engine Working...' : 'Start Intelligence Analysis'}
                </button>
                
                <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-2">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SECURE ENCRYPTION</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> AI LLAMA-3 POWERED</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
            {/* Top Analysis Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="flex w-full justify-around">
                  <CircularProgress value={analysis.atsScore} label="ATS Score" color="text-indigo-600" />
                  <CircularProgress value={analysis.careerPotential} label="Potential" color="text-emerald-500" />
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 w-full text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Score
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Role Compatibility</h3>
                  </div>
                </div>
                <div className="space-y-6">
                  {analysis.roleCompatibility.map((role, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <span className="text-[15px] font-black text-slate-800">{role.role}</span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Target Match</p>
                        </div>
                        <span className="text-xl font-black text-purple-600">{role.match}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-50 overflow-hidden border border-slate-100 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${role.match}%` }}
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keyword & Readiness Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Keyword Engine</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-10">
                  {analysis.keywordAnalysis.map((kw, i) => (
                    <span key={i} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border transition-all hover:scale-105 ${
                      kw.status === 'Found' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                      'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                    }`}>
                      {kw.status === 'Found' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {kw.keyword}
                    </span>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Missing Intelligence
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black rounded-xl uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Readiness</h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(analysis.industryReadiness).map(([key, val], i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{key.replace('_', ' ')}</span>
                        <span className="text-[14px] font-black text-amber-600">{val}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-50 border border-slate-100 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          className="h-full bg-amber-500 rounded-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights & Suggestions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">AI Strategy Insights</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.aiInsights.map((insight, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white/10 border border-white/10 rounded-[1.5rem] backdrop-blur-sm hover:bg-white/15 transition-colors">
                        <Brain className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-60" />
                        <p className="text-[14px] font-bold leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl" />
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-indigo-600 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Action Items</h3>
                </div>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-[14px] font-bold text-slate-600 leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => { setAnalysis(null); setFile(null); setSelectedResumeId(''); }} 
                className="btn-secondary group px-10"
              >
                Start New Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default ResumeIntelligencePage;
