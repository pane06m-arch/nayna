// modules/homework.js - Homework Module

window.homeworkModule = {
    getContent() {
        return `
            <div class="module-header">
                <h2>${i18n.translate('homework.title')}</h2>
                <p>Akademik ödev ve rapor hazırlama aracı</p>
            </div>
            <div class="homework-editor">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Ödev Başlığı</label>
                    <input 
                        type="text" 
                        id="homeworkTitle"
                        placeholder="Ödev başlığı girin..."
                        class="homework-input"
                    >
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Öğrenci Adı</label>
                        <input 
                            type="text" 
                            id="studentName"
                            placeholder="Adınız Soyadınız"
                            class="homework-input"
                        >
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Numara</label>
                        <input 
                            type="text" 
                            id="studentNumber"
                            placeholder="Öğrenci numarası"
                            class="homework-input"
                        >
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Ders Adı</label>
                    <input 
                        type="text" 
                        id="courseName"
                        placeholder="Ders adı"
                        class="homework-input"
                    >
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Ödev İçeriği</label>
                    <textarea 
                        id="homeworkContent"
                        placeholder="Ödev içeriğinizi buraya yazın..."
                        class="journal-textarea"
                        style="min-height: 300px;"
                        oninput="homeworkModule.updateWordCount()"
                    ></textarea>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Kaynakça</label>
                    <textarea 
                        id="homeworkReferences"
                        placeholder="Kaynakları listeleyin (her satıra bir kaynak)..."
                        class="journal-textarea"
                        style="min-height: 120px;"
                    ></textarea>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="opacity: 0.7; font-size: 13px;">
                        <span id="homeworkWordCount">0 kelime</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="homeworkModule.previewHomework()">
                            👁️ Önizleme
                        </button>
                        <button class="btn btn-secondary" onclick="homeworkModule.saveHomework()">
                            💾 Kaydet
                        </button>
                        <button class="btn" onclick="homeworkModule.exportPDF()">
                            ${i18n.translate('homework.export')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    updateWordCount() {
        const content = document.getElementById('homeworkContent');
        const counter = document.getElementById('homeworkWordCount');
        
        if (content && counter) {
            const text = content.value;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            counter.textContent = `${words} kelime`;
        }
    },

    getHomeworkData() {
        return {
            title: document.getElementById('homeworkTitle')?.value || '',
            studentName: document.getElementById('studentName')?.value || '',
            studentNumber: document.getElementById('studentNumber')?.value || '',
            courseName: document.getElementById('courseName')?.value || '',
            content: document.getElementById('homeworkContent')?.value || '',
            references: document.getElementById('homeworkReferences')?.value || ''
        };
    },

    previewHomework() {
        const data = this.getHomeworkData();
        
        if (!data.title || !data.content) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }

        const previewContent = this.generatePreviewHTML(data);
        
        windowManager.createWindow({
            title: 'Ödev Önizleme: ' + data.title,
            content: previewContent,
            width: 800,
            height: 700
        });
    },

    generatePreviewHTML(data) {
        const references = data.references.split('\n').filter(r => r.trim());
        
        return `
            <div style="background: white; color: #333; padding: 60px; line-height: 1.8; font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 60px;">
                    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 40px;">${utils.sanitizeHTML(data.title)}</h1>
                    ${data.studentName ? `<p style="margin: 10px 0;">${utils.sanitizeHTML(data.studentName)}</p>` : ''}
                    ${data.studentNumber ? `<p style="margin: 10px 0;">Öğrenci No: ${utils.sanitizeHTML(data.studentNumber)}</p>` : ''}
                    ${data.courseName ? `<p style="margin: 10px 0;">${utils.sanitizeHTML(data.courseName)}</p>` : ''}
                    <p style="margin: 10px 0;">${new Date().toLocaleDateString('tr-TR')}</p>
                </div>

                <div style="margin-bottom: 40px; text-align: justify;">
                    ${utils.sanitizeHTML(data.content).replace(/\n/g, '</p><p style="margin: 15px 0;">')}
                </div>

                ${references.length > 0 ? `
                    <div style="margin-top: 60px;">
                        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">KAYNAKÇA</h2>
                        <ol style="padding-left: 20px;">
                            ${references.map(ref => `<li style="margin: 10px 0;">${utils.sanitizeHTML(ref)}</li>`).join('')}
                        </ol>
                    </div>
                ` : ''}
            </div>
        `;
    },

    saveHomework() {
        const data = this.getHomeworkData();
        
        if (!data.title) {
            alert('Lütfen ödev başlığı girin.');
            return;
        }

        data.savedAt = new Date().toISOString();
        
        let savedHomeworks = utils.storage.get('homeworks', []);
        const existingIndex = savedHomeworks.findIndex(h => h.title === data.title);
        
        if (existingIndex >= 0) {
            savedHomeworks[existingIndex] = data;
        } else {
            savedHomeworks.push(data);
        }
        
        utils.storage.set('homeworks', savedHomeworks);
        alert('Ödev kaydedildi!');
    },

    exportPDF() {
        const data = this.getHomeworkData();
        
        if (!data.title || !data.content) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }

        // Create a simple HTML document for printing
        const printContent = this.generatePreviewHTML(data);
        const printWindow = window.open('', '', 'width=800,height=600');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${data.title}</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 20px; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
};
