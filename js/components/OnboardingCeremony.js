// ---------------------------------------------------------
// js/components/OnboardingCeremony.js
// ---------------------------------------------------------
import { userData, saveSettings } from '../state.js';

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
                    <button id="btn-finish-baptism" class="btn-ritual">Bautizar</button>
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
        document.getElementById('btn-finish-baptism').addEventListener('click', () => {
            const val = document.getElementById('ai-name-input').value.trim();
            if(!val) return;
            userData.jadeName = val;
            userData.onboarded = true;
            saveSettings();

            core.style.transform = 'scale(50)';
            core.style.opacity = '0';
            document.getElementById('awakening-void').style.background = 'white';
            
            setTimeout(() => {
                location.reload(); // Hard refresh to lock the state and start main app
            }, 1000);
        });
    }
};
