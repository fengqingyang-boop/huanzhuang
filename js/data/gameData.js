export const GAME_DATA = {
    categories: [
        { id: 'hat', name: '帽子', icon: '🎩', position: 'head' },
        { id: 'glasses', name: '眼镜', icon: '👓', position: 'face' },
        { id: 'top', name: '上衣', icon: '👔', position: 'torso' },
        { id: 'pants', name: '裤子', icon: '👖', position: 'legs' },
        { id: 'shoes', name: '鞋子', icon: '👟', position: 'feet' }
    ],

    styles: {
        hat: [
            { id: 'none', name: 'none', icon: '❌', modelType: null },
            { id: 'baseball', name: 'baseball', icon: '🧢', modelType: 'baseballCap', trendScore: 8, styleTag: 'casual' },
            { id: 'fedora', name: 'fedora', icon: '🎩', modelType: 'fedora', trendScore: 7, styleTag: 'formal' },
            { id: 'beanie', name: 'beanie', icon: '🧶', modelType: 'beanie', trendScore: 9, styleTag: 'street' },
            { id: 'cowboy', name: 'cowboy', icon: '🤠', modelType: 'cowboyHat', trendScore: 6, styleTag: 'western' },
            { id: 'top', name: 'top', icon: '👑', modelType: 'topHat', trendScore: 5, styleTag: 'formal' },
            { id: 'bucket', name: 'bucket', icon: '🪣', modelType: 'bucketHat', trendScore: 9, styleTag: 'street' },
            { id: 'beret', name: 'beret', icon: '🎨', modelType: 'beret', trendScore: 8, styleTag: 'artistic' }
        ],
        glasses: [
            { id: 'none', name: 'none', icon: '❌', modelType: null },
            { id: 'round', name: 'round', icon: '🔵', modelType: 'roundGlasses', trendScore: 8, styleTag: 'intellectual' },
            { id: 'square', name: 'square', icon: '🟦', modelType: 'squareGlasses', trendScore: 7, styleTag: 'business' },
            { id: 'aviator', name: 'aviator', icon: '✈️', modelType: 'aviator', trendScore: 9, styleTag: 'cool' },
            { id: 'cat', name: 'cat', icon: '🐱', modelType: 'catEye', trendScore: 8, styleTag: 'feminine' },
            { id: 'sport', name: 'sport', icon: '🏃', modelType: 'sportGlasses', trendScore: 7, styleTag: 'sporty' },
            { id: 'vintage', name: 'vintage', icon: '📷', modelType: 'vintage', trendScore: 8, styleTag: 'retro' },
            { id: 'wayfarer', name: 'wayfarer', icon: '🕶️', modelType: 'wayfarer', trendScore: 9, styleTag: 'classic' }
        ],
        top: [
            { id: 'none', name: 'none', icon: '❌', modelType: null },
            { id: 'tshirt', name: 'tshirt', icon: '👕', modelType: 'tshirt', trendScore: 8, styleTag: 'casual' },
            { id: 'shirt', name: 'shirt', icon: '👔', modelType: 'shirt', trendScore: 7, styleTag: 'business' },
            { id: 'hoodie', name: 'hoodie', icon: '🧥', modelType: 'hoodie', trendScore: 9, styleTag: 'street' },
            { id: 'jacket', name: 'jacket', icon: '🧥', modelType: 'jacket', trendScore: 8, styleTag: 'cool' },
            { id: 'suit', name: 'suit', icon: '🤵', modelType: 'suitJacket', trendScore: 7, styleTag: 'formal' },
            { id: 'sweater', name: 'sweater', icon: '🧶', modelType: 'sweater', trendScore: 7, styleTag: 'cozy' },
            { id: 'polo', name: 'polo', icon: '🏌️', modelType: 'poloShirt', trendScore: 6, styleTag: 'preppy' }
        ],
        pants: [
            { id: 'none', name: 'none', icon: '❌', modelType: null },
            { id: 'jeans', name: 'jeans', icon: '👖', modelType: 'jeans', trendScore: 9, styleTag: 'casual' },
            { id: 'chino', name: 'chino', icon: '🩳', modelType: 'chino', trendScore: 7, styleTag: 'smart' },
            { id: 'suit', name: 'suit', icon: '👔', modelType: 'suitPants', trendScore: 7, styleTag: 'formal' },
            { id: 'shorts', name: 'shorts', icon: '🩳', modelType: 'shorts', trendScore: 8, styleTag: 'casual' },
            { id: 'sweat', name: 'sweat', icon: '🏃', modelType: 'sweatpants', trendScore: 9, styleTag: 'street' },
            { id: 'cargo', name: 'cargo', icon: '🎒', modelType: 'cargo', trendScore: 8, styleTag: 'utility' },
            { id: 'linen', name: 'linen', icon: '🌴', modelType: 'linen', trendScore: 6, styleTag: 'summer' }
        ],
        shoes: [
            { id: 'none', name: 'none', icon: '❌', modelType: null },
            { id: 'sneaker', name: 'sneaker', icon: '👟', modelType: 'sneakers', trendScore: 9, styleTag: 'street' },
            { id: 'leather', name: 'leather', icon: '👞', modelType: 'leatherShoes', trendScore: 7, styleTag: 'formal' },
            { id: 'boots', name: 'boots', icon: '🥾', modelType: 'boots', trendScore: 8, styleTag: 'rugged' },
            { id: 'casual', name: 'casual', icon: '👟', modelType: 'casual', trendScore: 7, styleTag: 'casual' },
            { id: 'sandal', name: 'sandal', icon: '👡', modelType: 'sandals', trendScore: 6, styleTag: 'summer' },
            { id: 'loafer', name: 'loafer', icon: '👞', modelType: 'loafers', trendScore: 7, styleTag: 'smart' },
            { id: 'canvas', name: 'canvas', icon: '👟', modelType: 'canvas', trendScore: 8, styleTag: 'casual' }
        ]
    },

    colors: {
        primary: [
            { id: 'white', hex: '#FFFFFF', name: '白色', hsl: [0, 0, 100] },
            { id: 'black', hex: '#000000', name: '黑色', hsl: [0, 0, 0] },
            { id: 'gray', hex: '#808080', name: '灰色', hsl: [0, 0, 50] },
            { id: 'darkgray', hex: '#333333', name: '深灰', hsl: [0, 0, 20] },
            { id: 'lightgray', hex: '#CCCCCC', name: '浅灰', hsl: [0, 0, 80] },
            { id: 'navy', hex: '#1e3a5f', name: '藏蓝', hsl: [210, 60, 25] },
            { id: 'blue', hex: '#3B82F6', name: '蓝色', hsl: [217, 91, 60] },
            { id: 'lightblue', hex: '#60A5FA', name: '浅蓝', hsl: [210, 90, 68] }
        ],
        accent: [
            { id: 'red', hex: '#EF4444', name: '红色', hsl: [0, 84, 60] },
            { id: 'darkred', hex: '#991B1B', name: '深红', hsl: [0, 70, 35] },
            { id: 'orange', hex: '#F97316', name: '橙色', hsl: [25, 95, 53] },
            { id: 'yellow', hex: '#EAB308', name: '黄色', hsl: [45, 93, 47] },
            { id: 'green', hex: '#22C55E', name: '绿色', hsl: [142, 76, 45] },
            { id: 'darkgreen', hex: '#14532D', name: '深绿', hsl: [140, 70, 20] },
            { id: 'teal', hex: '#14B8A6', name: '青色', hsl: [174, 80, 40] },
            { id: 'purple', hex: '#8B5CF6', name: '紫色', hsl: [262, 83, 65] }
        ],
        earth: [
            { id: 'brown', hex: '#78350F', name: '棕色', hsl: [24, 80, 25] },
            { id: 'tan', hex: '#D2B48C', name: '驼色', hsl: [34, 40, 65] },
            { id: 'olive', hex: '#708090', name: '橄榄', hsl: [210, 10, 50] },
            { id: 'khaki', hex: '#C3B091', name: '卡其', hsl: [40, 30, 65] },
            { id: 'cream', hex: '#FFFDD0', name: '奶油', hsl: [55, 100, 90] },
            { id: 'beige', hex: '#F5F5DC', name: '米色', hsl: [60, 50, 90] },
            { id: 'maroon', hex: '#800000', name: '酒红', hsl: [0, 100, 25] },
            { id: 'burgundy', hex: '#800020', name: '勃艮第', hsl: [345, 100, 25] }
        ]
    },

    defaultColors: {
        hat: 'black',
        glasses: 'black',
        top: 'white',
        pants: 'navy',
        shoes: 'white'
    },

    defaultOutfit: {
        hat: { style: 'none', color: 'black' },
        glasses: { style: 'none', color: 'black' },
        top: { style: 'tshirt', color: 'white' },
        pants: { style: 'jeans', color: 'navy' },
        shoes: { style: 'sneaker', color: 'white' }
    },

    styleTags: {
        casual: { name: '休闲', weight: 1.0 },
        formal: { name: '正式', weight: 1.0 },
        street: { name: '街头', weight: 1.0 },
        western: { name: '西部', weight: 0.8 },
        artistic: { name: '文艺', weight: 0.9 },
        intellectual: { name: '知性', weight: 0.9 },
        business: { name: '商务', weight: 0.9 },
        cool: { name: '酷炫', weight: 1.0 },
        feminine: { name: '柔美', weight: 0.8 },
        sporty: { name: '运动', weight: 0.9 },
        retro: { name: '复古', weight: 0.8 },
        classic: { name: '经典', weight: 1.0 },
        smart: { name: '精致', weight: 0.9 },
        cozy: { name: '舒适', weight: 0.8 },
        preppy: { name: '学院', weight: 0.7 },
        rugged: { name: '粗犷', weight: 0.8 },
        utility: { name: '机能', weight: 0.9 },
        summer: { name: '夏日', weight: 0.7 }
    },

    colorHarmony: {
        complementary: { score: 10, description: '互补色' },
        analogous: { score: 8, description: '邻近色' },
        triadic: { score: 9, description: '三角色' },
        monochromatic: { score: 7, description: '同色系' },
        neutral: { score: 8, description: '中性色' },
        clash: { score: 3, description: '冲突色' }
    },

    scoring: {
        maxScore: 100,
        styleMatch: { max: 30, weight: 0.3 },
        colorHarmony: { max: 35, weight: 0.35 },
        trendScore: { max: 20, weight: 0.2 },
        overallBalance: { max: 15, weight: 0.15 }
    },

    scoreRatings: {
        perfect: { min: 95, max: 100, label: 'perfect' },
        excellent: { min: 85, max: 94, label: 'excellent' },
        great: { min: 75, max: 84, label: 'great' },
        good: { min: 60, max: 74, label: 'good' },
        average: { min: 0, max: 59, label: 'average' }
    },

    styleCompatibility: {
        formal: ['formal', 'business', 'classic', 'smart'],
        casual: ['casual', 'street', 'sporty', 'cool', 'preppy'],
        street: ['street', 'casual', 'sporty', 'cool', 'utility'],
        business: ['business', 'formal', 'classic', 'smart'],
        sporty: ['sporty', 'casual', 'street'],
        classic: ['classic', 'formal', 'business', 'smart'],
        smart: ['smart', 'formal', 'business', 'classic', 'preppy'],
        cool: ['cool', 'casual', 'street', 'retro'],
        retro: ['retro', 'cool', 'artistic'],
        artistic: ['artistic', 'retro', 'cool'],
        intellectual: ['intellectual', 'classic', 'smart'],
        preppy: ['preppy', 'smart', 'casual', 'classic'],
        rugged: ['rugged', 'utility', 'casual'],
        utility: ['utility', 'rugged', 'street', 'casual'],
        cozy: ['cozy', 'casual'],
        western: ['western', 'rugged', 'casual'],
        feminine: ['feminine', 'classic', 'smart'],
        summer: ['summer', 'casual', 'cozy']
    }
};

export const MODEL_CONFIGS = {
    character: {
        height: 1.8,
        headRadius: 0.2,
        torsoHeight: 0.5,
        torsoWidth: 0.35,
        torsoDepth: 0.2,
        armLength: 0.5,
        armRadius: 0.05,
        legLength: 0.8,
        legRadius: 0.06,
        footLength: 0.2,
        footHeight: 0.08,
        skinColor: 0xF5D0B8
    },
    clothing: {
        offset: 0.01,
        thickness: 0.02,
        opacity: 1.0
    }
};

export const SCENE_CONFIG = {
    camera: {
        position: { x: 0, y: 1.2, z: 3 },
        fov: 45,
        near: 0.1,
        far: 1000
    },
    lights: {
        ambient: { intensity: 0.6, color: 0xFFFFFF },
        directional: {
            intensity: 0.8,
            color: 0xFFFFFF,
            position: { x: 5, y: 10, z: 7.5 }
        },
        hemisphere: {
            intensity: 0.4,
            skyColor: 0x87CEEB,
            groundColor: 0x362d1f
        }
    },
    background: {
        top: 0x1e3a5f,
        bottom: 0x0f172a
    },
    rotation: {
        speed: 0.005,
        damping: 0.1,
        autoRotate: true,
        autoRotateSpeed: 0.002
    }
};
