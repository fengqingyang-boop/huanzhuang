import { GAME_DATA } from '../data/gameData.js';
import { Helpers } from '../utils/helpers.js';

export class ScoreManager {
    constructor(colorManager) {
        this.colorManager = colorManager;
        this.scoringConfig = GAME_DATA.scoring;
        this.styleCompatibility = GAME_DATA.styleCompatibility;
        this.scoreRatings = GAME_DATA.scoreRatings;
    }

    calculateScore(outfit) {
        const styleScore = this.calculateStyleMatch(outfit);
        const colorScore = this.calculateColorHarmony(outfit);
        const trendScore = this.calculateTrendScore(outfit);
        const balanceScore = this.calculateOverallBalance(outfit);

        const totalScore = this.weightedSum({
            style: styleScore,
            color: colorScore,
            trend: trendScore,
            balance: balanceScore
        });

        const clampedScore = Helpers.clamp(totalScore, 0, 100);
        const roundedScore = Math.round(clampedScore);
        const rating = Helpers.getScoreRating(roundedScore, this.scoreRatings);

        return {
            total: roundedScore,
            rating,
            breakdown: {
                style: {
                    score: Math.round(styleScore),
                    max: this.scoringConfig.styleMatch.max
                },
                color: {
                    score: Math.round(colorScore),
                    max: this.scoringConfig.colorHarmony.max
                },
                trend: {
                    score: Math.round(trendScore),
                    max: this.scoringConfig.trendScore.max
                },
                balance: {
                    score: Math.round(balanceScore),
                    max: this.scoringConfig.overallBalance.max
                }
            },
            details: this.generateDetails(outfit, { styleScore, colorScore, trendScore, balanceScore })
        };
    }

    calculateStyleMatch(outfit) {
        const styleTags = this.collectStyleTags(outfit);
        
        if (styleTags.length === 0) {
            return this.scoringConfig.styleMatch.max * 0.5;
        }

        const compatibilityScore = this.checkStyleCompatibility(styleTags);
        const completenessScore = this.checkCompleteness(outfit);
        const consistencyScore = this.checkStyleConsistency(styleTags);

        const total = (compatibilityScore * 0.4) + (completenessScore * 0.3) + (consistencyScore * 0.3);
        return total * this.scoringConfig.styleMatch.max;
    }

    collectStyleTags(outfit) {
        const tags = [];
        const categories = ['hat', 'glasses', 'top', 'pants', 'shoes'];

        categories.forEach(category => {
            const item = outfit[category];
            if (item && item.style && item.style !== 'none') {
                const styleData = this.getStyleData(category, item.style);
                if (styleData && styleData.styleTag) {
                    tags.push({
                        category,
                        style: item.style,
                        tag: styleData.styleTag
                    });
                }
            }
        });

        return tags;
    }

    getStyleData(category, styleId) {
        const styles = GAME_DATA.styles[category];
        return styles?.find(s => s.id === styleId);
    }

    checkStyleCompatibility(styleTags) {
        if (styleTags.length < 2) {
            return 0.8;
        }

        let compatiblePairs = 0;
        let totalPairs = 0;

        for (let i = 0; i < styleTags.length; i++) {
            for (let j = i + 1; j < styleTags.length; j++) {
                const tag1 = styleTags[i].tag;
                const tag2 = styleTags[j].tag;
                
                if (this.areStylesCompatible(tag1, tag2)) {
                    compatiblePairs++;
                }
                totalPairs++;
            }
        }

        return totalPairs > 0 ? compatiblePairs / totalPairs : 0.5;
    }

    areStylesCompatible(tag1, tag2) {
        if (tag1 === tag2) {
            return true;
        }

        const compat1 = this.styleCompatibility[tag1] || [];
        const compat2 = this.styleCompatibility[tag2] || [];

        return compat1.includes(tag2) || compat2.includes(tag1);
    }

    checkCompleteness(outfit) {
        const essentialCategories = ['top', 'pants', 'shoes'];
        let completeCount = 0;

        essentialCategories.forEach(cat => {
            if (outfit[cat] && outfit[cat].style !== 'none') {
                completeCount++;
            }
        });

        return completeCount / essentialCategories.length;
    }

    checkStyleConsistency(styleTags) {
        if (styleTags.length < 2) {
            return 1;
        }

        const tagCounts = {};
        styleTags.forEach(item => {
            tagCounts[item.tag] = (tagCounts[item.tag] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(tagCounts));
        return maxCount / styleTags.length;
    }

    calculateColorHarmony(outfit) {
        const activeColors = this.collectActiveColors(outfit);
        
        if (activeColors.length < 2) {
            return this.scoringConfig.colorHarmony.max * 0.7;
        }

        const colorAnalysis = this.colorManager.analyzeColorSet(activeColors.map(c => c.colorId));
        
        const averageHarmony = colorAnalysis.averageScore;
        const maxHarmony = 10;
        
        const harmonyRatio = averageHarmony / maxHarmony;

        const temperatureBalance = this.checkTemperatureBalance(activeColors.map(c => c.colorId));
        const contrastScore = this.checkColorContrast(activeColors);

        const total = (harmonyRatio * 0.5) + (temperatureBalance * 0.3) + (contrastScore * 0.2);
        return total * this.scoringConfig.colorHarmony.max;
    }

    collectActiveColors(outfit) {
        const colors = [];
        const categories = ['hat', 'glasses', 'top', 'pants', 'shoes'];

        categories.forEach(category => {
            const item = outfit[category];
            if (item && item.style && item.style !== 'none' && item.color) {
                colors.push({
                    category,
                    colorId: item.color
                });
            }
        });

        return colors;
    }

    checkTemperatureBalance(colorIds) {
        const balance = this.colorManager.getTemperatureBalance(colorIds);
        const total = balance.warmCount + balance.coolCount;

        if (total === 0) {
            return 0.7;
        }

        const warmRatio = balance.warmCount / total;
        const idealRatio = 0.5;
        const deviation = Math.abs(warmRatio - idealRatio);
        const balanceScore = Math.max(0, 1 - deviation * 2);

        return balanceScore;
    }

    checkColorContrast(activeColors) {
        if (activeColors.length < 2) {
            return 0.5;
        }

        let hasGoodContrast = false;
        const topColor = activeColors.find(c => c.category === 'top');
        const pantsColor = activeColors.find(c => c.category === 'pants');

        if (topColor && pantsColor) {
            const contrast = this.colorManager.getColorContrast(topColor.colorId, pantsColor.colorId);
            if (contrast >= 1.5 && contrast <= 10) {
                hasGoodContrast = true;
            }
        }

        return hasGoodContrast ? 1 : 0.5;
    }

    calculateTrendScore(outfit) {
        const trendScores = [];
        const categories = ['hat', 'glasses', 'top', 'pants', 'shoes'];

        categories.forEach(category => {
            const item = outfit[category];
            if (item && item.style && item.style !== 'none') {
                const styleData = this.getStyleData(category, item.style);
                if (styleData && styleData.trendScore !== undefined) {
                    trendScores.push(styleData.trendScore);
                }
            }
        });

        if (trendScores.length === 0) {
            return this.scoringConfig.trendScore.max * 0.5;
        }

        const avgTrend = trendScores.reduce((a, b) => a + b, 0) / trendScores.length;
        const maxTrend = 10;
        const trendRatio = avgTrend / maxTrend;

        const varietyBonus = this.calculateVarietyBonus(trendScores);

        const total = (trendRatio * 0.8) + (varietyBonus * 0.2);
        return total * this.scoringConfig.trendScore.max;
    }

    calculateVarietyBonus(scores) {
        if (scores.length < 2) {
            return 0.5;
        }

        const min = Math.min(...scores);
        const max = Math.max(...scores);
        const range = max - min;

        return Math.min(1, range / 3);
    }

    calculateOverallBalance(outfit) {
        let balanceScore = 0;
        let weight = 0;

        const hasAccessories = (outfit.hat?.style !== 'none' || outfit.glasses?.style !== 'none');
        if (hasAccessories) {
            balanceScore += 0.3;
            weight += 0.3;
        }

        const hasEssentials = (outfit.top?.style !== 'none' && 
                               outfit.pants?.style !== 'none' && 
                               outfit.shoes?.style !== 'none');
        if (hasEssentials) {
            balanceScore += 0.4;
            weight += 0.4;
        }

        const styleTags = this.collectStyleTags(outfit);
        if (styleTags.length >= 3) {
            const uniqueTags = new Set(styleTags.map(t => t.tag));
            if (uniqueTags.size >= 2 && uniqueTags.size <= 3) {
                balanceScore += 0.3;
                weight += 0.3;
            }
        }

        const normalizedWeight = weight > 0 ? balanceScore / weight : 0.5;
        return normalizedWeight * this.scoringConfig.overallBalance.max;
    }

    weightedSum(scores) {
        const config = this.scoringConfig;
        return (
            scores.style * config.styleMatch.weight +
            scores.color * config.colorHarmony.weight +
            scores.trend * config.trendScore.weight +
            scores.balance * config.overallBalance.weight
        );
    }

    generateDetails(outfit, scores) {
        const styleTags = this.collectStyleTags(outfit);
        const activeColors = this.collectActiveColors(outfit);

        return {
            styleTags: styleTags.map(t => t.tag),
            activeColors: activeColors.map(c => c.colorId),
            rawScores: scores,
            suggestions: this.generateSuggestions(outfit, scores)
        };
    }

    generateSuggestions(outfit, scores) {
        const suggestions = [];

        if (scores.styleScore < this.scoringConfig.styleMatch.max * 0.6) {
            suggestions.push({
                type: 'style',
                message: '建议选择风格更协调的搭配组合'
            });
        }

        if (scores.colorScore < this.scoringConfig.colorHarmony.max * 0.6) {
            suggestions.push({
                type: 'color',
                message: '可以尝试使用互补色或邻近色来提升色彩协调度'
            });
        }

        if (scores.trendScore < this.scoringConfig.trendScore.max * 0.6) {
            suggestions.push({
                type: 'trend',
                message: '选择一些更时尚的单品可以提升整体时尚感'
            });
        }

        if (!outfit.hat || outfit.hat.style === 'none') {
            if (!outfit.glasses || outfit.glasses.style === 'none') {
                suggestions.push({
                    type: 'accessory',
                    message: '添加帽子或眼镜等配饰可以让造型更完整'
                });
            }
        }

        return suggestions;
    }

    getRatingLabel(rating) {
        const ratingConfig = this.scoreRatings[rating];
        return ratingConfig?.label || 'average';
    }

    getRatingRange(rating) {
        const ratingConfig = this.scoreRatings[rating];
        return ratingConfig ? { min: ratingConfig.min, max: ratingConfig.max } : { min: 0, max: 59 };
    }
}

export default ScoreManager;
