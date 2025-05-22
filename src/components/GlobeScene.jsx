import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

const demoData = [
  { lat: 48.773, lng: 2.043, city: 'Asmodee HQ (Guyancourt, France)', population: 150000000 },
  { lat: 48.870, lng: 2.330, city: 'Twin Sails (Paris, France)', population: 50000000 },
  { lat: 46.580, lng: 0.340, city: 'Libellud (Poitiers, France)', population: 30000000 },
  { lat: 50.850, lng: 4.350, city: 'Repos Production (Bruxelles, Belgique)', population: 30000000 },
  { lat: 49.982, lng: 8.074, city: 'Lookout Games (Schwabenheim, Allemagne)', population: 20000000 },
  { lat: 51.152, lng: 6.675, city: 'Asmodee Holding GmbH (Essen, Allemagne)', population: 50000000 },
  { lat: 45.464, lng: 9.190, city: 'Asmodee Italia (Milan, Italie)', population: 40000000 },
  { lat: 40.416, lng: -3.703, city: 'Asmodee Ibérica (Madrid, Espagne)', population: 40000000 },
  { lat: 59.329, lng: 18.068, city: 'Asmodee Nordics (Stockholm, Suède)', population: 35000000 },
  { lat: 51.150, lng: -0.980, city: 'Asmodee UK (Alton, Royaume-Uni)', population: 60000000 },
  { lat: 45.421, lng: -75.699, city: 'Asmodee Canada (Ottawa, Canada)', population: 40000000 },
  { lat: -33.868, lng: 151.209, city: 'Asmodee Australia (Sydney, Australie)', population: 30000000 },
  { lat: 44.933, lng: -93.090, city: 'Asmodee North America (Roseville, USA)', population: 100000000 },
  { lat: 44.933, lng: -93.090, city: 'Fantasy Flight Games (Roseville, USA)', population: 50000000 },
  { lat: 44.933, lng: -93.090, city: 'Z-Man Games (Roseville, USA)', population: 30000000 },
  { lat: 32.776, lng: -96.797, city: 'Plaid Hat Games (Dallas, USA)', population: 30000000 }
];

const arcsData = [
  {
    startLat: 48.773,
    startLng: 2.043,
    endLat: 44.933,
    endLng: -93.090,
    colorStart: '#FEE885',
    colorEnd: '#FBB232',
    stroke: 1.0,
    dashLength: 5.0,
    animationDuration: 2000,
  },
];

const MESSAGE_OPTIONS = [
  { id: 'hi', text: 'Hi !' },
  { id: 'hello', text: 'Hello' },
  { id: 'emoji', text: '😊' }
];

const GlobeScene = () => {
  const globeRef = useRef();
  const globeInstance = useRef(null);
  const [messages, setMessages] = useState([]);
  const containerRef = useRef();
  const labelRefs = useRef([]);


  useEffect(() => {
    if (!globeRef.current) return;

    const globe = Globe()(globeRef.current)
      .globeImageUrl('globe-texture-v11.png')
      .backgroundColor('rgba(0, 0, 0, 0)')
      .pointsData(demoData)
      .pointAltitude(d => Math.sqrt(d.population) * 0.00001)
      .pointColor(() => 'rgba(249, 0, 115, 1)')
      .pointRadius(0.15)
      .pointLabel(d => `${d.city} (${d.population.toLocaleString()})`)
      .arcsData(arcsData)
      .arcColor(d => [d.colorStart, d.colorEnd])
      .arcStroke(d => d.stroke)
      .arcDashLength(d => d.dashLength)
      .arcDashGap(0.9)
      .arcDashAnimateTime(d => d.animationDuration)
      .arcDashInitialGap(() => 0);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.1;

    const scene = globe.scene();
    const overlayGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: '#f8c8dc',
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
    scene.add(overlayMesh);

    globe.scene().onBeforeRender = () => {
      if (globe.globeMesh && globe.globeMesh.rotation) {
        overlayMesh.rotation.copy(globe.globeMesh.rotation);
      }
    };

    globeInstance.current = globe;
  }, []);

  useEffect(() => {
    labelRefs.current = labelRefs.current.slice(0, messages.length);
  }, [messages]);

  useEffect(() => {
    const animate = () => {
      const globe = globeInstance.current;
      globe.controls().update();
      if (!globe || !globe.camera || !globe.renderer || !messages.length) {
        requestAnimationFrame(animate);
        return;
      }

      const camera = globe.camera();
      const renderer = globe.renderer();
      const width = renderer.domElement.width;
      const height = renderer.domElement.height;

  

      requestAnimationFrame(animate);
    };

    animate();
  }, [messages]);

  const handleClick = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        lat: 48.773,
        lng: 2.043
      }
    ]);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh', background: 'linear-gradient(-52deg, rgba(44,91,184,1) 19%, rgba(56,73,163,1) 46%, rgba(71,50,135,1) 81%)' }}>
      <div ref={globeRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

      {messages.map((msg, index) => {
          const isWest = msg.lng < 0;
          const topPercent = 50 - (msg.lat / 90) * 50;
          const verticalSpacing = 40;

          return (
            <div
              key={msg.id}
              ref={el => labelRefs.current[index] = el}
              style={{
                position: 'absolute',
                top: `${20 + index * verticalSpacing}px`,
                left: isWest ? '10px' : 'auto',
                right: isWest ? 'auto' : '10px',
                transform: 'translateY(0)',
                padding: '6px 12px',
                backgroundColor: '#ffe4e8',
                border: '1px solid #ffb6c1',
                borderRadius: '12px',
                color: '#000',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              {msg.text}
            </div>
          );
        })}

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
        background: 'rgba(255,255,255,0.6)',
        padding: '10px 20px',
        borderRadius: '12px'
      }}>
        {MESSAGE_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.text)}
            style={{
              fontSize: '1.2rem',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 8,
              backgroundColor: '#ffe4e8',
              color: '#000',
              border: '1px solid #ffb6c1',
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobeScene;
