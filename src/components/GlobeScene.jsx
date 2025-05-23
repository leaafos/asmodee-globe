import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

const demoData = [
  { lat: 48.3-10, lng: 2.08-10, city: 'Asmodee HQ (Guyancourt, France)', population: 155000000 },
  { lat: 48.870-10, lng: 2.330-10, city: 'Twin Sails (Paris, France)', population: 50000000 },
  { lat: 46.580-10, lng: 0.340-10, city: 'Libellud (Poitiers, France)', population: 30000000 },
  { lat: 50.850-10, lng: 4.350-10, city: 'Repos Production (Bruxelles, Belgique)', population: 30000000 },
  { lat: 49.982-10, lng: 8.074-10, city: 'Lookout Games (Schwabenheim, Allemagne)', population: 20000000 },
  { lat: 51.152-10, lng: 6.675-10, city: 'Asmodee Holding GmbH (Essen, Allemagne)', population: 50000000 },
  { lat: 45.464-10, lng: 9.190-10, city: 'Asmodee Italia (Milan, Italie)', population: 40000000 },
  { lat: 40.416-10, lng: -3.703-10, city: 'Asmodee Ibérica (Madrid, Espagne)', population: 40000000 },
  { lat: 59.329-10, lng: 18.068-10, city: 'Asmodee Nordics (Stockholm, Suède)', population: 35000000 },
  { lat: 51.150-10, lng: -0.980-10, city: 'Asmodee UK (Alton, Royaume-Uni)', population: 60000000 },
  { lat: 45.421-10, lng: -75.699-10, city: 'Asmodee Canada (Ottawa, Canada)', population: 40000000 },
  { lat: -33.868-10, lng: 151.209-10, city: 'Asmodee Australia (Sydney, Australie)', population: 30000000 },
  { lat: 44.933-10, lng: -93.090-10, city: 'Asmodee North America (Roseville, USA)', population: 100000000 },
  { lat: 44.933-10, lng: -93.090-10, city: 'Fantasy Flight Games (Roseville, USA)', population: 50000000 },
  { lat: 44.933-10, lng: -93.090-10, city: 'Z-Man Games (Roseville, USA)', population: 30000000 },
  { lat: 32.776-10, lng: -96.797-10, city: 'Plaid Hat Games (Dallas, USA)', population: 30000000 },
  { lat: 22.3193-10, lng: 114.1694-10, city: 'Asmodee Asia (Hong Kong)', population: 25000000 },
  { lat: 31.2304-10, lng: 121.4737-10, city: 'Asmodee China (Shanghai, Chine)', population: 25000000 },
  { lat: 37.5665-10, lng: 126.9780-10, city: 'Asmodee Korea (Séoul, Corée du Sud)', population: 20000000 },
  { lat: 25.0330-10, lng: 121.5654-10, city: 'Asmodee Taiwan (Taipei, Taïwan)', population: 20000000 },
  { lat: 48.8566-10, lng: 2.3522-10, city: 'Days of Wonder (Paris, France)', population: 30000000 },
  { lat: 50.8503-10, lng: 4.3517-10, city: 'Pearl Games (Bruxelles, Belgique)', population: 15000000 },
  { lat: 43.2965-10, lng: 5.3698-10, city: 'Space Cowboys (Marseille, France)', population: 20000000 },
  { lat: 45.7640-10, lng: 4.8357-10, city: 'Ludonaute (Lyon, France)', population: 15000000 },
  { lat: 52.3676-10, lng: 4.9041-10, city: 'Enigma Distribution (Amsterdam, Pays-Bas)', population: 20000000 },
  { lat: 60.1695-10, lng: 24.9354-10, city: 'Asmodee Nordics (Helsinki, Finlande)', population: 15000000 },
  { lat: 52.2297-10, lng: 21.0122-10, city: 'Rebel Studio (Varsovie, Pologne)', population: 15000000 },
  { lat: 45.5017-10, lng: -73.5673-10, city: 'Plan B Games (Montréal, Canada)', population: 20000000 },
  { lat: 51.5074-10, lng: -0.1278-10, city: 'Coiledspring Games (Londres, Royaume-Uni)', population: 15000000 },
  { lat: 52.5200-10, lng: 13.4050-10, city: 'ADC Blackfire Entertainment (Berlin, Allemagne)', population: 20000000 },
  { lat: 35.6895-10, lng: 139.6917, city: 'Asmodee Japan (Tokyo, Japon)', population: 20000000 }
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
  { id: 'message1', text: 'Hello' },
  { id: 'message2', text: 'Have a nice day !' },
  { id: 'message3', text: 'Be bold !' },
  { id: 'message4', text: 'Let\' play !' },
  { id: 'message', text: '❤️' }
];

const fixedPositions = [
  { top: '20px', right: '20px' },
  { top: '70px', right: '20px' },
  { top: '120px', right: '20px' },
  { bottom: '70px', left: '20px' },
  { bottom: '20px', left: '20px' },
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

    const waitForSticksAndAddGlow = () => {
      const sticks = [];
      scene.traverse(obj => {
        if (obj.type === 'Mesh' && obj.geometry.type === 'CylinderGeometry') {
          sticks.push(obj);
        }
      });
  
      if (sticks.length === 0) {
        setTimeout(waitForSticksAndAddGlow, 50);
        return;
      }
  
      // Applique les matériaux aux sticks
      sticks.forEach(obj => {
        obj.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xf90073),
          emissive: new THREE.Color(0xf90073),
          emissiveIntensity: 3,
          metalness: 0.7,
          roughness: 0.05,
          transparent: true,
          opacity: 1.0,
          depthWrite: false,
        });
      });
  
      // Attend 300 ms avant d’ajouter et rendre visible les glowMeshes
      setTimeout(() => {
        sticks.forEach(obj => {
          // Clone de la géométrie pour glow
          const glowGeometry = obj.geometry.clone();
          glowGeometry.scale(1.5, 1.5, 1.5);
  
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xf90073),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
  
          const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
          glowMesh.position.copy(obj.position);
          glowMesh.quaternion.copy(obj.quaternion);
          glowMesh.visible = true; // visible au moment de l'ajout
  
          scene.add(glowMesh);
        });
      }, 500);
    };
  
    waitForSticksAndAddGlow();
    globeInstance.current = globe;
    globeInstance.current.camera().position.z = 400;
    
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
    setMessages(prev => {
      const newMsg = { id: Date.now(), text, lat: 48.773, lng: 2.043 };
  
      if (prev.length < 5) {
        return [...prev, newMsg];
      } else {
        // remplace le plus ancien (index 0) par le nouveau
        const updated = [...prev.slice(1), newMsg];
        return updated;
      }
    });
  };

  const fixedPositions = [
    { top: '100px', right: '180px' },  
    { top: '250px', right: '40px' },   
    { top: '480px', right: '100px' },  
    { top: '140px', left: '100px' }, 
    { top: '300px', left: '60px' }, 
  ];

  return (
    <div ref={containerRef}>
      <div ref={globeRef}  />

      {messages.map((msg, index) => {
          const pos = fixedPositions[index % fixedPositions.length];
          const isWest = msg.lng < 0;
          const topPercent = 50 - (msg.lat / 90) * 50;
          const verticalSpacing = 40;

          return (
            <div
              key={msg.id}
              ref={el => labelRefs.current[index] = el}
              style={{
                position: 'absolute',
                width: 'auto',
                ...pos,
                //top: `${20 + index * verticalSpacing}px`,
                // left: isWest ? '10px' : 'auto',
                //right: isWest ? 'auto' : '10px',
                transform: 'translateY(0)',
                padding: '6px 14px',
                backgroundColor: 'linear-gradient(45deg, rgb(255, 255, 255) 40%, rgb(255, 255, 255) 6%)',
                border: '1px solid #fff',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '14px',
                //whiteSpace: 'nowrap',
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
        width: 'auto',
        height: 'auto',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '14px',
        zIndex: 10,
        borderRadius: '4px'
      }}>
        {MESSAGE_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.text)}
            style={{
              fontSize: '0.8rem',
              padding: '4px 12px',
              cursor: 'pointer',
              borderRadius: 4,
              backgroundColor: 'linear-gradient(45deg, rgb(255, 255, 255) 40%, rgb(255, 255, 255) 6%)',
              color: '#000',
              border: '1px solid #fff',
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
