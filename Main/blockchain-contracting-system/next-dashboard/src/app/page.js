"use client";

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Map, Maximize, AlertCircle, RefreshCw, Hexagon, Fingerprint, ActivitySquare, Shield, Globe2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Fix: Dynamically import the Globe to prevent Three.js from crashing during Next.js Server-Side Rendering (SSR)
const GlobeComponent = dynamic(() => import('@/components/GlobeComponent'), { 
  ssr: false,
  loading: () => null // Must be null or a Three.js element, cannot be a <div> inside <Canvas>
});

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/projects');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data && data.data) {
          // If the backend returns data, format it
          // Wait, the backend returns data in the format { success: true, data: [ { Key, Record } ] }
          setProjects(data.data || []);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        console.log("Using simulated blockchain data as fallback");
        setProjects([
          { Record: { projectId: 'INFRA_001', name: 'Delhi-Mumbai Expressway', status: 'INITIATED', totalValue: 98000000000, contractor: 'L&T Construction', employer: 'NHAI' } },
          { Record: { projectId: 'SMART_CTY', name: 'Pune Smart City Infrastructure', status: 'IN_PROGRESS', totalValue: 12500000000, contractor: 'TATA Projects', employer: 'UrbanDev' } },
          { Record: { projectId: 'RAIL_003', name: 'High-Speed Rail Corridor', status: 'VERIFIED', totalValue: 45000000000, contractor: 'IRCON', employer: 'Ministry of Railways' } },
          { Record: { projectId: 'BRIDGE_99', name: 'Coastal Road Bridge', status: 'COMPLETED', totalValue: 8500000000, contractor: 'Afcons', employer: 'BMC' } }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex bg-[#02060f]">
      
      {/* 3D Globe Background - Centered but pushed right, fully visible */}
      <div className="absolute top-0 right-0 w-[70vw] h-screen z-0 opacity-90 pointer-events-auto">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-cyan-500">Loading Network Map...</div>}>
          <Canvas camera={{ position: [0, 0, 5.5], fov: 40 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#00f2fe" />
            <GlobeComponent />
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              autoRotate 
              autoRotateSpeed={0.3}
              minDistance={3}
              maxDistance={8}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex w-full h-screen pointer-events-none">
        
        {/* LEFT COLUMN: Typography & Activity Feed */}
        <div className="w-[450px] h-full flex flex-col justify-center px-12 pointer-events-auto">
          
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
              <button className="btn-primary flex items-center gap-2 text-sm">
                Explore Projects <Activity size={16} />
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                View Live Map <Map size={16} />
              </button>
            </div>
          </motion.div>

          {/* Live Network Activity Feed */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                Live Network Activity <span className="live-dot"></span>
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Feed Item 1 */}
              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
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

              {/* Feed Item 2 */}
              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 mt-0.5 group-hover:bg-cyan-500/20 transition-colors">
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

              {/* Feed Item 3 */}
              <div className="flex gap-3 items-start group cursor-pointer">
                <div className="p-1.5 rounded bg-saffron-500/10 border border-[#ff9933]/20 mt-0.5 group-hover:bg-[#ff9933]/20 transition-colors">
                  <Hexagon size={14} className="text-[#ff9933]" />
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

        <div className="flex-1"></div> {/* Empty space for Globe */}

        {/* RIGHT COLUMN: Floating Data Panels */}
        <div className="w-[320px] h-full flex flex-col justify-center pr-10 py-10 gap-4 pointer-events-auto">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="dashboard-panel p-5 hover:border-cyan-500/30 transition-colors">
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="dashboard-panel p-5 hover:border-cyan-500/30 transition-colors">
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="dashboard-panel p-5 hover:border-cyan-500/30 transition-colors">
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="dashboard-panel p-5 hover:border-cyan-500/30 transition-colors">
            <div className="panel-content">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-slate-400">Blockchain Network</span>
                <div className="flex items-center gap-1">
                  <div className="live-dot"></div>
                  <span className="text-[10px] text-emerald-400 uppercase">Healthy</span>
                </div>
              </div>
              <div className="text-sm font-medium text-white mb-2">Peer Nodes: 24</div>
              {/* Simulated mini map */}
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
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
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
            <div className="p-2 rounded-full border border-[#ff9933]/30">
              <AlertCircle size={16} className="text-[#ff9933]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Delayed</p>
              <p className="text-lg font-bold text-white leading-none">173</p>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center gap-2">
          Drag to rotate globe <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Scroll to zoom
        </p>
      </div>

      {/* BOTTOM FULL WIDTH: Feature Cards */}
      <div className="absolute bottom-0 w-full px-12 pb-6 z-20 pointer-events-none flex justify-center gap-6">
        {[
          { title: "End-to-End Transparency", desc: "Immutable records of every action from planning to completion.", icon: <ShieldCheck size={16} className="text-cyan-400" /> },
          { title: "Decentralized Verification", desc: "Hybrid blockchain ensures data integrity and absolute trust.", icon: <Fingerprint size={16} className="text-emerald-400" /> },
          { title: "Real-time Monitoring", desc: "Track progress, funds, and milestones instantly.", icon: <Activity size={16} className="text-[#ff9933]" /> }
        ].map((feat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
            className="flex items-start gap-4 bg-[#060d1a]/80 backdrop-blur-md border border-white/5 rounded-lg p-4 w-80 pointer-events-auto"
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
      
    </div>
  );
}
