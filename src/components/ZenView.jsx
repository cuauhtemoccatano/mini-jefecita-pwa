import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2, Wind } from 'lucide-react';
import { useStore } from '../js/store/useStore';
import * as THREE from 'three';

/**
 * ZenView (v4.0.0) - React Edition
 * Inmersión 3D minimalista para meditación.
 */
export default function ZenView() {
  const { setView } = useStore();
  const canvasRef = useRef(null);
  const [audioCtx, setAudioCtx] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 0), 
      new THREE.MeshPhongMaterial({ 
        color: 0x00C4B4, 
        transparent: true, 
        opacity: 0.4,
        wireframe: true 
      })
    );
    scene.add(mesh);
    
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const playCrystal = () => {
    let ctx = audioCtx;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(ctx);
    }
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
    
    if (window.navigator?.vibrate) window.navigator.vibrate(5);
  };

  return (
    <div className="fixed inset-0 z-[8000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={playCrystal}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-12 pointer-events-none">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extralight text-white tracking-[0.3em] uppercase">Santuario</h2>
          <p className="text-xs text-primary font-bold tracking-[0.5em] uppercase animate-pulse">Momento de Calma</p>
        </div>

        <div className="flex gap-8 pointer-events-auto">
          <button 
            className="p-6 rounded-full bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
            onClick={playCrystal}
          >
            <Wind size={32} />
          </button>
        </div>
      </div>

      <button 
        className="absolute top-10 right-10 p-4 text-white/50 hover:text-white transition-colors"
        onClick={() => setView('inicio')}
      >
        <X size={32} />
      </button>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] tracking-[0.4em] uppercase">
        Toca el cristal para resonar
      </div>
    </div>
  );
}
