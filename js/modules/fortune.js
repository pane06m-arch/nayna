// modules/fortune.js - Fortune Telling Module

window.fortuneModule = {
    fortunes: {
        tr: [
            "Yakında hayatınızda önemli bir değişiklik yaşayacaksınız.",
            "Uzun zamandır beklediğiniz bir haber size ulaşacak.",
            "Yeni bir dostluk kapınızı çalacak.",
            "Maddi konularda olumlu gelişmeler yaşanacak.",
            "Sağlığınıza özen göstermeniz gereken bir dönemdesiniz.",
            "Aşk hayatınızda heyecan verici günler sizi bekliyor.",
            "Kariyer hayatınızda yükseliş dönemi başlıyor.",
            "Ailenizden güzel haberler alacaksınız.",
            "Yaratıcılığınızı konuşturacağınız bir fırsat doğacak.",
            "Sabırlı olun, güzel günler yakında.",
            "Kendinize güvenin, başaracaksınız!",
            "Yeni bir yolculuk sizi bekliyor."
        ],
        en: [
            "An important change in your life is coming soon.",
            "News you've been waiting for will reach you.",
            "A new friendship will knock on your door.",
            "Positive developments in financial matters.",
            "You are in a period where you need to take care of your health.",
            "Exciting days await you in your love life.",
            "Your career is on the rise.",
            "You will receive good news from your family.",
            "An opportunity to express your creativity will arise.",
            "Be patient, good days are near.",
            "Believe in yourself, you will succeed!",
            "A new journey awaits you."
        ]
    },

    getContent() {
        return `
            <div class="fortune-container">
                <div class="module-header" style="text-align: center;">
                    <h2>${i18n.translate('fortune.title')}</h2>
                    <p>${i18n.translate('fortune.instruction')}</p>
                </div>
                
                <div id="fortuneCards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
                    ${this.renderCards()}
                </div>

                <div id="fortuneResult" style="display: none; text-align: center; min-height: 150px;">
                    <div class="fortune-result">
                        <p style="font-size: 20px; line-height: 1.8;" id="fortuneText"></p>
                        <button class="btn" style="margin-top: 20px;" onclick="fortuneModule.reset()">
                            🔄 Tekrar Dene
                        </button>
                    </div>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <div style="display: inline-flex; gap: 15px;">
                        <input 
                            type="text" 
                            id="fortuneName"
                            placeholder="Adınızı girin (opsiyonel)"
                            class="homework-input"
                            style="width: 250px;"
                        >
                    </div>
                </div>
            </div>
        `;
    },

    renderCards() {
        const cards = ['🔮', '🎴', '✨'];
        return cards.map((emoji, index) => `
            <div 
                class="fortune-card" 
                id="fortuneCard${index}"
                onclick="fortuneModule.selectCard(${index})"
            >
                ${emoji}
            </div>
        `).join('');
    },

    selectCard(index) {
        const card = document.getElementById(`fortuneCard${index}`);
        const result = document.getElementById('fortuneResult');
        const text = document.getElementById('fortuneText');
        const cards = document.getElementById('fortuneCards');

        if (!card || !result || !text) return;

        // Animate card flip
        card.classList.add('flipped');

        setTimeout(() => {
            // Get random fortune
            const fortuneList = this.fortunes[i18n.currentLang] || this.fortunes.tr;
            const randomFortune = fortuneList[Math.floor(Math.random() * fortuneList.length)];

            // Personalize if name is provided
            const nameInput = document.getElementById('fortuneName');
            const name = nameInput?.value.trim();
            let finalFortune = randomFortune;

            if (name) {
                finalFortune = `${name}, ${randomFortune.toLowerCase()}`;
            }

            // Show result
            text.textContent = finalFortune;
            cards.style.display = 'none';
            result.style.display = 'block';
            result.classList.add('fade-in');
        }, 600);
    },

    reset() {
        const cards = document.getElementById('fortuneCards');
        const result = document.getElementById('fortuneResult');

        if (cards && result) {
            result.style.display = 'none';
            cards.style.display = 'grid';

            // Reset card animations
            document.querySelectorAll('.fortune-card').forEach(card => {
                card.classList.remove('flipped');
            });
        }
    }
};
