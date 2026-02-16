// modules/twitter.js - Twitter/X Automation Module

window.twitterModule = {
    maxChars: 280,

    getContent() {
        return `
            <div class="module-header">
                <h2>${i18n.translate('twitter.title')}</h2>
                <p>Tweet oluştur, zamanla ve paylaş</p>
            </div>
            <div class="twitter-composer">
                <textarea 
                    class="tweet-textarea" 
                    id="tweetTextarea"
                    placeholder="${i18n.translate('twitter.placeholder')}"
                    maxlength="${this.maxChars}"
                    oninput="twitterModule.updateCharCount()"
                ></textarea>
                <div class="tweet-controls">
                    <div>
                        <span class="char-counter" id="charCounter">0/${this.maxChars}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="twitterModule.scheduleTweet()">
                            ⏰ Zamanla
                        </button>
                        <button class="btn" onclick="twitterModule.sendTweet()">
                            ${i18n.translate('twitter.send')}
                        </button>
                    </div>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">Zamanlanmış Tweetler</h3>
                <div id="scheduledTweets">${this.renderScheduledTweets()}</div>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="opacity: 0.7; font-size: 14px;">
                    <strong>Not:</strong> Bu modül Twitter/X API entegrasyonu gerektirir. 
                    Gerçek bir uygulamada, OAuth kimlik doğrulaması ve Twitter API v2 kullanılmalıdır.
                </p>
            </div>
        `;
    },

    updateCharCount() {
        const textarea = document.getElementById('tweetTextarea');
        const counter = document.getElementById('charCounter');
        
        if (textarea && counter) {
            const length = textarea.value.length;
            counter.textContent = `${length}/${this.maxChars}`;
            
            // Update counter color based on remaining chars
            if (length > this.maxChars - 20) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
            
            if (length > this.maxChars) {
                counter.classList.add('error');
            } else {
                counter.classList.remove('error');
            }
        }
    },

    sendTweet() {
        const textarea = document.getElementById('tweetTextarea');
        
        if (!textarea || !textarea.value.trim()) {
            alert('Lütfen bir tweet metni girin.');
            return;
        }

        if (textarea.value.length > this.maxChars) {
            alert(`Tweet çok uzun. Maximum ${this.maxChars} karakter olmalıdır.`);
            return;
        }

        // Simulate sending tweet
        const tweet = textarea.value;
        console.log('Sending tweet:', tweet);
        
        // In a real app, this would call the Twitter API
        alert('Tweet gönderildi! (Simülasyon)\n\n' + tweet);
        
        // Clear textarea
        textarea.value = '';
        this.updateCharCount();
    },

    scheduleTweet() {
        const textarea = document.getElementById('tweetTextarea');
        
        if (!textarea || !textarea.value.trim()) {
            alert('Lütfen bir tweet metni girin.');
            return;
        }

        // Simple scheduling dialog
        const dateStr = prompt('Tarih ve saat girin (örn: 2024-12-25 14:30):');
        
        if (dateStr) {
            const scheduled = {
                id: Date.now(),
                text: textarea.value,
                scheduledFor: dateStr,
                status: 'scheduled'
            };

            // Save to storage
            let scheduledTweets = utils.storage.get('scheduled_tweets', []);
            scheduledTweets.push(scheduled);
            utils.storage.set('scheduled_tweets', scheduledTweets);

            alert('Tweet zamanlandı!');
            textarea.value = '';
            this.updateCharCount();

            // Refresh scheduled list
            const container = document.getElementById('scheduledTweets');
            if (container) {
                container.innerHTML = this.renderScheduledTweets();
            }
        }
    },

    renderScheduledTweets() {
        const scheduled = utils.storage.get('scheduled_tweets', []);
        
        if (scheduled.length === 0) {
            return `
                <div style="padding: 20px; text-align: center; opacity: 0.5;">
                    Zamanlanmış tweet bulunmuyor.
                </div>
            `;
        }

        return scheduled.map(tweet => `
            <div style="padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 10px;">
                <p style="margin-bottom: 8px;">${utils.sanitizeHTML(tweet.text)}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; opacity: 0.7;">
                    <span>⏰ ${tweet.scheduledFor}</span>
                    <button class="btn-secondary" style="padding: 4px 12px; font-size: 12px;" onclick="twitterModule.deleteScheduled(${tweet.id})">
                        Sil
                    </button>
                </div>
            </div>
        `).join('');
    },

    deleteScheduled(id) {
        let scheduled = utils.storage.get('scheduled_tweets', []);
        scheduled = scheduled.filter(t => t.id !== id);
        utils.storage.set('scheduled_tweets', scheduled);

        // Refresh list
        const container = document.getElementById('scheduledTweets');
        if (container) {
            container.innerHTML = this.renderScheduledTweets();
        }
    }
};
