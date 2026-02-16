// utils.js - Utility Functions

const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Escape HTML entities
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    // Format date
    formatDate(date) {
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        };
        return date.toLocaleDateString(i18n.currentLang, options);
    },

    // Format time
    formatTime(date) {
        return date.toLocaleTimeString(i18n.currentLang, { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    },

    // Generate unique ID
    generateId() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    // Get position for centering window
    getCenterPosition(width, height) {
        const container = document.getElementById('windowContainer');
        const rect = container.getBoundingClientRect();
        return {
            x: (rect.width - width) / 2,
            y: (rect.height - height) / 2
        };
    },

    // Get cascade position for new windows
    getCascadePosition(index) {
        const offset = 30;
        return {
            x: 50 + (index * offset),
            y: 50 + (index * offset)
        };
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage error:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        }
    },

    // Animate element
    animate(element, animation, duration = 300) {
        return new Promise((resolve) => {
            element.style.animation = `${animation} ${duration}ms ease-out`;
            
            const handleAnimationEnd = () => {
                element.style.animation = '';
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    },

    // Check if mobile device
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }
};
