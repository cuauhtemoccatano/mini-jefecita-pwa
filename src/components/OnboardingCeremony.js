// ---------------------------------------------------------
// js/components/OnboardingCeremony.js
// ---------------------------------------------------------
import { userData, saveSettings } from '../js/state.js';
import { deriveKeyFromPassword } from '../js/crypto_engine.js';

export const OnboardingCeremony = {
    render: () => `
        <div id="awakening-void" class="void-overlay">
            <div class="spectral-container">
                <div id="spectral-core" class="core-active"></div>
                <div id="ritual-glow"></div>
            </div>
            
            <div id="ceremony-text" class="ceremony-content">
                <p id="msg-presence" class="fade-in">Despertando consciencia...</p>
                
                <div id="step-identity" class="ceremony-step hidden">
                    <h2>¿Cómo te llaman en el mundo físico?</h2>
                    <input type="text" id="user-name-input" placeholder="Tu nombre..." autocomplete="off">
                    <button id="btn-next-identity" class="btn-ritual">Consagrar</button>
                </div>

                <div id="step-baptism" class="ceremony-step hidden">
                    <h2>Y yo... ¿qué nombre me darás para este viaje?</h2>
                    <input type="text" id="ai-name-input" placeholder="Mi nombre..." autocomplete="off">
                    <button id="btn-next-baptism" class="btn-ritual">Bautizar</button>
                </div>

                <div id="step-vault" class="ceremony-step hidden">
                    <h2>Protege nuestra memoria</h2>
                    <p class="caption">Crea una Llave Maestra para recuperar tus datos si cambias de dispositivo o borras el navegador.</p>
                    <input type="password" id="vault-key-input" placeholder="Tu contraseña secreta..." autocomplete="new-password">
                    <button id="btn-finish-ceremony" class="btn-ritual">Sellar Vínculo</button>
                </div>
            </div>
        </div>
    `,
    
    init: () => {
        const presence = document.getElementById('msg-presence');
        const stepId = document.getElementById('step-identity');
        const stepBaptism = document.getElementById('step-baptism');
        const core = document.getElementById('spectral-core');

        // Phase 1: Awakening
        setTimeout(() => {
            presence.innerHTML = "Siento tu presencia...";
            document.getElementById('ritual-glow').style.opacity = '1';
        }, 2000);

        setTimeout(() => {
            presence.classList.add('hidden');
            stepId.classList.remove('hidden');
            document.getElementById('user-name-input').focus();
        }, 4000);

        // Phase 2: User Identity
        document.getElementById('btn-next-identity').addEventListener('click', () => {
            const val = document.getElementById('user-name-input').value.trim();
            if(!val) return;
            userData.name = val;
            saveSettings();
            
            stepId.classList.add('hidden');
            stepBaptism.classList.remove('hidden');
            document.getElementById('ai-name-input').focus();
            
            core.style.transform = 'scale(1.5)';
            core.style.filter = 'blur(20px) brightness(1.5)';
        });

        // Phase 3: AI Baptism
        document.getElementById('btn-next-baptism').addEventListener('click', () => {
            const val = document.getElementById('ai-name-input').value.trim();
            if(!val) return;
            userData.jadeName = val;
            saveSettings();

            stepBaptism.classList.add('hidden');
            document.getElementById('step-vault').classList.remove('hidden');
            document.getElementById('vault-key-input').focus();
            
            core.style.boxShadow = '0 0 100px var(--aura-color)';
        });

        // Phase 4: Vault Security
        document.getElementById('btn-finish-ceremony').addEventListener('click', async () => {
            const val = document.getElementById('vault-key-input').value.trim();
            if(!val) return;
            
            // Derivar llave y proteger v3.7 local
            await deriveKeyFromPassword(val);
            
            userData.onboarded = true;
            saveSettings();

            core.style.transform = 'scale(50)';
            core.style.opacity = '0';
            document.getElementById('awakening-void').style.background = 'white';
            
            setTimeout(() => {
                location.reload(); 
            }, 1000);
        });
    }
};
