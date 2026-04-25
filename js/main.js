import { SceneManager } from './core/SceneManager.js';
import { Character } from './models/Character.js';
import { LanguageManager } from './managers/LanguageManager.js';
import { ColorManager } from './managers/ColorManager.js';
import { ScoreManager } from './managers/ScoreManager.js';
import { UIController } from './managers/UIController.js';
import { GAME_DATA } from './data/gameData.js';

export class Game {
    constructor() {
        this.sceneManager = null;
        this.character = null;
        this.languageManager = null;
        this.colorManager = null;
        this.scoreManager = null;
        this.uiController = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('Initializing 3D Dress Up Game...');

            this.initManagers();
            await this.init3DScene();
            this.setupEventListeners();
            this.applyDefaultOutfit();
            this.uiController.hideLoading();

            this.isInitialized = true;
            console.log('Game initialized successfully!');

        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.handleInitializationError(error);
        }
    }

    initManagers() {
        this.languageManager = new LanguageManager().init();
        this.colorManager = new ColorManager();
        this.scoreManager = new ScoreManager(this.colorManager);
        this.uiController = new UIController(
            this,
            this.languageManager,
            this.colorManager
        ).init();
    }

    async init3DScene() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        this.sceneManager = new SceneManager().init(canvas);

        this.character = new Character().build();
        this.sceneManager.setCharacter(this.character);

        await this.waitForSceneReady();
    }

    waitForSceneReady() {
        return new Promise((resolve) => {
            let frames = 0;
            const checkReady = () => {
                frames++;
                if (frames >= 3 || this.sceneManager.isInitialized) {
                    resolve();
                } else {
                    requestAnimationFrame(checkReady);
                }
            };
            checkReady();
        });
    }

    setupEventListeners() {
        this.uiController.on('styleChange', (data) => {
            this.handleClothingChange(data);
        });

        this.uiController.on('colorChange', (data) => {
            this.handleClothingChange(data);
        });

        this.uiController.on('reset', (outfit) => {
            this.applyOutfit(outfit);
        });

        this.uiController.on('randomize', (outfit) => {
            this.applyOutfit(outfit);
        });

        this.uiController.on('confirm', (outfit) => {
            this.handleConfirm(outfit);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleClothingChange(data) {
        const { category, style, color } = data;
        
        if (!style) return;

        let actualColor = color;
        if (style !== 'none' && !actualColor) {
            actualColor = GAME_DATA.defaultColors[category];
        }

        if (this.character) {
            const colorHex = this.colorManager.getColorHex(actualColor);
            this.character.updateClothing(category, style, colorHex);
        }
    }

    applyOutfit(outfit) {
        if (!this.character) return;

        const categories = ['hat', 'glasses', 'top', 'pants', 'shoes'];

        categories.forEach(category => {
            const item = outfit[category];
            if (item) {
                const { style, color } = item;
                const colorHex = this.colorManager.getColorHex(color);
                this.character.updateClothing(category, style, colorHex);
            }
        });
    }

    applyDefaultOutfit() {
        this.applyOutfit(GAME_DATA.defaultOutfit);
    }

    handleConfirm(outfit) {
        const scoreResult = this.scoreManager.calculateScore(outfit);
        
        this.uiController.setLastScore(scoreResult.total);
        this.uiController.showScoreModal(scoreResult);

        console.log('Score calculated:', scoreResult);
    }

    handleResize() {
        if (this.sceneManager) {
            this.sceneManager.handleResize();
        }
    }

    handleInitializationError(error) {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.innerHTML = `
                <div style="color: #ef4444; text-align: center;">
                    <p style="font-size: 1.5rem; margin-bottom: 1rem;">❌ 初始化失败</p>
                    <p style="color: #94a3b8;">${error.message}</p>
                    <p style="color: #64748b; margin-top: 1rem; font-size: 0.875rem;">
                        请确保浏览器支持Three.js和WebGL
                    </p>
                </div>
            `;
        }
    }

    getSceneManager() {
        return this.sceneManager;
    }

    getCharacter() {
        return this.character;
    }

    getLanguageManager() {
        return this.languageManager;
    }

    getColorManager() {
        return this.colorManager;
    }

    getScoreManager() {
        return this.scoreManager;
    }

    getUIController() {
        return this.uiController;
    }

    getCurrentOutfit() {
        return this.uiController ? this.uiController.getCurrentOutfit() : null;
    }

    setOutfit(outfit) {
        if (this.uiController) {
            this.uiController.setCurrentOutfit(outfit);
        }
        this.applyOutfit(outfit);
    }

    resetGame() {
        if (this.uiController) {
            this.uiController.resetOutfit();
        }
    }

    randomizeOutfit() {
        if (this.uiController) {
            this.uiController.randomizeOutfit();
        }
    }

    showScore() {
        const outfit = this.getCurrentOutfit();
        if (outfit) {
            this.handleConfirm(outfit);
        }
    }

    rotateCharacter(angle) {
        if (this.sceneManager) {
            this.sceneManager.rotateCharacter(angle);
        }
    }

    setAutoRotate(enabled) {
        if (this.sceneManager) {
            this.sceneManager.setAutoRotate(enabled);
        }
    }

    setLanguage(localeCode) {
        if (this.languageManager) {
            return this.languageManager.setLocale(localeCode);
        }
        return false;
    }

    getSupportedLanguages() {
        if (this.languageManager) {
            return this.languageManager.getSupportedLocales();
        }
        return [];
    }

    dispose() {
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        this.isInitialized = false;
    }
}

window.Game = Game;
