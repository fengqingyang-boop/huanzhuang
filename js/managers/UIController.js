import { GAME_DATA } from '../data/gameData.js';
import { Helpers } from '../utils/helpers.js';

export class UIController {
    constructor(game, languageManager, colorManager) {
        this.game = game;
        this.languageManager = languageManager;
        this.colorManager = colorManager;
        this.currentCategory = 'hat';
        this.currentOutfit = Helpers.deepClone(GAME_DATA.defaultOutfit);
        this.listeners = [];
    }

    init() {
        this.setupTabs();
        this.setupStyleSelector();
        this.setupColorSelector();
        this.setupActionButtons();
        this.setupModal();
        
        this.updateAllSelectors();
        this.updateUIWithLanguage();

        this.languageManager.onLanguageChange(() => {
            this.updateUIWithLanguage();
        });

        return this;
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                if (category) {
                    this.setCurrentCategory(category);
                }
            });
        });
    }

    setCurrentCategory(category) {
        if (this.currentCategory === category) return;

        this.currentCategory = category;

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            const btnCategory = btn.getAttribute('data-category');
            if (btnCategory === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.updateStyleSelector();
        this.updateColorSelector();
    }

    setupStyleSelector() {
        this.updateStyleSelector();
    }

    updateStyleSelector() {
        const container = document.getElementById('style-options');
        if (!container) return;

        container.innerHTML = '';

        const styles = GAME_DATA.styles[this.currentCategory] || [];

        styles.forEach(style => {
            const option = this.createStyleOption(style);
            container.appendChild(option);
        });
    }

    createStyleOption(style) {
        const option = document.createElement('div');
        option.className = 'option-item';
        
        if (style.id === 'none') {
            option.classList.add('none');
        }

        const currentStyle = this.currentOutfit[this.currentCategory]?.style;
        if (style.id === currentStyle) {
            option.classList.add('selected');
        }

        option.setAttribute('data-style-id', style.id);
        option.textContent = style.icon;

        const title = this.languageManager.t(`styles.${this.currentCategory}.${style.id}`);
        option.setAttribute('title', title);

        option.addEventListener('click', () => {
            this.selectStyle(style.id);
        });

        return option;
    }

    selectStyle(styleId) {
        this.currentOutfit[this.currentCategory] = this.currentOutfit[this.currentCategory] || {};
        this.currentOutfit[this.currentCategory].style = styleId;

        if (styleId !== 'none' && !this.currentOutfit[this.currentCategory].color) {
            this.currentOutfit[this.currentCategory].color = GAME_DATA.defaultColors[this.currentCategory];
        }

        const options = document.querySelectorAll('.option-item[data-style-id]');
        options.forEach(opt => {
            const id = opt.getAttribute('data-style-id');
            if (id === styleId) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        this.notifyListeners('styleChange', {
            category: this.currentCategory,
            style: styleId,
            color: this.currentOutfit[this.currentCategory].color
        });
    }

    setupColorSelector() {
        this.updateColorSelector();
    }

    updateColorSelector() {
        const container = document.getElementById('color-options');
        if (!container) return;

        container.innerHTML = '';

        const allColors = this.colorManager.getAllColors();
        const currentColor = this.currentOutfit[this.currentCategory]?.color;

        allColors.forEach(color => {
            const option = this.createColorOption(color, currentColor);
            container.appendChild(option);
        });
    }

    createColorOption(color, selectedColorId) {
        const option = document.createElement('div');
        option.className = 'color-item';
        
        if (color.id === selectedColorId) {
            option.classList.add('selected');
        }

        option.setAttribute('data-color-id', color.id);
        option.style.backgroundColor = color.hex;
        option.setAttribute('title', color.name);

        option.addEventListener('click', () => {
            this.selectColor(color.id);
        });

        return option;
    }

    selectColor(colorId) {
        this.currentOutfit[this.currentCategory] = this.currentOutfit[this.currentCategory] || {};
        this.currentOutfit[this.currentCategory].color = colorId;

        const colorOptions = document.querySelectorAll('.color-item');
        colorOptions.forEach(opt => {
            const id = opt.getAttribute('data-color-id');
            if (id === colorId) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        this.notifyListeners('colorChange', {
            category: this.currentCategory,
            style: this.currentOutfit[this.currentCategory].style,
            color: colorId
        });
    }

    setupActionButtons() {
        const resetBtn = document.getElementById('reset-btn');
        const randomBtn = document.getElementById('random-btn');
        const confirmBtn = document.getElementById('confirm-btn');

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetOutfit());
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.randomizeOutfit());
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmOutfit());
        }
    }

    resetOutfit() {
        this.currentOutfit = Helpers.deepClone(GAME_DATA.defaultOutfit);
        this.updateAllSelectors();

        this.notifyListeners('reset', this.currentOutfit);
    }

    randomizeOutfit() {
        const categories = ['hat', 'glasses', 'top', 'pants', 'shoes'];
        const allColors = this.colorManager.getAllColors();

        categories.forEach(category => {
            const styles = GAME_DATA.styles[category].filter(s => s.id !== 'none');
            const randomStyle = Helpers.getRandomItem(styles);
            const randomColor = Helpers.getRandomItem(allColors);

            this.currentOutfit[category] = {
                style: randomStyle.id,
                color: randomColor.id
            };
        });

        this.updateAllSelectors();

        this.notifyListeners('randomize', this.currentOutfit);
    }

    confirmOutfit() {
        this.notifyListeners('confirm', this.currentOutfit);
    }

    setupModal() {
        const modal = document.getElementById('score-modal');
        const closeBtn = document.getElementById('close-modal-btn');
        const shareBtn = document.getElementById('share-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareResult();
            });
        }
    }

    showScoreModal(scoreResult) {
        const modal = document.getElementById('score-modal');
        if (!modal) return;

        const scoreValue = document.getElementById('score-value');
        const scoreRating = document.getElementById('score-rating');
        const scoreCircle = document.getElementById('score-circle');

        if (scoreValue) {
            scoreValue.textContent = scoreResult.total;
        }

        if (scoreRating) {
            scoreRating.textContent = this.languageManager.t(`score.${scoreResult.rating}`);
        }

        if (scoreCircle) {
            const percent = (scoreResult.total / 100) * 100;
            scoreCircle.style.setProperty('--score-percent', `${percent}%`);
        }

        this.updateScoreDetails(scoreResult.breakdown);
        this.updateScoreComments(scoreResult.rating);

        modal.classList.remove('hidden');
    }

    updateScoreDetails(breakdown) {
        const styleScore = document.getElementById('style-score');
        const colorScore = document.getElementById('color-score');
        const trendScore = document.getElementById('trend-score');
        const overallScore = document.getElementById('overall-score');

        if (styleScore) {
            styleScore.textContent = `${breakdown.style.score}/${breakdown.style.max}`;
        }

        if (colorScore) {
            colorScore.textContent = `${breakdown.color.score}/${breakdown.color.max}`;
        }

        if (trendScore) {
            trendScore.textContent = `${breakdown.trend.score}/${breakdown.trend.max}`;
        }

        if (overallScore) {
            overallScore.textContent = `${breakdown.balance.score}/${breakdown.balance.max}`;
        }
    }

    updateScoreComments(rating) {
        const commentsElement = document.querySelector('#score-comments p');
        if (!commentsElement) return;

        const commentKey = `score.comment.${rating}`;
        const comment = this.languageManager.t(commentKey);
        
        if (comment !== commentKey) {
            commentsElement.textContent = comment;
        }
    }

    closeModal() {
        const modal = document.getElementById('score-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: this.languageManager.t('title'),
                text: `我在3D换装游戏中获得了${this.lastScore || 0}分！快来试试吧！`
            }).catch(console.error);
        } else {
            const text = `我在3D换装游戏中获得了${this.lastScore || 0}分！`;
            navigator.clipboard.writeText(text).then(() => {
                alert('结果已复制到剪贴板！');
            }).catch(() => {
                alert(text);
            });
        }
    }

    setLastScore(score) {
        this.lastScore = score;
    }

    updateAllSelectors() {
        this.updateStyleSelector();
        this.updateColorSelector();
    }

    updateUIWithLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.languageManager.t(key);
            if (translation !== key) {
                el.textContent = translation;
            }
        });

        const styleOptions = document.querySelectorAll('.option-item[data-style-id]');
        styleOptions.forEach(opt => {
            const styleId = opt.getAttribute('data-style-id');
            const title = this.languageManager.t(`styles.${this.currentCategory}.${styleId}`);
            if (title !== `styles.${this.currentCategory}.${styleId}`) {
                opt.setAttribute('title', title);
            }
        });
    }

    getCurrentOutfit() {
        return Helpers.deepClone(this.currentOutfit);
    }

    setCurrentOutfit(outfit) {
        this.currentOutfit = Helpers.deepClone(outfit);
        this.updateAllSelectors();
    }

    on(event, callback) {
        if (typeof callback === 'function') {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }

        return () => {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(l => l !== callback);
            }
        };
    }

    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in ${event} listener:`, e);
                }
            });
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    showLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }
}

export default UIController;
