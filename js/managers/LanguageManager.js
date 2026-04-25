import { LOCALES, DEFAULT_LOCALE } from '../data/locales.js';
import { Helpers } from '../utils/helpers.js';

export class LanguageManager {
    constructor() {
        this.currentLocale = DEFAULT_LOCALE;
        this.supportedLocales = Object.keys(LOCALES);
        this.listeners = [];
    }

    init() {
        const savedLocale = this.getSavedLocale();
        if (savedLocale && this.supportedLocales.includes(savedLocale)) {
            this.currentLocale = savedLocale;
        }
        this.setupLanguageButtons();
        this.updateAllTranslations();
        return this;
    }

    getSavedLocale() {
        try {
            return localStorage.getItem('game_locale');
        } catch (e) {
            return null;
        }
    }

    saveLocale() {
        try {
            localStorage.setItem('game_locale', this.currentLocale);
        } catch (e) {
            console.warn('Could not save locale to localStorage:', e);
        }
    }

    setLocale(localeCode) {
        if (!this.supportedLocales.includes(localeCode)) {
            console.warn(`Locale "${localeCode}" is not supported`);
            return false;
        }

        if (this.currentLocale === localeCode) {
            return true;
        }

        this.currentLocale = localeCode;
        this.saveLocale();
        this.updateAllTranslations();
        this.notifyListeners();
        this.updateLanguageButtons();

        return true;
    }

    getLocale() {
        return this.currentLocale;
    }

    getTranslations() {
        return LOCALES[this.currentLocale];
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.getTranslations();
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value === 'string') {
            return this.interpolate(value, params);
        }

        return key;
    }

    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    updateAllTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation !== key) {
                el.textContent = translation;
            }
        });

        const titleElement = document.getElementById('game-title');
        if (titleElement) {
            titleElement.textContent = this.t('title');
        }

        const hintElement = document.getElementById('rotation-hint');
        if (hintElement) {
            hintElement.textContent = this.t('hint');
        }

        this.updateStyleOptions();
    }

    updateStyleOptions() {
        const styleOptions = document.querySelectorAll('.option-item[data-style-id]');
        styleOptions.forEach(el => {
            const category = el.closest('[data-category]')?.getAttribute('data-category');
            const styleId = el.getAttribute('data-style-id');
            
            if (category && styleId) {
                const key = `styles.${category}.${styleId}`;
                const translation = this.t(key);
                
                if (translation !== key) {
                    const titleAttr = el.getAttribute('title');
                    if (titleAttr) {
                        el.setAttribute('title', translation);
                    }
                }
            }
        });
    }

    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            const locale = btn.getAttribute('data-lang');
            if (locale) {
                btn.addEventListener('click', () => {
                    this.setLocale(locale);
                });
            }
        });
        this.updateLanguageButtons();
    }

    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            const locale = btn.getAttribute('data-lang');
            if (locale === this.currentLocale) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    onLanguageChange(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.currentLocale);
            } catch (e) {
                console.error('Error in language change listener:', e);
            }
        });
    }

    getSupportedLocales() {
        return [...this.supportedLocales];
    }

    getLocaleInfo(localeCode) {
        if (!this.supportedLocales.includes(localeCode)) {
            return null;
        }
        return {
            code: localeCode,
            translations: LOCALES[localeCode]
        };
    }
}

export default LanguageManager;
