import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { applicationAPI } from '../lib/api';
import AppLayout from '../components/layout/AppLayout';
import { Plus, MessageSquare, Check, MoreHorizontal, Briefcase, MapPin, Loader2, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'Saved', label: 'Backlog', headerBg: 'bg-indigo-600', badgeBg: 'bg-white', badgeText: 'text-indigo-600', textColor: 'text-white' },
  { id: 'Applied', label: 'In Progress', headerBg: 'bg-[#5e5ce6]', badgeBg: 'bg-white', badgeText: 'text-[#5e5ce6]', textColor: 'text-white' },
  { id: 'OA', label: 'Assessment', headerBg: 'bg-[#ff9f0a]', badgeBg: 'bg-white', badgeText: 'text-[#ff9f0a]', textColor: 'text-white' },
  { id: 'Interview', label: 'Interview', headerBg: 'bg-[#bf5af2]', badgeBg: 'bg-white', badgeText: 'text-[#bf5af2]', textColor: 'text-white' },
  { id: 'Offer', label: 'Completed', headerBg: 'bg-[#32d74b]', badgeBg: 'bg-white', badgeText: 'text-[#32d74b]', textColor: 'text-white' },
  { id: 'Rejected', label: 'Terminated', headerBg: 'bg-[#ff453a]', badgeBg: 'bg-white', badgeText: 'text-[#ff453a]', textColor: 'text-white' },
];

const KanbanCard = ({ app, provided, snapshot }) => {
  // Mock data for the screenshot aesthetic
  const commentCount = Math.floor(Math.random() * 200);
  const verifyCount = Math.floor(Math.random() * 1000);
  
  const priorityColors = {
    High: 'bg-rose-50 text-rose-500',
    Medium: 'bg-amber-50 text-amber-500',
    Low: 'bg-emerald-50 text-emerald-500',
  };

  const priorityLabel = app.priority === 'High' ? 'High Priority' : app.priority === 'Medium' ? 'Important' : 'Low Priority';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white p-6 rounded-[2.5rem] transition-all duration-300 group ${
        snapshot.isDragging 
          ? 'rotate-[2deg] shadow-2xl shadow-indigo-200/60 scale-105 ring-2 ring-indigo-500' 
          : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-50'
      }`}
    >
      <div className="mb-4">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${priorityColors[app.priority] || 'bg-slate-50 text-slate-400'}`}>
          {priorityLabel}
        </span>
      </div>

      <h3 className="text-[17px] font-black text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
        {app.role} at {app.company}
      </h3>

      <p className="text-[13px] font-bold text-slate-400 line-clamp-3 leading-relaxed mb-6">
        {app.notes || 'No additional details provided for this strategic move. Use notes to track key information.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }}>
              <img src={`https://i.pravatar.cc/150?u=${app._id + i}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">
            +{Math.floor(Math.random() * 5)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[11px] font-black">{commentCount > 100 ? `${(commentCount/10).toFixed(1)}k` : commentCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 transition-colors">
            <Check className="w-4 h-4" />
            <span className="text-[11px] font-black">{verifyCount > 100 ? `${(verifyCount/10).toFixed(1)}k` : verifyCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanPage = () => {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await applicationAPI.getAll({ limit: 200 });
      const grouped = {};
      COLUMNS.forEach(col => { grouped[col.id] = []; });
      res.data.data.forEach(app => {
        if (grouped[app.status]) grouped[app.status].push(app);
      });
      setColumns(grouped);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = [...(columns[source.droppableId] || [])];
    const destCol = source.droppableId === destination.droppableId ? srcCol : [...(columns[destination.droppableId] || [])];
    const [moved] = srcCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, moved);

    const newColumns = {
      ...columns,
      [source.droppableId]: srcCol,
      [destination.droppableId]: destCol,
    };
    setColumns(newColumns);

    if (source.droppableId !== destination.droppableId) {
      setUpdating(draggableId);
      try {
        await applicationAPI.update(draggableId, { status: destination.droppableId });
        toast.success(`Moved to ${destination.droppableId}`);
      } catch {
        toast.error('Sync error');
        loadApplications();
      } finally {
        setUpdating(null);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="page-container p-10">
          <div className="flex gap-10 overflow-x-auto pb-4 scrollbar-hide">
            {COLUMNS.map(col => (
              <div key={col.id} className="skeleton w-[360px] h-[800px] rounded-[4rem] flex-shrink-0" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-container max-w-full !p-0">
        <div className="px-12 pt-12 pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Strategic Board</h1>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mt-1">High-Fidelity Operations Management</p>
          </div>
          {updating && (
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100 text-[11px] font-black text-indigo-600 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              SYNCHRONIZING...
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-10 overflow-x-auto pb-20 scrollbar-hide px-12 pt-4">
            {COLUMNS.map(col => (
              <div key={col.id} className="flex-shrink-0 w-[360px]">
                {/* Screenshot Style Header */}
                <div className={`flex items-center justify-between px-3 py-3 pr-5 rounded-full ${col.headerBg} ${col.textColor} shadow-lg shadow-current/10 mb-8`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${col.badgeBg} ${col.badgeText} flex items-center justify-center text-[13px] font-black shadow-sm`}>
                      {(columns[col.id] || []).length}
                    </div>
                    <span className="text-[15px] font-black tracking-tight">{col.label}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Droppable Container */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[700px] flex flex-col gap-8 p-6 rounded-[4rem] transition-all duration-500 border-4 border-transparent ${
                        snapshot.isDraggingOver 
                          ? 'bg-slate-100/50 border-dashed border-slate-200 scale-[1.02]' 
                          : 'bg-[#f8f9fe]/50'
                      }`}
                    >
                      {(columns[col.id] || []).map((app, index) => (
                        <Draggable key={app._id} draggableId={app._id} index={index}>
                          {(provided, snapshot) => (
                            <KanbanCard app={app} provided={provided} snapshot={snapshot} />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {(columns[col.id] || []).length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center py-40 text-center opacity-20">
                          <Briefcase className="w-16 h-16 text-slate-300 mb-6" />
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Active Moves</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </AppLayout>
  );
};

export default KanbanPage;
