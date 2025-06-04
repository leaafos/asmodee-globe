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
  { top: '24%', right: '11%' },
  { top: '43%', right: '4%' },
  { top: '64%', right: '11%' },
  { top: '30%', left: '11%' },
  { top: '50%', left: '6%' },
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

      sticks.forEach((obj, index) => {
        const structure = structures[index];
        if (!structure) return;
        obj.raycast = () => {};

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
          glowMesh.raycast = () => {};

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

  return (
    <div id='mapContainer' ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="scene-container">
        <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default GlobeScene;