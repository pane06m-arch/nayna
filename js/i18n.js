// i18n.js - Internationalization System

const i18n = {
    currentLang: 'tr',
    translations: {
        tr: {
            'menu.home': 'Ana Sayfa',
            'menu.agriculture': 'Tarım & Hayvancılık',
            'menu.prices': 'Fiyatlar',
            'menu.analytics': 'Analitik',
            'menu.journal': 'Günlük Yazma',
            'menu.news': 'Haberler',
            'menu.twitter': 'X (Twitter)',
            'menu.books': 'Kitap & Şiir',
            'menu.fortune': 'Fal',
            'menu.homework': 'Ödev',
            'menu.settings': 'Ayarlar',
            'search.placeholder': 'Ara...',
            'window.close': 'Kapat',
            'window.minimize': 'Küçült',
            'window.maximize': 'Büyüt',
            'agriculture.title': 'Tarım & Hayvancılık',
            'agriculture.description': 'Fiyat takibi ve analitik dashboard',
            'journal.title': 'Günlük Yazma',
            'journal.placeholder': 'Bugün ne yaşadın?',
            'news.title': 'Haberler',
            'news.loading': 'Haberler yükleniyor...',
            'twitter.title': 'X Otomasyonu',
            'twitter.placeholder': 'Ne düşünüyorsun?',
            'twitter.send': 'Gönder',
            'books.title': 'Kitap & Şiir',
            'books.placeholder': 'Yazmaya başla...',
            'fortune.title': 'Fal',
            'fortune.instruction': 'Bir kart seç',
            'homework.title': 'Ödev',
            'homework.export': 'PDF Olarak İndir',
            'search.results': 'Arama Sonuçları'
        },
        en: {
            'menu.home': 'Home',
            'menu.agriculture': 'Agriculture & Livestock',
            'menu.prices': 'Prices',
            'menu.analytics': 'Analytics',
            'menu.journal': 'Journal',
            'menu.news': 'News',
            'menu.twitter': 'X (Twitter)',
            'menu.books': 'Books & Poetry',
            'menu.fortune': 'Fortune',
            'menu.homework': 'Homework',
            'menu.settings': 'Settings',
            'search.placeholder': 'Search...',
            'window.close': 'Close',
            'window.minimize': 'Minimize',
            'window.maximize': 'Maximize',
            'agriculture.title': 'Agriculture & Livestock',
            'agriculture.description': 'Price tracking and analytics dashboard',
            'journal.title': 'Journal',
            'journal.placeholder': 'What happened today?',
            'news.title': 'News',
            'news.loading': 'Loading news...',
            'twitter.title': 'X Automation',
            'twitter.placeholder': 'What\'s happening?',
            'twitter.send': 'Send',
            'books.title': 'Books & Poetry',
            'books.placeholder': 'Start writing...',
            'fortune.title': 'Fortune',
            'fortune.instruction': 'Choose a card',
            'homework.title': 'Homework',
            'homework.export': 'Export as PDF',
            'search.results': 'Search Results'
        }
    },

    init() {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem('language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        }
        this.updateUI();
    },

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updateUI();
            return true;
        }
        return false;
    },

    translate(key) {
        return this.translations[this.currentLang][key] || key;
    },

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }
};
