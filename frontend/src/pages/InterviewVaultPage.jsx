import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { Plus, Search, BookOpen, X, Loader2, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ROUNDS = ['OA', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR', 'Managerial', 'Final'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const OUTCOMES = ['Cleared', 'Rejected', 'Pending'];
const CATEGORIES = ['DSA', 'System Design', 'HR', 'Technical', 'Behavioral'];

const defaultForm = {
  company: '', role: '', round: 'Technical Round 1', difficulty: 'Medium',
  outcome: 'Pending', experience: '', tips: '', questions: [], interviewDate: new Date().toISOString().split('T')[0]
};

const VaultModal = ({ exp, onClose, onSave }) => {
  const [form, setForm] = useState(exp || defaultForm);
  const [loading, setLoading] = useState(false);
  const [qText, setQText] = useState('');
  const [qCat, setQCat] = useState('Technical');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return toast.error('Company and role required');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  const addQuestion = () => {
    if (!qText.trim()) return;
    setForm({ ...form, questions: [...form.questions, { question: qText.trim(), category: qCat }] });
    setQText('');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">{exp ? 'Edit Experience' : 'Add to Vault'}</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Company *</label>
              <input className="input-field" placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
            <div><label className="label-field">Role *</label>
              <input className="input-field" placeholder="SWE" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-field">Round</label>
              <select className="input-field" value={form.round} onChange={e => setForm({ ...form, round: e.target.value })}>
                {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
              </select></div>
            <div><label className="label-field">Difficulty</label>
              <select className="input-field" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select></div>
            <div><label className="label-field">Outcome</label>
              <select className="input-field" value={form.outcome} onChange={e => setForm({ ...form, outcome: e.target.value })}>
                {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
              </select></div>
          </div>
          <div>
            <label className="label-field">Interview Experience</label>
            <textarea className="input-field resize-none" rows={4} placeholder="Describe your interview experience..."
              value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
          </div>
          {/* Questions */}
          <div>
            <label className="label-field">Questions Asked</label>
            <div className="flex gap-2 mb-2">
              <select className="input-field w-36 flex-shrink-0" value={qCat} onChange={e => setQCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input-field flex-1" placeholder="Add a question..." value={qText}
                onChange={e => setQText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addQuestion())} />
              <button type="button" onClick={addQuestion} className="btn-primary px-4">Add</button>
            </div>
            {form.questions.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {form.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-white/3 rounded-lg border border-white/5">
                    <span className="text-xs px-2 py-0.5 bg-primary-600/20 text-primary-300 rounded flex-shrink-0">{q.category}</span>
                    <p className="text-xs text-slate-400 flex-1">{q.question}</p>
                    <button type="button" onClick={() => setForm({ ...form, questions: form.questions.filter((_, j) => j !== i) })}
                      className="text-slate-600 hover:text-red-400 flex-shrink-0"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div><label className="label-field">Tips for Others</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Tips for future candidates..."
              value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {exp ? 'Save Changes' : 'Add to Vault'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ExperienceCard = ({ exp, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const diffColors = { Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20', Hard: 'text-red-400 bg-red-500/10 border-red-500/20' };
  const outcomeColors = { Cleared: 'badge-offer', Rejected: 'badge-rejected', Pending: 'badge-oa' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">
              {exp.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">{exp.company}</h3>
              <p className="text-xs text-slate-500">{exp.role} • {exp.round}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`badge border ${diffColors[exp.difficulty] || ''}`}>{exp.difficulty}</span>
            <span className={`badge ${outcomeColors[exp.outcome] || 'badge-saved'}`}>{exp.outcome}</span>
          </div>
        </div>

        {exp.experience && <p className="text-sm text-slate-400 line-clamp-2 mb-3">{exp.experience}</p>}

        {exp.questions?.length > 0 && (
          <div className="text-xs text-slate-500 mb-3">
            📝 {exp.questions.length} question{exp.questions.length !== 1 ? 's' : ''} recorded
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Show less' : 'Show more'}
          </button>
          <div className="flex gap-1">
            <button onClick={() => onEdit(exp)} className="btn-ghost p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => onDelete(exp._id)} className="btn-danger p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 p-5 space-y-4">
            {exp.questions?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Questions Asked</h4>
                <div className="space-y-2">
                  {exp.questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 bg-primary-600/15 text-primary-400 rounded flex-shrink-0">{q.category}</span>
                      <p className="text-xs text-slate-300">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {exp.tips && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <p className="text-xs font-medium text-amber-400 mb-1">💡 Tips</p>
                <p className="text-xs text-slate-400">{exp.tips}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InterviewVaultPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editExp, setEditExp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRound, setFilterRound] = useState('');

  useEffect(() => { loadExperiences(); }, [filterRound]);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.getAll({ round: filterRound || undefined });
      setExperiences(res.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    if (editExp) {
      await interviewAPI.update(editExp._id, form);
      toast.success('Experience updated!');
    } else {
      await interviewAPI.create(form);
      toast.success('Added to vault! 📚');
    }
    await loadExperiences();
    setEditExp(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    await interviewAPI.delete(id);
    toast.success('Deleted');
    setExperiences(prev => prev.filter(e => e._id !== id));
  };

  const filtered = experiences.filter(e =>
    !search || e.company.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Interview Vault</h1>
            <p className="page-subtitle">{experiences.length} experiences stored</p>
          </div>
          <button onClick={() => { setEditExp(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilterRound('')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${!filterRound ? 'bg-primary-600/30 text-primary-300 border-primary-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/8'}`}>
            All Rounds
          </button>
          {ROUNDS.map(r => (
            <button key={r} onClick={() => setFilterRound(r === filterRound ? '' : r)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filterRound === r ? 'bg-primary-600/30 text-primary-300 border-primary-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/8'}`}>
              {r}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-bar max-w-md mb-6">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search companies or roles..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-300 placeholder-slate-500 flex-1" />
        </div>

        {loading ? (
          <div className="space-y-4">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><BookOpen className="w-8 h-8 text-slate-600" /></div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Empty Vault</h3>
            <p className="text-slate-500 text-sm mb-4">Document your interview experiences for future reference</p>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm px-5 py-2.5">Add First Experience</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(e => (
              <ExperienceCard key={e._id} exp={e}
                onEdit={e => { setEditExp(e); setShowModal(true); }}
                onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <VaultModal exp={editExp}
            onClose={() => { setShowModal(false); setEditExp(null); }}
            onSave={handleSave} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default InterviewVaultPage;
