// ---------------------------------------------------------
// js/santuario.js - Inmersión 3D y Sonido
// ---------------------------------------------------------
import { triggerHaptic } from './ui_engine.js';

export const ZenAudio = {
    ctx: null,
    unlock() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    playCrystal(freq = 440) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
};

let zen3DRenderer, zen3DScene, zen3DCamera, zen3DActive = false;
let crystals = [];

export function initZenMode() {
    const portal = document.getElementById('btn-zen-portal');
    const zenView = document.getElementById('view-zen');

    portal?.addEventListener('click', () => {
        triggerHaptic('light');
        ZenAudio.unlock();
        zenView?.classList.add('active');
        zen3DActive = true;
        if (!zen3DRenderer) init3DScene();
    });

    document.getElementById('btn-exit-zen')?.addEventListener('click', () => {
        zenView?.classList.remove('active');
        zen3DActive = false;
    });
}

async function init3DScene() {
    const canvas = document.getElementById('zen-3d-canvas');
    if (!canvas) return;

    // Lazy load Three.js solo cuando se necesita
    if (!window.THREE) {
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
    zen3DScene = new THREE.Scene();
    zen3DCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    zen3DCamera.position.z = 5;
    zen3DRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    zen3DRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Simple icosahedron logic from legacy
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1,0), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
    zen3DScene.add(mesh);
    zen3DScene.add(new THREE.AmbientLight(0x404040, 2));
    crystals.push(mesh);
    
    const anim = () => {
        if (!zen3DActive) return;
        requestAnimationFrame(anim);
        mesh.rotation.y += 0.01;
        zen3DRenderer.render(zen3DScene, zen3DCamera);
    };
    anim();
}
