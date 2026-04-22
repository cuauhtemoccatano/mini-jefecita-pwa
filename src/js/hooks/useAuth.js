import { useState, useCallback, useEffect } from 'react';

/**
 * useAuth hook (v1.0.0)
 * Encapsula la lógica de autenticación biométrica (WebAuthn).
 */
export function useAuth() {
    const [isLocked, setIsLocked] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);

    const authenticate = useCallback(async () => {
        if (!window.PublicKeyCredential) {
            console.warn('WebAuthn not supported, auto-unlocking');
            setIsLocked(false);
            return true;
        }

        try {
            setIsAuthenticating(true);
            setError(null);
            
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);
            const credIdBase64 = localStorage.getItem('mqa_journal_cred_id');

            if (!credIdBase64) {
                // Registro inicial
                const credential = await navigator.credentials.create({
                    publicKey: {
                        rp: { name: 'Mini Jefecita', id: window.location.hostname },
                        user: { 
                            id: new Uint8Array([1, 2, 3, 4]), 
                            name: 'jade_user', 
                            displayName: 'Usuario' 
                        },
                        challenge,
                        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
                        authenticatorSelection: { 
                            authenticatorAttachment: 'platform', 
                            userVerification: 'required' 
                        }
                    }
                });
                
                if (credential) {
                    const id64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
                    localStorage.setItem('mqa_journal_cred_id', id64);
                }
            } else {
                // Autenticación recurrente
                const rawId = Uint8Array.from(atob(credIdBase64), c => c.charCodeAt(0));
                await navigator.credentials.get({
                    publicKey: {
                        challenge,
                        allowCredentials: [{ id: rawId, type: 'public-key' }],
                        userVerification: 'required'
                    }
                });
            }

            setIsLocked(false);
            if (window.navigator?.vibrate) window.navigator.vibrate(10);
            return true;
        } catch (err) {
            console.error('🔐 Auth Hook Error:', err);
            setError(err.message || 'Error de autenticación');
            return false;
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const lock = useCallback(() => {
        setIsLocked(true);
    }, []);

    // Auto-trigger if credential exists
    useEffect(() => {
        if (localStorage.getItem('mqa_journal_cred_id')) {
            authenticate();
        }
    }, [authenticate]);

    return {
        isLocked,
        isAuthenticating,
        error,
        authenticate,
        lock
    };
}
