/**
 * Security utilities for production
 * Disables right-click, text selection, copy/paste, and screenshot attempts
 */

export const enableSecurityFeatures = () => {
    if ((import.meta as any).env?.MODE === 'production') {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable text selection
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable copy
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable cut
        document.addEventListener('cut', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable paste
        document.addEventListener('paste', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable drag
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }
            // Ctrl+S (Save Page)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }
        });

        // Block screenshot attempts (best-effort)
        // Note: This cannot fully prevent screenshots but can make it harder
        document.addEventListener('keydown', (e) => {
            // Windows: Win+Shift+S, Mac: Cmd+Shift+4/5
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['4', '5', 'S'].includes(e.key)) {
                // Can't fully prevent, but we can show a warning
                console.warn('Screenshots are not permitted');
            }
        });

        // Add CSS to prevent text selection
        const style = document.createElement('style');
        style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
        document.head.appendChild(style);
    }
};

export const disableSecurityFeatures = () => {
    // For development mode, security features are disabled
    // This function can be used to explicitly disable if needed
};

// Obfuscate sensitive data in console
export const obfuscateConsole = () => {
    if ((import.meta as any).env?.MODE === 'production') {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        const originalInfo = console.info;

        const obfuscate = (args: any[]) => {
            return args.map(arg => {
                if (typeof arg === 'string' && (
                    arg.includes('password') ||
                    arg.includes('token') ||
                    arg.includes('key') ||
                    arg.includes('secret')
                )) {
                    return '[REDACTED]';
                }
                return arg;
            });
        };

        console.log = (...args: any[]) => {
            // In production, disable console.log
            return;
        };

        console.warn = (...args: any[]) => {
            originalWarn(...obfuscate(args));
        };

        console.error = (...args: any[]) => {
            originalError(...obfuscate(args));
        };

        console.info = (...args: any[]) => {
            // In production, disable console.info
            return;
        };
    }
};

