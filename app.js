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

let generator = null;
let isDownloadingAI = false;
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
// 2.5 MOTOR DE ATMÓSFERA (AURA)
// ---------------------------------------------------------
function updateAuraMood(view) {
    const aura = document.getElementById('aura-system');
    if (!aura) return;

    let mood = 'default';
    if (view === 'diario') mood = 'introspection';
    if (view === 'ejercicio') mood = 'energy';
    if (view === 'zen') mood = 'calm';

    aura.setAttribute('data-mood', mood);
    console.log(`🌌 Aura Mood: ${mood}`);
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
        userData.name = document.getElementById('set-name').value.trim() || "Jade";
        userData.jadeName = document.getElementById('set-jade-name').value.trim() || "Jefecita";
        userData.vibe = document.getElementById('set-vibe').value.trim() || "💚";
        userData.brain = document.getElementById('set-brain-level').value;
        saveSettings();
        modal.style.display = 'none';
        applyPersonalization();
        updateGreeting();
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

async function initAI(retryCount = 0) {
    if (generator || isDownloadingAI) return;

    const bgDownloader = document.getElementById('ai-bg-downloader');
    const bgProgress = document.getElementById('ai-bg-progress');
    const bgStatus = document.getElementById('ai-bg-status');

    try {
        console.log('💎 Evolucionando motor de consciencia (v3 + WebGPU)...');
        await requestWakeLock();
        
        // Mostrar barra de progreso en segundo plano
        if (bgDownloader) bgDownloader.classList.remove('hidden');

        // Cargamos la versión 3 que soporta WebGPU para máximo rendimiento en hardware Mini Jefecita
        const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
        
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        isDownloadingAI = true;

        // Detección proactiva de WebGPU
        let device = 'wasm';
        try {
            if (navigator.gpu) {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) device = 'webgpu';
            }
        } catch (gpuErr) {
            console.warn("WebGPU no disponible, usando WASM como respaldo.");
        }

        const level = userData.brain || 'PRO';
        
        // Mapeo optimizado por jerarquía de hardware (Mac M2 / iPhone 15 Pro / iPhone 14 Pro)
        const modelMappings = {
            'MASTER': 'onnx-community/Llama-3.2-1B-Instruct',       // Para Mac M2 (Razonamiento Superior)
            'ULTRA':  'onnx-community/Qwen2.5-0.5B-Instruct',        // Para iPhone 15 Pro Max (8GB RAM)
            'PRO':    'onnx-community/Qwen2.5-0.5B-Instruct',        // Para iPhone 14 Pro (6GB RAM)
            'NORMAL': 'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA' // Fallback universal (Ligero)
        };

        const modelName = modelMappings[level] || modelMappings['NORMAL'];
        const hardwareName = device === 'webgpu' ? 'Aceleración Neuronal' : 'Núcleo de Calma';
        
        console.log(`🧠 Jade: ${hardwareName} | Modelo: ${modelName}`);

        // Frase de inicio aleatoria para Jade
        const jadePhrases = [
            "Sintonizando nuestra conexión",
            "Expandiendo mi espacio mental",
            "Sintiendo la materia",
            "Despertando mis sentidos",
            "Armonizando pensamientos"
        ];
        const initialPhrase = jadePhrases[Math.floor(Math.random() * jadePhrases.length)];

        generator = await pipeline('text-generation', modelName, {
            device: device,
            progress_callback: (progress) => {
                if (progress.status === 'progress') {
                    const pct = progress.progress.toFixed(0);
                    
                    // Actualizar barra de segundo plano con lenguaje poético
                    if (bgProgress) bgProgress.style.width = `${pct}%`;
                    if (bgStatus) bgStatus.textContent = `${initialPhrase}... ${pct}%`;

                    // Actualizar chat si está en proceso
                    const aiMessages = document.querySelectorAll('.message.ai');
                    const lastAI = aiMessages[aiMessages.length - 1];
                    if (lastAI && lastAI.textContent.includes('consciencia')) {
                        lastAI.textContent = `${initialPhrase} (${hardwareName})... ${pct}% ✨`;
                    }
                }
            }
        });

        console.log(`IA Lista y Cargada con ${device.toUpperCase()} ✅`);
        if (bgDownloader) {
            bgStatus.textContent = `Conexión plena establecida (${hardwareName})`;
            // Transición elegante y lenta para evitar flasheos
            setTimeout(() => {
                bgDownloader.style.opacity = '0';
                bgDownloader.style.transform = 'translateY(-100%)';
                setTimeout(() => bgDownloader.classList.add('hidden'), 800);
            }, 2000);
        }
        isDownloadingAI = false;
        releaseWakeLock();
    } catch (e) {
        console.error(`❌ Error en IA (Intento ${retryCount + 1}):`, e);
        isDownloadingAI = false;
        releaseWakeLock();

        if (retryCount < 2) {
            if (bgStatus) bgStatus.textContent = "Reintentando sintonización...";
            setTimeout(() => initAI(retryCount + 1), 3000);
        } else {
            if (bgStatus) bgStatus.textContent = "Error en sincronización";
        }
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

        if (generator) {
            try {
                const system = `Eres ${userData.jadeName}, la asistente personal de ${userData.name}. Eres motivadora, directa y eficiente.`;
                const messages = [{ role: 'system', content: system }, { role: 'user', content: text }];
                
                const fullPrompt = generator.tokenizer.apply_chat_template(messages, { tokenize: false, add_generation_prompt: true });
                const output = await generator(fullPrompt, { max_new_tokens: 80, temperature: 0.7 });
                
                let reply = output[0].generated_text.split('assistant\n')[1] || "Estoy lista para ayudarte.";
                chatBox.innerHTML += `<div class="message ai">${reply.replace('<|im_end|>', '').trim()}</div>`;
            } catch (err) {
                chatBox.innerHTML += `<div class="message ai">Lo siento, mi motor de pensamiento falló. ¿Puedes repetir?</div>`;
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
        ZenAudio.unlock();
        zenView?.classList.add('active');
        zen3DActive = true;
        init3DScene();
        setTimeout(() => {
            speakZen("Siente la materia, Jade. Todo está en calma.");
        }, 1000);
    });

    exit?.addEventListener('click', () => {
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

function checkStressLevels(hrv) {
    if (hrv < 35) { // Umbral de sobreestimulación profunda
        const card = document.getElementById('care-suggestion');
        if (card) {
            card.classList.remove('hidden');
            
            // Calmar el Aura
            document.documentElement.style.setProperty('--aura-speed', '60s');
            document.documentElement.style.setProperty('--aura-1', 'rgba(0, 150, 200, 0.2)');
            document.documentElement.style.setProperty('--aura-blur', '180px');

            setTimeout(() => {
                speakZen("Jade, noto que tu ritmo es acelerado. He preparado el Santuario para ti.");
            }, 2000);
            if (window.navigator.vibrate) window.navigator.vibrate([10, 50, 10]);
        }
    } else {
        // Restaurar Aura normal si no hay estrés
        document.documentElement.style.setProperty('--aura-speed', '25s');
        document.documentElement.style.setProperty('--aura-blur', '120px');
    }
}

// ---------------------------------------------------------
// 7. INICIALIZACIÓN FINAL MAESTRA
// ---------------------------------------------------------
function initApp() {
    console.log("💎 Mini Jefecita v3.0.0: Sentient Edition Activa.");
    
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

