// modules/agriculture.js - Agriculture & Livestock Module

window.agricultureModule = {
    getContent() {
        return `
            <div class="module-header">
                <h2>${i18n.translate('agriculture.title')}</h2>
                <p>${i18n.translate('agriculture.description')}</p>
            </div>
            <div class="agriculture-dashboard">
                <div class="stat-card">
                    <div class="stat-label">Buğday Fiyatı</div>
                    <div class="stat-value">₺8.50</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>+2.5%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Arpa Fiyatı</div>
                    <div class="stat-value">₺7.20</div>
                    <div class="stat-change negative">
                        <span>↓</span>
                        <span>-1.2%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Süt Fiyatı</div>
                    <div class="stat-value">₺12.00</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>+0.8%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Et Fiyatı</div>
                    <div class="stat-value">₺150.00</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>+3.5%</span>
                    </div>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">Fiyat Trendleri</h3>
                <div style="padding: 20px; background: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <p style="opacity: 0.7;">Grafik görselleştirmesi burada yer alacak.</p>
                    <p style="opacity: 0.5; font-size: 13px; margin-top: 10px;">Chart.js veya benzeri bir kütüphane ile gerçek grafikler eklenebilir.</p>
                </div>
            </div>
        `;
    },

    getPricesContent() {
        return `
            <div class="module-header">
                <h2>Güncel Fiyatlar</h2>
                <p>Tarım ürünleri ve hayvancılık piyasa fiyatları</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                        <th style="padding: 12px; text-align: left;">Ürün</th>
                        <th style="padding: 12px; text-align: right;">Fiyat</th>
                        <th style="padding: 12px; text-align: right;">Değişim</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generatePriceRows()}
                </tbody>
            </table>
        `;
    },

    generatePriceRows() {
        const products = [
            { name: 'Buğday', price: '₺8.50', change: '+2.5%', positive: true },
            { name: 'Arpa', price: '₺7.20', change: '-1.2%', positive: false },
            { name: 'Mısır', price: '₺6.80', change: '+1.8%', positive: true },
            { name: 'Süt', price: '₺12.00', change: '+0.8%', positive: true },
            { name: 'Et (Dana)', price: '₺150.00', change: '+3.5%', positive: true },
            { name: 'Et (Kuzu)', price: '₺180.00', change: '+2.1%', positive: true },
            { name: 'Tavuk', price: '₺45.00', change: '-0.5%', positive: false },
            { name: 'Yumurta', price: '₺35.00', change: '+1.2%', positive: true }
        ];

        return products.map(product => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <td style="padding: 12px;">${product.name}</td>
                <td style="padding: 12px; text-align: right; font-weight: 600;">${product.price}</td>
                <td style="padding: 12px; text-align: right; color: ${product.positive ? 'var(--apple-green)' : 'var(--apple-red)'};">
                    ${product.positive ? '↑' : '↓'} ${product.change}
                </td>
            </tr>
        `).join('');
    },

    getAnalyticsContent() {
        return `
            <div class="module-header">
                <h2>Analitik Dashboard</h2>
                <p>Detaylı piyasa analizi ve raporlama</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="padding: 20px; background: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="font-size: 16px; margin-bottom: 10px;">Ortalama Fiyat Artışı</h3>
                    <p style="font-size: 32px; font-weight: 700; color: var(--apple-green);">+2.3%</p>
                    <p style="opacity: 0.7; font-size: 13px;">Son 30 günde</p>
                </div>
                <div style="padding: 20px; background: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="font-size: 16px; margin-bottom: 10px;">Toplam İşlem Hacmi</h3>
                    <p style="font-size: 32px; font-weight: 700;">₺2.5M</p>
                    <p style="opacity: 0.7; font-size: 13px;">Bu ay</p>
                </div>
                <div style="padding: 20px; background: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="font-size: 16px; margin-bottom: 10px;">Aktif Ürün Sayısı</h3>
                    <p style="font-size: 32px; font-weight: 700;">48</p>
                    <p style="opacity: 0.7; font-size: 13px;">Takip ediliyor</p>
                </div>
            </div>
            <div style="padding: 30px; background: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                <p style="opacity: 0.7; margin-bottom: 10px;">Detaylı grafik ve veri görselleştirme</p>
                <p style="opacity: 0.5; font-size: 13px;">İleriki versiyonlarda Chart.js entegrasyonu ile interaktif grafikler eklenecek</p>
            </div>
        `;
    }
};
