// statusbar.js - Status Bar Functionality

const statusBar = {
    clockElement: null,
    dateElement: null,
    weatherElement: null,
    weatherIconElement: null,
    weatherTempElement: null,
    languageSelector: null,
    clockInterval: null,

    init() {
        this.clockElement = document.getElementById('clock');
        this.dateElement = document.getElementById('date');
        this.weatherElement = document.getElementById('weather');
        this.weatherIconElement = this.weatherElement.querySelector('.weather-icon');
        this.weatherTempElement = this.weatherElement.querySelector('.weather-temp');
        this.languageSelector = document.getElementById('languageSelector');

        this.startClock();
        this.initLanguageSelector();
        this.getWeather();

        // Update weather every 30 minutes
        setInterval(() => this.getWeather(), 30 * 60 * 1000);
    },

    startClock() {
        const updateClock = () => {
            const now = new Date();
            this.clockElement.textContent = utils.formatTime(now);
            this.dateElement.textContent = utils.formatDate(now);
        };

        updateClock();
        this.clockInterval = setInterval(updateClock, 1000);
    },

    initLanguageSelector() {
        const currentLangBtn = document.getElementById('currentLang');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        // Update current language display
        currentLangBtn.textContent = i18n.currentLang.toUpperCase();

        // Toggle dropdown
        currentLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.languageSelector.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.languageSelector.classList.remove('active');
        });

        // Language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                
                if (i18n.setLanguage(lang)) {
                    currentLangBtn.textContent = lang.toUpperCase();
                    
                    // Update active state
                    langOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                }
                
                this.languageSelector.classList.remove('active');
            });

            // Set active language
            if (option.dataset.lang === i18n.currentLang) {
                option.classList.add('active');
            }
        });
    },

    async getWeather() {
        try {
            // Try to get user's location
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        await this.fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log('Location access denied, using default weather');
                        this.setDefaultWeather();
                    }
                );
            } else {
                this.setDefaultWeather();
            }
        } catch (error) {
            console.error('Weather error:', error);
            this.setDefaultWeather();
        }
    },

    async fetchWeather(lat, lon) {
        try {
            // Using Open-Meteo API (free, no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            
            if (!response.ok) {
                throw new Error('Weather fetch failed');
            }

            const data = await response.json();
            const weather = data.current_weather;
            
            // Update weather display
            this.updateWeather(weather.temperature, this.getWeatherIcon(weather.weathercode));
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.setDefaultWeather();
        }
    },

    updateWeather(temp, icon) {
        this.weatherIconElement.textContent = icon;
        this.weatherTempElement.textContent = `${Math.round(temp)}°C`;
    },

    setDefaultWeather() {
        this.updateWeather(22, '☀️');
    },

    getWeatherIcon(code) {
        // WMO Weather interpretation codes
        const icons = {
            0: '☀️',  // Clear sky
            1: '🌤️', // Mainly clear
            2: '⛅', // Partly cloudy
            3: '☁️',  // Overcast
            45: '🌫️', // Foggy
            48: '🌫️', // Foggy
            51: '🌦️', // Drizzle
            61: '🌧️', // Rain
            71: '🌨️', // Snow
            95: '⛈️'  // Thunderstorm
        };

        return icons[code] || '🌤️';
    },

    destroy() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }
};
