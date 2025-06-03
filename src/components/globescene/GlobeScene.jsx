import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import './globeScene.scss';

const arcsData = [{
  startLat: 48.773,
  startLng: 2.043,
  endLat: 44.933,
  endLng: -93.090,
  colorStart: '#FEE885',
  colorEnd: '#FBB232',
  stroke: 1.0,
  dashLength: 5.0,
  animationDuration: 2000,
}];

const fixedPositions = [
  { top: '24%', right: '11%' },
  { top: '43%', right: '4%' },
  { top: '64%', right: '11%' },
  { top: '30%', left: '11%' },
  { top: '50%', left: '6%' },
];



const GlobeScene = () => {
  const globeRef = useRef();
  const globeInstance = useRef(null);
  const containerRef = useRef();
  const labelRefs = useRef([]);
  const [structures, setStructures] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageOptions, setMessageOptions] = useState([]);
  const [popupData, setPopupData] = useState(null);

  // Charger les structures
  useEffect(() => {
    fetch('http://localhost/structures')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(struct => ({
          id: struct.id,
          lat: struct.latitude,
          lng: struct.longitude,
          name: struct.name,
          structure: struct.name,
          city: struct.city,
          country: struct.country,
          population: struct.size || 10000000,
          website: struct.website,
        }));
        setStructures(formatted);
      })
      .catch(err => console.error("Erreur lors du chargement des structures :", err));
  }, []);

  // Initialisation du globe
  useEffect(() => {
    if (!globeRef.current) return;

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
      .onPointClick(handleClickStick);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.1;
    globeInstance.current = globe;
    globeInstance.current.camera().position.z = 400;

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
        scene.add(glowMesh);
      });
    };

    waitForSticksAndAddGlow();
  }, [structures]);

  useEffect(() => {
    const animate = () => {
      globeInstance.current?.controls()?.update();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // Clic sur un point du globe
  const handleClickStick = (structureData) => {
    setPopupData(structureData);
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

    setMessages(prev =>
      prev.length < 5 ? [...prev, newMsg] : [...prev.slice(1), newMsg]
    );
  };

  // Clic sur un bouton message
// const handleClick = async (messageId) => {
//   try {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       console.warn("Aucun user_id dans localStorage");
//       return;
//     }

    // const parsedUser = JSON.parse(storedUser);
    // const userId = parsedUser.id;
    // const structuresUserId = await fetch(`http://localhost/structures/user/${userId}`)

    // const structures = await fetch(`http://localhost/structures/user/${userId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     user_id: userId,
    //     structure_id: structures.id
    //   })
    // });

    // const messageOpt = messageOptions.find(m => m.id === messageId);
    // if (!messageOpt) {
    //   console.warn(`Message introuvable pour l'ID : ${messageId}`);
    //   return;
    // }

    // const structure = structures.find(s => s.id === userId.structure);
    // if (!structure) {
    //   console.warn(`Structure introuvable pour : ${userId.structure}`);
    //   return;
    // }

    // const response = await fetch('http://localhost/messages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: messageOpt.text,
    //     user_id: userId,
    //     structure_id: structure.id
    //   })
    // });

//     if (!response.ok) throw new Error('Erreur API');

//     const newMsg = await response.json();

//     setMessages(prev =>
//       prev.length < 5 ? [...prev, newMsg] : [...prev.slice(1), newMsg]
//     );
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi du message :', error);
//   }
// };


  // Charger les messages disponibles
  useEffect(() => {
    fetch('http://localhost/messages')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(m => ({
          id: m.id,
          text: m.text,
          structure: m.structure?.name,
          country: m.structure?.name
        }));
        setMessageOptions(formatted);
        console.log('Messages chargés :', formatted);
        setMessages(formatted.slice(0, 5)); 
      })
      .catch(err => console.error('Erreur lors du chargement des messages :', err));
  }, []);

  useEffect(() => {
    labelRefs.current = labelRefs.current.slice(0, messages.length);
  }, [messages]);

  return (
    <div id='mapContainer' ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="scene-container">
        <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {popupData && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid #f90073',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 20,
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            minWidth: '250px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px' }}>{popupData.name}</h3>
            <p><strong>Ville :</strong> {popupData.city}</p>
            <p><strong>Pays :</strong> {popupData.country}</p>
            <p><strong>Site :</strong> <a href={popupData.website} target="_blank" rel="noreferrer">{popupData.website}</a></p>
            <button onClick={() => setPopupData(null)} style={{
              marginTop: '10px',
              backgroundColor: '#f90073',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Fermer</button>
          </div>
        )}

      {messages.map((msg, index) => (
        <div
          key={msg.id}
          ref={el => labelRefs.current[index] = el}
          style={{
            position: 'absolute',
            width: 'auto',
            maxWidth: '40%',
            ...fixedPositions[index % fixedPositions.length],
            transform: 'translateY(0)',
            padding: '6px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #fff',
            borderRadius: '4px',
            color: '#000',
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            wordWrap: 'break-word',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <strong>{msg.text}</strong><br />
          <span style={{ fontSize: '0.75em' }}>
            {msg.structure} – {msg.country}
          </span>
        </div>
      ))}
{/* 
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
              {msg.text} */}
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
            {/* </div>
          );
        })} */}

      <div style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '90%',
        bottom: '2%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 'clamp(8px, 1vw, 14px)',
        zIndex: 10,
        borderRadius: '4px',
      }}>
       {messageOptions
        .filter(opt => opt.id >= 1 && opt.id <= 5)
        .map(opt => (
          <button
            key={opt.id}
            //onClick={() => handleClick(opt.id)}
            style={{
              fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
              padding: 'clamp(3px, 0.5vw, 4px) clamp(8px, 1.5vw, 12px)',
              cursor: 'pointer',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              border: '1px solid #fff',
              whiteSpace: 'nowrap',
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
