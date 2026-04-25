import { GAME_DATA } from '../data/gameData.js';
import { Helpers } from '../utils/helpers.js';

export class ColorManager {
    constructor() {
        this.colors = GAME_DATA.colors;
        this.allColors = this.getAllColors();
        this.listeners = [];
    }

    getAllColors() {
        return [
            ...this.colors.primary,
            ...this.colors.accent,
            ...this.colors.earth
        ];
    }

    getColorsByCategory(category) {
        return this.colors[category] || [];
    }

    getColorById(colorId) {
        return this.allColors.find(c => c.id === colorId);
    }

    getColorHex(colorId) {
        const color = this.getColorById(colorId);
        return color ? color.hex : '#FFFFFF';
    }

    getColorHsl(colorId) {
        const color = this.getColorById(colorId);
        if (color) {
            return {
                h: color.hsl[0],
                s: color.hsl[1],
                l: color.hsl[2]
            };
        }
        return { h: 0, s: 0, l: 100 };
    }

    getRandomColor() {
        return Helpers.getRandomItem(this.allColors);
    }

    getRandomColorId() {
        return this.getRandomColor().id;
    }

    isNeutral(colorId) {
        const hsl = this.getColorHsl(colorId);
        return Helpers.isNeutralColor(hsl);
    }

    analyzeHarmony(colorId1, colorId2) {
        const hsl1 = this.getColorHsl(colorId1);
        const hsl2 = this.getColorHsl(colorId2);
        return Helpers.analyzeColorHarmony(hsl1, hsl2);
    }

    getHarmonyScore(colorId1, colorId2) {
        const harmonyType = this.analyzeHarmony(colorId1, colorId2);
        const harmonyMap = GAME_DATA.colorHarmony;
        return harmonyMap[harmonyType]?.score || 0;
    }

    getHarmonyDescription(colorId1, colorId2) {
        const harmonyType = this.analyzeHarmony(colorId1, colorId2);
        const harmonyMap = GAME_DATA.colorHarmony;
        return harmonyMap[harmonyType]?.description || '未知';
    }

    analyzeColorSet(colorIds) {
        if (!colorIds || colorIds.length < 2) {
            return { totalScore: 0, harmonies: [] };
        }

        let totalScore = 0;
        const harmonies = [];
        let pairCount = 0;

        for (let i = 0; i < colorIds.length; i++) {
            for (let j = i + 1; j < colorIds.length; j++) {
                const color1 = colorIds[i];
                const color2 = colorIds[j];
                
                if (color1 && color2 && color1 !== 'none' && color2 !== 'none') {
                    const score = this.getHarmonyScore(color1, color2);
                    const type = this.analyzeHarmony(color1, color2);
                    
                    totalScore += score;
                    harmonies.push({
                        color1,
                        color2,
                        score,
                        type
                    });
                    pairCount++;
                }
            }
        }

        return {
            totalScore,
            averageScore: pairCount > 0 ? totalScore / pairCount : 0,
            harmonies,
            pairCount
        };
    }

    getComplementaryColors(colorId) {
        const baseHsl = this.getColorHsl(colorId);
        const complementaryHue = (baseHsl.h + 180) % 360;
        
        return this.allColors.filter(color => {
            const hueDiff = Helpers.getHueDifference(color.hsl[0], complementaryHue);
            return hueDiff < 30 && color.id !== colorId;
        });
    }

    getAnalogousColors(colorId) {
        const baseHsl = this.getColorHsl(colorId);
        const leftHue = (baseHsl.h - 30 + 360) % 360;
        const rightHue = (baseHsl.h + 30) % 360;
        
        return this.allColors.filter(color => {
            const leftDiff = Helpers.getHueDifference(color.hsl[0], leftHue);
            const rightDiff = Helpers.getHueDifference(color.hsl[0], rightHue);
            return (leftDiff < 20 || rightDiff < 20) && color.id !== colorId;
        });
    }

    getTriadicColors(colorId) {
        const baseHsl = this.getColorHsl(colorId);
        const hue1 = (baseHsl.h + 120) % 360;
        const hue2 = (baseHsl.h + 240) % 360;
        
        return this.allColors.filter(color => {
            const diff1 = Helpers.getHueDifference(color.hsl[0], hue1);
            const diff2 = Helpers.getHueDifference(color.hsl[0], hue2);
            return (diff1 < 20 || diff2 < 20) && color.id !== colorId;
        });
    }

    getMonochromaticColors(colorId) {
        const baseHsl = this.getColorHsl(colorId);
        
        return this.allColors.filter(color => {
            const hueDiff = Helpers.getHueDifference(color.hsl[0], baseHsl.h);
            return hueDiff < 20 && color.id !== colorId;
        });
    }

    getRecommendedColors(colorId, style = 'complementary') {
        switch (style) {
            case 'complementary':
                return this.getComplementaryColors(colorId);
            case 'analogous':
                return this.getAnalogousColors(colorId);
            case 'triadic':
                return this.getTriadicColors(colorId);
            case 'monochromatic':
                return this.getMonochromaticColors(colorId);
            default:
                return [];
        }
    }

    generateColorPalette(baseColorId, count = 5) {
        const palette = [this.getColorById(baseColorId)];
        const complementary = this.getComplementaryColors(baseColorId);
        const analogous = this.getAnalogousColors(baseColorId);
        
        const availableColors = [...complementary, ...analogous].filter(
            c => c.id !== baseColorId && !palette.find(p => p.id === c.id)
        );
        
        while (palette.length < count && availableColors.length > 0) {
            const index = Math.floor(Math.random() * availableColors.length);
            palette.push(availableColors.splice(index, 1)[0]);
        }
        
        return palette;
    }

    isWarmColor(colorId) {
        const hsl = this.getColorHsl(colorId);
        return (hsl.h >= 0 && hsl.h <= 60) || (hsl.h >= 300 && hsl.h <= 360);
    }

    isCoolColor(colorId) {
        return !this.isWarmColor(colorId);
    }

    getTemperatureBalance(colorIds) {
        let warmCount = 0;
        let coolCount = 0;
        let neutralCount = 0;

        colorIds.forEach(id => {
            if (this.isNeutral(id)) {
                neutralCount++;
            } else if (this.isWarmColor(id)) {
                warmCount++;
            } else {
                coolCount++;
            }
        });

        const total = warmCount + coolCount;
        return {
            warmCount,
            coolCount,
            neutralCount,
            warmRatio: total > 0 ? warmCount / total : 0.5,
            coolRatio: total > 0 ? coolCount / total : 0.5,
            isBalanced: total > 0 && Math.abs(warmCount - coolCount) <= 1
        };
    }

    onColorChange(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(colorId, category) {
        this.listeners.forEach(listener => {
            try {
                listener(colorId, category);
            } catch (e) {
                console.error('Error in color change listener:', e);
            }
        });
    }

    lighten(colorId, percent = 20) {
        const hex = this.getColorHex(colorId);
        return Helpers.lightenColor(hex, percent);
    }

    darken(colorId, percent = 20) {
        const hex = this.getColorHex(colorId);
        return Helpers.darkenColor(hex, percent);
    }

    saturate(colorId, percent = 20) {
        const hex = this.getColorHex(colorId);
        return Helpers.saturateColor(hex, percent);
    }

    getColorContrast(colorId1, colorId2) {
        const hex1 = this.getColorHex(colorId1);
        const hex2 = this.getColorHex(colorId2);
        
        const rgb1 = Helpers.hexToRgb(hex1);
        const rgb2 = Helpers.hexToRgb(hex2);
        
        const l1 = this.getRelativeLuminance(rgb1);
        const l2 = this.getRelativeLuminance(rgb2);
        
        const light = Math.max(l1, l2);
        const dark = Math.min(l1, l2);
        
        return (light + 0.05) / (dark + 0.05);
    }

    getRelativeLuminance(rgb) {
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;
        
        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
}

export default ColorManager;
