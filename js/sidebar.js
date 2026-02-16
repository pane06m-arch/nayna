// sidebar.js - Sidebar Navigation

const sidebar = {
    element: null,
    menuItems: null,
    mobileToggle: null,

    init() {
        this.element = document.getElementById('sidebar');
        this.menuItems = document.querySelectorAll('.menu-item');
        this.mobileToggle = document.getElementById('mobileMenuToggle');

        this.initMenuItems();
        this.initMobileToggle();
        this.setupExpandableMenus();
    },

    initMenuItems() {
        this.menuItems.forEach(item => {
            // Skip expandable items (they're handled separately)
            if (item.classList.contains('expandable')) {
                return;
            }

            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = item.dataset.module;
                
                if (module) {
                    this.selectMenuItem(item);
                    this.openModule(module);
                    
                    // Close mobile menu after selection
                    if (utils.isMobile()) {
                        this.closeMobileMenu();
                    }
                }
            });
        });

        // Handle submenu items
        const submenuItems = document.querySelectorAll('.submenu-item');
        submenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = item.dataset.module;
                
                if (module) {
                    this.selectSubmenuItem(item);
                    this.openModule(module);
                    
                    if (utils.isMobile()) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    },

    setupExpandableMenus() {
        const expandableItems = document.querySelectorAll('.menu-item.expandable');
        
        expandableItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const submenu = item.nextElementSibling;
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    item.classList.remove('expanded');
                    submenu.classList.remove('expanded');
                } else {
                    // Expand
                    item.classList.add('expanded');
                    submenu.classList.add('expanded');
                }
            });
        });
    },

    selectMenuItem(item) {
        // Remove active class from all items
        this.menuItems.forEach(mi => mi.classList.remove('active'));
        document.querySelectorAll('.submenu-item').forEach(si => si.classList.remove('active'));
        
        // Add active class to selected item
        item.classList.add('active');
    },

    selectSubmenuItem(item) {
        // Remove active class from all items
        this.menuItems.forEach(mi => mi.classList.remove('active'));
        document.querySelectorAll('.submenu-item').forEach(si => si.classList.remove('active'));
        
        // Add active class to selected item
        item.classList.add('active');
        
        // Also mark parent as active
        const parentMenu = item.closest('.submenu').previousElementSibling;
        if (parentMenu) {
            parentMenu.classList.add('active');
        }
    },

    openModule(moduleName) {
        // Dispatch event for router/window manager
        window.dispatchEvent(new CustomEvent('openModule', {
            detail: { module: moduleName }
        }));
    },

    initMobileToggle() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (utils.isMobile() && 
                    this.element.classList.contains('mobile-open') &&
                    !this.element.contains(e.target) &&
                    !this.mobileToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    },

    toggleMobileMenu() {
        this.element.classList.toggle('mobile-open');
        this.mobileToggle.classList.toggle('active');
    },

    closeMobileMenu() {
        this.element.classList.remove('mobile-open');
        this.mobileToggle.classList.remove('active');
    },

    openMobileMenu() {
        this.element.classList.add('mobile-open');
        this.mobileToggle.classList.add('active');
    }
};
