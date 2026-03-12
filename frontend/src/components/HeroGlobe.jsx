import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as topojson from 'topojson-client';
import * as THREE from 'three';

const EARTH_RADIUS_KM = 6371;

const SAT_COUNT = 200; // limit for performance

function parseTLE(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
  const records = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    try {
      const name = lines[i];
      const satrec = satellite.twoline2satrec(lines[i + 1], lines[i + 2]);
      if (satrec) records.push({ name, satrec });
    } catch (e) { /* skip bad entries */ }
  }
  return records;
}

function propagate(records) {
  const now = new Date();
  const gmst = satellite.gstime(now);
  return records.map(({ name, satrec }) => {
    try {
      const pv = satellite.propagate(satrec, now);
      if (!pv.position || typeof pv.position === 'boolean') return null;
      const geo = satellite.eciToGeodetic(pv.position, gmst);
      return {
        name,
        lat: satellite.degreesLat(geo.latitude),
        lng: satellite.degreesLong(geo.longitude),
        alt: Math.log10(1 + geo.height / 300) * 0.12,
      };
    } catch (e) { return null; }
  }).filter(Boolean);
}

function parseFlights(data) {
  if (!Array.isArray(data)) return [];
  return data.map(([lng, lat]) => ({
    name: '',
    lat,
    lng,
    alt: 0.012,
    type: 'flight',
  }));
}

const HeroGlobe = () => {
  const globeRef = useRef();
  const containerRef = useRef();
  const satRecordsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const rafRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [satPositions, setSatPositions] = useState([]);
  const [flights, setFlights] = useState([]);
  const [dims, setDims] = useState({ w: 420, h: 420 });
  const [visitorCoords, setVisitorCoords] = useState(null);
  const readyFlags = useRef({ countries: false, sats: false, flights: false });

  const checkReady = useCallback(() => {
    const { countries, sats, flights } = readyFlags.current;
    if (countries && sats && flights) {
      window.dispatchEvent(new Event('globe-ready'));
    }
  }, []);

  // Geolocate visitor by IP for initial globe orientation
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          setVisitorCoords({ lat: data.latitude, lng: data.longitude });
        }
      })
      .catch(() => {}); // Silent fail — falls back to default view
  }, []);

  // Measure container for responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse parallax + scroll animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouse = (e) => {
      // Normalize mouse to -1..1 relative to viewport center
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    let currentX = 0, currentY = 0, currentScroll = 0;

    const animate = () => {
      // Smooth lerp toward target
      currentX += (mouseRef.current.x - currentX) * 0.06;
      currentY += (mouseRef.current.y - currentY) * 0.06;
      currentScroll += (scrollRef.current - currentScroll) * 0.1;

      // Mouse parallax: subtle shift + rotation
      const tx = currentX * 12;
      const ty = currentY * 8;
      const rx = -currentY * 3;
      const ry = currentX * 3;

      // Scroll: slight scale up + vertical drift + fade
      const scrollPx = Math.min(currentScroll, window.innerHeight);
      const scrollPct = scrollPx / window.innerHeight;
      const scale = 1 + scrollPct * 0.05;
      const scrollY = scrollPct * 40;
      const opacity = 0.85 * (1 - scrollPct * 0.5);

      el.style.transform = `translate(${tx}px, ${ty + scrollY}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      el.style.opacity = opacity;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Point globe at visitor's country once geolocation resolves
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !visitorCoords) return;
    globe.pointOfView({ lat: visitorCoords.lat, lng: visitorCoords.lng, altitude: 2.5 }, 1500);
  }, [visitorCoords]);

  // Configure globe controls + add planet glow
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    // Default view — overridden by geolocation when it resolves
    globe.pointOfView({ lat: 25, lng: 30, altitude: 2.5 });

    // Rim glow — subtle amber light at the edges
    const rimGeo = new THREE.SphereGeometry(101, 64, 64);
    const rimMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#E8922A') },
        intensity: { value: 0.12 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = pow(rim, 3.0) * intensity;
          gl_FragColor = vec4(glowColor, glow);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    globe.scene().add(rimMesh);

    // Surface glow — soft ambient light across the visible face
    const surfGeo = new THREE.SphereGeometry(99.5, 64, 64);
    const surfMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#E8922A') },
        intensity: { value: 0.15 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float facing = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = facing * intensity;
          gl_FragColor = vec4(glowColor, glow);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const surfMesh = new THREE.Mesh(surfGeo, surfMat);
    globe.scene().add(surfMesh);

    return () => {
      globe.scene().remove(rimMesh);
      globe.scene().remove(surfMesh);
      rimGeo.dispose(); rimMat.dispose();
      surfGeo.dispose(); surfMat.dispose();
    };
  }, []);

  // Load country polygons
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/world-110m.json`)
      .then(r => r.json())
      .then(topo => {
        setCountries(topojson.feature(topo, topo.objects.countries).features);
        readyFlags.current.countries = true;
        checkReady();
      })
      .catch(() => { readyFlags.current.countries = true; checkReady(); });
  }, []);

  // Load satellite TLE data and propagate positions
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/satellites.tle`)
      .then(r => r.text())
      .then(text => {
        const records = parseTLE(text).slice(0, SAT_COUNT);
        satRecordsRef.current = records;
        setSatPositions(propagate(records));
        readyFlags.current.sats = true;
        checkReady();
      })
      .catch(() => { readyFlags.current.sats = true; checkReady(); });

    const interval = setInterval(() => {
      if (satRecordsRef.current.length > 0) {
        setSatPositions(propagate(satRecordsRef.current));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Load flight position data
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/flights.json`)
      .then(r => r.json())
      .then(data => {
        setFlights(parseFlights(data));
        readyFlags.current.flights = true;
        checkReady();
      })
      .catch(() => { readyFlags.current.flights = true; checkReady(); });
  }, []);

  // Combine satellites + flights into one objectsData array
  const objectsData = useMemo(() => [
    ...satPositions.map(s => ({ ...s, type: 'sat' })),
    ...flights,
  ], [satPositions, flights]);


  // Dark globe surface
  const globeMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({ color: '#0c0b09', transparent: true, opacity: 0.85 }),
  []);

  // Glowing dot texture for satellites
  const glowTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(232,146,42,1)');
    gradient.addColorStop(0.25, 'rgba(232,146,42,0.8)');
    gradient.addColorStop(0.5, 'rgba(232,146,42,0.2)');
    gradient.addColorStop(1, 'rgba(232,146,42,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Smaller, warmer glow for flights
  const flightTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(240,220,180,1)');
    gradient.addColorStop(0.2, 'rgba(240,200,140,0.6)');
    gradient.addColorStop(0.5, 'rgba(232,146,42,0.15)');
    gradient.addColorStop(1, 'rgba(232,146,42,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const renderObject = useCallback((d) => {
    if (d.type === 'flight') {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: flightTexture,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        })
      );
      sprite.scale.set(1.5, 1.5, 1);
      return sprite;
    }
    // Satellite
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      })
    );
    sprite.scale.set(3.5, 3.5, 1);
    return sprite;
  }, [glowTexture, flightTexture]);

  // City points
  const cities = useMemo(() => [
    { lat: 51.5, lng: -0.12, name: 'London' },
    { lat: 48.85, lng: 2.35, name: 'Paris' },
    { lat: 40.71, lng: -74.01, name: 'New York' },
    { lat: 35.68, lng: 139.69, name: 'Tokyo' },
    { lat: 55.75, lng: 37.62, name: 'Moscow' },
    { lat: -33.87, lng: 151.21, name: 'Sydney' },
    { lat: 1.35, lng: 103.82, name: 'Singapore' },
    { lat: 25.2, lng: 55.27, name: 'Dubai' },
    { lat: 39.9, lng: 116.4, name: 'Beijing' },
    { lat: 28.61, lng: 77.21, name: 'Delhi' },
    { lat: -23.55, lng: -46.63, name: 'Sao Paulo' },
    { lat: 30.04, lng: 31.24, name: 'Cairo' },
  ], []);

  // Arcs between cities
  const arcsData = useMemo(() => {
    const pairs = [[0,2],[0,4],[2,7],[3,6],[5,8],[1,9],[7,9],[10,2],[11,7]];
    return pairs.map(([a, b]) => ({
      startLat: cities[a].lat, startLng: cities[a].lng,
      endLat: cities[b].lat, endLng: cities[b].lng,
    }));
  }, [cities]);

  return (
    <div ref={containerRef} className="hero-globe">
      <Globe
        ref={globeRef}
        width={dims.w}
        height={dims.h}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        atmosphereColor="rgba(232,146,42,0.1)"
        atmosphereAltitude={0.45}
        showGraticules={true}

        // Country polygons
        polygonsData={countries}
        polygonCapColor={() => 'rgba(232,146,42,0.18)'}
        polygonSideColor={() => 'rgba(232,146,42,0.06)'}
        polygonStrokeColor={() => 'rgba(232,146,42,0.3)'}
        polygonAltitude={0.005}

        // City dots
        pointsData={cities}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#E8922A'}
        pointAltitude={0.01}
        pointRadius={0.15}

        // Data arcs
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => ['rgba(232,146,42,0.25)', 'rgba(92,58,14,0.15)']}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={4000}
        arcStroke={0.3}

        // Live satellites + flights
        objectsData={objectsData}
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectThreeObject={renderObject}
        objectLabel="name"
        objectsTransitionDuration={3000}

        animateIn={true}
      />
    </div>
  );
};

export default HeroGlobe;
