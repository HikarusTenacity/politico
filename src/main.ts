import * as THREE from 'three';

import { createGamePieces } from './game/actors/pieces/create';
import { positionPiecesForCharacterSelect } from './game/actors/pieces/place';
import { updateAllPiecePositions } from './game/actors/actor-manager';

import { initializeBoardSpaces} from "./game/board/board-layout";
import { createPlayableSpacesVisualization, createBoardGridVisualization } from "./utils/grid-visual";

import { setupEnvironment, setEnvironmentQuality, updateEnvironmentAnimations } from "./rendering/environment";
import { setupSky, updateClouds, setCloudEffectsEnabled, setSkyQuality } from './rendering/sky';

import { applyIdleAnimations, createPlayerAnimator} from './game/animations/player-animator';

import { GAME_RENDER_CONFIG } from './constants/rendering-parameters';
import { setupCameraControls } from './input/camera';
import { createGameManager } from './game/game-manager';
import { createSettingsManager } from './game/ui/settings/settings-manager';
import { createSettingsMenu } from './game/ui/settings/settings-menu';

import { applyGameTheme } from './game/themes/game-theme';
import { createCreditsScreen } from './game/ui/credits/credits-screen';
import { createGameUI } from './game/ui/game-ui';
import { createFpsCounter } from './utils/fps-counter';
import { loadKurokaneFont } from './utils/font-loader';
import './styles/main.css';
import {clampValue} from "./utils/clampValue";
import {GAME_CAMERA_CONFIG} from "./constants/camera-parameters";
import { createTitleScreen } from './game/ui/menu/title-screen';

import type { GameThemeName } from './types/theme';
import type { CameraControls } from "./types/camera-types";
import type {GameSettings, GraphicsQuality, SettingsManager} from "./types/settings-types";
import type {SkyQuality} from "./types/environment-types";

const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const pixelationScale: number = GAME_RENDER_CONFIG.pixelationScale;

const renderer = new THREE.WebGLRenderer({ 
    antialias: GAME_RENDER_CONFIG.rendererOptions.antialias, 
    powerPreference: GAME_RENDER_CONFIG.rendererOptions.powerPreference
});

const pixelatedRenderTarget = new THREE.WebGLRenderTarget(1, 1);
pixelatedRenderTarget.texture.minFilter = THREE.NearestFilter;
pixelatedRenderTarget.texture.magFilter = THREE.NearestFilter;
pixelatedRenderTarget.texture.generateMipmaps = false;

const postProcessScene = new THREE.Scene();
const postProcessCamera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    0,
    1
);
const postProcessMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: null },
        resolution: {
            value: new THREE.Vector4(
                1,
                1,
                1,
                1
            )
        }
    },
    vertexShader:
        `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }
        `,
    fragmentShader:
        `
        uniform sampler2D tDiffuse;
        uniform vec4 resolution;
        varying vec2 vUv;
        void main() {
            vec2 iuv = (floor(resolution.xy * vUv) + .5) * resolution.zw;
            gl_FragColor = texture2D(tDiffuse, iuv);
        }
        `
});
const postProcessQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    postProcessMaterial);
postProcessScene.add(postProcessQuad);

function syncViewportSize() {
    const viewportWidth: number = Math.max(1, window.innerWidth);
    const viewportHeight: number = Math.max(1, window.innerHeight);
    const renderWidth: number = Math.max(1, Math.floor(viewportWidth / pixelationScale));
    const renderHeight: number = Math.max(1, Math.floor(viewportHeight / pixelationScale));

    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        viewportWidth,
        viewportHeight,
        false
    );
    pixelatedRenderTarget.setSize(renderWidth, renderHeight);
    postProcessMaterial.uniforms.resolution!.value.set(
        renderWidth,
        renderHeight,
        1 / renderWidth,
        1 / renderHeight
    );
}

syncViewportSize();
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const infoDiv: HTMLDivElement = document.getElementById('info') as HTMLDivElement;
const fpsCounter  = createFpsCounter();

// create the pieces
const worldPieces = createGamePieces();
for (const element of worldPieces) {
    scene.add(element);
}

// Initialize board spaces
initializeBoardSpaces();

// Pregame character select lineup
positionPiecesForCharacterSelect(worldPieces);

// Setup environment and get directional light
const directionalLight = setupEnvironment(scene);

// Setup sky elements
setupSky(scene, directionalLight);

// Setup playable space visualization
createPlayableSpacesVisualization(scene);

// Setup board grid visualization
createBoardGridVisualization(scene);

// Setup camera controls
const cameraControls: CameraControls = setupCameraControls(camera, scene);

// Initialize game manager for local 4-player co-op
const gameManager = createGameManager(scene, camera, worldPieces, renderer.domElement);

// Initialize game UI
const gameUI = createGameUI(infoDiv);

// Initialize settings systems
const settingsManager: SettingsManager = createSettingsManager();
applyGameTheme(settingsManager.getTheme());
const settingsMenu = createSettingsMenu(settingsManager);
const creditsScreen = createCreditsScreen();

function setSceneShadowsEnabled(enabled: boolean): void {
    renderer.shadowMap.enabled = enabled;
    directionalLight.castShadow = enabled;
}
function applyMasterVolume(volume: number): void {
    const vol: number = clampValue(
        volume,
        0,
        1
    );

    const mediaNodes = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
    for (const element of mediaNodes) element.volume = vol;

    (window as any).__GAME_MASTER_VOLUME__ = vol;
}

function applyGraphicsQuality(quality: SkyQuality): void {
    let shadowsEnabled: boolean = quality !== 'low';
    let effectsEnabled: boolean = quality === 'high';

    setSceneShadowsEnabled(shadowsEnabled);

    if (typeof setCloudEffectsEnabled === 'function') {
        setCloudEffectsEnabled(effectsEnabled);
    }

    if (typeof setEnvironmentQuality === 'function') setEnvironmentQuality(quality);

    if (typeof setSkyQuality === 'function') {
        setSkyQuality(quality);
    }
}

function applySettings(settings: GameSettings): void {
    applyMasterVolume(settings.masterVolume);
    applyGraphicsQuality(settings.graphicsQuality);
    gameManager.setGameSpeed(settings.gameSpeed);
    applyGameTheme(settings.theme);
}

settingsManager.subscribe(applySettings);
applySettings(settingsManager.getAll());

window.addEventListener('resize', function(): void {
    syncViewportSize();
    applyGraphicsQuality(settingsManager.getGraphicsQuality());
});

settingsMenu.onVolumeChange(function(value: number): void {
    settingsManager.setVolume(value);
});

settingsMenu.onGraphicsChange(function(quality: GraphicsQuality): void {
    settingsManager.setGraphicsQuality(quality);
});

settingsMenu.onThemeChange(function(theme: GameThemeName) {
    settingsManager.setTheme(theme);
});

settingsMenu.onGameSpeedChange(function(speed: number) {
    settingsManager.setGameSpeed(speed);
});

settingsMenu.onReset(function() {
    settingsManager.resetToDefaults();
});

settingsMenu.onClose(function() {
    settingsMenu.hide();
});

// Initialize title screen gate
const titleScreen = createTitleScreen();
let hasGameStarted = false;

if (gameManager.inputHandler?.actionButton) {
    gameManager.inputHandler.actionButton.style.display = 'none';
}

titleScreen.onStart(function() {
    hasGameStarted = true;
    titleScreen.hide();

    if (gameManager.inputHandler?.actionButton) {
        gameManager.inputHandler.actionButton.style.display = 'block';
    }
});

titleScreen.onButton('settings', function() {
    settingsMenu.show();
});

titleScreen.onButton('credits', function() {
    creditsScreen.show();
});

// Render loop
const render = function () {
    requestAnimationFrame(render);

    if (!hasGameStarted) {
        camera.position.set(
            GAME_CAMERA_CONFIG.pregamePosition.x,
            GAME_CAMERA_CONFIG.pregamePosition.y,
            GAME_CAMERA_CONFIG.pregamePosition.z
        );
        camera.lookAt(
            GAME_CAMERA_CONFIG.pregameLookAt.x,
            GAME_CAMERA_CONFIG.pregameLookAt.y,
            GAME_CAMERA_CONFIG.pregameLookAt.z
        );
        applyIdleAnimations(worldPieces, Date.now());
        updateEnvironmentAnimations(Date.now());
        renderer.setRenderTarget(pixelatedRenderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        postProcessMaterial.uniforms.tDiffuse!.value = pixelatedRenderTarget.texture;
        renderer.render(postProcessScene, postProcessCamera);
        fpsCounter.update({
            renderStats: {
                calls: renderer.info.render.calls,
                triangles: renderer.info.render.triangles,
                geometries: renderer.info.memory.geometries,
                textures: renderer.info.memory.textures
            },
            gameManager: gameManager
        });
        return;
    }

    // Update game manager
    gameManager.update();

    // Update clouds
    updateClouds();

    // Only update camera controls if no animation is playing
    if (gameManager.isPregame()) {
        camera.position.set(
            GAME_CAMERA_CONFIG.boardPosition.x,
            GAME_CAMERA_CONFIG.boardPosition.y,
            GAME_CAMERA_CONFIG.boardPosition.z
        );
        camera.lookAt(
            GAME_CAMERA_CONFIG.boardLookAt.x,
            GAME_CAMERA_CONFIG.boardLookAt.y,
            GAME_CAMERA_CONFIG.boardLookAt.z
        );
    } else if (gameManager.diceAnimator && !gameManager.diceAnimator.isAnimating) {
        cameraControls.updateCamera();
    }

    if ((window as any).playerAnimator?.isAnimating) {
        const stillWalking = (window as any).playerAnimator.update();
        if (!stillWalking) {
            (window as any).playerAnimator = null;
        }
    }

    // Update piece positions based on player locations (skip during animation)
    if (gameManager.diceAnimator && !gameManager.diceAnimator.isAnimating && !gameManager.isPregame()) {
        updateAllPiecePositions();
    }

    applyIdleAnimations(worldPieces, Date.now());
    updateEnvironmentAnimations(Date.now());

    // Update game UI
    gameUI.update(gameManager);

    renderer.setRenderTarget(pixelatedRenderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    postProcessMaterial.uniforms.tDiffuse!.value = pixelatedRenderTarget.texture;
    renderer.render(postProcessScene, postProcessCamera);
    fpsCounter.update({
        renderStats: {
            calls: renderer.info.render.calls,
            triangles: renderer.info.render.triangles,
            geometries: renderer.info.memory.geometries,
            textures: renderer.info.memory.textures
        },
        gameManager: gameManager 
    });
};

// === ANIMATION EDITOR API ===
// Expose game state for testing/debugging
(window as any).GAME_STATE = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    pieces: worldPieces,
    gameManager: gameManager,
    get playerAnimator() {
        return (window as any).playerAnimator || null;
    },
    diceAnimator: gameManager.diceAnimator,
    get isAnimating() {
        return gameManager.diceAnimator?.isAnimating ?? false;
    }
};

(window as any).testAnimations = {
    playPlayerWalk: function(playerIndex: number, targetSpace: number) {
        const piece = worldPieces[playerIndex || 0];
        if (!piece) {
            console.error('Player ' + playerIndex + ' not found');
            return;
        }
        let animator = createPlayerAnimator(piece, targetSpace);
        animator.init();
        (window as any).playerAnimator = animator;
    },

    rollDice: function(speedMultiplier: number) {
        if (!gameManager?.diceAnimator) {
            console.error('Dice animator not available');
            return;
        }
        gameManager.diceAnimator.setupCutscene();
        gameManager.diceAnimator.setSpeedMultiplier(speedMultiplier || 1.0);
    },

    setIdleSpeedMultiplier: function(mult: number) {
        worldPieces.forEach((piece: any) => {
            piece.userData.idleSpeedMultiplier = mult;
        });
    },

    setBodySwayAmount: function(amount: number) {
        worldPieces.forEach((piece: any) => {
            piece.userData.bodySwayAmount = amount;
        });
    },

    resetIdlePhases: function() {
        worldPieces.forEach((piece: any) => {
            piece.userData.idlePhase = Math.random() * Math.PI * 2; //NOSONAR
        });
    }
};

void loadKurokaneFont();

render();
