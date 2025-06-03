import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import "./globeScene.scss"


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


const GlobeScene = () => {
  const globeRef = useRef();
  const globeInstance = useRef(null);
  const [messages, setMessages] = useState([]);
  const containerRef = useRef();
  const labelRefs = useRef([]);
  const [structures, setStructures] = useState([]);

useEffect(() => {
  fetch('http://localhost/structures') 
    .then(res => res.json())
    .then(data => {
      console.log("Structures récupérées :", data);
      const formatted = data.map(struct => ({
          lat: struct.latitude,
          lng: struct.longitude,
          name: struct.name,
          structure: struct.name,
          city: struct.city,
          country: struct.country,
          population: struct.size || 10000000,
          website: struct.website,
      }));
      console.log("Structures chargées :", formatted);
      setStructures(formatted);
    })
    .catch(err => console.error("Erreur lors du chargement des structures :", err));
}, []);



  useEffect(() => {
    if (!globeRef.current) return;
    console.log("Initialisation de Globe.js");
    const globe = Globe()(globeRef.current)
      .globeImageUrl('globe-texture-v11.png')
      .backgroundColor('rgba(0, 0, 0, 0)')
      .pointsData(structures)
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
      .arcDashInitialGap(() => 0)
      .onPointClick(d => handleClickStick(d));


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
  
      setTimeout(() => {
        sticks.forEach(obj => {
         
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
          glowMesh.visible = true; 
  
          scene.add(glowMesh);
        });
      }, 500);
    };
  
    waitForSticksAndAddGlow();
    globeInstance.current = globe;
    globeInstance.current.camera().position.z = 400;
    
  }, []);

  const handleClickStick = (structureData) => {
    setMessages(prev => {
      const newMsg = {
        id: Date.now(),
        text: structureData.name,
        structure: structureData.structure,
        country: structureData.country,
        city: structureData.city,
        lat: structureData.lat,
        lng: structureData.lng,
        website: structureData.website
      };

      if (prev.length < 5) {
        console.log("Ajout du message :", newMsg);
        return [...prev, newMsg];
      } else {
        console.log("Remplacement du message le plus ancien par :", newMsg);
        return [...prev.slice(1), newMsg];
      }
    });
  };

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
      requestAnimationFrame(animate);
    };

    animate();
  }, [messages]);

  const handleClick = (text) => {
    setMessages(prev => {
      const newMsg = { id: Date.now(), 
        text, 
        structure: messages.structure,
        country: messages.country,
        lat: 48.773, 
        lng: 2.043 };
  
      if (prev.length < 5) {
        return [...prev, newMsg];
      } else {
        const updated = [...prev.slice(1), newMsg];
        return updated;
      }
    });
  };

   const fixedPositions = [
    { top: '24%', right: '11%' },  
    { top: '43%', right: '4%' },   
    { top: '64%', right: '11%' },  
    { top: '30%', left: '11%' }, 
    { top: '50%', left: '6%' }, 

];

const [messageOptions, setMessageOptions] = useState([]);

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost/messages');
      const data = await res.json();
      const formatted = data.map(message => ({
        id: message.id,
        text: message.text,
        structure: message.structure,
        country: message.country
      }));
      setMessageOptions(formatted);
    } catch (err) {
      console.error('Erreur lors du chargement des messages :', err);
    }
  };

  fetchMessages();
}, []);

return (
  <>
    <div id='mapContainer' ref={containerRef} style={{
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div className="scene-container">
        <div ref={globeRef} style={{width: '100%', height: '100%'}} />
      </div>

      {messages.map((msg, index) => {
          const posGlobe = fixedPositions[index % fixedPositions.length];
          const pos = fixedPositions[index % fixedPositions.length];

          return (
            <div
              key={msg.id}
              ref={el => labelRefs.current[index] = el}
              style={{
                position: 'absolute',
                width: 'auto',
                maxWidth: '40%', 
                ...pos,
                transform: 'translateY(0)',
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #fff',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10,
                boxSizing: 'border-box'
              }}
            >
              {msg.text}
              {/* <div style={{
                position: 'absolute',
                top: `${20 + index * 80}px`,
                right: '20px',
                width: '300px',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 20,
                color: '#000',
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}>
               <div>
                <strong>{msg.structure}</strong><br />
                {msg.city}, {msg.country}<br />
                {msg.website && (
                  <a href={msg.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0077cc' }}>
                    Site web
                  </a>
                )}
              </div>
              </div> */}
            </div>
          );
        })}

      <div style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '90%', 
        height: 'auto',
        bottom: '2%', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: 'clamp(8px, 1vw, 14px)',
        zIndex: 10,
        borderRadius: '4px',
        boxSizing: 'border-box'
      }}>

      
        {messageOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.text)}
            style={{
              fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', 
              padding: 'clamp(3px, 0.5vw, 4px) clamp(8px, 1.5vw, 12px)',
              cursor: 'pointer',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              border: '1px solid #fff',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flexShrink: 1
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  </>
  );
};

export default GlobeScene;
