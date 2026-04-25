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
        this.currentStyles = {
            hat: 'none',
            glasses: 'none',
            top: 'tshirt',
            pants: 'jeans',
            shoes: 'sneaker'
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
        this.currentStyles.top = style;
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
                this.createShirtStyle(topGroup, material, clothingOffset);
                break;

            case 'hoodie':
                this.createHoodieStyle(topGroup, material, clothingOffset);
                break;

            case 'jacket':
                this.createJacketStyle(topGroup, material, clothingOffset);
                break;

            case 'suit':
                this.createSuitStyle(topGroup, material, clothingOffset);
                break;

            case 'sweater':
                this.createSweaterStyle(topGroup, material, clothingOffset);
                break;

            case 'polo':
                this.createPoloStyle(topGroup, material, clothingOffset);
                break;
        }

        this.clothing.top = topGroup;
        this.clothingColors.top = color;
        this.chestJoint.add(topGroup);
    }

    createShirtStyle(topGroup, material, clothingOffset) {
        const shirtGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.52 + clothingOffset,
            this.config.torsoWidth * 0.48 + clothingOffset,
            this.config.torsoHeight * 0.72,
            16
        );
        const shirt = new THREE.Mesh(shirtGeometry, material);
        shirt.position.y = this.config.torsoHeight * 0.3;
        shirt.castShadow = true;
        topGroup.add(shirt);

        const collarGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.35 + clothingOffset,
            this.config.torsoWidth * 0.3 + clothingOffset,
            0.08,
            8
        );
        const collar = new THREE.Mesh(collarGeometry, material);
        collar.position.y = this.config.torsoHeight * 0.65;
        collar.castShadow = true;
        topGroup.add(collar);

        const leftCollar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), material);
        leftCollar.position.set(-0.08, this.config.torsoHeight * 0.66, 0.06);
        leftCollar.rotation.z = 0.3;
        topGroup.add(leftCollar);

        const rightCollar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), material);
        rightCollar.position.set(0.08, this.config.torsoHeight * 0.66, 0.06);
        rightCollar.rotation.z = -0.3;
        topGroup.add(rightCollar);

        const longSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 1.5,
            this.config.armRadius + clothingOffset,
            this.config.armLength * 0.65,
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
    }

    createHoodieStyle(topGroup, material, clothingOffset) {
        const hoodieGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.58 + clothingOffset,
            this.config.torsoWidth * 0.55 + clothingOffset,
            this.config.torsoHeight * 0.75,
            16
        );
        const hoodie = new THREE.Mesh(hoodieGeometry, material);
        hoodie.position.y = this.config.torsoHeight * 0.28;
        hoodie.castShadow = true;
        topGroup.add(hoodie);

        const hoodGroup = new THREE.Group();
        const hoodGeometry = new THREE.SphereGeometry(
            this.config.headRadius * 0.95,
            16, 12, 0, Math.PI * 2, 0, Math.PI / 2
        );
        const hood = new THREE.Mesh(hoodGeometry, material);
        hood.position.y = this.config.torsoHeight * 0.78;
        hood.position.z = -0.05;
        hood.castShadow = true;
        hoodGroup.add(hood);

        const hoodBackGeometry = new THREE.SphereGeometry(
            this.config.headRadius * 0.8,
            16, 12, 0, Math.PI, Math.PI / 2, Math.PI / 2
        );
        const hoodBack = new THREE.Mesh(hoodBackGeometry, material);
        hoodBack.position.y = this.config.torsoHeight * 0.75;
        hoodBack.position.z = -0.08;
        hoodBack.castShadow = true;
        hoodGroup.add(hoodBack);
        topGroup.add(hoodGroup);

        const pocketGeometry = new THREE.BoxGeometry(
            this.config.torsoWidth * 0.6,
            this.config.torsoHeight * 0.18,
            0.03 + clothingOffset
        );
        const pocket = new THREE.Mesh(pocketGeometry, material);
        pocket.position.y = this.config.torsoHeight * 0.15;
        pocket.position.z = this.config.torsoWidth * 0.52;
        pocket.castShadow = true;
        topGroup.add(pocket);

        const drawstringMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8
        });
        const drawstringGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.25, 8);
        const leftDrawstring = new THREE.Mesh(drawstringGeometry, drawstringMaterial);
        leftDrawstring.position.set(-0.06, this.config.torsoHeight * 0.55, this.config.torsoWidth * 0.55);
        topGroup.add(leftDrawstring);

        const rightDrawstring = new THREE.Mesh(drawstringGeometry, drawstringMaterial);
        rightDrawstring.position.set(0.06, this.config.torsoHeight * 0.55, this.config.torsoWidth * 0.55);
        topGroup.add(rightDrawstring);

        const longSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 2,
            this.config.armRadius + clothingOffset * 1.5,
            this.config.armLength * 0.68,
            8
        );
        const leftLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        leftLongSleeve.position.set(-this.config.torsoWidth * 0.58, this.config.torsoHeight * 0.38, 0);
        leftLongSleeve.rotation.z = Math.PI * 0.1;
        leftLongSleeve.castShadow = true;
        topGroup.add(leftLongSleeve);

        const rightLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        rightLongSleeve.position.set(this.config.torsoWidth * 0.58, this.config.torsoHeight * 0.38, 0);
        rightLongSleeve.rotation.z = -Math.PI * 0.1;
        rightLongSleeve.castShadow = true;
        topGroup.add(rightLongSleeve);
    }

    createJacketStyle(topGroup, material, clothingOffset) {
        const jacketGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.56 + clothingOffset,
            this.config.torsoWidth * 0.52 + clothingOffset,
            this.config.torsoHeight * 0.7,
            16
        );
        const jacket = new THREE.Mesh(jacketGeometry, material);
        jacket.position.y = this.config.torsoHeight * 0.3;
        jacket.castShadow = true;
        topGroup.add(jacket);

        const lapelMaterial = new THREE.MeshStandardMaterial({
            color: material.color.clone().multiplyScalar(0.85),
            roughness: material.roughness,
            metalness: material.metalness
        });
        const leftLapel = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.03), lapelMaterial);
        leftLapel.position.set(-0.03, this.config.torsoHeight * 0.5, this.config.torsoWidth * 0.53);
        leftLapel.rotation.z = -0.3;
        topGroup.add(leftLapel);

        const rightLapel = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.03), lapelMaterial);
        rightLapel.position.set(0.03, this.config.torsoHeight * 0.5, this.config.torsoWidth * 0.53);
        rightLapel.rotation.z = 0.3;
        topGroup.add(rightLapel);

        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.5,
            metalness: 0.5
        });
        for (let i = 0; i < 3; i++) {
            const button = new THREE.Mesh(
                new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12),
                buttonMaterial
            );
            button.position.set(0, this.config.torsoHeight * (0.5 - i * 0.15), this.config.torsoWidth * 0.54);
            button.rotation.x = Math.PI / 2;
            topGroup.add(button);
        }

        const pocketGeometry = new THREE.BoxGeometry(0.1, 0.08, 0.02);
        const leftPocket = new THREE.Mesh(pocketGeometry, material);
        leftPocket.position.set(-this.config.torsoWidth * 0.35, this.config.torsoHeight * 0.3, this.config.torsoWidth * 0.53);
        topGroup.add(leftPocket);

        const rightPocket = new THREE.Mesh(pocketGeometry, material);
        rightPocket.position.set(this.config.torsoWidth * 0.35, this.config.torsoHeight * 0.3, this.config.torsoWidth * 0.53);
        topGroup.add(rightPocket);

        const longSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 1.8,
            this.config.armRadius + clothingOffset,
            this.config.armLength * 0.65,
            8
        );
        const leftLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        leftLongSleeve.position.set(-this.config.torsoWidth * 0.56, this.config.torsoHeight * 0.4, 0);
        leftLongSleeve.rotation.z = Math.PI * 0.1;
        leftLongSleeve.castShadow = true;
        topGroup.add(leftLongSleeve);

        const rightLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        rightLongSleeve.position.set(this.config.torsoWidth * 0.56, this.config.torsoHeight * 0.4, 0);
        rightLongSleeve.rotation.z = -Math.PI * 0.1;
        rightLongSleeve.castShadow = true;
        topGroup.add(rightLongSleeve);
    }

    createSuitStyle(topGroup, material, clothingOffset) {
        const suitGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.54 + clothingOffset,
            this.config.torsoWidth * 0.5 + clothingOffset,
            this.config.torsoHeight * 0.68,
            16
        );
        const suit = new THREE.Mesh(suitGeometry, material);
        suit.position.y = this.config.torsoHeight * 0.32;
        suit.castShadow = true;
        topGroup.add(suit);

        const shoulderGeometry = new THREE.BoxGeometry(
            this.config.torsoWidth * 1.3,
            0.03,
            this.config.torsoWidth * 0.6
        );
        const shoulder = new THREE.Mesh(shoulderGeometry, material);
        shoulder.position.y = this.config.torsoHeight * 0.63;
        shoulder.position.z = 0.02;
        shoulder.castShadow = true;
        topGroup.add(shoulder);

        const lapelMaterial = new THREE.MeshStandardMaterial({
            color: material.color.clone().multiplyScalar(0.8),
            roughness: 0.4,
            metalness: 0.1
        });
        const leftLapel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.025), lapelMaterial);
        leftLapel.position.set(-0.05, this.config.torsoHeight * 0.48, this.config.torsoWidth * 0.52);
        leftLapel.rotation.z = -0.35;
        topGroup.add(leftLapel);

        const rightLapel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.025), lapelMaterial);
        rightLapel.position.set(0.05, this.config.torsoHeight * 0.48, this.config.torsoWidth * 0.52);
        rightLapel.rotation.z = 0.35;
        topGroup.add(rightLapel);

        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.7
        });
        for (let i = 0; i < 2; i++) {
            const button = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.015, 0.012, 16),
                buttonMaterial
            );
            button.position.set(0, this.config.torsoHeight * (0.52 - i * 0.18), this.config.torsoWidth * 0.53);
            button.rotation.x = Math.PI / 2;
            topGroup.add(button);
        }

        const breastPocket = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.06, 0.015),
            lapelMaterial
        );
        breastPocket.position.set(-this.config.torsoWidth * 0.35, this.config.torsoHeight * 0.48, this.config.torsoWidth * 0.52);
        topGroup.add(breastPocket);

        const longSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 1.5,
            this.config.armRadius + clothingOffset * 0.8,
            this.config.armLength * 0.63,
            8
        );
        const leftLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        leftLongSleeve.position.set(-this.config.torsoWidth * 0.54, this.config.torsoHeight * 0.42, 0);
        leftLongSleeve.rotation.z = Math.PI * 0.08;
        leftLongSleeve.castShadow = true;
        topGroup.add(leftLongSleeve);

        const rightLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        rightLongSleeve.position.set(this.config.torsoWidth * 0.54, this.config.torsoHeight * 0.42, 0);
        rightLongSleeve.rotation.z = -Math.PI * 0.08;
        rightLongSleeve.castShadow = true;
        topGroup.add(rightLongSleeve);

        const cuffMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.6
        });
        const leftCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(this.config.armRadius + clothingOffset, this.config.armRadius + clothingOffset, 0.04, 8),
            cuffMaterial
        );
        leftCuff.position.set(-this.config.torsoWidth * 0.54, this.config.torsoHeight * 0.15, 0);
        topGroup.add(leftCuff);

        const rightCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(this.config.armRadius + clothingOffset, this.config.armRadius + clothingOffset, 0.04, 8),
            cuffMaterial
        );
        rightCuff.position.set(this.config.torsoWidth * 0.54, this.config.torsoHeight * 0.15, 0);
        topGroup.add(rightCuff);
    }

    createSweaterStyle(topGroup, material, clothingOffset) {
        const sweaterGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.57 + clothingOffset,
            this.config.torsoWidth * 0.54 + clothingOffset,
            this.config.torsoHeight * 0.73,
            16
        );
        const sweater = new THREE.Mesh(sweaterGeometry, material);
        sweater.position.y = this.config.torsoHeight * 0.29;
        sweater.castShadow = true;
        topGroup.add(sweater);

        const neckGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.32 + clothingOffset,
            this.config.torsoWidth * 0.28 + clothingOffset,
            0.1,
            8
        );
        const neck = new THREE.Mesh(neckGeometry, material);
        neck.position.y = this.config.torsoHeight * 0.63;
        neck.castShadow = true;
        topGroup.add(neck);

        const ribMaterial = new THREE.MeshStandardMaterial({
            color: material.color.clone().multiplyScalar(0.92),
            roughness: 0.85
        });
        const bottomRib = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.config.torsoWidth * 0.54 + clothingOffset,
                this.config.torsoWidth * 0.53 + clothingOffset,
                0.06,
                16
            ),
            ribMaterial
        );
        bottomRib.position.y = -this.config.torsoHeight * 0.05;
        bottomRib.castShadow = true;
        topGroup.add(bottomRib);

        const longSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 2,
            this.config.armRadius + clothingOffset * 1.5,
            this.config.armLength * 0.7,
            8
        );
        const leftLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        leftLongSleeve.position.set(-this.config.torsoWidth * 0.57, this.config.torsoHeight * 0.38, 0);
        leftLongSleeve.rotation.z = Math.PI * 0.1;
        leftLongSleeve.castShadow = true;
        topGroup.add(leftLongSleeve);

        const rightLongSleeve = new THREE.Mesh(longSleeveGeometry, material);
        rightLongSleeve.position.set(this.config.torsoWidth * 0.57, this.config.torsoHeight * 0.38, 0);
        rightLongSleeve.rotation.z = -Math.PI * 0.1;
        rightLongSleeve.castShadow = true;
        topGroup.add(rightLongSleeve);

        const leftCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.config.armRadius + clothingOffset * 1.5,
                this.config.armRadius + clothingOffset,
                0.06,
                8
            ),
            ribMaterial
        );
        leftCuff.position.set(-this.config.torsoWidth * 0.57, this.config.torsoHeight * 0.12, 0);
        topGroup.add(leftCuff);

        const rightCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.config.armRadius + clothingOffset * 1.5,
                this.config.armRadius + clothingOffset,
                0.06,
                8
            ),
            ribMaterial
        );
        rightCuff.position.set(this.config.torsoWidth * 0.57, this.config.torsoHeight * 0.12, 0);
        topGroup.add(rightCuff);
    }

    createPoloStyle(topGroup, material, clothingOffset) {
        const poloGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.52 + clothingOffset,
            this.config.torsoWidth * 0.5 + clothingOffset,
            this.config.torsoHeight * 0.68,
            16
        );
        const polo = new THREE.Mesh(poloGeometry, material);
        polo.position.y = this.config.torsoHeight * 0.32;
        polo.castShadow = true;
        topGroup.add(polo);

        const collarGeometry = new THREE.CylinderGeometry(
            this.config.torsoWidth * 0.35 + clothingOffset,
            this.config.torsoWidth * 0.3 + clothingOffset,
            0.08,
            8
        );
        const collar = new THREE.Mesh(collarGeometry, material);
        collar.position.y = this.config.torsoHeight * 0.64;
        collar.castShadow = true;
        topGroup.add(collar);

        const leftCollarPoint = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.07), material);
        leftCollarPoint.position.set(-0.07, this.config.torsoHeight * 0.65, 0.05);
        leftCollarPoint.rotation.z = 0.4;
        topGroup.add(leftCollarPoint);

        const rightCollarPoint = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.07), material);
        rightCollarPoint.position.set(0.07, this.config.torsoHeight * 0.65, 0.05);
        rightCollarPoint.rotation.z = -0.4;
        topGroup.add(rightCollarPoint);

        const placketMaterial = new THREE.MeshStandardMaterial({
            color: material.color.clone().multiplyScalar(0.95),
            roughness: material.roughness
        });
        const placket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.02), placketMaterial);
        placket.position.set(0, this.config.torsoHeight * 0.5, this.config.torsoWidth * 0.52);
        topGroup.add(placket);

        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.3
        });
        for (let i = 0; i < 2; i++) {
            const button = new THREE.Mesh(
                new THREE.CylinderGeometry(0.008, 0.008, 0.01, 12),
                buttonMaterial
            );
            button.position.set(0, this.config.torsoHeight * (0.58 - i * 0.08), this.config.torsoWidth * 0.53);
            button.rotation.x = Math.PI / 2;
            topGroup.add(button);
        }

        const shortSleeveGeometry = new THREE.CylinderGeometry(
            this.config.armRadius + clothingOffset * 1.5,
            this.config.armRadius + clothingOffset,
            this.config.armLength * 0.35,
            8
        );
        const leftShortSleeve = new THREE.Mesh(shortSleeveGeometry, material);
        leftShortSleeve.position.set(-this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.52, 0);
        leftShortSleeve.rotation.z = Math.PI * 0.15;
        leftShortSleeve.castShadow = true;
        topGroup.add(leftShortSleeve);

        const rightShortSleeve = new THREE.Mesh(shortSleeveGeometry, material);
        rightShortSleeve.position.set(this.config.torsoWidth * 0.55, this.config.torsoHeight * 0.52, 0);
        rightShortSleeve.rotation.z = -Math.PI * 0.15;
        rightShortSleeve.castShadow = true;
        topGroup.add(rightShortSleeve);
    }

    createPants(style, color) {
        this.currentStyles.pants = style;
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
        this.currentStyles.shoes = style;
        if (this.clothing.shoes) {
            this.hipJoint.remove(this.clothing.shoes);
        }

        if (style === 'none') {
            this.clothing.shoes = null;
            return;
        }

        let shoesGroup = new THREE.Group();

        switch (style) {
            case 'sneaker':
                this.createSneakerStyle(shoesGroup, color);
                break;
            case 'leather':
                this.createLeatherShoeStyle(shoesGroup, color);
                break;
            case 'boots':
                this.createBootsStyle(shoesGroup, color);
                break;
            case 'casual':
                this.createCasualShoeStyle(shoesGroup, color);
                break;
            case 'sandal':
                this.createSandalStyle(shoesGroup, color);
                break;
            case 'loafer':
                this.createLoaferStyle(shoesGroup, color);
                break;
            case 'canvas':
                this.createCanvasShoeStyle(shoesGroup, color);
                break;
            default:
                this.createSneakerStyle(shoesGroup, color);
                break;
        }

        this.clothing.shoes = shoesGroup;
        this.clothingColors.shoes = color;
        this.hipJoint.add(shoesGroup);
    }

    createSneakerStyle(shoesGroup, color) {
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.1
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.1
        });

        const accentMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5,
            metalness: 0.2
        });

        this.createSneakerPair(shoesGroup, shoeMaterial, soleMaterial, accentMaterial);
    }

    createSneakerPair(group, shoeMaterial, soleMaterial, accentMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.52,
                0.025,
                this.config.footLength * 1.1
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.055, zBase);
            sole.castShadow = true;
            group.add(sole);

            const midsoleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.5,
                0.02,
                this.config.footLength
            );
            const midsole = new THREE.Mesh(midsoleGeometry, soleMaterial);
            midsole.position.set(xOffset, yBase - 0.03, zBase);
            midsole.castShadow = true;
            group.add(midsole);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.48,
                0.07,
                this.config.footLength * 0.9
            );
            const upper = new THREE.Mesh(upperGeometry, shoeMaterial);
            upper.position.set(xOffset, yBase + 0.01, zBase);
            upper.castShadow = true;
            group.add(upper);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.24,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, shoeMaterial);
            toe.position.set(xOffset, yBase + 0.01, zBase + this.config.footLength * 0.45);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const heelGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.4,
                0.08,
                0.06
            );
            const heel = new THREE.Mesh(heelGeometry, shoeMaterial);
            heel.position.set(xOffset, yBase + 0.015, zBase - this.config.footLength * 0.35);
            heel.castShadow = true;
            group.add(heel);

            const swooshGeometry = new THREE.BoxGeometry(0.015, 0.04, 0.12);
            const swoosh = new THREE.Mesh(swooshGeometry, accentMaterial);
            swoosh.position.set(
                xOffset + (side * 0.03),
                yBase + 0.02,
                zBase + 0.02
            );
            swoosh.rotation.z = side * 0.3;
            group.add(swoosh);

            const tongueGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.25,
                0.02,
                0.08
            );
            const tongue = new THREE.Mesh(tongueGeometry, shoeMaterial);
            tongue.position.set(xOffset, yBase + 0.055, zBase + 0.02);
            tongue.castShadow = true;
            group.add(tongue);
        });
    }

    createLeatherShoeStyle(shoesGroup, color) {
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.35,
            metalness: 0.4
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a1a0a,
            roughness: 0.8,
            metalness: 0.1
        });

        this.createLeatherShoePair(shoesGroup, shoeMaterial, soleMaterial);
    }

    createLeatherShoePair(group, shoeMaterial, soleMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.48,
                0.02,
                this.config.footLength * 0.95
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.045, zBase);
            sole.castShadow = true;
            group.add(sole);

            const heelGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.35,
                0.035,
                0.08
            );
            const heel = new THREE.Mesh(heelGeometry, soleMaterial);
            heel.position.set(xOffset, yBase - 0.055, zBase - this.config.footLength * 0.3);
            heel.castShadow = true;
            group.add(heel);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.46,
                0.06,
                this.config.footLength * 0.85
            );
            const upper = new THREE.Mesh(upperGeometry, shoeMaterial);
            upper.position.set(xOffset, yBase - 0.005, zBase);
            upper.castShadow = true;
            group.add(upper);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.23,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, shoeMaterial);
            toe.position.set(xOffset, yBase - 0.005, zBase + this.config.footLength * 0.42);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const vampGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.35,
                0.02,
                0.1
            );
            const vamp = new THREE.Mesh(vampGeometry, shoeMaterial);
            vamp.position.set(xOffset, yBase + 0.03, zBase + 0.05);
            vamp.castShadow = true;
            group.add(vamp);

            const quarterGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.3,
                0.05,
                0.08
            );
            const quarter = new THREE.Mesh(quarterGeometry, shoeMaterial);
            quarter.position.set(xOffset, yBase + 0.01, zBase - this.config.footLength * 0.3);
            quarter.castShadow = true;
            group.add(quarter);
        });
    }

    createBootsStyle(shoesGroup, color) {
        const bootMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.2
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.9,
            metalness: 0.1
        });

        this.createBootsPair(shoesGroup, bootMaterial, soleMaterial);
    }

    createBootsPair(group, bootMaterial, soleMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.55,
                0.035,
                this.config.footLength * 1.05
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.06, zBase);
            sole.castShadow = true;
            group.add(sole);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.52,
                0.08,
                this.config.footLength * 0.95
            );
            const upper = new THREE.Mesh(upperGeometry, bootMaterial);
            upper.position.set(xOffset, yBase - 0.005, zBase);
            upper.castShadow = true;
            group.add(upper);

            const shaftGeometry = new THREE.CylinderGeometry(
                this.config.legRadius * 0.9,
                this.config.legRadius * 0.95,
                0.25,
                8
            );
            const shaft = new THREE.Mesh(shaftGeometry, bootMaterial);
            shaft.position.set(xOffset, yBase + 0.13, zBase);
            shaft.castShadow = true;
            group.add(shaft);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.26,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, bootMaterial);
            toe.position.set(xOffset, yBase - 0.005, zBase + this.config.footLength * 0.47);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const laceGeometry = new THREE.CylinderGeometry(0.006, 0.006, 0.22, 8);
            const laceMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.6
            });
            for (let i = 0; i < 3; i++) {
                const lace = new THREE.Mesh(laceGeometry, laceMaterial);
                lace.position.set(
                    xOffset + (side * 0.02),
                    yBase + 0.04 + i * 0.06,
                    zBase + 0.05
                );
                lace.rotation.z = side * 0.2;
                group.add(lace);
            }
        });
    }

    createCasualShoeStyle(shoesGroup, color) {
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.6,
            metalness: 0.15
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.85,
            metalness: 0.1
        });

        this.createCasualShoePair(shoesGroup, shoeMaterial, soleMaterial);
    }

    createCasualShoePair(group, shoeMaterial, soleMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.5,
                0.022,
                this.config.footLength
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.05, zBase);
            sole.castShadow = true;
            group.add(sole);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.48,
                0.065,
                this.config.footLength * 0.9
            );
            const upper = new THREE.Mesh(upperGeometry, shoeMaterial);
            upper.position.set(xOffset, yBase - 0.002, zBase);
            upper.castShadow = true;
            group.add(upper);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.24,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, shoeMaterial);
            toe.position.set(xOffset, yBase - 0.002, zBase + this.config.footLength * 0.45);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const sliponGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.3,
                0.015,
                0.12
            );
            const slipon = new THREE.Mesh(sliponGeometry, shoeMaterial);
            slipon.position.set(xOffset, yBase + 0.035, zBase);
            slipon.castShadow = true;
            group.add(slipon);
        });
    }

    createSandalStyle(shoesGroup, color) {
        const sandalMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.4,
            metalness: 0.2
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            roughness: 0.7,
            metalness: 0.1
        });

        this.createSandalPair(shoesGroup, sandalMaterial, soleMaterial);
    }

    createSandalPair(group, sandalMaterial, soleMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.48,
                0.015,
                this.config.footLength * 0.95
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.045, zBase);
            sole.castShadow = true;
            group.add(sole);

            const toeStrapGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.4,
                0.012,
                0.04
            );
            const toeStrap = new THREE.Mesh(toeStrapGeometry, sandalMaterial);
            toeStrap.position.set(xOffset, yBase - 0.035, zBase + this.config.footLength * 0.35);
            toeStrap.castShadow = true;
            group.add(toeStrap);

            const midStrapGeometry = new THREE.BoxGeometry(0.012, 0.06, 0.08);
            const leftMidStrap = new THREE.Mesh(midStrapGeometry, sandalMaterial);
            leftMidStrap.position.set(
                xOffset - (side * 0.02),
                yBase - 0.01,
                zBase + 0.05
            );
            leftMidStrap.castShadow = true;
            group.add(leftMidStrap);

            const rightMidStrap = new THREE.Mesh(midStrapGeometry, sandalMaterial);
            rightMidStrap.position.set(
                xOffset + (side * 0.02),
                yBase - 0.01,
                zBase + 0.05
            );
            rightMidStrap.castShadow = true;
            group.add(rightMidStrap);

            const heelStrapGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.3,
                0.012,
                0.04
            );
            const heelStrap = new THREE.Mesh(heelStrapGeometry, sandalMaterial);
            heelStrap.position.set(xOffset, yBase - 0.03, zBase - this.config.footLength * 0.3);
            heelStrap.castShadow = true;
            group.add(heelStrap);

            const backStrapGeometry = new THREE.BoxGeometry(0.012, 0.05, 0.04);
            const backStrap = new THREE.Mesh(backStrapGeometry, sandalMaterial);
            backStrap.position.set(
                xOffset,
                yBase - 0.015,
                zBase - this.config.footLength * 0.3
            );
            backStrap.castShadow = true;
            group.add(backStrap);
        });
    }

    createLoaferStyle(shoesGroup, color) {
        const loaferMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.35
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.1
        });

        this.createLoaferPair(shoesGroup, loaferMaterial, soleMaterial);
    }

    createLoaferPair(group, loaferMaterial, soleMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.47,
                0.018,
                this.config.footLength * 0.92
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.042, zBase);
            sole.castShadow = true;
            group.add(sole);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.45,
                0.055,
                this.config.footLength * 0.85
            );
            const upper = new THREE.Mesh(upperGeometry, loaferMaterial);
            upper.position.set(xOffset, yBase - 0.008, zBase);
            upper.castShadow = true;
            group.add(upper);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.225,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, loaferMaterial);
            toe.position.set(xOffset, yBase - 0.008, zBase + this.config.footLength * 0.42);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const saddleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.28,
                0.015,
                0.1
            );
            const saddleMaterial = new THREE.MeshStandardMaterial({
                color: loaferMaterial.color.clone().multiplyScalar(0.85),
                roughness: loaferMaterial.roughness,
                metalness: loaferMaterial.metalness
            });
            const saddle = new THREE.Mesh(saddleGeometry, saddleMaterial);
            saddle.position.set(xOffset, yBase + 0.022, zBase - 0.02);
            saddle.castShadow = true;
            group.add(saddle);

            const pennySlotGeometry = new THREE.BoxGeometry(0.06, 0.008, 0.035);
            const pennySlot = new THREE.Mesh(pennySlotGeometry, saddleMaterial);
            pennySlot.position.set(xOffset, yBase + 0.028, zBase - 0.02);
            group.add(pennySlot);
        });
    }

    createCanvasShoeStyle(shoesGroup, color) {
        const canvasMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.75,
            metalness: 0.05
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.9,
            metalness: 0.05
        });

        const rubberMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc4444,
            roughness: 0.7,
            metalness: 0.1
        });

        this.createCanvasShoePair(shoesGroup, canvasMaterial, soleMaterial, rubberMaterial);
    }

    createCanvasShoePair(group, canvasMaterial, soleMaterial, rubberMaterial) {
        const sides = [-1, 1];

        sides.forEach(side => {
            const xOffset = this.config.torsoWidth * 0.25 * side;
            const yBase = -this.config.legLength;
            const zBase = this.config.footLength * 0.2;

            const soleGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.51,
                0.028,
                this.config.footLength * 1.02
            );
            const sole = new THREE.Mesh(soleGeometry, soleMaterial);
            sole.position.set(xOffset, yBase - 0.058, zBase);
            sole.castShadow = true;
            group.add(sole);

            const upperGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.49,
                0.075,
                this.config.footLength * 0.95
            );
            const upper = new THREE.Mesh(upperGeometry, canvasMaterial);
            upper.position.set(xOffset, yBase, zBase);
            upper.castShadow = true;
            group.add(upper);

            const toeGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.245,
                8, 8, 0, Math.PI
            );
            const toe = new THREE.Mesh(toeGeometry, canvasMaterial);
            toe.position.set(xOffset, yBase, zBase + this.config.footLength * 0.47);
            toe.rotation.x = -Math.PI / 2;
            toe.castShadow = true;
            group.add(toe);

            const toeCapGeometry = new THREE.SphereGeometry(
                this.config.footLength * 0.25,
                8, 4, 0, Math.PI, Math.PI / 2, Math.PI / 2
            );
            const toeCap = new THREE.Mesh(toeCapGeometry, rubberMaterial);
            toeCap.position.set(xOffset, yBase - 0.02, zBase + this.config.footLength * 0.47);
            toeCap.rotation.x = -Math.PI / 2;
            group.add(toeCap);

            const tongueGeometry = new THREE.BoxGeometry(
                this.config.footLength * 0.28,
                0.018,
                0.09
            );
            const tongue = new THREE.Mesh(tongueGeometry, canvasMaterial);
            tongue.position.set(xOffset, yBase + 0.05, zBase + 0.03);
            tongue.castShadow = true;
            group.add(tongue);

            const laceGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.18, 6);
            const laceMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.6
            });
            for (let i = 0; i < 4; i++) {
                const lace = new THREE.Mesh(laceGeometry, laceMaterial);
                lace.position.set(
                    xOffset + (side * 0.015),
                    yBase + 0.045 + i * 0.04,
                    zBase + 0.04
                );
                lace.rotation.z = side * 0.15;
                group.add(lace);
            }
        });
    }

    createHat(style, color) {
        this.currentStyles.hat = style;
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
        this.currentStyles.glasses = style;
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
        return this.currentStyles[category] || 'none';
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
