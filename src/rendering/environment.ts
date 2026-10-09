import * as THREE from 'three';
import { getGameTheme} from "../game/themes/game-theme";
import { createTreeRing } from '../game/models/tree';
import { createMountains } from '../game/models/mountain';
import {
    AMBIENT_LIGHT_INTENSITY,
    DIRECTIONAL_LIGHT_SETTINGS,
    GROUND,
    HEMISPHERE_LIGHT_INTENSITY,
    TREE
} from "../constants/rendering-parameters";
import { EnvironmentTheme } from "../types/environment-types";
import {setCloudTheme} from "./sky";
import {GROUND_TEXTURE_PATH} from "../constants/environment-parameters";

let environmentTheme: EnvironmentTheme = getGameTheme().visuals.environment;
let swayMultiplier: number = 1.0;

const environmentMaterials = {
    ground: null as THREE.MeshPhongMaterial,
    floor: null as THREE.MeshPhongMaterial,
    directionalLight: null as THREE.DirectionalLight,
    ambientLight: null as THREE.AmbientLight,
    hemisphereLight: null as THREE.HemisphereLight
};
const environmentVisuals = {
    trees: [],
    mountains: []
};

function setupEnvironment(scene: THREE.Scene): THREE.DirectionalLight {
    if (typeof getGameTheme === 'function') {
        environmentTheme = getGameTheme().visuals.environment;
    }

    const groundColor:   number = environmentTheme.groundColor;
    const sunlightColor: number = environmentTheme.sunlightColor;
    const skyLightColor: number = environmentTheme.skyLightColor;

    const groundGeometry = new THREE.PlaneGeometry(
        GROUND.width,
        GROUND.length
    );
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: groundColor,
        flatShading: GROUND.usesFlatShading
    });
    const ground = new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );
    ground.rotation.x = GROUND.rotationX;
    ground.position.y = GROUND.rotationY;
    ground.receiveShadow = GROUND.recievesShadow;
    scene.add(ground);

    const textureLoader = new THREE.TextureLoader();
    const floorTexture: THREE.Texture = textureLoader.load(GROUND_TEXTURE_PATH);

    const floorGeometry = new THREE.PlaneGeometry(
        GROUND.boardWidth,
        GROUND.boardHeight
    );
    const floorMaterial = new THREE.MeshPhongMaterial({
        map: floorTexture
    });
    const floor = new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );
    floor.rotation.x = GROUND.rotationX;
    floor.position.y = GROUND.positionY;
    floor.receiveShadow = GROUND.recievesShadow;
    scene.add(floor);

    environmentVisuals.trees = createTreeRing(scene) || [];
    for (const tree of environmentVisuals.trees) {
        tree.userData.baseRotationX = tree.rotation.x;
        tree.userData.baseRotationZ = tree.rotation.z;
        tree.userData.swayPhase = Math.random() * Math.PI * 2; //NOSONAR, purely for animation
        tree.userData.swayAmplitude =
            TREE.sway.amplitudeBase + Math.random() * TREE.sway.amplitudeRange; //NOSONAR
        tree.userData.swaySpeed =
            TREE.sway.speedBase + Math.random() * TREE.sway.speedRange; //NOSONAR
    }

    environmentVisuals.mountains = createMountains() || [];

    const directionalLight = new THREE.DirectionalLight(sunlightColor, DIRECTIONAL_LIGHT_SETTINGS.intensity);
    directionalLight.position.set(
        DIRECTIONAL_LIGHT_SETTINGS.x,
        DIRECTIONAL_LIGHT_SETTINGS.y,
        DIRECTIONAL_LIGHT_SETTINGS.z
    );
    directionalLight.castShadow = DIRECTIONAL_LIGHT_SETTINGS.castsShadow;
    directionalLight.shadow.mapSize.width = DIRECTIONAL_LIGHT_SETTINGS.shadowMapSize.width;
    directionalLight.shadow.mapSize.height = DIRECTIONAL_LIGHT_SETTINGS.shadowMapSize.height;
    directionalLight.shadow.camera.near = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.near;
    directionalLight.shadow.camera.far = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.far;
    directionalLight.shadow.camera.left = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.left;
    directionalLight.shadow.camera.right = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.right;
    directionalLight.shadow.camera.top = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.top;
    directionalLight.shadow.camera.bottom = DIRECTIONAL_LIGHT_SETTINGS.shadowCamera.bottom;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(
        skyLightColor,
        AMBIENT_LIGHT_INTENSITY
    );
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(
        skyLightColor,
        groundColor,
        HEMISPHERE_LIGHT_INTENSITY
    );
    scene.add(hemisphereLight);

    environmentMaterials.ground = groundMaterial;
    environmentMaterials.floor = floorMaterial;
    environmentMaterials.directionalLight = directionalLight;
    environmentMaterials.ambientLight = ambientLight;
    environmentMaterials.hemisphereLight = hemisphereLight;

    return directionalLight;
}

function setEnvironmentTheme(theme: EnvironmentTheme): void {
    environmentTheme = theme;

    environmentMaterials.ground?.color.setHex(theme.groundColor);
    environmentMaterials.floor?.color.setHex(theme.groundColor);
    environmentMaterials.directionalLight?.color.setHex(theme.sunlightColor);
    environmentMaterials.ambientLight?.color.setHex(theme.skyLightColor);
    environmentMaterials.hemisphereLight?.color.setHex(theme.skyLightColor);
    environmentMaterials.hemisphereLight?.groundColor.setHex(theme.groundColor);

    for (const tree of environmentVisuals.trees) {
        tree.traverse(function(node: THREE.Object3D): void {
            if (!(node instanceof THREE.Mesh)) return;
            if (!node.isMesh || !node.material?.color) return;

            if (node.userData.themePart === 'treeTrunk') {
                node.material.color.setHex(theme.treeTrunkColor);
            } else if (node.userData.themePart === 'treeFoliage') {
                node.material.color.setHex(theme.treeFoliageColor);
            }
        });
    }

    for (const mountain of environmentVisuals.mountains) {
        mountain.traverse(function(node: THREE.Object3D): void {
            if (!(node instanceof THREE.Mesh)) return;
            if (!node.isMesh || !node.material?.color) return;

            if (node.userData.themePart === 'mountain') {
                node.material.color.setHex(theme.mountainColor);
            } else if (node.userData.themePart === 'snow') {
                node.material.color.setHex(theme.snowColor);
            }
        });
    }

    setCloudTheme(theme.cloudColor);
}


/**
 * Set environment quality (low, medium, high)
 * @param quality
 */
function setEnvironmentQuality(quality: string): void {
    const showTrees: boolean = quality === 'high';
    const showMountains: boolean = quality !== 'low';

    for (const tree of environmentVisuals.trees) {
        tree.visible = showTrees;
    }
    for (const mountain of environmentVisuals.mountains) {
        mountain.visible = showMountains;
    }
}

/**
 * Set sway multiplier for trees
 * @param multiplier
 */
export function setTreeSwayMultiplier(multiplier: number): void {
    if (multiplier < 0) {
        console.warn('[Environment]: Sway multiplier cannot be negative, clamping to 0.');
    }
    swayMultiplier = Math.max(0, multiplier);
}

/**
 * Update sway anim pos of trees based on current time
 * @param nowMs
 */
function updateEnvironmentAnimations(nowMs: number): void {
    const animTime: number = nowMs * 0.001;
    const trees: THREE.Object3D[] = environmentVisuals.trees;

    if (!trees.length || !trees[0].visible) return;

    for (const tree of trees) {
        const phase: number = tree.userData.swayPhase || TREE.sway.defaults.phase;
        const amp: number = (tree.userData.swayAmplitude || TREE.sway.defaults.amplitude) * swayMultiplier;
        const speed: number = (tree.userData.swaySpeed || TREE.sway.defaults.speed) * swayMultiplier;
        const baseX: number = tree.userData.baseRotationX || TREE.sway.defaults.baseRotationX;
        const baseZ: number = tree.userData.baseRotationZ || TREE.sway.defaults.baseRotationZ;


        tree.rotation.x = baseX + Math.sin(animTime * speed + phase) * amp;
        tree.rotation.z = baseZ + Math.cos(
            animTime *
            (speed * TREE.sway.zSpeedRatio) + phase) *
            (amp * TREE.sway.zAmplitudeRatio);
    }
}
