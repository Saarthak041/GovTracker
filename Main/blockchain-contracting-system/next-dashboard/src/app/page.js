"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Maximize, AlertCircle, RefreshCw, Hexagon, Fingerprint, ActivitySquare, Shield, Globe2, X, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    setShowProjects(true);
    setLoadingProjects(true);
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      const data = await res.json();
      if (data && data.data) {
        setProjects(data.data);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.log('Using fallback data');
      setProjects([
        { Key: 'INFRA_001', Record: { projectId: 'INFRA_001', name: 'Highway Infrastructure Development', status: 'INITIATED', totalValue: 30000000000, employer: 'EmployerMSP', description: 'Multi-lane highway construction' } },
      ]);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#02060f]">
      
      {/* Main Content Layout */}
      <div className="relative z-10 flex w-full min-h-screen">
        
        {/* LEFT COLUMN */}
        <div className="w-[500px] h-screen flex flex-col justify-center px-12">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/5 mb-6">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase">Hybrid Blockchain Infrastructure</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-white mb-2 leading-[1.1]">
              Building India.
            </h1>
            <h1 className="text-5xl font-bold tracking-tight text-slate-300 mb-2 leading-[1.1]">
              On Trust.
            </h1>
            <h1 className="text-5xl font-bold tracking-tight text-cyan-400 mb-6 leading-[1.1]">
              On Blockchain.
            </h1>
            
            <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
              A hybrid blockchain system for end-to-end tracking, verification, and transparent governance of infrastructure projects across India.
            </p>

            <div className="flex gap-4 mb-12">
              <button onClick={fetchProjects} className="btn-primary flex items-center gap-2 text-sm">
                Explore Projects <Activity size={16} />
              </button>
            </div>
          </motion.div>

          {/* Live Network Activity Feed */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                Live Network Activity <span className="live-dot"></span>
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 mt-0.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
                <div className="flex-1 border-b border-slate-800/50 pb-3">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-medium text-slate-200">Project Verified</h4>
                    <span className="text-[10px] text-slate-500">2 mins ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">Delhi Metro Phase IV – Package 3</p>
                  <p className="text-[10px] text-slate-500 font-mono">Tx ID: 0x8f3...a21b</p>
                </div>
              </div>

              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 mt-0.5">
                  <RefreshCw size={14} className="text-cyan-400" />
                </div>
                <div className="flex-1 border-b border-slate-800/50 pb-3">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-medium text-slate-200">Funds Disbursed</h4>
                    <span className="text-[10px] text-slate-500">5 mins ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">₹125.6 Cr to National Highways Authority</p>
                  <p className="text-[10px] text-slate-500 font-mono">Tx ID: 0x7c1...b92e</p>
                </div>
              </div>

              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-orange-500/10 border border-orange-500/20 mt-0.5">
                  <Hexagon size={14} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-medium text-slate-200">Milestone Completed</h4>
                    <span className="text-[10px] text-slate-500">11 mins ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">Bharatmala Project – NH-48</p>
                  <p className="text-[10px] text-slate-500 font-mono">Tx ID: 0x3a9...f11d</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CENTER: Full-screen Globe Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative w-[110vh] h-[110vh]" style={{ mask: 'radial-gradient(circle, white 30%, transparent 70%)', WebkitMask: 'radial-gradient(circle, white 30%, transparent 70%)' }}>
            {/* Globe image with slow pulse */}
            <motion.img 
              src="/globe.png" 
              alt="Global Infrastructure Network" 
              className="w-full h-full object-contain"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          {/* Pulsing scan rings */}
          <motion.div 
            className="absolute w-[50vh] h-[50vh] rounded-full border border-cyan-500/10"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute w-[50vh] h-[50vh] rounded-full border border-cyan-500/5"
            animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
          />
        </div>

        {/* Globe is absolute so add spacer to push right column */}
        <div className="flex-1"></div>

        {/* RIGHT COLUMN: Floating Data Panels */}
        <div className="w-[320px] h-screen flex flex-col justify-center pr-10 py-10 gap-4 z-10">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="dashboard-panel p-5">
            <div className="panel-content">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-400">Total Projects</span>
                <Maximize size={12} className="text-slate-600" />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">2,910</div>
              <div className="mt-3 h-8 w-full flex items-end gap-1 opacity-50">
                {[4, 6, 5, 8, 7, 10, 8, 12, 11, 14, 15].map((h, i) => (
                  <div key={i} className="w-full bg-cyan-500 rounded-t-sm" style={{ height: `${h * 2}px` }}></div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="dashboard-panel p-5">
            <div className="panel-content">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-400">Total Investment</span>
                <Maximize size={12} className="text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">₹ 18.73 Lakh Cr</div>
              <div className="data-divider"></div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-500 uppercase">YoY Growth</span>
                <span className="text-xs font-medium text-emerald-400">+14.2%</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="dashboard-panel p-5">
            <div className="panel-content">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-400">Funds Utilized</span>
                <Maximize size={12} className="text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight mb-3">₹ 7.89 Lakh Cr</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '42.1%' }}></div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[10px] font-mono text-slate-400">42.1%</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="dashboard-panel p-5">
            <div className="panel-content">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-slate-400">Blockchain Network</span>
                <div className="flex items-center gap-1">
                  <div className="live-dot"></div>
                  <span className="text-[10px] text-emerald-400 uppercase">Healthy</span>
                </div>
              </div>
              <div className="text-sm font-medium text-white mb-2">Peer Nodes: 24</div>
              <div className="w-full h-16 bg-slate-800/30 rounded border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                <Globe2 className="text-slate-700 absolute opacity-50" size={60} />
                <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-1/3 left-1/3 shadow-[0_0_5px_#00f2fe]"></div>
                <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-1/2 left-1/2 shadow-[0_0_5px_#00f2fe]"></div>
                <div className="absolute w-1 h-1 bg-emerald-400 rounded-full top-1/4 left-2/3 shadow-[0_0_5px_#10b981]"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM CENTER: Project Status Strip */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} 
          className="dashboard-panel px-8 py-4 flex gap-12"
        >
          <div className="panel-content flex items-center gap-3">
            <div className="p-2 rounded-full border border-emerald-500/30">
              <ActivitySquare size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">In Progress</p>
              <p className="text-lg font-bold text-white leading-none">1,283</p>
            </div>
          </div>

          <div className="panel-content flex items-center gap-3">
            <div className="p-2 rounded-full border border-cyan-500/30">
              <Shield size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Completed</p>
              <p className="text-lg font-bold text-white leading-none">842</p>
            </div>
          </div>

          <div className="panel-content flex items-center gap-3">
            <div className="p-2 rounded-full border border-orange-500/30">
              <AlertCircle size={16} className="text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Delayed</p>
              <p className="text-lg font-bold text-white leading-none">173</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: Feature Cards */}
      <div className="absolute bottom-0 w-full px-12 pb-6 z-20 flex justify-center gap-6">
        {[
          { title: "End-to-End Transparency", desc: "Immutable records of every action from planning to completion.", icon: <ShieldCheck size={16} className="text-cyan-400" /> },
          { title: "Decentralized Verification", desc: "Hybrid blockchain ensures data integrity and absolute trust.", icon: <Fingerprint size={16} className="text-emerald-400" /> },
          { title: "Real-time Monitoring", desc: "Track progress, funds, and milestones instantly.", icon: <Activity size={16} className="text-orange-400" /> }
        ].map((feat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
            className="flex items-start gap-4 bg-[#060d1a]/80 border border-white/5 rounded-lg p-4 w-80"
          >
            <div className="p-2 bg-white/5 rounded border border-white/10 shrink-0">
              {feat.icon}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 mb-1">{feat.title}</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PROJECTS PANEL OVERLAY */}
      <AnimatePresence>
        {showProjects && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowProjects(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-[900px] max-h-[80vh] bg-[#060d1a]/95 border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-bold text-white">Blockchain Projects</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Live data from Hyperledger Fabric ledger</p>
                </div>
                <button onClick={() => setShowProjects(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[65vh]">
                {loadingProjects ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 size={28} className="text-cyan-400 animate-spin" />
                    <p className="text-sm text-slate-400">Querying blockchain ledger...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-slate-400">No projects found on the ledger.</p>
                    <p className="text-xs text-slate-500 mt-1">Use the API to create one: POST /api/projects</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((p, i) => {
                      const project = p.Record || p;
                      const statusColors = {
                        'INITIATED': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                        'CREATED': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                        'IN_PROGRESS': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                        'VERIFIED': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                        'COMPLETED': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                        'DELAYED': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                      };
                      const statusStyle = statusColors[project.status] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                      return (
                        <motion.div 
                          key={p.Key || project.projectId || i}
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.08 }}
                          className="p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-cyan-500/20 transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{project.name || project.projectId}</h3>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {project.projectId}</p>
                            </div>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border ${statusStyle}`}>
                              {(project.status || 'UNKNOWN').replace('_', ' ')}
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-xs text-slate-400 mb-3">{project.description}</p>
                          )}
                          <div className="flex gap-6 text-[10px]">
                            <div>
                              <span className="text-slate-500 uppercase tracking-wider">Value</span>
                              <p className="text-white font-semibold mt-0.5">₹ {project.totalValue ? (project.totalValue / 10000000).toFixed(0) + ' Cr' : 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-slate-500 uppercase tracking-wider">Employer</span>
                              <p className="text-white font-semibold mt-0.5">{project.employer || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-slate-500 uppercase tracking-wider">Work Packages</span>
                              <p className="text-white font-semibold mt-0.5">{project.workPackages ? project.workPackages.length : 0}</p>
                            </div>
                            <div>
                              <span className="text-slate-500 uppercase tracking-wider">Payments</span>
                              <p className="text-white font-semibold mt-0.5">{project.payments ? project.payments.length : 0}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
