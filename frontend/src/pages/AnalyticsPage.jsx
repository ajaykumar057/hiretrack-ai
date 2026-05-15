import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { applicationAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { TrendingUp, TrendingDown, Target, BarChart3, PieChart as PieIcon, Activity, Zap, Info } from 'lucide-react';

const COLORS = ['#4f46e5', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];
const STATUS_COLORS = {
  Saved: '#94a3b8', Applied: '#3b82f6', OA: '#f59e0b',
  Interview: '#a855f7', Offer: '#10b981', Rejected: '#ef4444'
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI.getAnalytics()
      .then(res => setAnalytics(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-44 rounded-[2.5rem]" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {Array.from({length:2}).map((_,i) => <div key={i} className="skeleton h-80 rounded-[2.5rem]" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  const s = analytics?.summary || {};

  const kpiData = [
    { label: 'Response Rate', value: s.responseRate || 0, color: 'text-indigo-600', barColor: 'bg-indigo-600', icon: TrendingUp, bg: 'bg-indigo-50/50' },
    { label: 'Interview Rate', value: s.total > 0 ? Math.round((s.interviews / s.total) * 100) : 0, color: 'text-purple-600', barColor: 'bg-purple-600', icon: Target, bg: 'bg-purple-50/50' },
    { label: 'Offer Rate', value: s.offerRate || 0, color: 'text-emerald-600', barColor: 'bg-emerald-600', icon: Zap, bg: 'bg-emerald-50/50' },
    { label: 'Rejection Rate', value: s.rejectionRate || 0, color: 'text-rose-600', barColor: 'bg-rose-600', icon: TrendingDown, bg: 'bg-rose-50/50' },
  ];

  return (
    <AppLayout>
      <div className="page-container">
        <div className="section-header">
          <div>
            <h1 className="page-title">Career Intelligence</h1>
            <p className="page-subtitle">Visualizing your search performance and pipeline health</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-500 text-xs font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-indigo-500" /> Real-time Analytics
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiData.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-indigo-100/20 transition-all duration-500`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className={`text-3xl font-black font-display ${kpi.color} mb-3`}>{kpi.value}%</div>
              <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(kpi.value, 100)}%` }}
                  className={`h-full ${kpi.barColor} rounded-full`} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Trends Row */}
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          {/* Monthly Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Outreach Velocity</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Application volume over time</p>
              </div>
            </div>
            <div className="h-[300px]">
              {analytics?.monthlyTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                    />
                    <Area type="monotone" dataKey="applications" stroke="#4f46e5" strokeWidth={4} fill="url(#colorTrend)" dot={{ fill: '#4f46e5', r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <BarChart3 className="w-16 h-16 text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No trend data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Stage Breakdown</h3>
            </div>
            <p className="text-sm font-bold text-slate-400 mb-8">Current pipeline distribution</p>
            <div className="h-[220px]">
              {analytics?.statusBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      paddingAngle={5} dataKey="value" strokeWidth={0}>
                      {analytics.statusBreakdown.map((entry, index) => (
                        <Cell key={index} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <PieIcon className="w-16 h-16 text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No distribution data</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {analytics?.statusBreakdown?.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[item.name] || COLORS[i] }} />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{item.name} <span className="text-slate-900 ml-1">{item.value}</span></span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Secondary Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Companies */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">High Interest Targets</h3>
            <p className="text-sm font-bold text-slate-400 mb-8">Companies you've engaged with most</p>
            <div className="h-[250px]">
              {analytics?.topCompanies?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topCompanies} layout="vertical">
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="company" width={100} tick={{ fill: '#475569', fontSize: 12, fontWeight: 800 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                      {analytics.topCompanies.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Insufficient Target Data</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Rejection Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Rejection Intelligence</h3>
            <p className="text-sm font-bold text-slate-400 mb-8">Understanding the friction points</p>
            <div className="h-[200px]">
              {analytics?.rejectionReasons?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.rejectionReasons}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="reason" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#fef2f2' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="count" fill="#f43f5e" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">No friction data recorded</p>
                </div>
              )}
            </div>
            
            {analytics?.rejectionReasons?.length > 0 && (
              <div className="mt-8 p-6 bg-indigo-600 rounded-[2rem] text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-200" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-indigo-100">AI Optimization Tip</p>
                  </div>
                  <p className="text-[14px] font-bold leading-relaxed">
                    Analyzing your data, we suggest focusing on <span className="underline decoration-indigo-300 underline-offset-4">{analytics.rejectionReasons[0]?.reason || 'the initial screening'}</span>. Consider using our Resume Intelligence tool to optimize for these specific points.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
