// search.js - Spotlight Search

const search = {
    searchElement: null,
    searchInput: null,

    init() {
        this.searchElement = document.getElementById('spotlightSearch');
        this.searchInput = document.getElementById('searchInput');

        this.setupSearch();
        this.setupKeyboardShortcut();
    },

    setupSearch() {
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.searchInput.value.trim();
                
                if (query) {
                    this.performSearch(query);
                }
            }
        });

        // Focus effect
        this.searchInput.addEventListener('focus', () => {
            this.searchElement.classList.add('focused');
        });

        this.searchInput.addEventListener('blur', () => {
            this.searchElement.classList.remove('focused');
        });
    },

    setupKeyboardShortcut() {
        // Cmd+K or Ctrl+K to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }

            // Escape to blur search
            if (e.key === 'Escape' && document.activeElement === this.searchInput) {
                this.searchInput.blur();
            }
        });
    },

    focusSearch() {
        this.searchInput.focus();
        this.searchInput.select();
    },

    performSearch(query) {
        const sanitizedQuery = utils.escapeHTML(query);
        
        // Open Google search in a window
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
        
        windowManager.createWindow({
            title: `${i18n.translate('search.results')}: ${sanitizedQuery}`,
            content: this.createSearchContent(searchUrl, sanitizedQuery),
            width: 900,
            height: 600
        });

        // Clear search input
        this.searchInput.value = '';
        this.searchInput.blur();
    },

    createSearchContent(url, query) {
        return `
            <div class="search-results">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 10px;">${i18n.translate('search.results')}</h3>
                    <p style="opacity: 0.7;">Query: <strong>${query}</strong></p>
                </div>
                <iframe 
                    src="${url}" 
                    style="width: 100%; height: calc(100% - 80px); border: none; border-radius: 12px; background: white;"
                    title="Search Results"
                ></iframe>
            </div>
        `;
    },

    hideSearchBar() {
        this.searchElement.classList.add('has-windows');
    },

    showSearchBar() {
        this.searchElement.classList.remove('has-windows');
    }
};
