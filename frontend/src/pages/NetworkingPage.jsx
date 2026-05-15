import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { networkAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { Plus, Search, Edit2, Trash2, ExternalLink, X, Loader2, Users, MapPin, Briefcase, Mail, Calendar, Tag, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Not Contacted', 'Reached Out', 'Replied', 'Meeting Scheduled', 'Referred', 'Inactive'];
const TYPES = ['Recruiter', 'Alumni', 'Peer', 'Mentor', 'Hiring Manager', 'Other'];
const STATUS_COLORS = {
  'Not Contacted': 'text-slate-500 bg-slate-50 border-slate-100',
  'Reached Out': 'text-blue-600 bg-blue-50 border-blue-100',
  'Replied': 'text-indigo-600 bg-indigo-50 border-indigo-100',
  'Meeting Scheduled': 'text-purple-600 bg-purple-50 border-purple-100',
  'Referred': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Inactive': 'text-red-600 bg-red-50 border-red-100',
};

const defaultForm = { name: '', company: '', role: '', linkedinUrl: '', email: '', status: 'Not Contacted', type: 'Recruiter', notes: '', followUpDate: '' };

const ContactModal = ({ contact, onClose, onSave }) => {
  const [form, setForm] = useState(contact || defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{contact ? 'Update Contact' : 'New Connection'}</h2>
              <p className="text-sm font-bold text-slate-400">Expand your professional ecosystem</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Full Name *</label>
              <input className="input-field" placeholder="e.g. Alex Rivera" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Current Company</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Briefcase className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="e.g. Tesla" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Professional Title</label>
              <input className="input-field" placeholder="e.g. Talent Acquisition" value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Connection Type</label>
              <select className="input-field" value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">LinkedIn Profile URL</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ExternalLink className="w-4 h-4" /></div>
              <input className="input-field pl-11" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl}
                onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-4 h-4" /></div>
                <input className="input-field pl-11" placeholder="alex@company.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Engagement Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">Follow-up Reminder</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></div>
              <input type="date" className="input-field pl-11" value={form.followUpDate}
                onChange={e => setForm({ ...form, followUpDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label-field">Internal Context / Notes</label>
            <textarea className="input-field resize-none" rows={3} placeholder="How did you meet? What are their interests?"
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4">Discard</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {contact ? 'Update Connection' : 'Save Connection'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const typeColors = {
    Recruiter: 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50',
    Alumni: 'bg-emerald-50/50 text-emerald-600 border-emerald-100/50',
    Peer: 'bg-blue-50/50 text-blue-600 border-blue-100/50',
    Mentor: 'bg-purple-50/50 text-purple-600 border-purple-100/50',
    'Hiring Manager': 'bg-rose-50/50 text-rose-600 border-rose-100/50',
    Other: 'bg-slate-50/50 text-slate-600 border-slate-100/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-slate-100 p-8 rounded-[2.5rem] group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)] hover:border-indigo-100 transition-all duration-500 relative overflow-hidden`}
    >
      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button onClick={() => onEdit(contact)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(contact._id)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 shadow-sm transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-100 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-md ${STATUS_COLORS[contact.status]?.split(' ')[1] || 'bg-slate-400'}`}>
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-1">{contact.name}</h3>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{contact.role}</p>
        {contact.company && (
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{contact.company}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[contact.status] || STATUS_COLORS['Not Contacted']}`}>
          {contact.status}
        </div>
        <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${typeColors[contact.type] || typeColors.Other}`}>
          {contact.type}
        </div>
      </div>

      {contact.notes && (
        <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 mb-6 text-center">
          <p className="text-[12px] font-bold text-slate-500 italic line-clamp-2 leading-relaxed">
            "{contact.notes}"
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
          {contact.followUpDate ? (
            <>
              <Calendar className="w-3.5 h-3.5" />
              {new Date(contact.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </>
          ) : (
            <span className="text-slate-300">No Reminders</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {contact.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer"
              className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NetworkingPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadContacts();
  }, [filterStatus]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await networkAPI.getAll({ status: filterStatus || undefined });
      setContacts(res.data.data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    if (editContact) {
      await networkAPI.update(editContact._id, form);
      toast.success('Contact updated!');
    } else {
      await networkAPI.create(form);
      toast.success('Contact added!');
    }
    await loadContacts();
    setEditContact(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await networkAPI.delete(id);
      toast.success('Contact deleted');
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const counts = STATUSES.reduce((acc, s) => { acc[s] = contacts.filter(c => c.status === s).length; return acc; }, {});

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Personal Ecosystem</h1>
            <p className="page-subtitle">Managing {contacts.length} high-value connections</p>
          </div>
          <button onClick={() => { setEditContact(null); setShowModal(true); }}
            className="btn-primary">
            <Plus className="w-5 h-5" />
            Grow Network
          </button>
        </div>

        {/* Quick Status Bar */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-4">
          <button 
            onClick={() => setFilterStatus('')}
            className={`flex-shrink-0 px-8 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:scale-105 min-w-[140px] text-center ${!filterStatus ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
          >
            <div className="text-2xl font-black text-slate-900 font-display">{contacts.length}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Power</div>
          </button>
          {STATUSES.map((s, i) => (
            <button 
              key={s} 
              onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
              className={`flex-shrink-0 px-8 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:scale-105 min-w-[140px] text-center ${filterStatus === s ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            >
              <div className="text-2xl font-black text-indigo-600 font-display">{counts[s] || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">{s}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="search-bar flex-1 max-w-xl">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Find by name, company, or role..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold text-slate-900 placeholder-slate-400 flex-1" />
          </div>
        </div>

        {/* Connections Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-[2.5rem]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm py-32 text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 mx-auto">
              <Users className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ecosystem is Empty</h3>
            <p className="text-slate-400 font-bold mb-10 max-w-sm mx-auto">Your professional network is your greatest asset. Start building it today.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <Plus className="w-5 h-5" />
              Add First Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <ContactCard key={c._id} contact={c}
                onEdit={(c) => { setEditContact(c); setShowModal(true); }}
                onDelete={handleDelete} />
            ))}
            
            <div 
              onClick={() => { setEditContact(null); setShowModal(true); }}
              className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white hover:border-indigo-100 group transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-slate-200 group-hover:text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Expand Ecosystem</h3>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <ContactModal contact={editContact}
            onClose={() => { setShowModal(false); setEditContact(null); }}
            onSave={handleSave} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default NetworkingPage;
