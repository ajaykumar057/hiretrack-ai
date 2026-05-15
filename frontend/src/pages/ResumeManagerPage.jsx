import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import { Loader2, Upload, FileText, Star, Trash2, Plus, CheckCircle, TrendingUp, Download, Eye, Sparkles } from 'lucide-react';
import { resumeAPI } from '../lib/api';
import toast from 'react-hot-toast';

const ResumeCard = ({ resume, onSetDefault, onDelete }) => {
  const callbackRate = resume.timesUsed > 0 ? Math.round((resume.callbackCount / resume.timesUsed) * 100) : 0;
  const interviewRate = resume.callbackCount > 0 ? Math.round((resume.interviewCount / resume.callbackCount) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-slate-100 p-6 rounded-[2rem] relative group shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 ${resume.isDefault ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
      
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
          <button onClick={() => onSetDefault(resume._id)}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
            Make Master
          </button>
        ) : (
          <div className="flex-1 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] font-black text-emerald-600 uppercase tracking-widest text-center">
            Active Master
          </div>
        )}
        <a href={resume.url} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 border border-transparent transition-all">
          <Download className="w-5 h-5" />
        </a>
        <button onClick={() => onDelete(resume._id)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 transition-all">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const ResumeManagerPage = () => {
  const [resumes, setResumes] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadResumes();
  }, []);

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

  const bestCallback = resumes.length > 0 ? Math.max(...resumes.map(r => r.timesUsed > 0 ? Math.round(r.callbackCount/r.timesUsed*100) : 0)) : 0;
  const totalApps = resumes.reduce((a, r) => a + r.timesUsed, 0);

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Resume Intelligence</h1>
            <p className="page-subtitle">Manage versions and track performance</p>
          </div>
          <button 
            onClick={() => document.getElementById('file-input').click()}
            className="btn-primary"
          >
            <Upload className="w-5 h-5" />
            Upload New
          </button>
        </div>

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
              <ResumeCard key={resume._id} resume={resume}
                onSetDefault={handleSetDefault}
                onDelete={handleDelete} />
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
      </div>
    </AppLayout>
  );
};

export default ResumeManagerPage;
