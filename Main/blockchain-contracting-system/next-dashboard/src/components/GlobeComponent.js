"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Approximate coordinates for major Indian cities
const nodes = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812 }
];

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return new THREE.Vector3(x, y, z);
}

export default function GlobeComponent() {
  const groupRef = useRef();
  const [colorMap, setColorMap] = useState(null);
  
  // Safely load the texture client-side to prevent Suspense crashes
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
      (texture) => setColorMap(texture),
      undefined,
      (err) => console.error("Failed to load earth texture, using fallback color.", err)
    );
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015; // Slow ambient rotation
    }
  });

  const radius = 2.2;

  const points = useMemo(() => {
    return nodes.map(node => latLngToVector3(node.lat, node.lng, radius * 1.01));
  }, []);

  const arcs = useMemo(() => {
    const lines = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (Math.random() > 0.4) {
          const distance = points[i].distanceTo(points[j]);
          // Scale arc height based on distance
          const midPoint = points[i].clone().add(points[j]).multiplyScalar(0.5).normalize().multiplyScalar(radius + distance * 0.3);
          const curve = new THREE.QuadraticBezierCurve3(
            points[i],
            midPoint,
            points[j]
          );
          lines.push(curve.getPoints(30));
        }
      }
    }
    return lines;
  }, [points]);

  return (
    // Focus on India initially
    <group ref={groupRef} rotation={[0.2, Math.PI / 1.8, 0]}>
      {/* Textured Earth (or fallback color if texture fails) */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial 
          color={colorMap ? "#ffffff" : "#060d1a"}
          map={colorMap || null}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[radius * 1.03, 64, 64]}>
        <meshBasicMaterial 
          color="#00f2fe" 
          transparent={true} 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Nodes (Cities) */}
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#00f2fe" />
          <pointLight color="#00f2fe" intensity={1} distance={1} />
        </mesh>
      ))}

      {/* Glowing Accents */}
      {points.map((pos, i) => (
        <mesh key={`accent-${i}`} position={pos.clone().multiplyScalar(1.02)}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#ff9933" : "#10b981"} />
        </mesh>
      ))}

      {/* Network Connections */}
      {arcs.map((arcPoints, i) => (
        <Line
          key={i}
          points={arcPoints}
          color="#00f2fe"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}
