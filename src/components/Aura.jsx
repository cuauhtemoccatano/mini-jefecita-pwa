import React, { useEffect, useState } from 'react';
import { useStore } from '../js/store/useStore';

/**
 * Aura (v4.0.0) - React Edition
 * Maneja la atmósfera dinámica del sistema.
 */
export default function Aura() {
  const { userData, healthData, activeView } = useStore();
  const [moodState, setMoodState] = useState({
    color: '#00C4B4',
    mood: 'default',
    speed: '25s',
    blur: '120px'
  });

  useEffect(() => {
    const hour = new Date().getHours();
    let color = '#00C4B4'; 
    let mood = 'default';
    let speed = '25s';
    let blur = '120px';

    // Lógica circadiana
    if (hour >= 6 && hour < 12) { color = '#00E5FF'; mood = 'morning'; speed = '20s'; }
    else if (hour >= 12 && hour < 18) { color = '#FFB300'; mood = 'energy'; speed = '15s'; }
    else if (hour >= 18 && hour < 22) { color = '#9575CD'; mood = 'introspection'; speed = '35s'; }
    else { color = '#1A237E'; mood = 'calm'; speed = '45s'; blur = '160px'; }

    // Lógica de estrés (HRV)
    const currentHRV = healthData?.hrv ?? 70;
    if (currentHRV < 45) {
      color = '#00C4B4'; mood = 'calm'; speed = '50s'; blur = '200px';
    }

    // Lógica por vista
    if (activeView === 'diario') { color = '#7E57C2'; mood = 'introspection'; speed = '40s'; }
    if (activeView === 'ejercicio') { color = '#FF7043'; mood = 'energy'; speed = '10s'; blur = '80px'; }
    if (activeView === 'zen') { color = '#00C4B4'; mood = 'calm'; speed = '40s'; }

    const primaryColor = userData.auraColor || color;
    
    // Aplicar variables CSS globales
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--aura-glow', `${primaryColor}33`);
    
    // Calcular contraste APCA-like simple
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 196, b: 180 };
    };

    const rgb = hexToRgb(primaryColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const contrastColor = brightness > 165 ? '#000000' : '#FFFFFF';
    document.documentElement.style.setProperty('--primary-contrast', contrastColor);
    document.documentElement.style.setProperty('--secondary-text', brightness > 165 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)');

    setMoodState({ color: primaryColor, mood, speed, blur });
  }, [userData.auraColor, healthData.hrv, activeView]);

  return (
    <div 
      className="aura-container" 
      data-mood={moodState.mood}
      style={{
        '--aura-speed': moodState.speed,
        '--aura-blur': moodState.blur
      }}
    >
      <div className="aura-blob aura-1"></div>
      <div className="aura-blob aura-2"></div>
      <div className="aura-blob aura-3"></div>
    </div>
  );
}
