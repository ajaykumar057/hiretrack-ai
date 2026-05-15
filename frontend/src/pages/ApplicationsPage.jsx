import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationAPI, resumeIntelligenceAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { 
  Plus, Search, Filter, Edit2, Trash2, ExternalLink, ChevronDown, 
  X, Loader2, Globe, Upload, FileSearch, Sparkles, Briefcase, 
  MapPin, Calendar, DollarSign, Tag, Info, Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Saved', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];
const SOURCES = ['', 'LinkedIn', 'Naukri', 'Company Website', 'Referral', 'Campus', 'Other'];
const WORK_MODES = ['', 'Remote', 'Hybrid', 'Onsite'];
const COMPANY_TYPES = ['', 'Startup', 'MNC', 'Product', 'Service', 'FAANG'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const defaultForm = {
  company: '', role: '', status: 'Applied', salary: '', location: '',
  jobLink: '', recruiterName: '', notes: '', appliedDate: new Date().toISOString().split('T')[0],
  workMode: '', companyType: '', source: '', priority: 'Medium', techStack: []
};

const ApplicationModal = ({ app, onClose, onSave }) => {
  const [form, setForm] = useState(app ? {
    ...app, appliedDate: app.appliedDate ? new Date(app.appliedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  } : defaultForm);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return toast.error('Company and role are required');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setForm({ ...form, techStack: [...(form.techStack || []), techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTech = (i) => {
    const arr = [...(form.techStack || [])];
    arr.splice(i, 1);
    setForm({ ...form, techStack: arr });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content max-w-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {app ? 'Edit Application' : 'New Application'}
              </h2>
              <p className="text-sm font-bold text-slate-400">Track your job search progress</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Company *</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Tag className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="e.g. Google" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Role *</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Briefcase className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="e.g. Frontend Engineer" value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Applied Date</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></div>
                <input type="date" className="input-field pl-11" value={form.appliedDate}
                  onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Salary / CTC</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="e.g. ₹12 LPA" value={form.salary}
                  onChange={e => setForm({ ...form, salary: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapPin className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="e.g. Bangalore" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="label-field text-[10px]">Work Mode</label>
              <select className="input-field text-xs" value={form.workMode}
                onChange={e => setForm({ ...form, workMode: e.target.value })}>
                {WORK_MODES.map(m => <option key={m} value={m}>{m || 'Select...'}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="label-field text-[10px]">Company Type</label>
              <select className="input-field text-xs" value={form.companyType}
                onChange={e => setForm({ ...form, companyType: e.target.value })}>
                {COMPANY_TYPES.map(c => <option key={c} value={c}>{c || 'Select...'}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="label-field text-[10px]">Source</label>
              <select className="input-field text-xs" value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}>
                {SOURCES.map(s => <option key={s} value={s}>{s || 'Select...'}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="label-field text-[10px]">Priority</label>
              <select className="input-field text-xs" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">Job Link</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe className="w-4 h-4" /></div>
              <input className="input-field pl-11" placeholder="https://www.linkedin.com/jobs/..." value={form.jobLink}
                onChange={e => setForm({ ...form, jobLink: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label-field">Tech Stack</label>
            <input className="input-field" placeholder="React, Node.js... (Press Enter)" value={techInput}
              onChange={e => setTechInput(e.target.value)} onKeyDown={addTech} />
            {form.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {form.techStack.map((t, i) => (
                  <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600">
                    {t}
                    <button type="button" onClick={() => removeTech(i)} className="hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {app ? 'Update Details' : 'Track Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ApplicationRow = ({ app, onEdit, onDelete, onStatusChange }) => {
  const [changing, setChanging] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setChanging(true);
    await onStatusChange(app._id, newStatus);
    setChanging(false);
  };

  const priorityClasses = { 
    Low: 'bg-slate-50 text-slate-500 border-slate-100', 
    Medium: 'bg-amber-50 text-amber-600 border-amber-100', 
    High: 'bg-red-50 text-red-600 border-red-100' 
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-all duration-300">
      <td className="py-5 px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg font-black text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
            {app.company.charAt(0)}
          </div>
          <div>
            <p className="text-[15px] font-black text-slate-900 leading-tight mb-0.5">{app.company}</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <MapPin className="w-3 h-3" />
              {app.location || 'Remote'}
            </div>
          </div>
        </div>
      </td>
      <td className="py-5 px-6">
        <p className="text-[14px] font-black text-slate-700 mb-0.5">{app.role}</p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{app.workMode || 'Full-time'}</p>
      </td>
      <td className="py-5 px-6">
        <div className="relative inline-block">
          <select
            value={app.status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={changing}
            className={`badge badge-${app.status.toLowerCase()} border-2 appearance-none cursor-pointer pr-8 hover:scale-105 transition-transform`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none opacity-50" />
        </div>
      </td>
      <td className="py-5 px-6 font-black text-slate-900 text-[14px]">{app.salary || '—'}</td>
      <td className="py-5 px-6">
        <p className="text-[14px] font-bold text-slate-600">
          {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
        </p>
      </td>
      <td className="py-5 px-6">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${priorityClasses[app.priority] || priorityClasses.Medium}`}>
          {app.priority || 'Medium'}
        </span>
      </td>
      <td className="py-5 px-6">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {app.jobLink && (
            <a href={app.jobLink} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button onClick={() => onEdit(app)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(app._id)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 hover:shadow-md transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const LinkedInImportModal = ({ onClose, onImportSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedJob, setImportedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!url.includes('linkedin.com/jobs')) return toast.error('Please enter a valid LinkedIn Job URL');
    setLoading(true);
    try {
      const res = await applicationAPI.importLinkedIn({ url });
      setImportedJob(res.data.data);
      toast.success('Job imported successfully!');
      onImportSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to import job');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return toast.error('Please upload a resume PDF');
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('targetRole', importedJob.role);
      
      const res = await resumeIntelligenceAPI.analyze(formData);
      setAnalysis(res.data.data);
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {importedJob ? 'Job Imported' : 'LinkedIn Import'}
              </h2>
              <p className="text-sm font-bold text-slate-400">AI-powered job scraping</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
        </div>

        {!importedJob ? (
          <form onSubmit={handleImport} className="space-y-6">
            <div>
              <label className="label-field">LinkedIn Job URL</label>
              <input type="url" required placeholder="https://www.linkedin.com/jobs/view/..." className="input-field" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
              {loading ? 'Importing via Apify...' : 'Import LinkedIn Job'}
            </button>
          </form>
        ) : !analysis ? (
          <div className="space-y-8">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <h3 className="text-xl font-black text-slate-900 mb-1">{importedJob.role}</h3>
              <p className="text-sm font-bold text-slate-500">{importedJob.company} • {importedJob.location || 'Remote'}</p>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Match Intelligence</h3>
              </div>
              
              <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-10 text-center cursor-pointer hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group" onClick={() => document.getElementById('resume-pdf').click()}>
                <input id="resume-pdf" type="file" accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-800 font-black mb-1">{resumeFile ? resumeFile.name : 'Upload PDF Resume'}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">To analyze ATS compatibility</p>
              </div>

              <button onClick={handleAnalyze} disabled={analyzing || !resumeFile} className="btn-primary w-full mt-8 py-4 text-lg">
                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {analyzing ? 'AI is working...' : 'Generate Match Report'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">ATS Score</p>
                <p className="text-4xl font-black">{analysis.atsScore}%</p>
              </div>
              <div className="bg-emerald-500 rounded-[2rem] p-6 text-white shadow-lg shadow-emerald-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Role Match</p>
                <p className="text-4xl font-black">{analysis.roleCompatibility?.[0]?.match || analysis.atsScore}%</p>
              </div>
            </div>

            {analysis.missingSkills?.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6">
                <p className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" /> Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black rounded-xl uppercase tracking-wider">{s}</span>)}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-100 rounded-3xl p-6">
              <p className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Suggestions
              </p>
              <ul className="space-y-3">
                {analysis.suggestions?.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[13px] font-bold text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={onClose} className="btn-secondary w-full py-4 rounded-2xl font-black uppercase tracking-widest">Close Report</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadApplications();
  }, [filterStatus]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationAPI.getAll({ status: filterStatus || undefined, limit: 100 });
      setApplications(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    if (editApp) {
      await applicationAPI.update(editApp._id, form);
      toast.success('Application updated!');
    } else {
      await applicationAPI.create(form);
      toast.success('Application added!');
    }
    await loadApplications();
    setEditApp(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await applicationAPI.delete(id);
      toast.success('Application deleted');
      setApplications(prev => prev.filter(a => a._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationAPI.update(id, { status: newStatus });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = applications.filter(a =>
    !search || a.company.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Job Applications</h1>
            <p className="page-subtitle">Managing {total} active opportunities</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLinkedInModal(true)}
              className="btn-secondary hidden sm:flex items-center gap-2"
            >
              <Globe className="w-5 h-5 text-indigo-600" />
              Import LinkedIn
            </button>
            <button
              onClick={() => { setEditApp(null); setShowModal(true); }}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Track New Job
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Status Filters */}
          <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-3">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${!filterStatus ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                All Jobs ({applications.length})
              </button>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s ? `badge badge-${s.toLowerCase()} shadow-lg` : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                >
                  {s} ({statusCounts[s] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="search-bar lg:w-96">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by company, role..."
              className="bg-transparent outline-none text-sm font-bold text-slate-900 placeholder-slate-400 flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company & Location</th>
                  <th>Role & Mode</th>
                  <th>Stage</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-8"><div className="skeleton h-10" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state py-24">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 mx-auto shadow-inner">
                          <Briefcase className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No opportunities found</h3>
                        <p className="text-slate-400 font-bold mb-10 max-w-sm mx-auto">
                          {search ? "We couldn't find any jobs matching your search criteria." : "Your job application pipeline is currently empty. Start tracking to get started!"}
                        </p>
                        {!search && (
                          <button onClick={() => setShowModal(true)} className="btn-primary">
                            <Plus className="w-5 h-5" />
                            Add Your First Application
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <ApplicationRow
                      key={app._id}
                      app={app}
                      onEdit={(a) => { setEditApp(a); setShowModal(true); }}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ApplicationModal
            app={editApp}
            onClose={() => { setShowModal(false); setEditApp(null); }}
            onSave={handleSave}
          />
        )}
        {showLinkedInModal && (
          <LinkedInImportModal
            onClose={() => setShowLinkedInModal(false)}
            onImportSuccess={() => loadApplications()}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default ApplicationsPage;
