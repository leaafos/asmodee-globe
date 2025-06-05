import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { interpolateRgb } from 'd3-interpolate';
import * as THREE from 'three';
import './globeScene.scss';

const arcsData = [{
  startLat: 44.2684,
  startLng: 2.4555,
  endLat: 151.6355,
  endLng: 46.6293,
  colorStart: '#FEE885',
  colorEnd: '#FBB232',
  stroke: 1.0,
  dashLength: 6.0,
  animationDuration: 2000,
},
{
  startLat: 43.8503,
  startLng: -2.3517,
  endLat: -33.2075,
  endLng: -62.1065,
  colorStart: '#FEE885',
  colorEnd: '#FBB232',
  stroke: 1.0,
  dashLength: 6.0,
  animationDuration: 2000,
},
{
  startLat: 36.2569,
  startLng: -82.5056,
  endLat: 36.4871,
  endLng: -103.4843,
  colorStart: '#FEE885',
  colorEnd: '#FBB232',
  stroke: 1.0,
  dashLength: 6.0,
  animationDuration: 2000,
},
{
  startLat: 35.2302,
  startLng: 15.6293,
  endLat: 28.2684,
  endLng: -16.4555,
  colorStart: '#FEE885',
  colorEnd: '#FBB232',
  stroke: 1.0,
  dashLength: 6.0,
  animationDuration: 2000,
}

];

const fixedPositions = [
  { top: '24%', right: '8%' },
  { top: '43%', right: '3%' },
  { top: '64%', right: '5%' },
  { top: '30%', left: '5%' },
  { top: '50%', left: '2%' },
];

const interpolateColor = interpolateRgb('#FFBC00', '#FFBC00');

const GlobeScene = () => {
  const globeRef = useRef();
  const globeInstance = useRef(null);
  const containerRef = useRef();
  const labelRefs = useRef([]);
  const [structures, setStructures] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageOptions, setMessageOptions] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [latOffset, setLatOffset] = useState(46);
  const [lngOffset, setLngOffset] = useState(2);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMessages = async () => {

    try {
      const res = await fetch('http://localhost/messages?limit=10');
      if (!res.ok) throw new Error('Erreur de récupération des messages');
      const data = await res.json();
      const formatted = data.map(m => ({
        id: m.id,
        text: m.text,
        structure: m.structure ?? 'N/A',
        country: m.country ?? 'N/A',
      }));
      setMessageOptions(formatted);
      setRetryCount(0);
      setMessages(formatted.slice(0, 5));
    } catch (err) {
      console.error('Erreur lors du chargement des messages :', err);
      if (retryCount < 3) {
        setTimeout(() => fetchMessages(), 3000);
        setRetryCount(retryCount + 1);
      }
    }
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetch('http://localhost/structures')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(struct => ({
          id: struct.id,
          lat: struct.latitude + latOffset,
          lng: struct.longitude + lngOffset,
          name: struct.name,
          structure: struct.name,
          city: struct.city,
          country: struct.country,
          population: struct.size || 10000000,
          website: struct.website,
        }));
        setStructures(formatted);
        console.log("Structures formatées avec offset :", formatted);
      })
      .catch(err => console.error("Erreur lors du chargement des structures :", err));
  }, [latOffset, lngOffset]);

  const [hoveredStructure, setHoveredStructure] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!globeRef.current) return;
    console.log("Structures injectées dans globe:", structures);

    const glowAllowedIds = new Set([
      ...Array.from({ length: 17 }, (_, i) => i + 1),
      ...Array.from({ length: 25 }, (_, i) => i + 22),

    ]);

    const globe = Globe()(globeRef.current)
      .globeImageUrl('globe-texture-v11.png')
      .backgroundColor('rgba(0, 0, 0, 0)')
      .arcsData(arcsData)
      .arcColor(d => [d.colorStart, d.colorEnd])
      .arcStroke(d => d.stroke)
      .arcDashLength(d => d.dashLength)
      .arcDashGap(0.9)
      .arcDashAnimateTime(d => d.animationDuration)
      .arcDashInitialGap(() => 0)
      .pointsData(structures)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointsTransitionDuration(0)
      .pointAltitude(d => Math.sqrt(d.population) * 0.00001)
      .pointColor((d, i) => interpolateColor(i / structures.length))
      .pointRadius(0.4)
      .pointLabel(d => `${d.name} — ${d.city}, ${d.country}`)
      .enablePointerInteraction(true)
      .onPointClick(d => {
        handleClickStick(d);
        console.log("Point cliqué :", d);
      })
      .onPointHover((point, event) => {
        if (point) {
          setHoveredStructure(point);
          if (event) {
            setMousePosition({ x: event.clientX, y: event.clientY });
          }
        } else {
          setHoveredStructure(null);
        }
      });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.1;
    globeInstance.current = globe;
    globeInstance.current.camera().position.z = 500;

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
      sticks.forEach((obj, index) => {
        const structure = structures[index];
        if (!structure) return;
        obj.raycast = () => { };

        if (glowAllowedIds.has(structure.id)) {
          obj.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xFFBC00),
            emissive: new THREE.Color(0xFFBC00),
            emissiveIntensity: 5,
            metalness: 0.7,
            roughness: 0.05,
            transparent: true,
            opacity: 1.0,
            depthWrite: false,
          });

          const glowGeometry = obj.geometry.clone();
          glowGeometry.scale(2, 2, 1.5);

          const glowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xFFBC00),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });

          const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
          glowMesh.position.copy(obj.position);
          glowMesh.quaternion.copy(obj.quaternion);
          glowMesh.raycast = () => { };

          scene.add(glowMesh);
        }
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

  const handleClick = async (messageId) => {
    try {
      const messageOpt = messageOptions.find(m => m.id === messageId);
      if (!messageOpt) return;

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error('Aucun utilisateur stocké');
        return;
      }

      const { id: userId } = JSON.parse(storedUser);

      const userRes = await fetch(`http://localhost/users/${userId}`);
      const userData = await userRes.json();
      const structureId = userData.structure_id;

      const postRes = await fetch('http://localhost/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageOpt.text,
          structure_id: structureId
        })
      });

      if (!postRes.ok) {
        const errorText = await postRes.text();
        throw new Error(`Erreur création message : ${postRes.status} - ${errorText}`);
      }

      let postData = null;
      const contentType = postRes.headers.get("content-type");
      const contentLength = postRes.headers.get("content-length");

      if (
        contentType && contentType.includes("application/json") &&
        contentLength !== "0"
      ) {
        postData = await postRes.json();
      }

      console.log('Message créé avec succès:', postData ?? '[Pas de contenu JSON]');
      
      await fetchMessages(); // RECHARGE depuis backend

    } catch (error) {
      console.error('Erreur lors du clic sur message :', error);
    }
  };

  // Charger les messages au montage
  useEffect(() => {
    fetchMessages();
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
        <div className='globeMsg'
          key={msg.id}
          ref={el => labelRefs.current[index] = el}
          style={{ // WILLIAM BOUTONS AUTOUR DE LA PLANETE 
            position: 'absolute',
            width: 'auto',
            maxWidth: '40%',
            ...fixedPositions[index % fixedPositions.length],
            transform: 'translateY(0)',
            padding: '6px 14px',
            fontSize: '0.75em',
            background: 'radial-gradient(100.71% 141.42% at 0% 0%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.2) 100%)',
            borderRadius: '4px',
            color: '#fff',
            wordWrap: 'break-word',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <span>{msg.text}</span><br />
          <span style={{ fontSize: '0.75em' }}>
            {msg.structure}  {msg.country}
          </span>
        </div>
      ))}

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
              className='btnMsg'
              key={opt.id}
              onClick={() => handleClick(opt.id)}
              style={{ //WILLIAAAN BOUTONS EN BAS
                fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                padding: 'clamp(3px, 0.5vw, 4px) clamp(8px, 1.5vw, 12px)',
                cursor: 'pointer',
                borderRadius: '4px',
                background: 'radial-gradient(100.71% 141.42% at 0% 0%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.06) 100%)',
                color: '#fff',
                transition: 'all 0.3s ease-in-out',
              }}
            //   onMouseOver={e => e.currentTarget.style.backgroundColor = '#f90073', e.currentTarget.style.color = 'white'}
            //   onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#f90073'}
            >
              {opt.text}
            </button>
          ))}
      </div>
    </div>
  );
};

export default GlobeScene;
