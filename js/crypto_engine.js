// ---------------------------------------------------------
// js/crypto_engine.js - Encriptación AES-GCM client-side
// Los datos se encriptan ANTES de salir del dispositivo
// ---------------------------------------------------------

const ALGO = 'AES-GCM';
const KEY_LENGTH = 256;
const STORAGE_KEY = 'mqa_crypto_key';

let _cryptoKey = null;

// ---------------------------------------------------------
// Derivar o recuperar la llave de encriptación
// ---------------------------------------------------------
export async function initCrypto() {
    if (_cryptoKey) return _cryptoKey;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        // Recuperar llave existente
        const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
        _cryptoKey = await crypto.subtle.importKey(
            'raw', raw, { name: ALGO }, false, ['encrypt', 'decrypt']
        );
    } else {
        // Generar nueva llave
        _cryptoKey = await crypto.subtle.generateKey(
            { name: ALGO, length: KEY_LENGTH }, true, ['encrypt', 'decrypt']
        );
        const exported = await crypto.subtle.exportKey('raw', _cryptoKey);
        localStorage.setItem(STORAGE_KEY, btoa(String.fromCharCode(...new Uint8Array(exported))));
    }

    return _cryptoKey;
}

// ---------------------------------------------------------
// Encriptar texto → base64
// ---------------------------------------------------------
export async function encrypt(plaintext) {
    const key = await initCrypto();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: ALGO, iv }, key, encoded
    );

    // Combinar IV + ciphertext en base64
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
}

// ---------------------------------------------------------
// Desencriptar base64 → texto
// ---------------------------------------------------------
export async function decrypt(base64) {
    try {
        const key = await initCrypto();
        const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: ALGO, iv }, key, ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.warn('🔐 MQA: Error desencriptando — dato corrupto o llave incorrecta');
        return null;
    }
}

// ---------------------------------------------------------
// Encriptar objeto JSON
// ---------------------------------------------------------
export async function encryptJSON(obj) {
    return encrypt(JSON.stringify(obj));
}

// ---------------------------------------------------------
// Desencriptar a objeto JSON
// ---------------------------------------------------------
export async function decryptJSON(base64) {
    const text = await decrypt(base64);
    if (!text) return null;
    try { return JSON.parse(text); } catch { return null; }
}
