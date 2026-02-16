// modules/journal.js - Daily Journal Module

window.journalModule = {
    entries: {},
    currentDate: null,

    init() {
        this.loadEntries();
        this.currentDate = new Date().toISOString().split('T')[0];
    },

    getContent() {
        this.init();
        
        return `
            <div class="journal-container">
                <div class="journal-calendar">
                    <h3 style="margin-bottom: 15px; text-align: center;">${i18n.translate('journal.title')}</h3>
                    <div id="journalCalendar">${this.renderCalendar()}</div>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; font-size: 12px; opacity: 0.7;">
                        <p><strong>İpucu:</strong> Kayıtlarınız otomatik olarak kaydedilir.</p>
                    </div>
                </div>
                <div class="journal-editor">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 id="journalDate">${this.formatDate(new Date())}</h3>
                        <button class="btn btn-secondary" onclick="journalModule.exportEntry()">
                            📥 Dışa Aktar
                        </button>
                    </div>
                    <textarea 
                        class="journal-textarea" 
                        id="journalTextarea"
                        placeholder="${i18n.translate('journal.placeholder')}"
                        oninput="journalModule.saveEntry()"
                    >${this.getEntry(this.currentDate)}</textarea>
                    <div style="margin-top: 10px; display: flex; justify-content: space-between; opacity: 0.7; font-size: 13px;">
                        <span id="wordCount">0 kelime</span>
                        <span id="charCount">0 karakter</span>
                    </div>
                </div>
            </div>
            <script>
                journalModule.updateCounts();
            </script>
        `;
    },

    renderCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; font-size: 12px;">';
        
        // Day headers
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        days.forEach(day => {
            html += `<div style="text-align: center; opacity: 0.5; padding: 4px;">${day}</div>`;
        });
        
        // Empty cells for offset
        const startDay = (firstDay.getDay() + 6) % 7; // Monday as first day
        for (let i = 0; i < startDay; i++) {
            html += '<div></div>';
        }
        
        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = day === today.getDate();
            const hasEntry = this.entries[dateStr];
            
            html += `
                <div style="
                    text-align: center; 
                    padding: 6px; 
                    cursor: pointer;
                    background: ${isToday ? 'var(--apple-blue)' : hasEntry ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
                    border-radius: 6px;
                    ${hasEntry ? 'font-weight: 600;' : ''}
                " onclick="journalModule.selectDate('${dateStr}')">
                    ${day}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },

    formatDate(date) {
        return date.toLocaleDateString(i18n.currentLang, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },

    selectDate(dateStr) {
        this.currentDate = dateStr;
        const textarea = document.getElementById('journalTextarea');
        const dateDisplay = document.getElementById('journalDate');
        
        if (textarea && dateDisplay) {
            textarea.value = this.getEntry(dateStr);
            dateDisplay.textContent = this.formatDate(new Date(dateStr));
            this.updateCounts();
        }
    },

    getEntry(date) {
        return this.entries[date] || '';
    },

    saveEntry() {
        const textarea = document.getElementById('journalTextarea');
        if (textarea) {
            this.entries[this.currentDate] = textarea.value;
            utils.storage.set('journal_entries', this.entries);
            this.updateCounts();
        }
    },

    loadEntries() {
        this.entries = utils.storage.get('journal_entries', {});
    },

    updateCounts() {
        const textarea = document.getElementById('journalTextarea');
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');
        
        if (textarea && wordCount && charCount) {
            const text = textarea.value;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            const chars = text.length;
            
            wordCount.textContent = `${words} kelime`;
            charCount.textContent = `${chars} karakter`;
        }
    },

    exportEntry() {
        const text = this.getEntry(this.currentDate);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `journal-${this.currentDate}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
};
