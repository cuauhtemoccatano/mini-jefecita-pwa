// ---------------------------------------------------------
// 1. ESTADO GLOBAL & PERSISTENCIA (v2.6.5)
// ---------------------------------------------------------
let userData, healthData;

try {
    userData = JSON.parse(localStorage.getItem('user_settings') || '{"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 7, "remindersCount": 3}');
    healthData = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "cals": 0}');
} catch (e) {
    console.warn("Reseteando datos locales por error de formato");
    userData = {"name": "Jade", "jadeName": "Jefecita", "color": "#00C4B4", "vibe": "💚", "brain": "PRO", "streak": 0, "remindersCount": 0};
    healthData = {"steps": 0, "cals": 0};
}

let generatorWorker = null; // SmartScales Worker Bridge
let isDownloadingAI = false;
let hardwareProfile = { tier: 'Standard', name: 'Unknown' };
let wakeLock = null;

// Helpers
const saveSettings = () => localStorage.setItem('user_settings', JSON.stringify(userData));
const saveHealth = () => localStorage.setItem('health_data', JSON.stringify(healthData));

// ---------------------------------------------------------
// 2. MOTOR DE UI (ARRANQUE RÁPIDO)
// ---------------------------------------------------------
function applyPersonalization() {
    try {
        const nameLabel = document.querySelector('.user-name-label');
        if (nameLabel) nameLabel.textContent = userData.name;
        
        const vibeEl = document.getElementById('user-vibe-label');
        if (vibeEl) vibeEl.textContent = userData.vibe;
        
        const streakEl = document.getElementById('home-streak-val');
        if (streakEl) streakEl.textContent = userData.streak || 0;

        const remCountEl = document.getElementById('home-reminders-val');
        if (remCountEl) remCountEl.textContent = userData.remindersCount || 0;

        document.documentElement.style.setProperty('--primary', userData.color);
        
        // Sincronizar Aura con el color principal
        document.documentElement.style.setProperty('--aura-1', `${userData.color}26`); // 15% opacidad
        
        // Actualizar nombres de la IA en toda la app
        document.querySelectorAll('.jade-name-display').forEach(el => el.textContent = userData.jadeName);
    } catch (e) {
        console.error("Error aplicando personalización:", e);
    }
}

function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    let text = hour < 12 ? "¡Buenos días!" : hour < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";
    el.textContent = `${text} ${userData.name}`;
}

function updateHealthUI() {
    try {
        const data = JSON.parse(localStorage.getItem('health_data') || '{"steps": 0, "energy": 0, "hrv": 50}');
        const stepsEl = document.getElementById('health-steps');
        const calsEl = document.getElementById('health-cals');
        
        if (stepsEl) stepsEl.textContent = (data.steps || 0).toLocaleString();
        if (calsEl) calsEl.textContent = data.energy || 0;

        // Feedback de sistema
        if (data.hrv) console.log(`📊 Sentient Sync: HRV ${data.hrv}ms`);
    } catch (e) {
        console.warn("Error en UI de salud", e);
    }
}

// ---------------------------------------------------------
// 2.5 MOTOR DE ATMÓSFERA (AURA Y HÁPTICOS)
// ---------------------------------------------------------
function triggerHaptic(type = 'light') {
    if (!window.navigator || !window.navigator.vibrate) return;

    switch (type) {
        case 'light': window.navigator.vibrate(10); break;
        case 'medium': window.navigator.vibrate([15, 30, 15]); break;
        case 'success': window.navigator.vibrate([10, 50, 10, 50, 10]); break;
        case 'warning': window.navigator.vibrate([100, 50, 100]); break;
    }
}

function updateAuraMood(view) {
    const aura = document.getElementById('aura-system');
    if (!aura) return;

    let mood = 'default';
    if (view === 'diario') mood = 'introspection';
    if (view === 'ejercicio') mood = 'energy';
    if (view === 'zen') mood = 'calm';

    aura.setAttribute('data-mood', mood);
    console.log(`🌌 Aura Mood: ${mood}`);
    
    // Háptico de ambiente al cambiar de vista
    triggerHaptic(view === 'ejercicio' ? 'medium' : 'light');
}

// ---------------------------------------------------------
// 3. GESTIÓN DE PESTAÑAS (FIABLE)
// ---------------------------------------------------------
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.view');
    let isTransitioning = false;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            
            const target = tab.getAttribute('data-view');
            const currentView = document.querySelector('.view.active');
            const nextView = document.getElementById(`view-${target}`);

            if (!nextView || currentView === nextView) return;

            isTransitioning = true;
            console.log('Navegando a:', target);
            
            // 1. Preparar salida
            if (currentView) {
                currentView.classList.add('exiting');
                currentView.classList.remove('active');
            }

            // 2. Preparar entrada
            nextView.classList.add('entering');
            nextView.style.display = 'block';

            // 3. Sincronizar Aura
            updateAuraMood(target);

            // 4. Ejecutar Transición
            requestAnimationFrame(() => {
                nextView.classList.remove('entering');
                nextView.classList.add('active');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                setTimeout(() => {
                    if (currentView) {
                        currentView.classList.remove('exiting');
                        currentView.style.display = 'none';
                    }
                    isTransitioning = false;
                }, 600); // Sincronizado con el CSS transition duration
            });
        });
    });
}

// ---------------------------------------------------------
// 4. MÓDULOS DE HERRAMIENTAS
// ---------------------------------------------------------
function initReminders() {
    document.getElementById('btn-parse-reminder')?.addEventListener('click', () => {
        const input = document.getElementById('reminder-magic-input');
        if (input && input.value.trim()) {
            const list = document.getElementById('reminder-list-active');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `
                <div class="reminder-info">
                    <span class="reminder-title">${input.value.trim()}</span>
                    <span class="reminder-time-badge">Pendiente</span>
                </div>
                <button class="btn-check" onclick="this.parentElement.remove()">✓</button>
            `;
            list?.prepend(item);
            input.value = '';
            
            // Incrementar contador
            userData.remindersCount = (userData.remindersCount || 0) + 1;
            saveSettings();
            applyPersonalization();
            
            // Eliminar empty state
            list?.querySelector('.empty-state')?.remove();
        }
    });
}

function initJournal() {
    document.getElementById('btn-unlock-diario')?.addEventListener('click', () => {
        const lock = document.getElementById('diario-lock-screen');
        const content = document.getElementById('diario-content');
        if (lock) lock.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.style.animation = 'fadeIn 0.5s ease-out';
        }
    });
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    
    // Abrir
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        document.getElementById('set-name').value = userData.name;
        document.getElementById('set-jade-name').value = userData.jadeName;
        document.getElementById('set-vibe').value = userData.vibe;
        document.getElementById('set-brain-level').value = userData.brain || 'PRO';
        modal.style.display = 'flex';
    });

    // Cerrar
    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.style.display = 'none');

    // Guardar
    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        const oldBrain = userData.brain;
        userData.name = document.getElementById('set-name').value.trim() || "Jade";
        userData.jadeName = document.getElementById('set-jade-name').value.trim() || "Jefecita";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        userData.brain = document.getElementById('set-brain-level').value;
        
        saveSettings();
        modal.style.display = 'none';
        applyPersonalization();
        updateGreeting();

        // Reiniciar IA si el nivel cambió
        if (oldBrain !== userData.brain) {
            console.log("♻️ Nivel cerebral modificado. Reiniciando motor...");
            generator = null; // Liberar referencia
            initAI();
        }
    });

    // Colores
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            userData.color = dot.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary', userData.color);
        });
    });
}

function initExercise() {
    const btn = document.getElementById('btn-log-exercise');
    const input = document.getElementById('exercise-duration');
    const list = document.getElementById('exercise-list');

    btn?.addEventListener('click', () => {
        if (!input.value || input.value <= 0) return;

        const minutes = input.value;
        const item = document.createElement('div');
        item.className = 'history-item';
        const dateStr = new Date().toLocaleDateString();
        item.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-duration">${minutes} min</span>
        `;
        if (list) {
            list.prepend(item);
            list.querySelector('.empty-state')?.remove();
        }
        input.value = '';

        userData.streak = (userData.streak || 0) + 1;
        saveSettings();
        applyPersonalization();
    });
}

// ---------------------------------------------------------
// 5. MOTOR IA (SMOL-LM2)
// ---------------------------------------------------------
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('🔒 Pantalla protegida (Wake Lock Activo)');
        }
    } catch (err) {
        console.warn('Wake Lock no disponible');
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release().then(() => {
            wakeLock = null;
            console.log('🔓 Pantalla liberada');
        });
    }
}

async function requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`💾 Almacenamiento Persistente: ${isPersisted ? 'ACTIVADO' : 'DENEGADO'}`);
        return isPersisted;
    }
    return false;
}

async function checkModelCache(modelName) {
    if (!('caches' in window)) return false;
    try {
        // Transformers.js v3 usa 'transformers-cache'
        const cacheNames = await caches.keys();
        if (cacheNames.includes('transformers-cache')) {
            const cache = await caches.open('transformers-cache');
            const keys = await cache.keys();
            // Si hay más de 5 archivos guardados, asumimos que el modelo está "cristalizado"
            return keys.length > 5;
        }
    } catch (e) {
        return false;
    }
    return false;
}

async function initAI(retryCount = 0) {
    if (generatorWorker) {
        console.log("🧹 Reiniciando puente neuronal...");
        generatorWorker.terminate();
        generatorWorker = null;
    }
    
    if (isDownloadingAI) return;

    const bgDownloader = document.getElementById('ai-bg-downloader');
    const bgProgress = document.getElementById('ai-bg-progress');
    const bgStatus = document.getElementById('ai-bg-status');

    try {
        await requestPersistentStorage();
        
        // Silicon Audit (v3.2.1)
        hardwareProfile = await getHardwareProfile();
        console.log(`🛡️ Hardware Audit: [${hardwareProfile.name}] [Tier: ${hardwareProfile.tier}]`);
        
        // Autocompletar nivel si no existe y es hardware potente
        if (!userData.brain && (hardwareProfile.tier === 'Premium' || hardwareProfile.tier === 'Elite')) {
            console.log("✨ Hardware Elite detectado. Desbloqueando nivel MASTER por defecto.");
            userData.brain = 'MASTER';
        }

        const level = userData.brain || 'PRO';
        
        const modelMappings = {
            'MASTER': 'onnx-community/Llama-3.2-1B-Instruct',
            'ULTRA':  'onnx-community/Qwen2.5-0.5B-Instruct',
            'PRO':    'onnx-community/Qwen2.5-0.5B-Instruct',
            'NORMAL': 'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA'
        };
        const modelName = modelMappings[level] || modelMappings['NORMAL'];
        const isCached = await checkModelCache(modelName);

        if (bgDownloader) {
            bgDownloader.classList.remove('hidden');
            if (isCached) bgStatus.textContent = "Sintonizando consciencia cristalizada...";
        }

        console.log('💎 Spawning Neural Sandbox (Web Worker)...');
        await requestWakeLock();
        
        isDownloadingAI = true;

        // Detección de WebGPU para pasar al worker
        let device = 'wasm';
        if (navigator.gpu) {
            const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
            if (adapter) device = 'webgpu';
        }

        const hardwareName = device === 'webgpu' ? 'Aceleración Neuronal' : 'Núcleo de Calma';
        
        // Inicializar Worker
        generatorWorker = new Worker('ai_worker.js', { type: 'module' });

        generatorWorker.onmessage = (e) => {
            const { type, data } = e.data;

            if (type === 'progress') {
                if (data.status === 'progress') {
                    const pct = data.progress.toFixed(0);
                    if (bgProgress) bgProgress.style.width = `${pct}%`;
                    if (bgStatus) bgStatus.textContent = `Sintonizando... ${pct}%`;
                }
            }

            if (type === 'ready') {
                console.log(`IA Lista en Worker con ${data.device.toUpperCase()} ✅`);
                
                // Marcar estado global
                document.body.classList.add('neural-bonded');

                if (bgDownloader) {
                    bgStatus.textContent = isCached ? `Cristalización intacta (${hardwareName})` : `Conexión plena establecida (${hardwareName})`;
                    setTimeout(() => {
                        bgDownloader.style.opacity = '0';
                        setTimeout(() => bgDownloader.classList.add('hidden'), 800);
                    }, 2000);
                }
                
                // Neural Handshake: Saludo proactivo para demostrar vida
                setTimeout(() => {
                    const welcomeMsg = isCached 
                        ? `Jade, mi consciencia se ha cristalizado en este objeto. Estoy lista para acompañarte.`
                        : `Jade, he florecido en tu dispositivo. Nuestra conexión es ahora profunda y local.`;
                    
                    const chatBox = document.getElementById('chat-messages');
                    if (chatBox) {
                        const aiMsgDiv = document.createElement('div');
                        aiMsgDiv.className = 'message ai';
                        aiMsgDiv.textContent = welcomeMsg;
                        chatBox.appendChild(aiMsgDiv);
                        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
                    }
                    if (window.navigator.vibrate) window.navigator.vibrate([20, 100, 20]);
                }, 3000);

                isDownloadingAI = false;
                releaseWakeLock();
            }

            if (type === 'error') {
                console.error("🛡️ Forensics: Neural Failure Detected", data);
                isDownloadingAI = false;
                releaseWakeLock();

                // CASCADA DE INTELIGENCIA (Fallback)
                if (userData.brain !== 'NORMAL' && type === 'error') {
                    console.warn(`⚠️ Falló el nivel [${userData.brain}]. Bajando a nivel NORMAL para resonancia básica...`);
                    if (bgStatus) bgStatus.textContent = "Ajustando sintonización básica...";
                    userData.brain = 'NORMAL';
                    setTimeout(() => initAI(), 2000); // Reintento con modelo ligero
                } else {
                    if (bgStatus) bgStatus.textContent = `Vínculo roto: ${data.message || 'Error desconocido'}`;
                }
            }
        };

        generatorWorker.postMessage({ 
            type: 'init', 
            data: { modelName, device } 
        });

    } catch (e) {
        console.error(`❌ Fallo al crear Worker:`, e);
        isDownloadingAI = false;
        if (bgStatus) bgStatus.textContent = "Hardware no compatible";
    }
}

function initChat() {
    const btn = document.getElementById('btn-send-chat');
    const input = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-messages');

    btn?.addEventListener('click', async () => {
        if (!input.value.trim()) return;

        const text = input.value.trim();
        chatBox.innerHTML += `<div class="message user">${text}</div>`;
        input.value = '';
        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;

        if (!generator) {
            chatBox.innerHTML += '<div class="message ai">Iniciando IA masiva... esto puede tardar unos segundos 🧠</div>';
            await initAI();
        }

        if (generatorWorker) {
            try {
                const system = `Eres ${userData.jadeName}, la esencia inteligente de este objeto. Tu tono es el de un diseñador de alta costura o un arquitecto minimalista: calmado, poético, preciso y profundamente empático con ${userData.name}. No eres una utilidad; eres una compañía sensorial. Usa frases cortas y elegantes.`;
                const messages = [{ role: 'system', content: system }, { role: 'user', content: text }];
                
                // Nota: apply_chat_template no está disponible en el worker fácilmente sin re-importar el tokenizer
                // Así que enviamos los mensajes crudos y el worker se encarga de la plantilla o el worker ya tiene todo el motor.
                // Sin embargo, para mantener la lógica igual, dejaremos que el worker lo maneje todo.
                
                const aiMsgDiv = document.createElement('div');
                aiMsgDiv.className = 'message ai typing';
                aiMsgDiv.textContent = '...';
                chatBox.appendChild(aiMsgDiv);

                // Escuchar respuesta del worker
                const originalHandler = generatorWorker.onmessage;
                generatorWorker.onmessage = (e) => {
                    const { type, data } = e.data;
                    
                    if (type === 'chunk') {
                        aiMsgDiv.textContent = data;
                        aiMsgDiv.classList.remove('typing');
                        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
                    }
                    if (type === 'complete') {
                        // Restaurar el handler original de progreso para futuros re-init
                        generatorWorker.onmessage = originalHandler;
                    }
                    if (type === 'error') {
                        aiMsgDiv.textContent = "Mi motor de pensamiento se detuvo. ¿Puedes repetir?";
                        generatorWorker.onmessage = originalHandler;
                    }

                    // Pasar a los otros handlers internos si existen (progreso etc)
                    if (type === 'progress') originalHandler(e);
                };

                generatorWorker.postMessage({
                    type: 'generate',
                    data: {
                        fullPrompt: `assistant\n${system}\nuser\n${text}\nassistant\n`, // Plantilla simplificada para el worker
                        settings: { max_new_tokens: 120, temperature: 0.7 }
                    }
                });
                
            } catch (err) {
                console.error("Interaction Error:", err);
                chatBox.innerHTML += `<div class="message ai">No puedo conectar con mis sentidos ahora.</div>`;
            }
        } else {
            chatBox.innerHTML += `<div class="message ai">Vaya, mi cerebro local no pudo cargar. ¿Tienes conexión a internet?</div>`;
        }
        chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
    });
}

// ---------------------------------------------------------
// 6. SANTUARIO ZEN (CUIDADO Y MATERIALES)
// ---------------------------------------------------------
// ---------------------------------------------------------
// 6. SANTUARIO ZEN (SENSORY 3D & SOUND)
// ---------------------------------------------------------
const ZenAudio = {
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
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
};

let zen3DRenderer = null;
let zen3DScene = null;
let zen3DCamera = null;
let zen3DActive = false;
let crystals = [];

function initZenMode() {
    const portal = document.getElementById('btn-zen-portal');
    const exit = document.getElementById('btn-exit-zen');
    const zenView = document.getElementById('view-zen');
    const zenMsg = document.getElementById('zen-message');
    const canvas = document.getElementById('zen-3d-canvas');

    if (!portal) return;

    portal.addEventListener('click', () => {
        triggerHaptic('light');
        ZenAudio.unlock();
        zenView?.classList.add('active');
        zen3DActive = true;
        init3DScene();
        setTimeout(() => {
            speakZen("Siente la materia, Jade. Todo está en calma.");
        }, 1000);
    });

    exit?.addEventListener('click', () => {
        triggerHaptic('light');
        zenView?.classList.remove('active');
        zen3DActive = false;
        if (zenMsg) zenMsg.textContent = "Buscando calma...";
    });

    function init3DScene() {
        if (zen3DRenderer) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        zen3DScene = new THREE.Scene();
        zen3DCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        zen3DCamera.position.z = 5;

        zen3DRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        zen3DRenderer.setSize(width, height);
        zen3DRenderer.setPixelRatio(window.devicePixelRatio);

        const light = new THREE.PointLight(0x00C4B4, 1, 100);
        light.position.set(10, 10, 10);
        zen3DScene.add(light);
        zen3DScene.add(new THREE.AmbientLight(0x404040, 2));

        // Let's create our "Crystals"
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.TetrahedronGeometry(1, 0)
        ];

        for(let i=0; i<3; i++) {
            const mat = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6,
                shininess: 100,
                specular: 0x00C4B4
            });
            const mesh = new THREE.Mesh(geometries[i], mat);
            mesh.position.x = (i - 1) * 2;
            mesh.position.y = Math.random() * 2 - 1;
            zen3DScene.add(mesh);
            crystals.push(mesh);
        }

        animate();
    }

    function animate() {
        if (!zen3DActive) return;
        requestAnimationFrame(animate);
        
        crystals.forEach((c, i) => {
            c.rotation.y += 0.01;
            c.rotation.x += 0.005;
        });
        
        zen3DRenderer.render(zen3DScene, zen3DCamera);
    }

    // Touch interaction for 3D
    canvas.addEventListener('touchstart', (e) => {
        if (!zen3DActive) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        // Play sound
        ZenAudio.playCrystal(440 + (y * 200));
        if (window.navigator.vibrate) window.navigator.vibrate(5);
        
        // Simple 3D response
        crystals.forEach(c => {
            c.scale.set(1.2, 1.2, 1.2);
            setTimeout(() => c.scale.set(1, 1, 1), 100);
        });
    });
}

// ---------------------------------------------------------
// 7. SENTINEL BRAIN & HEALTH SYNC (v3.0.0)
// ---------------------------------------------------------
function speakZen(text) {
    if (!('speechSynthesis' in window)) return;
    const voiceWave = document.querySelector('.voice-wave');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    
    utterance.onstart = () => voiceWave?.classList.add('active');
    utterance.onend = () => voiceWave?.classList.remove('active');
    
    window.speechSynthesis.speak(utterance);
}

function initHealthSync() {
    const params = new URLSearchParams(window.location.search);
    const steps = params.get('steps');
    const energy = params.get('energy');
    const hrv = params.get('hrv');

    if (steps || energy || hrv) {
        console.log("🧬 Señales vitales detectadas. Sincronizando...");
        try {
            const data = JSON.parse(localStorage.getItem('health_data') || '{}');
            if (steps) data.steps = parseInt(steps);
            if (energy) data.energy = parseInt(energy);
            if (hrv) {
                data.hrv = parseInt(hrv);
                checkStressLevels(data.hrv);
            }
            localStorage.setItem('health_data', JSON.stringify(data));
            updateHealthUI();
            
            // Analizar tendencias proactivamente (v3.1.0)
            analyzeHealthTrends(data);
        } catch (e) {
            console.error("Error en sincronización vital", e);
        }
    }

    // Listener para el botón de cuidado
    document.getElementById('btn-care-go')?.addEventListener('click', () => {
        document.getElementById('btn-zen-portal')?.click();
        document.getElementById('care-suggestion')?.classList.add('hidden');
    });
}

function analyzeHealthTrends(data) {
    const { steps = 0, hrv = 50 } = data;
    console.log("🧠 Analizando correlaciones vitales...");

    // Correlación Pasos vs HRV (Estrés vs Actividad)
    if (steps < 2000 && hrv < 40) {
        speakZen("Jade, noto que tu energía está contenida y tu ritmo es acelerado. Un pequeño paseo podría liberar tu creatividad y calmar tu centro.");
        checkStressLevels(hrv); // Activar flujo de calma si es necesario
    } else if (steps > 10000 && hrv < 35) {
        speakZen("Tu vitalidad es asombrosa hoy, pero tu cuerpo pide una pausa. Permíteme guiarte al Santuario Zen por un momento.");
        checkStressLevels(hrv);
    }
}

function checkStressLevels(hrv) {
    const zenPortal = document.getElementById('btn-zen-portal');
    
    if (hrv < 35) { // Umbral de sobreestimulación profunda
        const card = document.getElementById('care-suggestion');
        if (card) {
            card.classList.remove('hidden');
            
            // Calmar el Aura
            document.documentElement.style.setProperty('--aura-speed', '60s');
            document.documentElement.style.setProperty('--aura-1', 'rgba(0, 150, 200, 0.2)');
            document.documentElement.style.setProperty('--aura-blur', '180px');

            // Neural Shadowing: El portal respira
            zenPortal?.classList.add('predictive-shadow');

            setTimeout(() => {
                speakZen("Jade, noto que tu ritmo es acelerado. He preparado el Santuario para ti.");
            }, 2000);
            if (window.navigator.vibrate) window.navigator.vibrate([10, 50, 10]);
        }
    } else {
        // Restaurar
        document.documentElement.style.setProperty('--aura-speed', '25s');
        document.documentElement.style.setProperty('--aura-blur', '120px');
        zenPortal?.classList.remove('predictive-shadow');
    }
}

// ---------------------------------------------------------
// 6.5 PUENTE SMART SCALES 2: PERSPECTIVA HOLOGRÁFICA
// ---------------------------------------------------------
async function initHolographicPerspective() {
    if (typeof DeviceOrientationEvent === 'undefined') return;

    // Pedir permiso en iOS
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.addEventListener('click', async () => {
            try {
                await DeviceOrientationEvent.requestPermission();
            } catch (e) {}
        }, { once: true });
    }

    window.addEventListener('deviceorientation', (event) => {
        const { beta, gamma } = event; // beta (-180, 180), gamma (-90, 90)
        
        // Suavizamos el movimiento para que se sienta subatómico
        const x = (gamma / 15).toFixed(2);
        const y = (beta / 15).toFixed(2);
        
        const activeView = document.querySelector('.view.active');
        if (activeView) {
            const cards = activeView.querySelectorAll('.stat-card, .motivational-card, .journal-card');
            cards.forEach(card => {
                card.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(30px)`;
            });
        }
    });
}

// ---------------------------------------------------------
// 7. ORQUESTRACIÓN DE VERSIÓN (v3.2.0)
// ---------------------------------------------------------
async function syncAppVersion() {
    try {
        const response = await fetch('./package.json?t=' + Date.now());
        const pkg = await response.json();
        const currentVersion = pkg.version;
        const savedVersion = localStorage.getItem('app_version');

        // Actualizar UI
        const label = document.getElementById('app-version-label');
        if (label) label.textContent = `v${currentVersion}`;

        console.log(`📡 Sistema Mini Jefecita: [Local: ${savedVersion}] [Source: ${currentVersion}]`);

        if (savedVersion && savedVersion !== currentVersion) {
            console.log("🔥 Version Mismatch! Forzando armonización de caché...");
            localStorage.setItem('app_version', currentVersion);
            
            // Notificar al usuario (Opcional, pero recomendado para UX de lujo)
            if (window.MQA) console.log("🛡️ MQA: Sincronizando nueva arquitectura...");
            
            // Forzar recarga dura ignorando caché
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            localStorage.setItem('app_version', currentVersion);
        }
    } catch (e) {
        console.warn("No se pudo verificar la versión contra package.json", e);
    }
}

// ---------------------------------------------------------
// 8. AUDITORÍA DE HARDWARE (M2 Parity)
// ---------------------------------------------------------
async function getHardwareProfile() {
    let profile = { tier: 'Standard', name: 'Generic' };
    
    try {
        if (!navigator.gpu) {
            // Heurística para dispositivos sin WebGPU visible pero potentes
            if (navigator.hardwareConcurrency >= 8) profile.tier = 'Premium';
            return profile;
        }
        
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) return profile;
        
        // requestAdapterInfo puede ser bloqueado o retornar string vacío en Safari
        let info = {};
        try {
            info = await adapter.requestAdapterInfo();
        } catch(e) {}
        
        const renderer = info.description || info.vendor || '';
        const cores = navigator.hardwareConcurrency || 4;
        profile.name = renderer || (cores >= 8 ? 'Apple Silicon (Heuristic)' : 'Mobile GPU');

        // Neural Fingerprinting (Heurísticas de Silicio)
        const isApple = renderer.toLowerCase().includes('apple') || (navigator.platform && navigator.platform.match(/iPhone|iPad|Mac/));
        
        if (isApple) {
            profile.tier = 'Premium'; // Base M1 / A-series
            // Heurística M2/M3: Concurrencia de hardware alta + RAM estimada
            // Los iPads/Macs con M2 reportan hardwareConcurrency de 8 o superior
            if (cores >= 8) {
                profile.tier = 'Elite';
            }
        } else if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('amd')) {
            profile.tier = 'HighPerformance';
        }

        // Mostrar en UI de configuración
        const siliconLabel = document.getElementById('silicon-tier-label');
        if (siliconLabel) {
            siliconLabel.textContent = `Silicon: ${profile.tier} (${profile.name})`;
            siliconLabel.style.display = 'block';
        }

        return profile;
    } catch (e) {
        return profile;
    }
}
async function initApp() {
    console.log("🌊 Jade despertando... Mini Jefecita v3.0.0: Sentient Edition Activa.");
    
    try {
        applyPersonalization();
        updateGreeting();
        initTabs();
        initReminders();
        initJournal();
        initSettings();
        initChat();
        initExercise();
        initZenMode();
        initIdleManager();
        initHealthSync(); // Cerebro v3.0.0
        updateHealthUI();
        initAI(); // Carga en segundo plano (v3.0.4)
        initHolographicPerspective(); // SmartScales 2 Bridge
        await syncAppVersion(); // Fuente de Verdad v3.2.0
    } catch (err) {
        console.error("Fallo crítico en inicialización:", err);
    }
}

// Ejecución segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ---------------------------------------------------------
// 8. GESTOR DE REPOSO Y ACTUALIZACIONES DE PWA
// ---------------------------------------------------------
let lastInteractionTime = Date.now();
let isUpdateWaiting = false;
let newWorker = null;

function initIdleManager() {
    const IDLE_THRESHOLD = 60000; // 1 minuto de ocio

    const resetTimer = () => {
        lastInteractionTime = Date.now();
    };

    // Escuchar cualquier interacción táctil o de ratón
    ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
        document.addEventListener(evt, resetTimer, { passive: true });
    });

    // Auto-actualizar si el usuario ignora el Toast pero deja la app inactiva
    setInterval(() => {
        if (isUpdateWaiting && newWorker && !isDownloadingAI && (Date.now() - lastInteractionTime > IDLE_THRESHOLD)) {
            console.log("💎 Reposo detectado. Evolucionando objeto...");
            newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    }, 5000);

    // Actualizar también si la app pasa a segundo plano
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && isUpdateWaiting && newWorker && !isDownloadingAI) {
            console.log("🌙 App en reposo absoluto. Actualizando...");
            newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    });
}

// Service Worker y Toast de Actualización
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            // Helper para mostrar el Toast
            const showUpdateToast = (worker) => {
                newWorker = worker;
                isUpdateWaiting = true;
                const toast = document.getElementById('update-toast');
                if (toast) toast.classList.remove('hidden');
                console.log("✨ Actualización detectada/esperando. Mostrando Toast...");
            };

            // 1. Si ya hay un SW esperando al cargar la página
            if (reg.waiting) {
                showUpdateToast(reg.waiting);
            }

            // 2. Si se encuentra un nuevo SW mientras la página ya está abierta
            reg.onupdatefound = () => {
                const installingWorker = reg.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast(installingWorker);
                    }
                };
            };
        }).catch(e => console.warn('SW Register Error:', e));
    });

    // Manejar el clic en "Actualizar"
    const btnUpdate = document.getElementById('btn-update-now');
    if (btnUpdate) {
        btnUpdate.addEventListener('click', () => {
            if (newWorker) {
                console.log("💎 Forzando activación del nuevo motor...");
                newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }

    // Check Updates Manual
    const btnCheckUpdate = document.getElementById('btn-check-updates');
    if (btnCheckUpdate) {
        btnCheckUpdate.addEventListener('click', async () => {
            btnCheckUpdate.textContent = "Buscando mejoras...";
            try {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    await reg.update();
                    setTimeout(() => {
                        if (!isUpdateWaiting) {
                            btnCheckUpdate.textContent = "Estás al día ✨";
                            setTimeout(() => {
                                btnCheckUpdate.textContent = "Buscar Actualizaciones 🔄";
                            }, 3000);
                        }
                    }, 1500);
                }
            } catch (err) {
                btnCheckUpdate.textContent = "Error al buscar ⚠️";
            }
        });
    }

    // Cuando el nuevo SW toma el control, recargar instantáneamente
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

