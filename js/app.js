// app.js - Main Application Entry Point

const app = {
    init() {
        console.log('🚀 PAPA QUDI initializing...');

        // Initialize i18n first
        i18n.init();

        // Initialize core systems
        statusBar.init();
        sidebar.init();
        search.init();
        windowManager.init();
        router.init();

        // Setup global keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Setup security
        this.setupSecurity();

        // Performance optimizations
        this.setupPerformanceOptimizations();

        // Welcome message
        console.log('✨ PAPA QUDI is ready!');
        console.log('💡 Press Cmd/Ctrl + K to search');
        
        // Show welcome on first load
        if (!utils.storage.get('visited_before')) {
            this.showWelcome();
            utils.storage.set('visited_before', true);
        }
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + W to close active window
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                if (windowManager.activeWindow) {
                    e.preventDefault();
                    windowManager.closeWindow(windowManager.activeWindow);
                }
            }

            // Escape to close active window
            if (e.key === 'Escape' && windowManager.activeWindow) {
                const activeWin = windowManager.windows.get(windowManager.activeWindow);
                if (activeWin && !activeWin.isMaximized) {
                    windowManager.closeWindow(windowManager.activeWindow);
                }
            }
        });
    },

    setupSecurity() {
        // Prevent right-click context menu (optional, can be removed)
        // document.addEventListener('contextmenu', e => e.preventDefault());

        // Add CSP meta tag programmatically
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;";
        document.head.appendChild(meta);
    },

    setupPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Debounce window resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('optimizedResize'));
            }, 250);
        });
    },

    showWelcome() {
        setTimeout(() => {
            windowManager.createWindow({
                title: 'Welcome to PAPA QUDI',
                content: `
                    <div style="text-align: center; padding: 40px 20px;">
                        <h2 style="font-size: 32px; margin-bottom: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            PAPA QUDI
                        </h2>
                        <p style="font-size: 18px; opacity: 0.9; margin-bottom: 30px;">
                            Apple-inspired Glassmorphism Web Portal
                        </p>
                        <div style="text-align: left; max-width: 500px; margin: 0 auto; line-height: 1.8;">
                            <h3 style="margin-bottom: 15px;">Features:</h3>
                            <ul style="padding-left: 20px;">
                                <li>🌾 Agriculture & Livestock Dashboard</li>
                                <li>📔 Daily Journal with Calendar</li>
                                <li>📰 News Feed</li>
                                <li>𝕏 Twitter/X Automation</li>
                                <li>📚 Books & Poetry Editor</li>
                                <li>🔮 Fortune Telling</li>
                                <li>📝 Homework & Report Tool</li>
                            </ul>
                        </div>
                        <div style="margin-top: 40px;">
                            <p style="opacity: 0.7; font-size: 14px;">
                                💡 Press <kbd style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px;">Cmd/Ctrl + K</kbd> to search
                            </p>
                            <p style="opacity: 0.7; font-size: 14px; margin-top: 10px;">
                                🌐 Change language using the selector in the top-right corner
                            </p>
                        </div>
                        <button class="btn" style="margin-top: 30px;" onclick="windowManager.closeWindow(windowManager.activeWindow)">
                            Get Started
                        </button>
                    </div>
                `,
                width: 650,
                height: 600
            });
        }, 500);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for debugging
window.app = app;
