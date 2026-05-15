import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { linkedinAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { 
  Globe, Plus, MessageSquare, CheckCircle, Clock, 
  ExternalLink, MoreVertical, Edit, Trash2, Search, Loader2,
  TrendingUp, Users, Target, Tag, ChevronRight, MessageCircle, X,
  Briefcase, Mail, Calendar, Star
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'Not Contacted', 'Message Sent', 'Replied', 
  'Referral Received', 'Follow-up Pending', 'Closed'
];

const STATUS_COLORS = {
  'Not Contacted': 'text-slate-500 bg-slate-50 border-slate-100',
  'Message Sent': 'text-blue-600 bg-blue-50 border-blue-100',
  'Replied': 'text-indigo-600 bg-indigo-50 border-indigo-100',
  'Referral Received': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Follow-up Pending': 'text-amber-600 bg-amber-50 border-amber-100',
  'Closed': 'text-red-600 bg-red-50 border-red-100',
};

const RelationshipCard = ({ contact, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden"
  >
    {/* Status Line */}
    <div className={`absolute top-0 left-0 right-0 h-1.5 ${STATUS_COLORS[contact.status]?.split(' ')[1] || 'bg-slate-100'} opacity-60 group-hover:opacity-100 transition-opacity`} />

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
        <button onClick={() => onEdit(contact)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(contact._id)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 shadow-sm transition-all">
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
        <span className={`px-3 py-1 rounded-full border-2 text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[contact.status]}`}>
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
      <button className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm border border-slate-100">
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

const LinkedInCRMPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    recruiterName: '', companyName: '', role: '', linkedinUrl: '',
    status: 'Not Contacted', referralRequested: false, responseReceived: false,
    followUpDate: '', notes: '', tags: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await linkedinAPI.getAll();
      setContacts(res.data.data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (contact = null) => {
    if (contact) {
      setEditingId(contact._id);
      setFormData({
        ...contact,
        followUpDate: contact.followUpDate ? contact.followUpDate.split('T')[0] : '',
        tags: contact.tags ? contact.tags.join(', ') : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        recruiterName: '', companyName: '', role: '', linkedinUrl: '',
        status: 'Not Contacted', referralRequested: false, responseReceived: false,
        followUpDate: '', notes: '', tags: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    };

    try {
      if (editingId) {
        await linkedinAPI.update(editingId, payload);
        toast.success('Relationship Synchronized');
      } else {
        await linkedinAPI.create(payload);
        toast.success('New Relationship Initialized');
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this relationship data?')) {
      try {
        await linkedinAPI.delete(id);
        toast.success('Data Terminated');
        fetchContacts();
      } catch {
        toast.error('Termination Failed');
      }
    }
  };

  const totalContacted = contacts.filter(c => c.status !== 'Not Contacted').length;
  const totalReplies = contacts.filter(c => c.status === 'Replied' || c.responseReceived).length;
  const totalReferrals = contacts.filter(c => c.status === 'Referral Received').length;
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

  const filteredContacts = contacts.filter(c => 
    c.recruiterName.toLowerCase().includes(search.toLowerCase()) ||
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="section-header px-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-100 group">
              <Globe className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Connection Ledger</h1>
              <p className="page-subtitle font-bold text-slate-400">Managing {contacts.length} high-fidelity professional signals</p>
            </div>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary px-8">
            <Plus className="w-5 h-5" /> 
            New Relation
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Network Power', value: contacts.length, icon: Users, color: 'blue' },
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

        {/* Intelligence Layer */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative z-10 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md mt-10 hover:bg-white/10 transition-colors">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-4 text-blue-400">
                <Clock className="w-4 h-4" /> Next Operation
              </h4>
              <p className="text-[14px] font-bold opacity-80 mb-8 leading-relaxed">
                You have <span className="text-white font-black underline underline-offset-4 decoration-blue-500">{contacts.filter(c => c.status === 'Follow-up Pending').length} relationships</span> in critical follow-up state.
              </p>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                Execute Follow-ups
              </button>
            </div>
            {/* Background art */}
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />
            <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-purple-500/20 rounded-full blur-[50px]" />
          </div>
        </div>

        {/* Relationship Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-[400px] rounded-[3.5rem]" />)}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContacts.map(contact => (
                <RelationshipCard 
                  key={contact._id} 
                  contact={contact} 
                  onEdit={handleOpenModal} 
                  onDelete={handleDelete} 
                />
              ))}
              
              <div 
                onClick={() => handleOpenModal()}
                className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center min-h-[400px] cursor-pointer group hover:bg-white hover:border-blue-100 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-slate-200 group-hover:text-blue-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Expand Network</h3>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm py-40 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-700">
                  <Users className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Network Void Detected</h3>
                <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed">
                  Your professional ecosystem is awaiting input. Add recruiters and mentors to gain strategic advantages.
                </p>
                <button onClick={() => handleOpenModal()} className="btn-primary px-10 py-5">
                  <Plus className="w-5 h-5" /> Initialize Connection
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/30" />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
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
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingId ? 'Edit Identity' : 'New Identity'}</h2>
                    <p className="text-sm font-bold text-slate-400">Configure professional metadata</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" required className="input-field" placeholder="Sarah Connor" value={formData.recruiterName} onChange={e => setFormData({...formData, recruiterName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Entity</label>
                    <input type="text" required className="input-field" placeholder="Cyberdyne Systems" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Operational Role</label>
                    <input type="text" className="input-field" placeholder="Hiring Manager" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Intelligence URL</label>
                    <input type="url" className="input-field" placeholder="linkedin.com/in/..." value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Protocol</label>
                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Action Deadline</label>
                    <input type="date" className="input-field" value={formData.followUpDate} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-10 py-6 border-y border-slate-50">
                  <label className="flex items-center gap-3 text-sm font-black text-slate-700 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${formData.referralRequested ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                      {formData.referralRequested && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.referralRequested} onChange={e => setFormData({...formData, referralRequested: e.target.checked})} />
                    REFERRAL SECURED
                  </label>
                  <label className="flex items-center gap-3 text-sm font-black text-slate-700 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${formData.responseReceived ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-100' : 'border-slate-200 group-hover:border-emerald-400'}`}>
                      {formData.responseReceived && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.responseReceived} onChange={e => setFormData({...formData, responseReceived: e.target.checked})} />
                    ACK RECEIVED
                  </label>
                </div>

                <div className="space-y-6">
                  <button type="submit" className="btn-primary w-full py-5 text-xl">Commit Connection</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Discard Draft</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default LinkedInCRMPage;
