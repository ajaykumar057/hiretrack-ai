import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Briefcase, BarChart3, KanbanSquare, Users,
  FileText, BookOpen, Target, Settings, LogOut, ChevronLeft,
  ChevronRight, Sparkles, Bell, Search, Menu, Brain, Command,
  Globe, FileSearch, X
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Briefcase, label: 'Applications', path: '/applications' },
  { icon: KanbanSquare, label: 'Board', path: '/kanban' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Network Hub', path: '/networking' },
  { icon: FileText, label: 'Resume Intel', path: '/resume' },
  { icon: BookOpen, label: 'Interviews', path: '/interview-vault' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Brain, label: 'AI Insights', path: '/ai' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 overflow-hidden">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 flex-shrink-0 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100">
            <span className="font-black text-lg italic">HT</span>
          </div>
          <AnimatePresence>
            {(!collapsed || mobileMenuOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-black text-slate-800 tracking-tight text-xl"
              >
                HireTrack<span className="text-indigo-600">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon 
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              
              <AnimatePresence>
                {(!collapsed || mobileMenuOpen) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[15px] font-bold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 mt-auto border-t border-slate-50">
        <div className="flex items-center gap-3 px-2 py-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-sm font-black flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] font-bold text-slate-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {(!collapsed || mobileMenuOpen) && (
            <span className="text-[15px] font-bold">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 88 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full z-40 hidden lg:flex flex-col"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm z-50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-[280px] z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Topbar = ({ setMobileMenuOpen }) => {
  const { user } = useAuth();
  
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 w-80 group focus-within:bg-white focus-within:border-indigo-500/30 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Search applications, contacts..."
            className="bg-transparent border-none outline-none text-[14px] text-slate-900 placeholder-slate-400 w-full font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-2xl relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-px bg-slate-100 mx-1" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-slate-900">{user?.name}</p>
            <p className="text-[10px] font-bold text-slate-400">Pro Member</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black shadow-sm shadow-indigo-100/50">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-700 font-sans">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}
      >
        <Topbar setMobileMenuOpen={setMobileMenuOpen} />
        
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
