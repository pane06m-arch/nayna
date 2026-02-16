// modules/news.js - News Module

window.newsModule = {
    news: [],

    async init() {
        await this.loadNews();
    },

    getContent() {
        return `
            <div class="module-header">
                <h2>${i18n.translate('news.title')}</h2>
                <p>Güncel haberler ve duyurular</p>
            </div>
            <div id="newsContent">
                ${i18n.translate('news.loading')}
            </div>
            <script>
                newsModule.init().then(() => {
                    document.getElementById('newsContent').innerHTML = newsModule.renderNews();
                });
            </script>
        `;
    },

    async loadNews() {
        // Sample news data (in a real app, this would fetch from an API)
        this.news = [
            {
                id: 1,
                title: 'Teknoloji Sektöründe Yeni Gelişmeler',
                excerpt: 'Yapay zeka ve makine öğrenimi alanında önemli ilerlemeler kaydedildi.',
                date: new Date().toISOString(),
                image: null
            },
            {
                id: 2,
                title: 'Ekonomi Haberleri',
                excerpt: 'Piyasalarda yeni hareketlilik gözlemleniyor.',
                date: new Date(Date.now() - 86400000).toISOString(),
                image: null
            },
            {
                id: 3,
                title: 'Spor Dünyasından Haberler',
                excerpt: 'Önemli müsabakalar ve transfer haberleri.',
                date: new Date(Date.now() - 172800000).toISOString(),
                image: null
            },
            {
                id: 4,
                title: 'Bilim ve Teknoloji',
                excerpt: 'Yeni araştırmalar ve bilimsel keşifler.',
                date: new Date(Date.now() - 259200000).toISOString(),
                image: null
            },
            {
                id: 5,
                title: 'Kültür ve Sanat',
                excerpt: 'Sergiler, konserler ve kültürel etkinlikler.',
                date: new Date(Date.now() - 345600000).toISOString(),
                image: null
            },
            {
                id: 6,
                title: 'Sağlık ve Yaşam',
                excerpt: 'Sağlıklı yaşam için öneriler ve gelişmeler.',
                date: new Date(Date.now() - 432000000).toISOString(),
                image: null
            }
        ];
    },

    renderNews() {
        if (this.news.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; opacity: 0.7;">
                    <p>Henüz haber bulunmuyor.</p>
                </div>
            `;
        }

        return `
            <div class="news-grid">
                ${this.news.map(item => this.renderNewsCard(item)).join('')}
            </div>
        `;
    },

    renderNewsCard(item) {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString(i18n.currentLang, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        return `
            <div class="news-card" onclick="newsModule.openNewsDetail(${item.id})">
                <div class="news-image"></div>
                <div class="news-content">
                    <div class="news-title">${utils.sanitizeHTML(item.title)}</div>
                    <div class="news-excerpt">${utils.sanitizeHTML(item.excerpt)}</div>
                    <div style="margin-top: 12px; font-size: 12px; opacity: 0.6;">
                        ${formattedDate}
                    </div>
                </div>
            </div>
        `;
    },

    openNewsDetail(id) {
        const item = this.news.find(n => n.id === id);
        if (!item) return;

        windowManager.createWindow({
            title: item.title,
            content: `
                <div class="module-header">
                    <h2>${utils.sanitizeHTML(item.title)}</h2>
                    <p style="opacity: 0.7; font-size: 14px;">${new Date(item.date).toLocaleDateString(i18n.currentLang, { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
                <div style="line-height: 1.8;">
                    <p>${utils.sanitizeHTML(item.excerpt)}</p>
                    <p style="margin-top: 20px; opacity: 0.8;">
                        Bu bir örnek haber içeriğidir. Gerçek bir uygulamada, 
                        bu alan RSS feed veya haber API'sinden çekilen tam haber içeriğini gösterecektir.
                    </p>
                    <p style="margin-top: 20px; opacity: 0.8;">
                        Haber kaynağı entegrasyonu için RSS parser veya haber API'leri 
                        (NewsAPI, Guardian API vb.) kullanılabilir.
                    </p>
                </div>
            `,
            width: 700,
            height: 600
        });
    }
};
