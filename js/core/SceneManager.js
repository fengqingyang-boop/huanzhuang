import { SCENE_CONFIG } from '../data/gameData.js';
import { Helpers } from '../utils/helpers.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.lights = {};
        this.character = null;
        this.isInitialized = false;
        this.animationId = null;
        this.clock = null;
        
        this.targetRotationY = 0;
        this.currentRotationY = 0;
        this.isRotating = false;
        this.autoRotate = SCENE_CONFIG.rotation.autoRotate;
    }

    init(canvasElement) {
        if (this.isInitialized) {
            console.warn('SceneManager already initialized');
            return this;
        }

        this.canvas = canvasElement;
        this.clock = new THREE.Clock();

        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createEnvironment();
        this.setupEventListeners();
        this.startAnimationLoop();

        this.isInitialized = true;
        return this;
    }

    createScene() {
        this.scene = new THREE.Scene();
        
        const gradient = new THREE.Color(SCENE_CONFIG.background.top);
        this.scene.background = gradient;
        this.scene.fog = new THREE.Fog(
            SCENE_CONFIG.background.bottom, 5, 15
        );
    }

    createCamera() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(
            SCENE_CONFIG.camera.fov,
            aspect,
            SCENE_CONFIG.camera.near,
            SCENE_CONFIG.camera.far
        );

        this.camera.position.set(
            SCENE_CONFIG.camera.position.x,
            SCENE_CONFIG.camera.position.y,
            SCENE_CONFIG.camera.position.z
        );
        this.camera.lookAt(0, 1, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(
            SCENE_CONFIG.lights.ambient.color,
            SCENE_CONFIG.lights.ambient.intensity
        );
        this.scene.add(ambientLight);
        this.lights.ambient = ambientLight;

        const directionalLight = new THREE.DirectionalLight(
            SCENE_CONFIG.lights.directional.color,
            SCENE_CONFIG.lights.directional.intensity
        );
        directionalLight.position.set(
            SCENE_CONFIG.lights.directional.position.x,
            SCENE_CONFIG.lights.directional.position.y,
            SCENE_CONFIG.lights.directional.position.z
        );
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;
        this.scene.add(directionalLight);
        this.lights.directional = directionalLight;

        const hemisphereLight = new THREE.HemisphereLight(
            SCENE_CONFIG.lights.hemisphere.skyColor,
            SCENE_CONFIG.lights.hemisphere.groundColor,
            SCENE_CONFIG.lights.hemisphere.intensity
        );
        this.scene.add(hemisphereLight);
        this.lights.hemisphere = hemisphereLight;

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);
        this.lights.fill = fillLight;

        const rimLight = new THREE.DirectionalLight(0x88aaff, 0.2);
        rimLight.position.set(0, 2, -5);
        this.scene.add(rimLight);
        this.lights.rim = rimLight;
    }

    createEnvironment() {
        const floorGeometry = new THREE.CircleGeometry(3, 64);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01;
        floor.receiveShadow = true;
        this.scene.add(floor);

        const shadowGeometry = new THREE.CircleGeometry(0.8, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.001;
        this.scene.add(shadow);

        this.createDecorativeElements();
    }

    createDecorativeElements() {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 1] = Math.random() * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.6, 0.5, 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setCharacter(character) {
        if (this.character) {
            this.scene.remove(this.character.group);
        }
        this.character = character;
        if (character && character.group) {
            this.scene.add(character.group);
        }
        return this;
    }

    setupEventListeners() {
        this._onResize = Helpers.debounce(this.handleResize.bind(this), 100);
        window.addEventListener('resize', () => this._onResize());

        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());

        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.onMouseUp());

        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
    }

    onMouseDown(event) {
        this.isMouseDown = true;
        this.isRotating = true;
        this.autoRotate = false;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

    onMouseMove(event) {
        if (!this.isMouseDown) return;

        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        this.targetRotationY -= deltaX * SCENE_CONFIG.rotation.speed;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.isRotating = false;
        setTimeout(() => {
            if (!this.isMouseDown) {
                this.autoRotate = SCENE_CONFIG.rotation.autoRotate;
            }
        }, 2000);
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isMouseDown = true;
            this.isRotating = true;
            this.autoRotate = false;
            this.lastMouseX = event.touches[0].clientX;
            this.lastMouseY = event.touches[0].clientY;
        }
    }

    onTouchMove(event) {
        if (!this.isMouseDown || event.touches.length !== 1) return;
        event.preventDefault();

        const deltaX = event.touches[0].clientX - this.lastMouseX;
        this.targetRotationY -= deltaX * SCENE_CONFIG.rotation.speed;

        this.lastMouseX = event.touches[0].clientX;
        this.lastMouseY = event.touches[0].clientY;
    }

    handleResize() {
        if (this.camera && this.renderer) {
            const width = this.canvas.clientWidth;
            const height = this.canvas.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    startAnimationLoop() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.update();
            this.render();
        };
        animate();
    }

    update() {
        const delta = this.clock.getDelta();

        if (this.autoRotate && !this.isRotating) {
            this.targetRotationY += SCENE_CONFIG.rotation.autoRotateSpeed;
        }

        const damping = SCENE_CONFIG.rotation.damping;
        this.currentRotationY = Helpers.lerp(
            this.currentRotationY,
            this.targetRotationY,
            1 - Math.pow(damping, delta * 60)
        );

        if (this.character && this.character.group) {
            this.character.group.rotation.y = this.currentRotationY;
            this.character.update(delta);
        }

        if (this.particles) {
            this.particles.rotation.y += delta * 0.1;
            const positions = this.particles.geometry.attributes.position.array;
            const time = this.clock.getElapsedTime();
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i * 0.1) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    rotateCharacter(angle) {
        this.targetRotationY += angle;
    }

    setAutoRotate(enabled) {
        this.autoRotate = enabled;
    }

    getRotation() {
        return this.currentRotationY;
    }

    setRotation(angle) {
        this.currentRotationY = angle;
        this.targetRotationY = angle;
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        this.isInitialized = false;
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}

export default SceneManager;
