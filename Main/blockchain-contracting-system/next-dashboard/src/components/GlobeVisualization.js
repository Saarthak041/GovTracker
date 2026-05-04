"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Indian cities with project data
const projectNodes = [
  { lat: 28.6139, lng: 77.2090, name: 'Delhi', status: 'IN_PROGRESS', budget: '₹12,400 Cr', size: 0.6, color: '#00f2fe' },
  { lat: 19.0760, lng: 72.8777, name: 'Mumbai', status: 'VERIFIED', budget: '₹8,900 Cr', size: 0.5, color: '#10b981' },
  { lat: 12.9716, lng: 77.5946, name: 'Bangalore', status: 'IN_PROGRESS', budget: '₹6,200 Cr', size: 0.45, color: '#00f2fe' },
  { lat: 22.5726, lng: 88.3639, name: 'Kolkata', status: 'DELAYED', budget: '₹4,100 Cr', size: 0.4, color: '#f97316' },
  { lat: 13.0827, lng: 80.2707, name: 'Chennai', status: 'COMPLETED', budget: '₹5,600 Cr', size: 0.45, color: '#10b981' },
  { lat: 17.3850, lng: 78.4867, name: 'Hyderabad', status: 'IN_PROGRESS', budget: '₹7,300 Cr', size: 0.5, color: '#00f2fe' },
  { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad', status: 'VERIFIED', budget: '₹3,800 Cr', size: 0.4, color: '#10b981' },
  { lat: 18.5204, lng: 73.8567, name: 'Pune', status: 'IN_PROGRESS', budget: '₹4,500 Cr', size: 0.35, color: '#00f2fe' },
  { lat: 26.9124, lng: 75.7873, name: 'Jaipur', status: 'PLANNED', budget: '₹2,900 Cr', size: 0.35, color: '#8b5cf6' },
  { lat: 26.8467, lng: 80.9462, name: 'Lucknow', status: 'IN_PROGRESS', budget: '₹3,200 Cr', size: 0.35, color: '#00f2fe' },
  { lat: 21.1458, lng: 79.0882, name: 'Nagpur', status: 'VERIFIED', budget: '₹2,100 Cr', size: 0.3, color: '#10b981' },
  { lat: 25.5941, lng: 85.1376, name: 'Patna', status: 'DELAYED', budget: '₹1,800 Cr', size: 0.3, color: '#f97316' },
  { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam', status: 'PLANNED', budget: '₹2,400 Cr', size: 0.3, color: '#8b5cf6' },
  { lat: 30.7333, lng: 76.7794, name: 'Chandigarh', status: 'IN_PROGRESS', budget: '₹1,500 Cr', size: 0.25, color: '#00f2fe' },
  { lat: 15.3173, lng: 75.7139, name: 'Hubli', status: 'PLANNED', budget: '₹900 Cr', size: 0.2, color: '#8b5cf6' },
];

// Connection arcs (fund flows / verification chains)
const connectionArcs = [
  { startLat: 28.6139, startLng: 77.2090, endLat: 19.0760, endLng: 72.8777, color: ['rgba(0,242,254,0.6)', 'rgba(16,185,129,0.6)'] },
  { startLat: 28.6139, startLng: 77.2090, endLat: 12.9716, endLng: 77.5946, color: ['rgba(0,242,254,0.6)', 'rgba(0,242,254,0.3)'] },
  { startLat: 19.0760, startLng: 72.8777, endLat: 13.0827, endLng: 80.2707, color: ['rgba(16,185,129,0.6)', 'rgba(16,185,129,0.3)'] },
  { startLat: 28.6139, startLng: 77.2090, endLat: 22.5726, endLng: 88.3639, color: ['rgba(0,242,254,0.5)', 'rgba(249,115,22,0.5)'] },
  { startLat: 17.3850, startLng: 78.4867, endLat: 12.9716, endLng: 77.5946, color: ['rgba(0,242,254,0.5)', 'rgba(0,242,254,0.3)'] },
  { startLat: 19.0760, startLng: 72.8777, endLat: 23.0225, endLng: 72.5714, color: ['rgba(16,185,129,0.5)', 'rgba(16,185,129,0.3)'] },
  { startLat: 28.6139, startLng: 77.2090, endLat: 26.8467, endLng: 80.9462, color: ['rgba(0,242,254,0.5)', 'rgba(0,242,254,0.3)'] },
  { startLat: 17.3850, startLng: 78.4867, endLat: 17.6868, endLng: 83.2185, color: ['rgba(0,242,254,0.4)', 'rgba(139,92,246,0.4)'] },
  { startLat: 18.5204, startLng: 73.8567, endLat: 21.1458, endLng: 79.0882, color: ['rgba(0,242,254,0.4)', 'rgba(16,185,129,0.4)'] },
  { startLat: 22.5726, startLng: 88.3639, endLat: 25.5941, endLng: 85.1376, color: ['rgba(249,115,22,0.5)', 'rgba(249,115,22,0.3)'] },
  { startLat: 28.6139, startLng: 77.2090, endLat: 30.7333, endLng: 76.7794, color: ['rgba(0,242,254,0.4)', 'rgba(0,242,254,0.3)'] },
  { startLat: 12.9716, startLng: 77.5946, endLat: 15.3173, endLng: 75.7139, color: ['rgba(0,242,254,0.3)', 'rgba(139,92,246,0.3)'] },
];

// Ring pulse data (for pulsing effect on major nodes)
const ringsData = [
  { lat: 28.6139, lng: 77.2090, maxR: 3, propagationSpeed: 2, repeatPeriod: 1200, color: 'rgba(0,242,254,0.4)' },
  { lat: 19.0760, lng: 72.8777, maxR: 2.5, propagationSpeed: 2, repeatPeriod: 1500, color: 'rgba(16,185,129,0.4)' },
  { lat: 12.9716, lng: 77.5946, maxR: 2, propagationSpeed: 1.5, repeatPeriod: 1800, color: 'rgba(0,242,254,0.3)' },
  { lat: 17.3850, lng: 78.4867, maxR: 2, propagationSpeed: 1.5, repeatPeriod: 2000, color: 'rgba(0,242,254,0.3)' },
  { lat: 22.5726, lng: 88.3639, maxR: 2, propagationSpeed: 1.5, repeatPeriod: 1600, color: 'rgba(249,115,22,0.3)' },
];

// Dynamically import Globe to prevent SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => null
});

export default function GlobeVisualization() {
  const globeRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  useEffect(() => {
    setMounted(true);
    // Responsive sizing
    const updateSize = () => {
      const w = Math.min(window.innerWidth * 0.55, 900);
      setDimensions({ width: w, height: w });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current && mounted) {
      // Focus on India with smooth animation
      globeRef.current.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 2.0 }, 1500);

      // Auto-rotate settings
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.enableZoom = true;
        controls.minDistance = 120;
        controls.maxDistance = 400;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
      }
    }
  }, [mounted]);

  // Custom point tooltip
  const pointLabel = useCallback((d) => {
    return `
      <div style="
        background: rgba(6,13,26,0.95);
        border: 1px solid rgba(0,242,254,0.3);
        border-radius: 6px;
        padding: 10px 14px;
        color: #f1f5f9;
        font-family: Inter, sans-serif;
        font-size: 12px;
        min-width: 160px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      ">
        <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #fff;">${d.name}</div>
        <div style="color: ${d.color}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">${d.status.replace('_', ' ')}</div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; color: #8b9bb4;">Budget: <span style="color: #fff; font-weight: 600;">${d.budget}</span></div>
      </div>
    `;
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'relative' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        
        // Atmosphere - subtle cyan glow like the reference
        atmosphereColor="#00d4ff"
        atmosphereAltitude={0.18}
        showAtmosphere={true}
        
        // Project nodes as points
        pointsData={projectNodes}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.015}
        pointRadius="size"
        pointsMerge={false}
        pointLabel={pointLabel}
        
        // Pulsing rings around major cities
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringColor={() => t => `rgba(0,242,254,${1 - t})`}
        
        // Connection arcs with animated dashes
        arcsData={connectionArcs}
        arcColor="color"
        arcDashLength={0.5}
        arcDashGap={0.3}
        arcDashAnimateTime={2500}
        arcStroke={0.4}
        arcAltitudeAutoScale={0.25}
        
        // City labels
        labelsData={projectNodes.filter(n => n.size >= 0.4)}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={0.6}
        labelColor={() => 'rgba(200, 225, 255, 0.65)'}
        labelDotRadius={0.3}
        labelAltitude={0.02}
        labelResolution={2}
        
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
