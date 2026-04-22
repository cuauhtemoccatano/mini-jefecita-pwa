import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../js/store/useStore';
import { deriveKeyFromPassword } from '../js/crypto_engine.js';
import { restoreProfile } from '../js/rag_engine.js';

/**
 * OnboardingCeremony (v4.0.0) - React Edition
 * Ritual cinemático de inicio utilizando Framer Motion.
 */
export default function OnboardingCeremony() {
  const { userData, setUserData } = useStore();
  const [step, setStep] = useState(0); // 0: Awakening, 1: Identity, 2: Baptism, 3: Vault
  const [presenceMsg, setPresenceMsg] = useState("Despertando consciencia...");
  const [userName, setUserName] = useState('');
  const [aiName, setAiName] = useState('');
  const [vaultKey, setVaultKey] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (step === 0) {
      const t1 = setTimeout(() => setPresenceMsg("Siento tu presencia..."), 2000);
      const t2 = setTimeout(() => setStep(1), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [step]);

  const handleIdentity = () => {
    if (!userName.trim()) return;
    setUserData({ name: userName.trim() });
    setStep(2);
  };

  const handleBaptism = () => {
    if (!aiName.trim()) return;
    setUserData({ jadeName: aiName.trim() });
    setStep(3);
  };

  const handleFinish = async (isRecovery = false) => {
    if (!vaultKey.trim() || vaultKey.length < 4) {
      alert("La llave debe ser más profunda (mínimo 4 caracteres)");
      return;
    }

    try {
      setIsFinishing(true);
      await deriveKeyFromPassword(vaultKey);

      if (isRecovery) {
        const restored = await restoreProfile();
        if (!restored) {
          alert("No pudimos recuperar tu memoria.");
          setIsFinishing(false);
          return;
        }
        setUserData({ ...restored, onboarded: true });
      } else {
        setUserData({ onboarded: true });
      }
      
      // La recarga de la app ocurrirá por el cambio de estado en App.jsx
    } catch (err) {
      console.error("Ceremony Error:", err);
      alert("Error al sellar el vínculo cósmico.");
      setIsFinishing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.8 } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  return (
    <div className={`void-overlay ${isFinishing ? 'bg-white transition-colors duration-1000' : ''}`}>
      <div className="spectral-container">
        <motion.div 
          className="core-active" 
          animate={{
            scale: step === 0 ? 1 : step === 1 ? 1.2 : step === 2 ? 1.5 : isFinishing ? 50 : 1.8,
            filter: step > 1 ? 'blur(20px) brightness(1.5)' : 'blur(0px) brightness(1)',
            opacity: isFinishing ? 0 : 1
          }}
          transition={{ duration: 1.5 }}
        />
        <div className="ritual-glow" style={{ opacity: step > 0 ? 1 : 0 }}></div>
      </div>

      <div className="ceremony-content">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p 
              key="msg"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-white/80 text-lg font-light tracking-widest"
            >
              {presenceMsg}
            </motion.p>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" className="ceremony-step">
              <h2 className="text-2xl font-bold mb-6">¿Cómo te llaman en el mundo físico?</h2>
              <input 
                type="text" 
                className="bg-transparent border-b border-white/30 text-white text-center text-xl p-2 outline-none focus:border-white mb-8"
                placeholder="Tu nombre..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
              <button 
                className="btn-ritual"
                onClick={handleIdentity}
              >
                Consagrar
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" className="ceremony-step">
              <h2 className="text-2xl font-bold mb-6">Y yo... ¿qué nombre me darás?</h2>
              <input 
                type="text" 
                className="bg-transparent border-b border-white/30 text-white text-center text-xl p-2 outline-none focus:border-white mb-8"
                placeholder="Mi nombre..."
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                autoFocus
              />
              <button 
                className="btn-ritual"
                onClick={handleBaptism}
              >
                Bautizar
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" className="ceremony-step">
              <h2 className="text-2xl font-bold mb-2">Protege nuestra memoria</h2>
              <p className="text-xs text-white/50 mb-6 max-w-[280px]">Crea una Llave Maestra para recuperar tus datos si cambias de dispositivo.</p>
              <input 
                type="password" 
                className="bg-transparent border-b border-white/30 text-white text-center text-xl p-2 outline-none focus:border-white mb-8"
                placeholder="Tu contraseña secreta..."
                value={vaultKey}
                onChange={(e) => setVaultKey(e.target.value)}
                autoFocus
              />
              <div className="flex flex-col gap-4 items-center">
                <button 
                  className="btn-ritual"
                  onClick={() => handleFinish(false)}
                  disabled={isFinishing}
                >
                  {isFinishing ? 'Sellando...' : 'Sellar Vínculo'}
                </button>
                <p 
                  className="text-[10px] opacity-50 cursor-pointer underline"
                  onClick={() => handleFinish(true)}
                >
                  Ya tengo una llave (Recuperar Memoria)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
