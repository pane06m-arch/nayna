// router.js - SPA Routing System

const router = {
    currentRoute: null,

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentRoute = hash;

        // Dispatch route change event
        window.dispatchEvent(new CustomEvent('routeChanged', {
            detail: { route: hash }
        }));

        // Open corresponding module
        if (hash !== 'home') {
            window.dispatchEvent(new CustomEvent('openModule', {
                detail: { module: hash }
            }));
        }
    },

    navigate(route) {
        window.location.hash = route;
    }
};
