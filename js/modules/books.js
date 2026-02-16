// modules/books.js - Books & Poetry Module

window.booksModule = {
    getContent() {
        return `
            <div class="module-header">
                <h2>${i18n.translate('books.title')}</h2>
                <p>Odaklanma modunda yazmaya başla</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <input 
                        type="text" 
                        id="bookTitle"
                        placeholder="Başlık girin..."
                        class="homework-input"
                        style="width: 300px;"
                    >
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="booksModule.toggleFocusMode()">
                        🎯 Odaklanma Modu
                    </button>
                    <button class="btn" onclick="booksModule.saveWork()">
                        💾 Kaydet
                    </button>
                </div>
            </div>
            <div class="books-editor" id="booksEditor">
                <textarea 
                    class="books-textarea" 
                    id="booksTextarea"
                    placeholder="${i18n.translate('books.placeholder')}"
                    oninput="booksModule.updateStats()"
                ></textarea>
            </div>
            <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; opacity: 0.7; font-size: 13px;">
                <div>
                    <span id="bookWordCount">0 kelime</span>
                    <span style="margin: 0 10px;">•</span>
                    <span id="bookCharCount">0 karakter</span>
                    <span style="margin: 0 10px;">•</span>
                    <span id="bookPageCount">0 sayfa</span>
                </div>
                <span id="bookLastSaved">Kaydedilmedi</span>
            </div>
        `;
    },

    toggleFocusMode() {
        const editor = document.getElementById('booksEditor');
        
        if (editor.classList.contains('focus-mode')) {
            editor.classList.remove('focus-mode');
            document.exitFullscreen?.();
        } else {
            editor.classList.add('focus-mode');
            editor.requestFullscreen?.();
        }
    },

    updateStats() {
        const textarea = document.getElementById('booksTextarea');
        const wordCount = document.getElementById('bookWordCount');
        const charCount = document.getElementById('bookCharCount');
        const pageCount = document.getElementById('bookPageCount');
        
        if (textarea && wordCount && charCount && pageCount) {
            const text = textarea.value;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            const chars = text.length;
            const pages = Math.ceil(words / 250); // Approx 250 words per page
            
            wordCount.textContent = `${words} kelime`;
            charCount.textContent = `${chars} karakter`;
            pageCount.textContent = `${pages} sayfa`;
        }
    },

    saveWork() {
        const title = document.getElementById('bookTitle')?.value || 'Untitled';
        const text = document.getElementById('booksTextarea')?.value || '';
        
        if (!text.trim()) {
            alert('Yazmaya başlayın!');
            return;
        }

        // Save to storage
        const work = {
            title,
            text,
            savedAt: new Date().toISOString()
        };

        let savedWorks = utils.storage.get('books_works', []);
        const existingIndex = savedWorks.findIndex(w => w.title === title);
        
        if (existingIndex >= 0) {
            savedWorks[existingIndex] = work;
        } else {
            savedWorks.push(work);
        }
        
        utils.storage.set('books_works', savedWorks);

        // Update last saved indicator
        const lastSaved = document.getElementById('bookLastSaved');
        if (lastSaved) {
            lastSaved.textContent = `Kaydedildi: ${new Date().toLocaleTimeString(i18n.currentLang)}`;
        }

        alert('Çalışmanız kaydedildi!');
    },

    loadWork(title) {
        const savedWorks = utils.storage.get('books_works', []);
        const work = savedWorks.find(w => w.title === title);
        
        if (work) {
            const titleInput = document.getElementById('bookTitle');
            const textarea = document.getElementById('booksTextarea');
            
            if (titleInput) titleInput.value = work.title;
            if (textarea) textarea.value = work.text;
            
            this.updateStats();
        }
    },

    exportWork() {
        const title = document.getElementById('bookTitle')?.value || 'Untitled';
        const text = document.getElementById('booksTextarea')?.value || '';
        
        if (!text.trim()) {
            alert('Dışa aktarılacak içerik yok!');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
};
