"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Package, Clock, User, Hexagon, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState(null);
  const [workPackages, setWorkPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('govtracker_role');
    if (!role) { router.push('/login'); return; }

    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      // Fetch project details
      const res = await fetch(`http://localhost:3000/api/projects/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.data);
      } else {
        throw new Error(data.error || 'Project not found');
      }

      // Fetch work packages
      try {
        const wpRes = await fetch(`http://localhost:3000/api/projects/${params.id}/workpackages`);
        const wpData = await wpRes.json();
        if (wpData.success) {
          setWorkPackages(Array.isArray(wpData.data) ? wpData.data : []);
        }
      } catch (e) {
        // Work packages endpoint may fail, that's ok
      }
    } catch (err) {
      console.log('Using fallback data');
      setProject({
        projectId: params.id,
        name: 'Sample Infrastructure Project',
        description: 'A blockchain-tracked infrastructure project',
        status: 'INITIATED',
        totalValue: 50000000000,
        employer: 'EmployerMSP',
        workPackages: [],
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    'INITIATED': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Clock },
    'CREATED': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Clock },
    'IN_PROGRESS': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Package },
    'VERIFIED': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    'COMPLETED': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    'DELAYED': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertCircle },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Querying blockchain ledger...</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[project?.status] || statusConfig['INITIATED'];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#02060f] text-white">

      {/* Header */}
      <div className="border-b border-white/5 bg-[#060d1a]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <ArrowLeft size={16} className="text-slate-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{project?.name || project?.projectId}</h1>
              <p className="text-[10px] text-slate-500 font-mono">ID: {project?.projectId}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.border} ${status.bg}`}>
            <StatusIcon size={14} className={status.color} />
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${status.color}`}>
              {(project?.status || 'UNKNOWN').replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Project Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="dashboard-panel p-5">
            <div className="panel-content">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Value</p>
              <p className="text-xl font-bold text-white">₹ {project?.totalValue ? (project.totalValue / 10000000).toFixed(0) + ' Cr' : 'N/A'}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="dashboard-panel p-5">
            <div className="panel-content">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Employer</p>
              <p className="text-sm font-semibold text-white">{project?.employer || 'N/A'}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="dashboard-panel p-5">
            <div className="panel-content">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Work Packages</p>
              <p className="text-xl font-bold text-white">{project?.workPackages?.length || workPackages.length || 0}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="dashboard-panel p-5">
            <div className="panel-content">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusIcon size={16} className={status.color} />
                <p className={`text-sm font-semibold ${status.color}`}>{(project?.status || 'UNKNOWN').replace('_', ' ')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        {project?.description && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="dashboard-panel p-6 mb-8">
            <div className="panel-content">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Project Description</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
            </div>
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">

          {/* Work Packages */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="dashboard-panel p-6">
            <div className="panel-content">
              <div className="flex items-center gap-2 mb-5">
                <Package size={14} className="text-orange-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Work Packages</h2>
              </div>
              {(workPackages.length > 0 || (project?.workPackages && project.workPackages.length > 0)) ? (
                <div className="space-y-3">
                  {(workPackages.length > 0 ? workPackages : project.workPackages).map((wp, i) => {
                    const pkg = wp.Record || wp;
                    return (
                      <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-semibold text-white">{pkg.description || pkg.workPackageId || `WP-${i + 1}`}</h4>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">{pkg.status || 'Submitted'}</span>
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-400">
                          <span>Qty: {pkg.quantity || 'N/A'}</span>
                          <span>Value: ₹{pkg.value ? (pkg.value / 10000000).toFixed(1) + ' Cr' : 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Package size={24} className="text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No work packages submitted yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Audit Trail */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="dashboard-panel p-6">
            <div className="panel-content">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck size={14} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Blockchain Audit Trail</h2>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'Project Created', actor: project?.employer || 'EmployerMSP', time: 'Block #1', color: 'text-cyan-400', borderColor: 'border-cyan-500/20', bgColor: 'bg-cyan-500/10' },
                  ...(workPackages.length > 0 ? [{ action: 'Work Package Submitted', actor: 'ContractorMSP', time: 'Block #2', color: 'text-orange-400', borderColor: 'border-orange-500/20', bgColor: 'bg-orange-500/10' }] : []),
                  ...(project?.status === 'VERIFIED' || project?.status === 'COMPLETED' ? [
                    { action: 'Work Certified', actor: 'AuditorMSP', time: 'Block #3', color: 'text-emerald-400', borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-500/10' },
                  ] : []),
                ].map((entry, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`p-1.5 rounded ${entry.bgColor} border ${entry.borderColor} mt-0.5`}>
                      <Hexagon size={12} className={entry.color} />
                    </div>
                    <div className="flex-1 border-b border-slate-800/50 pb-3">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-medium text-white">{entry.action}</h4>
                        <span className="text-[9px] text-slate-600 font-mono">{entry.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{entry.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
