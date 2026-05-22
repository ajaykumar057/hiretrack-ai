import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { networkAPI, linkedinAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, X, Loader2, Users, MapPin, 
  Briefcase, Mail, Calendar, Tag, UserPlus, Globe, MessageSquare, 
  CheckCircle, Clock, TrendingUp, ChevronRight, MessageCircle, Star, Copy,
  Sparkles, Brain, AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

// Constants & Data Options
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

const LI_STATUS_OPTIONS = [
  'Not Contacted', 'Message Sent', 'Replied', 
  'Referral Received', 'Follow-up Pending', 'Closed'
];

const LI_STATUS_COLORS = {
  'Not Contacted': 'text-slate-500 bg-slate-50 border-slate-100',
  'Message Sent': 'text-blue-600 bg-blue-50 border-blue-100',
  'Replied': 'text-indigo-600 bg-indigo-50 border-indigo-100',
  'Referral Received': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Follow-up Pending': 'text-amber-600 bg-amber-50 border-amber-100',
  'Closed': 'text-red-600 bg-red-50 border-red-100',
};

const defaultPersonalForm = { name: '', company: '', role: '', linkedinUrl: '', email: '', status: 'Not Contacted', type: 'Recruiter', notes: '', followUpDate: '' };
const defaultLinkedInForm = { recruiterName: '', companyName: '', role: '', linkedinUrl: '', status: 'Not Contacted', referralRequested: false, responseReceived: false, followUpDate: '', notes: '', tags: '' };

// ----------------------------------------------------
// SUBCOMPONENTS: MODALS
// ----------------------------------------------------

// 1. Personal Connection Modal
const PersonalModal = ({ contact, onClose, onSave }) => {
  const [form, setForm] = useState(contact || defaultPersonalForm);
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
    <div className="modal-overlay animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content max-w-2xl !rounded-[3rem] !p-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{contact ? 'Update Connection' : 'New Connection'}</h2>
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
              <input type="date" className="input-field pl-11" value={form.followUpDate ? form.followUpDate.split('T')[0] : ''}
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
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {contact ? 'Update Connection' : 'Save Connection'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// 2. LinkedIn Recruiter Modal
const LinkedInModal = ({ contact, onClose, onSave }) => {
  const [form, setForm] = useState(
    contact 
      ? { ...contact, followUpDate: contact.followUpDate ? contact.followUpDate.split('T')[0] : '', tags: contact.tags ? contact.tags.join(', ') : '' } 
      : defaultLinkedInForm
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recruiterName || !form.companyName) return toast.error('Name and Company are required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags && typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()) : []
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: 20, opacity: 0, scale: 0.95 }} 
        className="modal-content max-w-2xl !rounded-[3.5rem] !p-12"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{contact ? 'Edit LinkedIn Contact' : 'New LinkedIn Contact'}</h2>
              <p className="text-sm font-bold text-slate-400">Configure recruiter metadata protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name *</label>
              <input type="text" required className="input-field" placeholder="Sarah Connor" value={form.recruiterName} onChange={e => setForm({...form, recruiterName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Entity/Company *</label>
              <input type="text" required className="input-field" placeholder="Cyberdyne Systems" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Operational Role</label>
              <input type="text" className="input-field" placeholder="Hiring Manager" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Intelligence URL</label>
              <input type="url" className="input-field" placeholder="linkedin.com/in/..." value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Protocol</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {LI_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Action Deadline</label>
              <input type="date" className="input-field" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} />
            </div>
          </div>

          <div className="flex gap-10 py-6 border-y border-slate-50">
            <label className="flex items-center gap-3 text-sm font-black text-slate-700 cursor-pointer group">
              <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${form.referralRequested ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                {form.referralRequested && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={form.referralRequested} onChange={e => setForm({...form, referralRequested: e.target.checked})} />
              REFERRAL SECURED
            </label>
            <label className="flex items-center gap-3 text-sm font-black text-slate-700 cursor-pointer group">
              <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${form.responseReceived ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-100' : 'border-slate-200 group-hover:border-emerald-400'}`}>
                {form.responseReceived && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={form.responseReceived} onChange={e => setForm({...form, responseReceived: e.target.checked})} />
              ACK RECEIVED
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Notes</label>
            <textarea className="input-field resize-none animate-none" rows={3} placeholder="Add background details or templates..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>

          <div className="space-y-6">
            <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Commit Connection
            </button>
            <button type="button" onClick={onClose} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Discard Draft</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ----------------------------------------------------
// MAIN HUB COMPONENT
// ----------------------------------------------------
const NetworkingPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('linkedin-crm') ? 'linkedin' : 'personal'
  );

  useEffect(() => {
    if (location.pathname.includes('linkedin-crm')) {
      setActiveTab('linkedin');
    } else {
      setActiveTab('personal');
    }
  }, [location]);

  // Tab 1: Personal Ecosystem States
  const [personalContacts, setPersonalContacts] = useState([]);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [editPersonalContact, setEditPersonalContact] = useState(null);
  const [personalSearch, setPersonalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Tab 2: LinkedIn CRM States
  const [linkedinContacts, setLinkedinContacts] = useState([]);
  const [loadingLinkedIn, setLoadingLinkedIn] = useState(true);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [editLinkedInContact, setEditLinkedInContact] = useState(null);
  const [linkedinSearch, setLinkedinSearch] = useState('');

  // Tab 3: LinkedIn AI Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [apifyApprovalUrl, setApifyApprovalUrl] = useState(null);
  const [resultsView, setResultsView] = useState('grid'); // 'grid' or 'list'
  const [resultsPage, setResultsPage] = useState(1);
  const resultsPerPage = 10;

  // Initialize
  useEffect(() => {
    loadPersonalContacts();
    loadLinkedInContacts();
  }, [filterStatus]);

  // ----------------------------------------------------
  // DATA LOADERS
  // ----------------------------------------------------
  const loadPersonalContacts = async () => {
    setLoadingPersonal(true);
    try {
      const res = await networkAPI.getAll({ status: filterStatus || undefined });
      setPersonalContacts(res.data.data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoadingPersonal(false);
    }
  };

  const loadLinkedInContacts = async () => {
    setLoadingLinkedIn(true);
    try {
      const res = await linkedinAPI.getAll();
      setLinkedinContacts(res.data.data);
    } catch {
      toast.error('Failed to load LinkedIn contacts');
    } finally {
      setLoadingLinkedIn(false);
    }
  };

  // ----------------------------------------------------
  // ACTION HANDLERS: PERSONAL
  // ----------------------------------------------------
  const handleSavePersonal = async (form) => {
    if (editPersonalContact) {
      await networkAPI.update(editPersonalContact._id, form);
      toast.success('Contact updated successfully!');
    } else {
      await networkAPI.create(form);
      toast.success('Contact added to ecosystem!');
    }
    await loadPersonalContacts();
    setEditPersonalContact(null);
  };

  const handleDeletePersonal = async (id) => {
    if (!window.confirm('Delete this contact from your ecosystem?')) return;
    try {
      await networkAPI.delete(id);
      toast.success('Contact deleted');
      setPersonalContacts(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ----------------------------------------------------
  // ACTION HANDLERS: LINKEDIN CRM
  // ----------------------------------------------------
  const handleSaveLinkedIn = async (form) => {
    if (editLinkedInContact) {
      await linkedinAPI.update(editLinkedInContact._id, form);
      toast.success('LinkedIn relation updated!');
    } else {
      await linkedinAPI.create(form);
      toast.success('New LinkedIn relationship registered!');
    }
    await loadLinkedInContacts();
    setEditLinkedInContact(null);
  };

  const handleDeleteLinkedIn = async (id) => {
    if (!window.confirm('Delete this LinkedIn relationship registry?')) return;
    try {
      await linkedinAPI.delete(id);
      toast.success('Relationship data deleted');
      setLinkedinContacts(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete registry');
    }
  };

  // ----------------------------------------------------
  // DISCOVERY & SEARCH ENGINE HANDLERS
  // ----------------------------------------------------
  const handleLinkedInAISearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return toast.error('Please enter a search query');
    
    setSearching(true);
    setSearchResults([]);
    setResultsPage(1);
    setResultsView('list');
    setApifyApprovalUrl(null); // Reset approval URL on new search
    try {
      const res = await linkedinAPI.search(searchQuery);
      setSearchResults(res.data.data || []);
      setResultsPage(1);
      if (res.data.apifyApprovalUrl) {
        setApifyApprovalUrl(res.data.apifyApprovalUrl);
        toast.warning('Apify permission approval required. Using AI fallback data.');
      } else {
        toast.success(`Discovered ${res.data.data?.length || 0} professional profiles!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'LinkedIn AI search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleImportToCRM = async (profile) => {
    try {
      const payload = {
        recruiterName: profile.name,
        companyName: profile.company,
        role: profile.title,
        linkedinUrl: profile.linkedinUrl,
        status: 'Not Contacted',
        notes: `Imported from AI Discovery query: "${searchQuery}". \n\nTarget Outreach Template:\n${profile.outreachMessage}`,
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default follow-up in 7 days
      };

      await linkedinAPI.create(payload);
      toast.success(`${profile.name} imported to LinkedIn CRM!`);
      loadLinkedInContacts();
    } catch (error) {
      toast.error('Failed to import contact');
    }
  };

  // Helper copy outreach template
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Outreach template copied to clipboard!');
  };

  // Calculations for filters/analytics
  const filteredPersonal = personalContacts.filter(c =>
    !personalSearch || c.name.toLowerCase().includes(personalSearch.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(personalSearch.toLowerCase())
  );

  const filteredLinkedIn = linkedinContacts.filter(c =>
    !linkedinSearch || c.recruiterName.toLowerCase().includes(linkedinSearch.toLowerCase()) ||
    (c.companyName || '').toLowerCase().includes(linkedinSearch.toLowerCase())
  );

  const personalCounts = STATUSES.reduce((acc, s) => { 
    acc[s] = personalContacts.filter(c => c.status === s).length; 
    return acc; 
  }, {});

  const totalContacted = linkedinContacts.filter(c => c.status !== 'Not Contacted').length;
  const totalReplies = linkedinContacts.filter(c => c.status === 'Replied' || c.responseReceived).length;
  const totalReferrals = linkedinContacts.filter(c => c.status === 'Referral Received').length;
  const responseRate = totalContacted > 0 ? Math.round((totalReplies / totalContacted) * 100) : 0;

  const chartData = [
    { name: 'Mon', outreach: 2, replies: 0 },
    { name: 'Tue', outreach: 5, replies: 1 },
    { name: 'Wed', outreach: 3, replies: 2 },
    { name: 'Thu', outreach: 8, replies: 3 },
    { name: 'Fri', outreach: 4, replies: 1 },
    { name: 'Sat', outreach: 1, replies: 0 },
    { name: 'Sun', outreach: Math.max(1, totalContacted % 5), replies: totalReplies % 3 },
  ];

  return (
    <AppLayout>
      <div className="page-container">
        
        {/* Header */}
        <div className="section-header">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <Users className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h1 className="page-title">Network & LinkedIn Hub</h1>
              <p className="page-subtitle">Consolidate connections, recruiter outreach, and AI lead discovery</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {activeTab === 'personal' ? (
              <button 
                onClick={() => { setEditPersonalContact(null); setShowPersonalModal(true); }}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                Grow Network
              </button>
            ) : (
              <button 
                onClick={() => { setEditLinkedInContact(null); setShowLinkedInModal(true); }}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                New LinkedIn Relation
              </button>
            )}
          </div>
        </div>

        {/* Premium Capsule Tabs Selector */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-3xl w-fit mb-12 gap-1.5 border border-slate-200/20 shadow-inner">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'personal' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <UserPlus className="w-4 h-4" />
            Personal Ecosystem
          </button>
          <button 
            onClick={() => setActiveTab('linkedin')}
            className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'linkedin' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            LinkedIn CRM
          </button>
          <button 
            onClick={() => setActiveTab('discovery')}
            className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'discovery' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
            LinkedIn Lead Finder
          </button>
        </div>

        {/* Dynamic Content Rendering */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PERSONAL ECOSYSTEM */}
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Quick Status Bar */}
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                <button 
                  onClick={() => setFilterStatus('')}
                  className={`flex-shrink-0 px-8 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:scale-105 min-w-[140px] text-center ${!filterStatus ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                >
                  <div className="text-2xl font-black text-slate-900 font-display">{personalContacts.length}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Connections</div>
                </button>
                {STATUSES.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
                    className={`flex-shrink-0 px-8 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:scale-105 min-w-[140px] text-center ${filterStatus === s ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                  >
                    <div className="text-2xl font-black text-indigo-600 font-display">{personalCounts[s] || 0}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">{s}</div>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="search-bar flex-1 max-w-xl">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Find in Personal Ecosystem by name, company, or role..." 
                    value={personalSearch}
                    onChange={e => setPersonalSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm font-bold text-slate-900 placeholder-slate-400 flex-1" 
                  />
                </div>
              </div>

              {/* Connections Grid */}
              {loadingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-[2.5rem]" />)}
                </div>
              ) : filteredPersonal.length === 0 ? (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm py-24 text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 mx-auto">
                    <Users className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ecosystem is Empty</h3>
                  <p className="text-slate-400 font-bold mb-8 max-w-sm mx-auto">Your professional network is your greatest asset. Start building it today.</p>
                  <button onClick={() => setShowPersonalModal(true)} className="btn-primary mx-auto">
                    <Plus className="w-5 h-5" />
                    Add First Connection
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPersonal.map(c => {
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
                        key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)] hover:border-indigo-100 transition-all duration-500 relative overflow-hidden"
                      >
                        {/* Top Right Actions */}
                        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            onClick={() => { setEditPersonalContact(c); setShowPersonalModal(true); }} 
                            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePersonal(c._id)} 
                            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 shadow-sm transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-col items-center text-center mb-6">
                          <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-100 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-md ${STATUS_COLORS[c.status]?.split(' ')[1] || 'bg-slate-400'}`}>
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-1">{c.name}</h3>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{c.role || 'Unspecified Role'}</p>
                          {c.company && (
                            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                              <Briefcase className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{c.company}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[c.status] || STATUS_COLORS['Not Contacted']}`}>
                            {c.status}
                          </div>
                          <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${typeColors[c.type] || typeColors.Other}`}>
                            {c.type}
                          </div>
                        </div>

                        {c.notes && (
                          <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 mb-6 text-center">
                            <p className="text-[12px] font-bold text-slate-500 italic line-clamp-2 leading-relaxed">
                              "{c.notes}"
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            {c.followUpDate ? (
                              <>
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(c.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </>
                            ) : (
                              <span className="text-slate-300">No Reminders</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {c.linkedinUrl && (
                              <a href={c.linkedinUrl} target="_blank" rel="noreferrer"
                                className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                            {c.email && (
                              <a href={`mailto:${c.email}`}
                                className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Mail className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  <div 
                    onClick={() => { setEditPersonalContact(null); setShowPersonalModal(true); }}
                    className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white hover:border-indigo-100 group transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-slate-200 group-hover:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Expand Ecosystem</h3>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: LINKEDIN CRM */}
          {activeTab === 'linkedin' && (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Network Power', value: linkedinContacts.length, icon: Users, color: 'blue' },
                  { label: 'Outreach Pulse', value: totalContacted, icon: MessageCircle, color: 'indigo' },
                  { label: 'Success Signals', value: totalReferrals, icon: CheckCircle, color: 'emerald' },
                  { label: 'Reply Velocity', value: `${responseRate}%`, icon: TrendingUp, color: 'amber' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    <div className="text-4xl font-black text-slate-900 font-display mt-2">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Charts & Search */}
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Interaction Frequency</h3>
                      <p className="text-sm font-bold text-slate-400">Real-time outreach & reply tracking</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Outreach</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Replies</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorOutreach" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} axisLine={false} tickLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                        />
                        <Area type="monotone" dataKey="outreach" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorOutreach)" dot={{ fill: '#3b82f6', r: 6, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="replies" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorReplies)" dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2" />
                </div>
                
                <div className="lg:col-span-4 bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight mb-8">Search Ledger</h3>
                    <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-sm group focus-within:bg-white transition-all duration-500">
                      <Search className="w-5 h-5 text-white/50 group-focus-within:text-indigo-600" />
                      <input 
                        type="text" 
                        placeholder="Find connections..." 
                        className="bg-transparent border-none outline-none text-[15px] w-full text-white placeholder-white/40 font-bold group-focus-within:text-slate-900 group-focus-within:placeholder-slate-400"
                        value={linkedinSearch}
                        onChange={(e) => setLinkedinSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="relative z-10 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md mt-10 hover:bg-white/10 transition-colors">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-4 text-blue-400">
                      <Clock className="w-4 h-4" /> Next Operation
                    </h4>
                    <p className="text-[14px] font-bold opacity-80 mb-8 leading-relaxed">
                      You have <span className="text-white font-black underline underline-offset-4 decoration-blue-500">{linkedinContacts.filter(c => c.status === 'Follow-up Pending').length} relationships</span> in critical follow-up state.
                    </p>
                    <button 
                      onClick={() => setActiveTab('linkedin')}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                    >
                      Execute Follow-ups
                    </button>
                  </div>
                  <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />
                  <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-purple-500/20 rounded-full blur-[50px]" />
                </div>
              </div>

              {/* Relationship Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loadingLinkedIn ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-[400px] rounded-[3.5rem]" />)
                ) : filteredLinkedIn.length > 0 ? (
                  <>
                    {filteredLinkedIn.map(contact => (
                      <motion.div
                        key={contact._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden"
                      >
                        {/* Status Line */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${LI_STATUS_COLORS[contact.status]?.split(' ')[1] || 'bg-slate-100'} opacity-60 group-hover:opacity-100 transition-opacity`} />

                        <div className="flex items-start justify-between mb-6">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                              {contact.recruiterName.charAt(0).toUpperCase()}
                            </div>
                            {contact.referralRequested && (
                              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-lg shadow-emerald-100">
                                <Star className="w-3.5 h-3.5 text-white fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button 
                              onClick={() => { setEditLinkedInContact(contact); setShowLinkedInModal(true); }} 
                              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteLinkedIn(contact._id)} 
                              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 shadow-sm transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{contact.recruiterName}</h3>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest truncate">{contact.role || 'Hiring Lead'}</span>
                          </div>
                          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{contact.companyName}</span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engagement</span>
                            <span className={`px-3 py-1 rounded-full border-2 text-[9px] font-black uppercase tracking-widest ${LI_STATUS_COLORS[contact.status]}`}>
                              {contact.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-[11px] font-black text-slate-700">
                                {contact.followUpDate ? new Date(contact.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-slate-50">
                          {contact.linkedinUrl && (
                            <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                              <Globe className="w-4 h-4" />
                              Profile
                            </a>
                          )}
                          <a 
                            href={contact.linkedinUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm border border-slate-100"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div 
                      onClick={() => handleSaveLinkedIn()}
                      className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center min-h-[400px] cursor-pointer group hover:bg-white hover:border-blue-100 transition-all duration-500"
                    >
                      <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="w-10 h-10 text-slate-200 group-hover:text-blue-500" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Expand Network</h3>
                    </div>
                  </>
                ) : (
                  <div className="col-span-full bg-white rounded-[4rem] border border-slate-100 shadow-sm py-32 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-700">
                        <Users className="w-10 h-10 text-slate-200" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Network Void Detected</h3>
                      <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed">
                        Your professional ecosystem is awaiting input. Add recruiters and mentors to gain strategic advantages.
                      </p>
                      <button onClick={() => { setEditLinkedInContact(null); setShowLinkedInModal(true); }} className="btn-primary px-10 py-5 mx-auto">
                        <Plus className="w-5 h-5" /> Initialize Connection
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/30" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: LINKEDIN LEAD FINDER (AI POWERED DISCOVERY) */}
          {activeTab === 'discovery' && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Modern Glass Console Search Area */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-[3rem] p-12 relative overflow-hidden shadow-xl shadow-indigo-950/20">
                <div className="relative z-10 max-w-3xl">
                  <span className="px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-4 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" /> AI Outreach Accelerator
                  </span>
                  <h2 className="text-4xl font-black tracking-tight mb-4">Discover Active Hiring Signals</h2>
                  <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
                    Search for recruiters, managers, or peer leaders inside key organizations. Our AI agent extracts potential leads and instantly synthesizes custom-fit cold outreach copies.
                  </p>
                  
                  <form onSubmit={handleLinkedInAISearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-4 px-6 py-4.5 rounded-2xl bg-white/10 border border-white/15 focus-within:bg-white focus-within:border-white transition-all duration-300 group">
                      <Search className="w-5 h-5 text-white/50 group-focus-within:text-indigo-600" />
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Technical Recruiter at Google, Hiring Manager at Meta..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-base w-full text-white placeholder-white/40 font-bold group-focus-within:text-slate-900 group-focus-within:placeholder-slate-400"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={searching}
                      className="px-10 py-4.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all duration-300 active:scale-95 flex-shrink-0"
                    >
                      {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {searching ? 'Querying Signals...' : 'Scan LinkedIn'}
                    </button>
                  </form>
                </div>

                {/* Decorative blob art */}
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]" />
              </div>

              {/* Apify Approval Alert Banner */}
              {apifyApprovalUrl && !searching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 rounded-[2rem] p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[15px] font-black text-amber-900 tracking-tight">Apify Scraper Authorization Required</h4>
                      <p className="text-xs font-semibold text-amber-700/90 mt-1 leading-relaxed max-w-2xl">
                        The LinkedIn Scraper Actor needs one-time permission approval under your Apify account. 
                        We are currently using high-fidelity simulated & AI-synthesized profiles as a fallback. 
                        Click the authorization button to grant scraper access in your console.
                      </p>
                    </div>
                  </div>
                  <a 
                    href={apifyApprovalUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-amber-200 hover:shadow-lg active:scale-95 flex-shrink-0 font-bold"
                  >
                    <span>Authorize Scraper</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              )}

              {/* Lead Finder Results Grid */}
              {searching ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-indigo-600 animate-spin flex items-center justify-center" />
                    <Brain className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Deep Search Running</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1.5">Scanning industry databases & synthesizing customized copy...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                      <CheckCircle className="w-5 h-5 text-emerald-500" /> Professional Signals Discovered ({searchResults.length})
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setResultsView('grid'); setResultsPage(1); }}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${resultsView === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Grid View
                      </button>
                      <button 
                        onClick={() => { setResultsView('list'); setResultsPage(1); }}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${resultsView === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        List View
                      </button>
                    </div>
                  </div>
                  
                  {resultsView === 'list' ? (
                    // LIST VIEW - Show all results with pagination
                    <div className="space-y-4">
                      {searchResults.slice((resultsPage - 1) * resultsPerPage, resultsPage * resultsPerPage).map((profile, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between gap-6">
                            {/* Left: Name and Role */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black flex-shrink-0">
                                {profile.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-900 text-sm leading-snug">{profile.name}</h4>
                                <p className="text-[11px] font-bold text-slate-500 truncate">{profile.title}</p>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" /> {profile.location} | {profile.company}
                                </span>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button 
                                onClick={() => copyToClipboard(profile.outreachMessage)}
                                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100 transition-all"
                                title="Copy outreach template"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <a 
                                href={profile.linkedinUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 rounded-lg transition-all"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleImportToCRM(profile)}
                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-md"
                              >
                                Import
                              </button>
                            </div>
                          </div>

                          {/* Outreach template on hover/expand */}
                          <div className="mt-4 pt-4 border-t border-slate-50 hidden group-hover:block">
                            <p className="text-slate-600 text-[12px] font-medium italic line-clamp-2">"{profile.outreachMessage}"</p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Pagination Controls */}
                      {Math.ceil(searchResults.length / resultsPerPage) > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-slate-100">
                          <button
                            onClick={() => setResultsPage(p => Math.max(1, p - 1))}
                            disabled={resultsPage === 1}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-black text-sm rounded-xl transition-all"
                          >
                            ← Previous
                          </button>
                          <span className="text-sm font-black text-slate-600">
                            Page {resultsPage} of {Math.ceil(searchResults.length / resultsPerPage)}
                          </span>
                          <button
                            onClick={() => setResultsPage(p => Math.min(Math.ceil(searchResults.length / resultsPerPage), p + 1))}
                            disabled={resultsPage === Math.ceil(searchResults.length / resultsPerPage)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all shadow-md"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* GRID VIEW - Original grid layout showing limited results */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {searchResults.slice((resultsPage - 1) * (resultsPerPage / 2), resultsPage * (resultsPerPage / 2)).map((profile, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all duration-300"
                      >
                        <div>
                          {/* Top card block */}
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-black shadow-sm group-hover:scale-110 transition-transform">
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">{profile.name}</h4>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                                </span>
                              </div>
                            </div>
                            
                            <a 
                              href={profile.linkedinUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-10 h-10 rounded-xl bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 flex items-center justify-center transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          {/* Role and Company Metadata */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Role</span>
                              <div className="text-slate-800 font-bold text-xs truncate mt-0.5">{profile.title}</div>
                            </div>
                            <div className="bg-indigo-50/20 p-3.5 rounded-2xl border border-indigo-50/50">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hiring Entity</span>
                              <div className="text-indigo-600 font-bold text-xs truncate mt-0.5">{profile.company}</div>
                            </div>
                          </div>

                          {/* Outreach template block */}
                          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 relative group/outreach mb-6">
                            <span className="absolute top-4 right-4 px-2.5 py-1 bg-white border border-slate-200 text-slate-400 group-hover/outreach:text-indigo-600 group-hover/outreach:border-indigo-100 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 pointer-events-none transition-colors">
                              Outreach Template
                            </span>
                            <p className="text-slate-600 text-[13px] font-medium leading-relaxed italic whitespace-pre-line mt-2 pr-6">
                              "{profile.outreachMessage}"
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 border-t border-slate-50 pt-6">
                          <button 
                            onClick={() => copyToClipboard(profile.outreachMessage)}
                            className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy Template
                          </button>
                          <button 
                            onClick={() => handleImportToCRM(profile)}
                            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 hover:shadow-lg"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Import to CRM
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    </div>

                    {/* Grid View Pagination */}
                    {Math.ceil(searchResults.length / (resultsPerPage / 2)) > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-slate-100">
                        <button
                          onClick={() => setResultsPage(p => Math.max(1, p - 1))}
                          disabled={resultsPage === 1}
                          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-black text-sm rounded-xl transition-all"
                        >
                          ← Previous
                        </button>
                        <span className="text-sm font-black text-slate-600">
                          Page {resultsPage} of {Math.ceil(searchResults.length / (resultsPerPage / 2))}
                        </span>
                        <button
                          onClick={() => setResultsPage(p => Math.min(Math.ceil(searchResults.length / (resultsPerPage / 2)), p + 1))}
                          disabled={resultsPage === Math.ceil(searchResults.length / (resultsPerPage / 2))}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all shadow-md"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm py-28 text-center">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 mx-auto">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Find Leads Instantly</h3>
                  <p className="text-slate-400 font-bold mb-0 max-w-sm mx-auto leading-relaxed">
                    Type a query above to start scanning for recruiters, alumni, or hiring managers who match your career path.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Modals Mounting */}
      <AnimatePresence>
        {showPersonalModal && (
          <PersonalModal 
            contact={editPersonalContact}
            onClose={() => { setShowPersonalModal(false); setEditPersonalContact(null); }}
            onSave={handleSavePersonal} 
          />
        )}
        {showLinkedInModal && (
          <LinkedInModal 
            contact={editLinkedInContact}
            onClose={() => { setShowLinkedInModal(false); setEditLinkedInContact(null); }}
            onSave={handleSaveLinkedIn} 
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default NetworkingPage;
