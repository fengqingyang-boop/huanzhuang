import { MODEL_CONFIGS } from '../data/gameData.js';
import { Helpers } from '../utils/helpers.js';

export class Character {
    constructor() {
        this.group = new THREE.Group();
        this.config = MODEL_CONFIGS.character;
        this.bodyParts = {};
        this.clothing = {
            hat: null,
            glasses: null,
            top: null,
            pants: null,
            shoes: null
        };
        this.clothingColors = {
            hat: '#000000',
            glasses: '#000000',
            top: '#FFFFFF',
            pants: '#1e3a5f',
            shoes: '#FFFFFF'
        };
        this.animationTime = 0;
        this.breathPhase = 0;
    }

    build() {
        this.createSkeleton();
        this.createHead();
        this.createTorso();
        this.createArms();
        this.createLegs();
        this.createDefaultClothing();

        this.group.position.y = 0.01;
        this.group.castShadow = true;

        return this;
    }

    createSkeleton() {
        this.hipJoint = new THREE.Group();
        this.hipJoint.position.y = this.config.legLength;
        this.group.add(this.hipJoint);

        this.chestJoint = new THREE.Group();
        this.chestJoint.position.y = this.config.torsoHeight;
        this.hipJoint.add(this.chestJoint);

        this.neckJoint = new THREE.Group();
        this.neckJoint.position.y = this.config.torsoHeight * 0.9;
        this.chestJoint.add(this.neckJoint);

        this.headJoint = new THREE.Group();
        this.headJoint.position.y = 0.15;
        this.neckJoint.add(this.headJoint);
    }

    createHead() {
        const headGeometry = new THREE.SphereGeometry(
            this.config.headRadius,
            32,
            32
        );
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: this.config.skinColor,
            roughness: 0.7,
            metalness: 0.1
        });

        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = this.config.headRadius * 0.1;
        head.castShadow = true;
        head.receiveShadow = true;
        this.headJoint.add(head);
        this.bodyParts.head = head;

        this.createFace(skinMaterial);
        this.createHair();
    }

    createFace(skinMaterial) {
        const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3c2e,
            roughness: 0.3,
            metalness: 0.2
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.06, 0.03, this.config.headRadius - 0.01);
        this.headJoint.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.06, 0.03, this.config.headRadius - 0.01);
        this.headJoint.add(rightEye);

        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2
        });

        const leftEyeWhite = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 16, 16),
            eyeWhiteMaterial
        );
        leftEyeWhite.position.set(-0.06, 0.03, this.config.headRadius - 0.02);
        leftEyeWhite.scale.set(1, 1, 0.5);
        this.headJoint.add(leftEyeWhite);

        const rightEyeWhite = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 16, 16),
            eyeWhiteMaterial
        );
        rightEyeWhite.position.set(0.06, 0.03, this.config.headRadius - 0.02);
        rightEyeWhite.scale.set(1, 1, 0.5);
        this.headJoint.add(rightEyeWhite);

        const noseGeometry = new THREE.ConeGeometry(0.015, 0.025, 8);
        const nose = new THREE.Mesh(noseGeometry, skinMaterial);
        nose.position.set(0, 0, this.config.headRadius - 0.015);
        nose.rotation.x = Math.PI / 2;
        this.headJoint.add(nose);

        const mouthGeometry = new THREE.TorusGeometry(0.02, 0.005, 8, 16, Math.PI);
        const mouthMaterial = new THREE.MeshStandardMaterial({
            color: 0xc76f5f,
            roughness: 0.8
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.05, this.config.headRadius - 0.01);
        mouth.rotation.x = Math.PI;
        this.headJoint.add(mouth);

        const earGeometry = new THREE.SphereGeometry(0.015, 16, 16);
        const leftEar = new THREE.Mesh(earGeometry, skinMaterial);
        leftEar.position.set(-this.config.headRadius - 0.005, 0.02, 0);
        leftEar.scale.set(0.3, 1, 0.8);
        this.headJoint.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, skinMaterial);
        rightEar.position.set(this.config.headRadius + 0.005, 0.02, 0);
        rightEar.scale.set(0.3, 1, 0.8);
        this.headJoint.add(rightEar);
    }

    createHair() {
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            roughness: 0.9,
            metalness: 0.1
        });

        const hairGeometry = new THREE.SphereGeometry(
            this.config.headRadius * 1.02,
            32,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.6
        );

        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = this.config.headRadius * 0.1;
        this.headJoint.add(hair);
        this.bodyParts.hair = hair;

        const sideHairGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.04);
        const leftSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
        leftSideHair.position.set(-this.config.headRadius - 0.01, -0.02, 0);
        this.headJoint.add(leftSideHair);

        const rightSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
        rightSideHair.position.set(this.config.headRadius + 0.01, -0.02, 0);
        this.headJoint.add(rightSideHair);
    }

    createTorso() {
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: this.config.skinColor,
            roughness: 0.7,
            metalness: 0.1
        });

        const torsoGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.5,
            this.config.torsoWidth * 0.45,
            this.config.torsoHeight * 0.7,
            16
        );
        const torso = new THREE.Mesh(torsoGeometry, skinMaterial);
        torso.position.y = this.config.torsoHeight * 0.35;
        torso.castShadow = true;
        torso.receiveShadow = true;
        this.chestJoint.add(torso);
        this.bodyParts.torso = torso;
    }

    createArms() {
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: this.config.skinColor,
            roughness: 0.7,
            metalness: 0.1
        });

        this.leftShoulder = new THREE.Group();
        this.leftShoulder.position.set(-this.config.torsoWidth * 0.6, this.config.torsoHeight * 0.75, 0);
        this.chestJoint.add(this.leftShoulder);

        const leftArmGeometry = new THREE.CylinderGeometry(
            this.config.armRadius,
            this.config.armRadius * 0.9,
            this.config.armLength * 0.8,
            8
        );
        const leftArm = new THREE.Mesh(leftArmGeometry, skinMaterial);
        leftArm.position.y = -this.config.armLength * 0.4;
        leftArm.rotation.z = Math.PI * 0.1;
        leftArm.castShadow = true;
        this.leftShoulder.add(leftArm);
        this.bodyParts.leftArm = leftArm;

        this.rightShoulder = new THREE.Group();
        this.rightShoulder.position.set(this.config.torsoWidth * 0.6, this.config.torsoHeight * 0.75, 0);
        this.chestJoint.add(this.rightShoulder);

        const rightArmGeometry = new THREE.CylinderGeometry(
            this.config.armRadius,
            this.config.armRadius * 0.9,
            this.config.armLength * 0.8,
            8
        );
        const rightArm = new THREE.Mesh(rightArmGeometry, skinMaterial);
        rightArm.position.y = -this.config.armLength * 0.4;
        rightArm.rotation.z = -Math.PI * 0.1;
        rightArm.castShadow = true;
        this.rightShoulder.add(rightArm);
        this.bodyParts.rightArm = rightArm;
    }

    createLegs() {
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: this.config.skinColor,
            roughness: 0.7,
            metalness: 0.1
        });

        this.leftHip = new THREE.Group();
        this.leftHip.position.set(-this.config.torsoWidth * 0.25, 0, 0);
        this.hipJoint.add(this.leftHip);

        const leftLegGeometry = new THREE.CylinderGeometry(
            this.config.legRadius,
            this.config.legRadius * 0.9,
            this.config.legLength * 0.8,
            8
        );
        const leftLeg = new THREE.Mesh(leftLegGeometry, skinMaterial);
        leftLeg.position.y = -this.config.legLength * 0.4;
        leftLeg.castShadow = true;
        this.leftHip.add(leftLeg);
        this.bodyParts.leftLeg = leftLeg;

        this.rightHip = new THREE.Group();
        this.rightHip.position.set(this.config.torsoWidth * 0.25, 0, 0);
        this.hipJoint.add(this.rightHip);

        const rightLegGeometry = new THREE.CylinderGeometry(
            this.config.legRadius,
            this.config.legRadius * 0.9,
            this.config.legLength * 0.8,
            8
        );
        const rightLeg = new THREE.Mesh(rightLegGeometry, skinMaterial);
        rightLeg.position.y = -this.config.legLength * 0.4;
        rightLeg.castShadow = true;
        this.rightHip.add(rightLeg);
        this.bodyParts.rightLeg = rightLeg;

        this.createFeet(skinMaterial);
    }

    createFeet(skinMaterial) {
        const footGeometry = new THREE.BoxGeometry(
            this.config.footLength * 0.5,
            this.config.footHeight,
            this.config.footLength
        );

        const leftFoot = new THREE.Mesh(footGeometry, skinMaterial);
        leftFoot.position.set(-this.config.torsoWidth * 0.25, -this.config.legLength, this.config.footLength * 0.2);
        leftFoot.castShadow = true;
        this.hipJoint.add(leftFoot);
        this.bodyParts.leftFoot = leftFoot;

        const rightFoot = new THREE.Mesh(footGeometry, skinMaterial);
        rightFoot.position.set(this.config.torsoWidth * 0.25, -this.config.legLength, this.config.footLength * 0.2);
        rightFoot.castShadow = true;
        this.hipJoint.add(rightFoot);
        this.bodyParts.rightFoot = rightFoot;
    }

    createDefaultClothing() {
        this.createTop('tshirt', '#FFFFFF');
        this.createPants('jeans', '#1e3a5f');
        this.createShoes('sneaker', '#FFFFFF');
    }

    createTop(style, color) {
        if (this.clothing.top) {
            this.chestJoint.remove(this.clothing.top);
        }

        if (style === 'none') {
            this.clothing.top = null;
            return;
        }

        const clothingOffset = MODEL_CONFIGS.clothing.offset;
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.1
        });

        let topGroup = new THREE.Group();

        switch (style) {
            case 'tshirt':
                const tshirtGeometry = new THREE.CylinderGeometry(
                    this.config.torsoWidth * 0.52 + clothingOffset,
                    this.config.torsoWidth * 0.5 + clothingOffset,
                    this.config.torsoHeight * 0.65,
                    16
                );
                const tshirt = new THREE.Mesh(tshirtGeometry, material);
                tshirt.position.y = this.config.torsoHeight * 0.35;
                tshirt.castShadow = true;
                topGroup.add(tshirt);

                const sleeveGeometry = new THREE.CylinderGeometry(
                    this.config.armRadius + clothingOffset * 2,
                    this.config.armRadius + clothingOffset,
                    this.config.armLength * 0.4,
                    8
                );
                const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
                leftSleeve.position.set(-this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.55, 0);
                leftSleeve.rotation.z = Math.PI * 0.15;
                leftSleeve.castShadow = true;
                topGroup.add(leftSleeve);

                const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
                rightSleeve.position.set(this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.55, 0);
                rightSleeve.rotation.z = -Math.PI * 0.15;
                rightSleeve.castShadow = true;
                topGroup.add(rightSleeve);
                break;

            case 'shirt':
            case 'hoodie':
            case 'jacket':
            case 'suit':
            case 'sweater':
            case 'polo':
                const shirtGeometry = new THREE.CylinderGeometry(
                    this.config.torsoWidth * 0.53 + clothingOffset,
                    this.config.torsoWidth * 0.5 + clothingOffset,
                    this.config.torsoHeight * 0.7,
                    16
                );
                const shirt = new THREE.Mesh(shirtGeometry, material);
                shirt.position.y = this.config.torsoHeight * 0.3;
                shirt.castShadow = true;
                topGroup.add(shirt);

                const longSleeveGeometry = new THREE.CylinderGeometry(
                    this.config.armRadius + clothingOffset * 2,
                    this.config.armRadius + clothingOffset,
                    this.config.armLength * 0.7,
                    8
                );
                const leftLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
                leftLongSleeve.position.set(-this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.4, 0);
                leftLongSleeve.rotation.z = Math.PI * 0.1;
                leftLongSleeve.castShadow = true;
                topGroup.add(leftLongSleeve);

                const rightLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
                rightLongSleeve.position.set(this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.4, 0);
                rightLongSleeve.rotation.z = -Math.PI * 0.1;
                rightLongSleeve.castShadow = true;
                topGroup.add(rightLongSleeve);
                break;
        }

        this.clothing.top = topGroup;
        this.clothingColors.top = color;
        this.chestJoint.add(topGroup);
    }

    createPants(style, color) {
        if (this.clothing.pants) {
            this.hipJoint.remove(this.clothing.pants);
        }

        if (style === 'none') {
            this.clothing.pants = null;
            return;
        }

        const clothingOffset = MODEL_CONFIGS.clothing.offset;
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: style === 'jeans' ? 0.9 : 0.8,
            metalness: 0.1
        });

        let pantsGroup = new THREE.Group();
        const pantLength = (style === 'shorts') ? this.config.legLength * 0.4 : this.config.legLength * 0.85;

        const waistGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.48,
            this.config.torsoWidth * 0.5,
            0.05,
            16
        );
        const waist = new THREE.Mesh(waistGeometry, material);
        waist.position.y = this.config.torsoHeight * 0.05;
        waist.castShadow = true;
        pantsGroup.add(waist);

        const legGeometry = new THREE.CylinderGeometry(
            this.config.legRadius + clothingOffset * 1.5,
            (this.config.legRadius + clothingOffset * 1.5) * 0.9,
            pantLength * 0.9,
            8
        );

        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-this.config.torsoWidth * 0.25, -pantLength * 0.45, 0);
        leftLeg.castShadow = true;
        pantsGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(this.config.torsoWidth * 0.25, -pantLength * 0.45, 0);
        rightLeg.castShadow = true;
        pantsGroup.add(rightLeg);

        this.clothing.pants = pantsGroup;
        this.clothingColors.pants = color;
        this.hipJoint.add(pantsGroup);
    }

    createShoes(style, color) {
        if (this.clothing.shoes) {
            this.hipJoint.remove(this.clothing.shoes);
        }

        if (style === 'none') {
            this.clothing.shoes = null;
            return;
        }

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: style === 'leather' ? 0.4 : 0.8,
            metalness: style === 'leather' ? 0.3 : 0.1
        });

        let shoesGroup = new THREE.Group();

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });

        const soleGeometry = new THREE.BoxGeometry(
            this.config.footLength * 0.5,
            0.03,
            this.config.footLength
        );

        const shoeGeometry = new THREE.BoxGeometry(
            this.config.footLength * 0.48,
            this.config.footHeight,
            this.config.footLength * 0.9
        );

        const leftSole = new THREE.Mesh(soleGeometry, soleMaterial);
        leftSole.position.set(
            -this.config.torsoWidth * 0.25,
            -this.config.legLength - this.config.footHeight - 0.015,
            this.config.footLength * 0.2
        );
        leftSole.castShadow = true;
        shoesGroup.add(leftSole);

        const leftShoe = new THREE.Mesh(shoeGeometry, material);
        leftShoe.position.set(
            -this.config.torsoWidth * 0.25,
            -this.config.legLength - this.config.footHeight / 2,
            this.config.footLength * 0.2
        );
        leftShoe.castShadow = true;
        shoesGroup.add(leftShoe);

        const rightSole = new THREE.Mesh(soleGeometry, soleMaterial);
        rightSole.position.set(
            this.config.torsoWidth * 0.25,
            -this.config.legLength - this.config.footHeight - 0.015,
            this.config.footLength * 0.2
        );
        rightSole.castShadow = true;
        shoesGroup.add(rightSole);

        const rightShoe = new THREE.Mesh(shoeGeometry, material);
        rightShoe.position.set(
            this.config.torsoWidth * 0.25,
            -this.config.legLength - this.config.footHeight / 2,
            this.config.footLength * 0.2
        );
        rightShoe.castShadow = true;
        shoesGroup.add(rightShoe);

        this.clothing.shoes = shoesGroup;
        this.clothingColors.shoes = color;
        this.hipJoint.add(shoesGroup);
    }

    createHat(style, color) {
        if (this.clothing.hat) {
            this.headJoint.remove(this.clothing.hat);
        }

        if (style === 'none') {
            this.clothing.hat = null;
            return;
        }

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.1
        });

        let hatGroup = new THREE.Group();
        const headTop = this.config.headRadius * 1.01;

        switch (style) {
            case 'baseball':
                const capCrown = new THREE.Mesh(
                    new THREE.SphereGeometry(this.config.headRadius * 0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
                    material
                );
                capCrown.position.y = headTop;
                hatGroup.add(capCrown);

                const capBrim = new THREE.Mesh(
                    new THREE.CylinderGeometry(this.config.headRadius * 0.7, this.config.headRadius * 1.3, 0.02, 32),
                    material
                );
                capBrim.position.set(0, headTop - 0.01, 0.1);
                hatGroup.add(capBrim);
                break;

            case 'fedora':
            case 'top':
            case 'cowboy':
            case 'bucket':
            case 'beanie':
            case 'beret':
                const topGeometry = style === 'top' 
                    ? new THREE.CylinderGeometry(this.config.headRadius * 0.7, this.config.headRadius * 0.7, 0.3, 32)
                    : new THREE.SphereGeometry(this.config.headRadius * 0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
                const hatTop = new THREE.Mesh(topGeometry, material);
                hatTop.position.y = style === 'top' ? headTop + 0.15 : headTop;
                hatGroup.add(hatTop);

                const brimRadius = style === 'cowboy' ? this.config.headRadius * 1.6 : this.config.headRadius * 1.3;
                const brimGeometry = new THREE.CylinderGeometry(
                    this.config.headRadius * 0.7, brimRadius, 0.02, 32
                );
                const brim = new THREE.Mesh(brimGeometry, material);
                brim.position.y = headTop - (style === 'top' ? 0.01 : 0.01);
                hatGroup.add(brim);
                break;
        }

        this.clothing.hat = hatGroup;
        this.clothingColors.hat = color;
        this.headJoint.add(hatGroup);
    }

    createGlasses(style, color) {
        if (this.clothing.glasses) {
            this.headJoint.remove(this.clothing.glasses);
        }

        if (style === 'none') {
            this.clothing.glasses = null;
            return;
        }

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.7
        });

        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.9
        });

        let glassesGroup = new THREE.Group();
        const eyeY = 0.03;
        const eyeZ = this.config.headRadius - 0.005;

        let lensShape;
        switch (style) {
            case 'round':
            case 'sport':
                lensShape = new THREE.CircleGeometry(0.03, 32);
                break;
            case 'square':
            case 'wayfarer':
                lensShape = new THREE.RingGeometry(0, 0.03, 4);
                break;
            case 'aviator':
                lensShape = new THREE.CircleGeometry(0.035, 32, 0, Math.PI * 1.5);
                break;
            case 'cat':
            case 'vintage':
                lensShape = new THREE.CircleGeometry(0.03, 32);
                break;
            default:
                lensShape = new THREE.CircleGeometry(0.03, 32);
        }

        const leftLens = new THREE.Mesh(lensShape, lensMaterial);
        leftLens.position.set(-0.06, eyeY, eyeZ);
        leftLens.rotation.y = Math.PI / 8;
        glassesGroup.add(leftLens);

        const rightLens = new THREE.Mesh(lensShape, lensMaterial);
        rightLens.position.set(0.06, eyeY, eyeZ);
        rightLens.rotation.y = -Math.PI / 8;
        glassesGroup.add(rightLens);

        const frameGeometry = new THREE.TorusGeometry(0.03, 0.003, 8, 32);
        const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        leftFrame.position.set(-0.06, eyeY, eyeZ);
        leftFrame.rotation.y = Math.PI / 8;
        glassesGroup.add(leftFrame);

        const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        rightFrame.position.set(0.06, eyeY, eyeZ);
        rightFrame.rotation.y = -Math.PI / 8;
        glassesGroup.add(rightFrame);

        const bridgeGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.1, 8);
        const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
        bridge.position.set(0, eyeY, eyeZ);
        bridge.rotation.z = Math.PI / 2;
        glassesGroup.add(bridge);

        const armGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.12, 8);
        const leftArm = new THREE.Mesh(armGeometry, frameMaterial);
        leftArm.position.set(-0.09, eyeY, -0.03);
        leftArm.rotation.x = Math.PI / 6;
        glassesGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, frameMaterial);
        rightArm.position.set(0.09, eyeY, -0.03);
        rightArm.rotation.x = Math.PI / 6;
        glassesGroup.add(rightArm);

        this.clothing.glasses = glassesGroup;
        this.clothingColors.glasses = color;
        this.headJoint.add(glassesGroup);
    }

    updateClothing(category, style, color) {
        switch (category) {
            case 'hat':
                this.createHat(style, color);
                break;
            case 'glasses':
                this.createGlasses(style, color);
                break;
            case 'top':
                this.createTop(style, color);
                break;
            case 'pants':
                this.createPants(style, color);
                break;
            case 'shoes':
                this.createShoes(style, color);
                break;
        }
    }

    getCurrentOutfit() {
        return {
            hat: { style: this.getCurrentStyle('hat'), color: this.clothingColors.hat },
            glasses: { style: this.getCurrentStyle('glasses'), color: this.clothingColors.glasses },
            top: { style: this.getCurrentStyle('top'), color: this.clothingColors.top },
            pants: { style: this.getCurrentStyle('pants'), color: this.clothingColors.pants },
            shoes: { style: this.getCurrentStyle('shoes'), color: this.clothingColors.shoes }
        };
    }

    getCurrentStyle(category) {
        if (category === 'hat' && this.clothing.hat) return 'baseball';
        if (category === 'glasses' && this.clothing.glasses) return 'round';
        if (category === 'top' && this.clothing.top) return 'tshirt';
        if (category === 'pants' && this.clothing.pants) return 'jeans';
        if (category === 'shoes' && this.clothing.shoes) return 'sneaker';
        return 'none';
    }

    update(delta) {
        this.animationTime += delta;
        this.breathPhase = Math.sin(this.animationTime * 2) * 0.02;

        if (this.chestJoint) {
            this.chestJoint.scale.y = 1 + this.breathPhase * 0.1;
        }

        if (this.leftShoulder && this.rightShoulder) {
            const armSwing = Math.sin(this.animationTime * 1.5) * 0.05;
            this.leftShoulder.rotation.x = armSwing;
            this.rightShoulder.rotation.x = -armSwing;
        }
    }

    setVisibility(visible) {
        this.group.visible = visible;
    }

    reset() {
        this.createTop('tshirt', '#FFFFFF');
        this.createPants('jeans', '#1e3a5f');
        this.createShoes('sneaker', '#FFFFFF');
        this.createHat('none', '#000000');
        this.createGlasses('none', '#000000');
    }
}

export default Character;
