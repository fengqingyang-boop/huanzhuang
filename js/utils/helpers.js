export const Helpers = {
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    hslToRgb(h, s, l) {
        h = (h % 360 + 360) % 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    },

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    getHueDifference(h1, h2) {
        const diff = Math.abs(h1 - h2);
        return diff > 180 ? 360 - diff : diff;
    },

    isNeutralColor(hsl) {
        return hsl.s < 15 || hsl.l < 10 || hsl.l > 90;
    },

    analyzeColorHarmony(color1Hsl, color2Hsl) {
        if (this.isNeutralColor(color1Hsl) || this.isNeutralColor(color2Hsl)) {
            return 'neutral';
        }

        const hueDiff = this.getHueDifference(color1Hsl.h, color2Hsl.h);

        if (hueDiff >= 170 && hueDiff <= 190) {
            return 'complementary';
        }
        
        if (hueDiff >= 20 && hueDiff <= 50) {
            return 'analogous';
        }
        
        if ((hueDiff >= 110 && hueDiff <= 130) || (hueDiff >= 230 && hueDiff <= 250)) {
            return 'triadic';
        }
        
        if (hueDiff < 20) {
            return 'monochromatic';
        }
        
        return 'clash';
    },

    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, hsl.l + percent);
        const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    },

    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.max(0, hsl.l - percent);
        const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    },

    saturateColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.s = Math.min(100, hsl.s + percent);
        const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    },

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    mapRange(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }
        return clonedObj;
    },

    mergeObjects(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeObjects(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.mergeObjects(target, ...sources);
    },

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    },

    getScoreRating(score, scoreRatings) {
        for (const key in scoreRatings) {
            const rating = scoreRatings[key];
            if (score >= rating.min && score <= rating.max) {
                return rating.label;
            }
        }
        return 'average';
    },

    checkStyleCompatibility(style1, style2, compatibilityMap) {
        if (!style1 || !style2) return false;
        const compatibleStyles = compatibilityMap[style1] || [];
        return compatibleStyles.includes(style2);
    },

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    formatScore(score, decimals = 0) {
        return Number(score).toFixed(decimals);
    },

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    easeOutQuad(t) {
        return t * (2 - t);
    },

    easeInQuad(t) {
        return t * t;
    }
};

export default Helpers;
