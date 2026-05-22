import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { 
  Loader2, Upload, FileText, Star, Trash2, Plus, CheckCircle, 
  TrendingUp, Download, Sparkles, BrainCircuit, AlertTriangle, 
  Zap, ArrowRight, ShieldCheck, XCircle, Brain, Target, ChevronRight, 
  FileSearch, ChevronLeft
} from 'lucide-react';
import { resumeAPI, resumeIntelligenceAPI } from '../lib/api';
import toast from 'react-hot-toast';

// Circular progress component for AI stats
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
      <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</span>
    </div>
  );
};

const ResumeCard = ({ resume, onSetDefault, onDelete }) => {
  const callbackRate = resume.timesUsed > 0 ? Math.round((resume.callbackCount / resume.timesUsed) * 100) : 0;
  const interviewRate = resume.callbackCount > 0 ? Math.round((resume.interviewCount / resume.callbackCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-slate-100 p-6 rounded-[2rem] relative group shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 ${resume.isDefault ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
    >
      {resume.isDefault && (
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span className="text-[10px] font-black uppercase tracking-widest">Master Version</span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
          <FileText className="w-7 h-7 text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-900 tracking-tight truncate">{resume.name}</h3>
          <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">{resume.targetRole || 'General'}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Added {new Date(resume.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-50 transition-colors">
          <div className="text-lg font-black text-slate-900">{resume.timesUsed}</div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Used</div>
        </div>
        <div className="text-center p-3 bg-indigo-50/30 rounded-2xl border border-indigo-50 group-hover:bg-white group-hover:border-indigo-50 transition-colors">
          <div className="text-lg font-black text-indigo-600">{callbackRate}%</div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Reply</div>
        </div>
        <div className="text-center p-3 bg-emerald-50/30 rounded-2xl border border-emerald-50 group-hover:bg-white group-hover:border-emerald-50 transition-colors">
          <div className="text-lg font-black text-emerald-600">{interviewRate}%</div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</div>
        </div>
      </div>

      {/* Performance Tracks */}
      <div className="space-y-4 mb-8">
        <div>
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <span>Callback Performance</span>
            <span className="text-indigo-600">{callbackRate}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${callbackRate}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!resume.isDefault ? (
          <button 
            onClick={() => onSetDefault(resume._id)}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
          >
            Make Master
          </button>
        ) : (
          <div className="flex-1 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] font-black text-emerald-600 uppercase tracking-widest text-center">
            Active Master
          </div>
        )}
        <a 
          href={resume.url} 
          target="_blank" 
          rel="noreferrer" 
          className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 border border-transparent transition-all"
        >
          <Download className="w-5 h-5" />
        </a>
        <button 
          onClick={() => onDelete(resume._id)} 
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const ResumeManagerPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('resume-intelligence') ? 'intelligence' : 'manager'
  );
  
  const [resumes, setResumes] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // AI intelligence states
  const [aiLoading, setAiLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [analysis, setAnalysis] = useState(null);
  const [aiFile, setAiFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    // Keep tab in sync with route if user navigates dynamically
    if (location.pathname.includes('resume-intelligence')) {
      setActiveTab('intelligence');
    } else {
      setActiveTab('manager');
    }
  }, [location]);

  const loadResumes = async () => {
    try {
      const res = await resumeAPI.getAll();
      setResumes(res.data.data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('targetRole', 'Unspecified');

        await resumeAPI.upload(formData);
        toast.success(`"${file.name}" uploaded successfully!`);
        await loadResumes();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to upload resume');
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleSetDefault = async (id) => {
    try {
      await resumeAPI.setDefault(id);
      toast.success('Default resume updated!');
      await loadResumes();
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume version?')) return;
    try {
      await resumeAPI.delete(id);
      toast.success('Resume deleted');
      setResumes(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  // AI intelligence upload / scanner handler
  const handleAiFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setAiFile(selectedFile);
      setSelectedResumeId('');
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!aiFile && !selectedResumeId) {
      return toast.error('Please upload a resume or select a saved one');
    }

    setAiLoading(true);
    try {
      const formData = new FormData();
      if (aiFile) formData.append('resume', aiFile);
      if (selectedResumeId) formData.append('resumeId', selectedResumeId);
      formData.append('targetRole', targetRole);

      const res = await resumeIntelligenceAPI.analyze(formData);
      setAnalysis(res.data.data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAiLoading(false);
    }
  };

  const bestCallback = resumes.length > 0 
    ? Math.max(...resumes.map(r => r.timesUsed > 0 ? Math.round(r.callbackCount/r.timesUsed*100) : 0)) 
    : 0;
  const totalApps = resumes.reduce((a, r) => a + r.timesUsed, 0);

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
              <p className="page-subtitle">Manage versions and optimize with premium AI insights</p>
            </div>
          </div>
          {activeTab === 'manager' && (
            <button 
              onClick={() => document.getElementById('file-input').click()}
              className="btn-primary"
            >
              <Upload className="w-5 h-5" />
              Upload New
            </button>
          )}
        </div>

        {/* Premium Sliding Tab Selector */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-3xl w-fit mb-12 gap-1.5 border border-slate-200/20 shadow-inner">
          <button 
            onClick={() => setActiveTab('manager')}
            className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'manager' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            Resume Manager
          </button>
          <button 
            onClick={() => setActiveTab('intelligence')}
            className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'intelligence' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            AI Scanner & Matcher
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'manager' ? (
            <motion.div
              key="manager"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Upload Zone */}
              <div
                className={`relative overflow-hidden bg-white border-4 border-dashed rounded-[3rem] p-16 mb-12 text-center transition-all duration-500 cursor-pointer group ${
                  dragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/30'
                }`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <div className="relative z-10">
                  <input id="file-input" type="file" accept=".pdf" className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) handleFileUpload(e.target.files[0]);
                    }} />
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                    {uploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                    {uploading ? 'Processing Resume...' : 'Drop your resume here'}
                  </h3>
                  <p className="text-slate-400 font-bold text-sm mb-4">Or click to browse your local files</p>
                  <div className="flex items-center justify-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> PDF Only</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Max 5MB</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> ATS Ready</span>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Analytics Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { label: 'Active Versions', value: resumes.length, icon: FileText, color: 'indigo' },
                  { label: 'Best Reply Rate', value: `${bestCallback}%`, icon: TrendingUp, color: 'emerald' },
                  { label: 'Total Applications', value: totalApps, icon: Sparkles, color: 'purple' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 shadow-sm`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className={`text-3xl font-black text-slate-900 font-display`}>{stat.value}</div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumes Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching your versions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resumes.map(resume => (
                    <ResumeCard 
                      key={resume._id} 
                      resume={resume}
                      onSetDefault={handleSetDefault}
                      onDelete={handleDelete} 
                    />
                  ))}
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    onClick={() => document.getElementById('file-input').click()}
                    className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[350px] cursor-pointer hover:bg-white hover:border-indigo-100 group transition-all duration-300"
                  >
                    <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Plus className="w-10 h-10 text-slate-200 group-hover:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Add New Version</h3>
                    <p className="text-slate-400 text-sm font-bold text-center max-w-[180px]">Tailor your resume for a specific role or industry</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="intelligence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {!analysis ? (
                <div className="max-w-3xl mx-auto mt-6">
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
                              onChange={e => { setSelectedResumeId(e.target.value); setAiFile(null); }}
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
                          className={`group border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300 cursor-pointer ${aiFile ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'}`}
                          onClick={() => document.getElementById('resume-upload').click()}
                        >
                          <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleAiFileUpload} />
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload className={`w-8 h-8 ${aiFile ? 'text-indigo-600' : 'text-slate-300'}`} />
                          </div>
                          <p className={`text-lg font-black ${aiFile ? 'text-indigo-600' : 'text-slate-900'}`}>{aiFile ? aiFile.name : 'Choose Resume PDF'}</p>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Maximum size 5MB</p>
                        </div>
                      )}

                      <button 
                        onClick={handleAnalyze} 
                        disabled={aiLoading || (!aiFile && !selectedResumeId)}
                        className="btn-primary w-full py-5 text-xl"
                      >
                        {aiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                        {aiLoading ? 'AI Engine Working...' : 'Start Intelligence Analysis'}
                      </button>
                      
                      <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-2">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SECURE ENCRYPTION</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> AI LLAMA-3 POWERED</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 pb-12">
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
                      onClick={() => { setAnalysis(null); setAiFile(null); setSelectedResumeId(''); }} 
                      className="btn-secondary group px-10"
                    >
                      Start New Analysis
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default ResumeManagerPage;
