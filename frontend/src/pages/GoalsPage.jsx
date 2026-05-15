import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goalAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { Plus, Target, CheckCircle, X, Loader2, Trash2, Edit2, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Applications', 'DSA', 'Networking', 'Interview Prep', 'Learning', 'Other'];
const CATEGORY_ICONS = {
  Applications: '💼', DSA: '💻', Networking: '🤝',
  'Interview Prep': '🎯', Learning: '📚', Other: '⭐'
};
const CATEGORY_COLORS = {
  Applications: 'from-primary-500/20 to-violet-500/20',
  DSA: 'from-cyan-500/20 to-blue-500/20',
  Networking: 'from-emerald-500/20 to-teal-500/20',
  'Interview Prep': 'from-purple-500/20 to-pink-500/20',
  Learning: 'from-amber-500/20 to-orange-500/20',
  Other: 'from-slate-500/20 to-slate-600/20',
};

const defaultForm = { title: '', description: '', category: 'Applications', target: 10, unit: 'tasks', priority: 'Medium' };

const GoalModal = ({ goal, onClose, onSave }) => {
  const [form, setForm] = useState(goal || defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.target) return toast.error('Title and target are required');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      toast.error('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">{goal ? 'Edit Goal' : 'Create Goal'}</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Goal Title *</label>
            <input className="input-field" placeholder="Apply to 5 companies this week" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Priority</label>
              <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {['Low', 'Medium', 'High'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Target</label>
              <input type="number" min="1" className="input-field" value={form.target}
                onChange={e => setForm({ ...form, target: parseInt(e.target.value) || 1 })} />
            </div>
            <div>
              <label className="label-field">Unit</label>
              <input className="input-field" placeholder="applications, problems..." value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-field">Description (optional)</label>
            <textarea className="input-field resize-none" rows={2} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What do you want to achieve?" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.completed || goal.current >= goal.target;
  const priorityColors = { Low: 'text-slate-400', Medium: 'text-amber-400', High: 'text-red-400' };

  const increment = () => onUpdateProgress(goal._id, Math.min(goal.current + 1, goal.target));
  const decrement = () => onUpdateProgress(goal._id, Math.max(goal.current - 1, 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 group relative overflow-hidden ${isCompleted ? 'border-emerald-500/30' : ''}`}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full flex items-start justify-end p-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[goal.category]} opacity-50 pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[goal.category] || '⭐'}</span>
            <div>
              <h3 className={`font-semibold text-sm leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {goal.title}
              </h3>
              <p className="text-xs text-slate-500">{goal.category}</p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(goal)} className="btn-ghost p-1.5">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(goal._id)} className="btn-danger p-1.5">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {goal.description && <p className="text-xs text-slate-500 mb-3">{goal.description}</p>}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{goal.current} / {goal.target} {goal.unit}</span>
            <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-primary-400'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary-500 to-violet-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={decrement} disabled={goal.current <= 0}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center justify-center">
              −
            </button>
            <span className="text-sm font-bold text-slate-200 min-w-6 text-center">{goal.current}</span>
            <button onClick={increment} disabled={isCompleted}
              className="w-7 h-7 rounded-lg bg-primary-600/30 border border-primary-500/30 text-primary-300 hover:bg-primary-600/50 disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center justify-center">
              +
            </button>
          </div>
          <div className="flex items-center gap-2">
            {goal.streak > 0 && (
              <span className="flex items-center gap-1 text-xs text-orange-400">
                <Flame className="w-3 h-3" />
                {goal.streak}d
              </span>
            )}
            <span className={`text-xs font-medium ${priorityColors[goal.priority] || priorityColors.Medium}`}>
              {goal.priority}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => { loadGoals(); }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const res = await goalAPI.getAll();
      setGoals(res.data.data);
    } catch { toast.error('Failed to load goals'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    if (editGoal) {
      await goalAPI.update(editGoal._id, form);
      toast.success('Goal updated!');
    } else {
      await goalAPI.create(form);
      toast.success('Goal created! 🎯');
    }
    await loadGoals();
    setEditGoal(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    await goalAPI.delete(id);
    toast.success('Goal deleted');
    setGoals(prev => prev.filter(g => g._id !== id));
  };

  const handleUpdateProgress = async (id, newValue) => {
    try {
      await goalAPI.update(id, { current: newValue });
      setGoals(prev => prev.map(g => g._id === id ? { ...g, current: newValue, completed: newValue >= g.target } : g));
    } catch { toast.error('Failed to update'); }
  };

  const filters = ['All', 'Active', 'Completed', ...CATEGORIES];
  const filtered = goals.filter(g => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !g.completed;
    if (filter === 'Completed') return g.completed;
    return g.category === filter;
  });

  const completedCount = goals.filter(g => g.completed).length;
  const totalProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + Math.min((g.current / g.target) * 100, 100), 0) / goals.length) : 0;

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Career Goals</h1>
            <p className="page-subtitle">{completedCount} of {goals.length} goals completed • {totalProgress}% overall progress</p>
          </div>
          <button onClick={() => { setEditGoal(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {/* Progress overview */}
        {goals.length > 0 && (
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Overall Progress</span>
              <span className="text-sm font-bold text-primary-400">{totalProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill bg-gradient-to-r from-primary-500 to-violet-500" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.slice(0, 6).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === f ? 'bg-primary-600/30 text-primary-300 border-primary-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/8'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Target className="w-8 h-8 text-slate-600" /></div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No goals yet</h3>
            <p className="text-slate-500 text-sm mb-4">Set meaningful career goals to stay on track</p>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm px-5 py-2.5">Create First Goal</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(g => (
              <GoalCard key={g._id} goal={g}
                onEdit={g => { setEditGoal(g); setShowModal(true); }}
                onDelete={handleDelete}
                onUpdateProgress={handleUpdateProgress} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <GoalModal goal={editGoal}
            onClose={() => { setShowModal(false); setEditGoal(null); }}
            onSave={handleSave} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default GoalsPage;
