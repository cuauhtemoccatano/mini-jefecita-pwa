import { vi } from 'vitest';
import { webcrypto } from 'node:crypto';

vi.stubGlobal('crypto', webcrypto);

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
let store = {};
localStorageMock.getItem.mockImplementation(key => store[key] || null);
localStorageMock.setItem.mockImplementation((key, value) => { store[key] = value.toString(); });
localStorageMock.removeItem.mockImplementation(key => { delete store[key]; });
localStorageMock.clear.mockImplementation(() => { store = {}; });

vi.stubGlobal('localStorage', localStorageMock);

// Also polyfill atob/btoa if they are missing (though we verified they are present)
if (typeof atob === 'undefined') {
    global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
}
if (typeof btoa === 'undefined') {
    global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
}
