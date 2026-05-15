import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import { authAPI } from '../lib/api';
import { User, Shield, Bell, Palette, Save, Loader2, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const SKILLS_LIST = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'MongoDB', 'SQL', 'AWS', 'Docker', 'GraphQL', 'Vue.js', 'Angular', 'Next.js', 'Express.js', 'Redis', 'Kubernetes', 'System Design', 'Data Structures'];

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    preferredLocation: user?.preferredLocation || '',
    college: user?.college || '',
    graduationYear: user?.graduationYear || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(profile);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPasswordLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const addSkill = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const addCustomSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <AppLayout>
      <div className="page-container max-w-4xl">
        <div className="section-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="glass-card p-3 space-y-1 h-fit">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`sidebar-item w-full ${activeTab === tab.id ? 'active' : ''}`}>
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Profile Information</h2>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">{user?.name}</h3>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1 px-2 py-1 bg-primary-600/20 border border-primary-500/20 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-primary-400">{user?.readinessScore || 0}% Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Full Name</label>
                      <input className="input-field" value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-field">Target Role</label>
                      <input className="input-field" placeholder="Software Engineer" value={profile.targetRole}
                        onChange={e => setProfile({ ...profile, targetRole: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">College / University</label>
                      <input className="input-field" placeholder="IIT Delhi" value={profile.college}
                        onChange={e => setProfile({ ...profile, college: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-field">Graduation Year</label>
                      <input type="number" className="input-field" placeholder="2025" value={profile.graduationYear}
                        onChange={e => setProfile({ ...profile, graduationYear: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Preferred Location</label>
                    <input className="input-field" placeholder="Bangalore, Mumbai, Remote..." value={profile.preferredLocation}
                      onChange={e => setProfile({ ...profile, preferredLocation: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label-field">LinkedIn URL</label>
                      <input className="input-field" placeholder="linkedin.com/in/..." value={profile.linkedinUrl}
                        onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-field">GitHub URL</label>
                      <input className="input-field" placeholder="github.com/..." value={profile.githubUrl}
                        onChange={e => setProfile({ ...profile, githubUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-field">Portfolio URL</label>
                      <input className="input-field" placeholder="yourportfolio.dev" value={profile.portfolioUrl}
                        onChange={e => setProfile({ ...profile, portfolioUrl: e.target.value })} />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="label-field">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.skills.map(skill => (
                        <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/20 border border-primary-500/30 rounded-lg text-xs text-primary-300">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input className="input-field" placeholder="Type a skill and press Enter..."
                      value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addCustomSkill} />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {SKILLS_LIST.filter(s => !profile.skills.includes(s)).slice(0, 10).map(skill => (
                        <button key={skill} type="button" onClick={() => addSkill(skill)}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-500 hover:bg-white/8 hover:text-slate-300 transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Bio</label>
                    <textarea className="input-field resize-none" rows={3}
                      placeholder="Tell recruiters about yourself..."
                      value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary px-6 py-3 flex items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="label-field">Current Password</label>
                    <input type="password" className="input-field"
                      value={passwords.currentPassword}
                      onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-field">New Password</label>
                    <input type="password" className="input-field"
                      value={passwords.newPassword}
                      onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-field">Confirm New Password</label>
                    <input type="password" className="input-field"
                      value={passwords.confirmPassword}
                      onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
                  </div>
                  <button type="submit" disabled={passwordLoading}
                    className="btn-primary px-6 py-3 flex items-center gap-2">
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-red-400 mb-4">Danger Zone</h3>
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-slate-400 mb-3">Permanently delete your account and all data.</p>
                    <button className="btn-danger px-4 py-2 text-sm">Delete Account</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Application follow-up reminders', desc: 'Get reminded to follow up on pending applications', enabled: true },
                    { label: 'Goal completion alerts', desc: 'Celebrate when you complete your career goals', enabled: true },
                    { label: 'Weekly progress report', desc: 'Receive a weekly summary of your job search activity', enabled: false },
                    { label: 'Interview reminders', desc: 'Get reminded before scheduled interviews', enabled: true },
                    { label: 'Network follow-up alerts', desc: 'Reminders to follow up with contacts', enabled: false },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{notif.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                      </div>
                      <button
                        className={`w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${notif.enabled ? 'bg-primary-500' : 'bg-white/10'}`}
                        onClick={() => {}}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-300 mx-0.5 ${notif.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
