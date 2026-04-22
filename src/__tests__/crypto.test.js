import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
    encrypt, 
    decrypt, 
    deriveKeyFromPassword, 
    initCrypto,
    resetCryptoInternal
} from '../js/crypto_engine';

describe('crypto_engine.js', () => {
    beforeEach(() => {
        localStorage.clear();
        resetCryptoInternal();
        vi.clearAllMocks();
    });

    it('should derive a key from a password', async () => {
        const password = 'test-password';
        const key = await deriveKeyFromPassword(password);
        expect(key).toBeDefined();
        expect(key.type).toBe('secret');
        expect(localStorage.setItem).toHaveBeenCalledWith('mqa_crypto_salt', expect.any(String));
    });

    it('should initialize crypto with a password if no key exists', async () => {
        const password = 'test-password';
        const key = await initCrypto(password);
        expect(key).toBeDefined();
        // Verificamos que se guardó la sal, que es lo que el motor hace actualmente
        expect(localStorage.setItem).toHaveBeenCalledWith('mqa_crypto_salt', expect.any(String));
    });

    it('should throw CRYPTO_REQUIRED if no key and no password', async () => {
        await expect(initCrypto()).rejects.toThrow('CRYPTO_REQUIRED');
    });

    it('should encrypt and decrypt text correctly', async () => {
        const password = 'secure-password';
        const plaintext = 'Hello, DeepMind!';
        
        await initCrypto(password);
        
        const ciphertext = await encrypt(plaintext);
        expect(ciphertext).toBeDefined();
        expect(ciphertext).not.toBe(plaintext);
        
        const decrypted = await decrypt(ciphertext);
        expect(decrypted).toBe(plaintext);
    });

    it('should return null for corrupted data', async () => {
        await initCrypto('password');
        const result = await decrypt('invalid-base64-data!');
        expect(result).toBeNull();
    });
});
