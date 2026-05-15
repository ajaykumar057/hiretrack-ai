import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { applicationAPI, aiAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, TrendingUp, MessageSquare, XCircle, CheckCircle,
  Activity, ArrowUpRight, Zap, Plus, ChevronRight, Target,
  Brain, Users, FileText, BarChart3, Calendar, ArrowRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const COLORS = ['#4f46e5', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

const STATUS_COLORS = {
  Saved: '#94a3b8', Applied: '#3b82f6', OA: '#f59e0b',
  Interview: '#a855f7', Offer: '#10b981', Rejected: '#ef4444'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const MetricCard = ({ title, value, icon: Icon, change, color, gradient, delay, suffix = '' }) => (
  <motion.div
    custom={delay}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 relative group cursor-default shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)] hover:border-indigo-100 transition-all duration-500 overflow-hidden"
  >
    {/* Decorative Pattern Background */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="0" r="80" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="0" r="40" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex flex-col items-end`}>
            <span className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
              change >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
            }`}>
              <ArrowUpRight className={`w-3.5 h-3.5 ${change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(change)}%
            </span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">vs last month</span>
          </div>
        )}
      </div>
      <div className="text-[36px] font-black text-slate-900 font-display mb-1 tracking-tight">{value}{suffix}</div>
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
        <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            className={`h-full bg-gradient-to-r ${color} opacity-20`}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const ActivityFeed = ({ applications }) => {
  const recent = applications.slice(0, 6);
  return (
    <div className="space-y-4 mt-8">
      {recent.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest">No Recent Signals</p>
        </div>
      ) : (
        recent.map((app, i) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/20 transition-all duration-500 relative overflow-hidden"
          >
            {/* Status Accent Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-20 group-hover:opacity-100 transition-opacity ${
              app.status === 'Offer' ? 'bg-emerald-500' : 
              app.status === 'Rejected' ? 'bg-red-500' : 
              app.status === 'Interview' ? 'bg-purple-500' : 'bg-indigo-500'
            }`} />
            
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[16px] font-black text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
              {app.company.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{app.company}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-400 truncate tracking-widest uppercase">{app.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                app.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                app.status === 'Interview' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}>{app.status}</span>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Just now</span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

const ReadinessGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#4f46e5';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" stroke="#f1f5f9" strokeWidth="10" fill="none" />
          <circle
            cx="60" cy="60" r="54"
            stroke={getColor(score)}
            strokeWidth="10" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 8px ${getColor(score)}40)`, transition: 'stroke-dasharray 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-display text-slate-900">{score}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">out of 100</span>
        </div>
      </div>
      <h4 className="text-[15px] font-black text-slate-900 mt-6 uppercase tracking-wider">Placement Readiness</h4>
      <p className="text-sm font-bold text-slate-500 mt-2">
        {score >= 80 ? '🔥 Excellent!' : score >= 60 ? '👍 Good Progress' : score >= 40 ? '📈 Keep Going' : '🚀 Just Getting Started'}
      </p>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, appsRes, insightsRes] = await Promise.all([
        applicationAPI.getAnalytics(),
        applicationAPI.getAll({ limit: 10, sort: '-createdAt' }),
        aiAPI.getInsights()
      ]);
      setAnalytics(analyticsRes.data.data);
      setApplications(appsRes.data.data);
      setInsights(insightsRes.data.data);
    } catch (error) {
      console.error('Dashboard load error:', error);
      setAnalytics({
        summary: { total: 0, active: 0, offers: 0, rejected: 0, interviews: 0, responseRate: 0, offerRate: 0, rejectionRate: 0 },
        statusBreakdown: [], monthlyTrend: [], topCompanies: [], rejectionReasons: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-44" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="skeleton h-80 lg:col-span-2" />
            <div className="skeleton h-80" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const s = analytics?.summary || {};
  const metrics = [
    { title: 'Total Applications', value: s.total || 0, icon: Briefcase, color: 'from-indigo-600 to-indigo-400', change: 12, delay: 0 },
    { title: 'Active Pipeline', value: s.active || 0, icon: Activity, color: 'from-blue-600 to-blue-400', change: 8, delay: 1 },
    { title: 'Interviews', value: s.interviews || 0, icon: MessageSquare, color: 'from-purple-600 to-purple-400', change: 15, delay: 2 },
    { title: 'Offers Received', value: s.offers || 0, icon: CheckCircle, color: 'from-emerald-600 to-emerald-400', change: 5, delay: 3 },
  ];

  const insightColors = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-100 bg-amber-50 text-amber-700',
    info: 'border-indigo-100 bg-indigo-50 text-indigo-700',
    tip: 'border-purple-100 bg-purple-50 text-purple-700'
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header"
        >
          <div>
            <h1 className="page-title">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
              {' '}<span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="page-subtitle">Ready to land your dream role today?</p>
          </div>
          <Link to="/applications" className="btn-primary group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Application
          </Link>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>

        {/* Rates Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Response Rate', value: s.responseRate || 0, color: 'text-indigo-600', barColor: 'bg-indigo-600', desc: 'companies responded' },
            { label: 'Interview Rate', value: s.total > 0 ? Math.round((s.interviews / s.total) * 100) : 0, color: 'text-purple-600', barColor: 'bg-purple-600', desc: 'moved to interview' },
            { label: 'Offer Rate', value: s.offerRate || 0, color: 'text-emerald-600', barColor: 'bg-emerald-600', desc: 'converted to offers' },
          ].map((rate, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{rate.label}</span>
                <span className={`text-2xl font-black font-display ${rate.color}`}>{rate.value}%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${rate.barColor}`} style={{ width: `${rate.value}%` }} />
              </div>
              <p className="text-xs font-bold text-slate-500 mt-3">{rate.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts & Bottom Row */}
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          {/* Application Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Application Trends</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Monthly application volume</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending up
              </div>
            </div>
            <div className="h-[280px]">
              {analytics?.monthlyTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                      labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#4f46e5" strokeWidth={4} fill="url(#colorApps)" dot={{ fill: '#4f46e5', strokeWidth: 0, r: 5 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <BarChart3 className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-sm">No trend data yet.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-4"
          >
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Status Breakdown</h3>
            <p className="text-sm font-bold text-slate-400 mb-6">Applications by stage</p>
            <div className="h-[200px]">
              {analytics?.statusBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={85}
                      paddingAngle={5} dataKey="value" strokeWidth={0}>
                      {analytics.statusBreakdown.map((entry, index) => (
                        <Cell key={index} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Target className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-sm">No status data yet.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {analytics?.statusBreakdown?.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[item.name] || COLORS[i] }} />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider truncate">{item.name}</p>
                    <p className="text-xs font-bold text-slate-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Activity</h3>
              <Link to="/applications" className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-wider">
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ActivityFeed applications={applications} />
          </motion.div>

          {/* Readiness Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-4"
          >
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Readiness</h3>
            <ReadinessGauge score={user?.readinessScore || 0} />
            <div className="mt-4 space-y-4">
              {[
                { label: 'Profile Complete', done: !!(user?.targetRole && user?.skills?.length > 0) },
                { label: 'Resume Uploaded', done: false },
                { label: 'Applications Active', done: (s.active || 0) > 0 },
                { label: 'Networking Active', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.done ? 'bg-indigo-600' : 'bg-slate-100'
                  }`}>
                    {item.done && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm font-bold ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${insightColors[insight.type] || 'border-slate-100 bg-slate-50'} flex gap-4 transition-all hover:scale-[1.02] cursor-default`}>
                  <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                  <div>
                    <p className="text-[13px] font-black mb-1">{insight.title}</p>
                    <p className="text-[12px] font-bold opacity-80 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))}
              <Link to="/ai" className="btn-secondary w-full text-xs py-3 mt-4">
                View all intelligence <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Zap className="w-6 h-6 fill-amber-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Add Application', icon: Briefcase, to: '/applications', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              { label: 'AI Resume Check', icon: Brain, to: '/resume-intelligence', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { label: 'Add Contact', icon: Users, to: '/networking', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { label: 'Set Career Goal', icon: Target, to: '/goals', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border ${action.color} hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md text-center`}
              >
                <action.icon className="w-8 h-8" />
                <span className="text-sm font-black uppercase tracking-wider">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
