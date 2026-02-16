// window-manager.js - Window Management System

const windowManager = {
    container: null,
    windows: new Map(),
    activeWindow: null,
    windowCounter: 0,
    maxZIndex: 300,

    init() {
        this.container = document.getElementById('windowContainer');
        
        // Listen for module open events
        window.addEventListener('openModule', (e) => {
            this.handleModuleOpen(e.detail.module);
        });
    },

    handleModuleOpen(moduleName) {
        // Check if module window already exists
        const existingWindow = Array.from(this.windows.values())
            .find(w => w.module === moduleName);

        if (existingWindow && !existingWindow.element.classList.contains('minimized')) {
            // Focus existing window
            this.focusWindow(existingWindow.id);
            return;
        }

        // Get module content
        const moduleContent = this.getModuleContent(moduleName);
        
        if (moduleContent) {
            const position = utils.getCascadePosition(this.windowCounter);
            
            this.createWindow({
                title: moduleContent.title,
                content: moduleContent.content,
                module: moduleName,
                width: moduleContent.width || 800,
                height: moduleContent.height || 600,
                x: position.x,
                y: position.y
            });
        }
    },

    getModuleContent(moduleName) {
        const modules = {
            home: {
                title: i18n.translate('menu.home'),
                content: '<div class="module-header"><h2>Welcome to PAPA QUDI</h2><p>Select a module from the sidebar to get started.</p></div>',
                width: 600,
                height: 400
            },
            agriculture: {
                title: i18n.translate('agriculture.title'),
                content: window.agricultureModule ? window.agricultureModule.getContent() : '<p>Loading...</p>',
                width: 900,
                height: 600
            },
            'agriculture-prices': {
                title: i18n.translate('menu.prices'),
                content: window.agricultureModule ? window.agricultureModule.getPricesContent() : '<p>Loading...</p>',
                width: 800,
                height: 600
            },
            'agriculture-analytics': {
                title: i18n.translate('menu.analytics'),
                content: window.agricultureModule ? window.agricultureModule.getAnalyticsContent() : '<p>Loading...</p>',
                width: 900,
                height: 600
            },
            journal: {
                title: i18n.translate('journal.title'),
                content: window.journalModule ? window.journalModule.getContent() : '<p>Loading...</p>',
                width: 900,
                height: 650
            },
            news: {
                title: i18n.translate('news.title'),
                content: window.newsModule ? window.newsModule.getContent() : '<p>Loading...</p>',
                width: 1000,
                height: 700
            },
            twitter: {
                title: i18n.translate('twitter.title'),
                content: window.twitterModule ? window.twitterModule.getContent() : '<p>Loading...</p>',
                width: 600,
                height: 500
            },
            books: {
                title: i18n.translate('books.title'),
                content: window.booksModule ? window.booksModule.getContent() : '<p>Loading...</p>',
                width: 800,
                height: 700
            },
            fortune: {
                title: i18n.translate('fortune.title'),
                content: window.fortuneModule ? window.fortuneModule.getContent() : '<p>Loading...</p>',
                width: 600,
                height: 700
            },
            homework: {
                title: i18n.translate('homework.title'),
                content: window.homeworkModule ? window.homeworkModule.getContent() : '<p>Loading...</p>',
                width: 800,
                height: 650
            }
        };

        return modules[moduleName];
    },

    createWindow(options) {
        const id = utils.generateId();
        const window = {
            id,
            module: options.module || null,
            element: null,
            isMaximized: false,
            isMinimized: false,
            originalBounds: null
        };

        // Create window element
        const windowEl = document.createElement('div');
        windowEl.className = 'window opening';
        windowEl.dataset.windowId = id;
        windowEl.style.width = `${options.width}px`;
        windowEl.style.height = `${options.height}px`;
        windowEl.style.left = `${options.x || 100}px`;
        windowEl.style.top = `${options.y || 100}px`;

        windowEl.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="window-control-btn close" data-action="close"></button>
                    <button class="window-control-btn minimize" data-action="minimize"></button>
                    <button class="window-control-btn maximize" data-action="maximize"></button>
                </div>
                <div class="window-title">${utils.sanitizeHTML(options.title)}</div>
            </div>
            <div class="window-content">${options.content}</div>
            <div class="window-resize-handle"></div>
        `;

        window.element = windowEl;
        this.container.appendChild(windowEl);
        this.windows.set(id, window);
        this.windowCounter++;

        // Setup window interactions
        this.setupWindowControls(window);
        this.setupDragging(window);
        this.setupResize(window);
        this.setupFocus(window);

        // Focus the new window
        this.focusWindow(id);

        // Update search bar position
        if (this.windows.size > 0) {
            search.hideSearchBar();
        }

        // Remove opening animation class
        setTimeout(() => {
            windowEl.classList.remove('opening');
        }, 300);

        return id;
    },

    setupWindowControls(window) {
        const controls = window.element.querySelectorAll('.window-control-btn');
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                
                switch(action) {
                    case 'close':
                        this.closeWindow(window.id);
                        break;
                    case 'minimize':
                        this.minimizeWindow(window.id);
                        break;
                    case 'maximize':
                        this.toggleMaximize(window.id);
                        break;
                }
            });
        });
    },

    setupDragging(window) {
        const titlebar = window.element.querySelector('.window-titlebar');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control-btn') || window.isMaximized) {
                return;
            }

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = window.element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            this.focusWindow(window.id);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            window.element.style.left = `${initialX + dx}px`;
            window.element.style.top = `${initialY + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Double click to maximize
        titlebar.addEventListener('dblclick', () => {
            this.toggleMaximize(window.id);
        });
    },

    setupResize(window) {
        const handle = window.element.querySelector('.window-resize-handle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', (e) => {
            if (window.isMaximized) return;

            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = window.element.offsetWidth;
            startHeight = window.element.offsetHeight;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);

            if (newWidth >= 400) {
                window.element.style.width = `${newWidth}px`;
            }
            if (newHeight >= 300) {
                window.element.style.height = `${newHeight}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    },

    setupFocus(window) {
        window.element.addEventListener('mousedown', () => {
            this.focusWindow(window.id);
        });
    },

    focusWindow(id) {
        const window = this.windows.get(id);
        if (!window) return;

        // Remove active class from all windows
        this.windows.forEach(w => {
            w.element.classList.remove('active');
            w.element.style.zIndex = this.maxZIndex;
        });

        // Set active window
        this.maxZIndex++;
        window.element.classList.add('active');
        window.element.style.zIndex = this.maxZIndex;
        this.activeWindow = id;
    },

    closeWindow(id) {
        const window = this.windows.get(id);
        if (!window) return;

        window.element.classList.add('closing');
        
        setTimeout(() => {
            window.element.remove();
            this.windows.delete(id);

            // Show search bar if no windows
            if (this.windows.size === 0) {
                search.showSearchBar();
            }
        }, 300);
    },

    minimizeWindow(id) {
        const window = this.windows.get(id);
        if (!window) return;

        window.element.classList.add('minimized');
        window.isMinimized = true;
    },

    toggleMaximize(id) {
        const window = this.windows.get(id);
        if (!window) return;

        if (window.isMaximized) {
            // Restore
            window.element.classList.remove('maximized');
            if (window.originalBounds) {
                window.element.style.width = window.originalBounds.width;
                window.element.style.height = window.originalBounds.height;
                window.element.style.left = window.originalBounds.left;
                window.element.style.top = window.originalBounds.top;
            }
            window.isMaximized = false;
        } else {
            // Maximize
            window.originalBounds = {
                width: window.element.style.width,
                height: window.element.style.height,
                left: window.element.style.left,
                top: window.element.style.top
            };
            window.element.classList.add('maximized');
            window.isMaximized = true;
        }
    }
};
