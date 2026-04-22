/**
 * ui_utils.js - Utilidades ligeras de UI
 */

export function triggerHaptic(type = 'light') {
    if (!window.navigator?.vibrate) return;
    
    switch (type) {
        case 'light': window.navigator.vibrate(10); break;
        case 'medium': window.navigator.vibrate(25); break;
        case 'heavy': window.navigator.vibrate([40, 30, 40]); break;
        case 'warning': window.navigator.vibrate([100, 50, 100]); break;
        case 'success': window.navigator.vibrate([10, 50, 10]); break;
    }
}
