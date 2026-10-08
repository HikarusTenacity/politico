import * as THREE from 'three';
import { getGameTheme} from "../game/themes/game-theme";
import {
    environmentMaterials,
    GROUND_FLAT_SHADING,
    GROUND_LENGTH,
    GROUND_WIDTH
} from "../constants/environment-parameters";
import { createTreeRing } from '../game/models/tree';
import { createMountains } from '../game/models/mountain';
import { TREE } from "../constants/rendering-parameters";
import { EnvironmentTheme } from "../types/environment-types";

let environmentTheme: EnvironmentTheme = getGameTheme().visuals.environment;
let swayMultiplier: number = 1.0;

export const environmentVisuals: {
    trees: THREE.Group[];
    mountains: THREE.Group[];
} = {
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
        GROUND_WIDTH,
        GROUND_LENGTH
    );
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: groundColor,
        flatShading: GROUND_FLAT_SHADING
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('assets/board.png');

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    environmentVisuals.trees = createTreeRing(scene) || [];
    for (const tree of environmentVisuals.trees) {
        tree.userData.baseRotationX = tree.rotation.x;
        tree.userData.baseRotationZ = tree.rotation.z;
        tree.userData.swayPhase = Math.random() * Math.PI * 2;
        tree.userData.swayAmplitude = 0.012 + Math.random() * 0.012;
        tree.userData.swaySpeed = 0.75 + Math.random() * 0.45;
    }

    environmentVisuals.mountains = createMountains() || [];

    const directionalLight = new THREE.DirectionalLight(sunlightColor, 1.2);
    directionalLight.position.set(30, 40, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(skyLightColor, 0.6);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(skyLightColor, groundColor, 0.5);
    scene.add(hemisphereLight);

    environmentMaterials.ground = groundMaterial;
    environmentMaterials.floor = floorMaterial;
    environmentMaterials.directionalLight = directionalLight;
    environmentMaterials.ambientLight = ambientLight;
    environmentMaterials.hemisphereLight = hemisphereLight;

    return directionalLight;
}

function setEnvironmentTheme(theme: {
    groundColor: number;
    sunlightColor: number;
    skyLightColor: number;
    treeTrunkColor: number;
    treeFoliageColor: number;
    mountainColor: number;
    snowColor: number;
    cloudColor: number;
    boardSpaceColor: number;
    boardGridColor: number;
}) {
    environmentTheme = theme;

    if (environmentMaterials.ground) {
        environmentMaterials.ground.color.setHex(theme.groundColor);
    }

    if (environmentMaterials.floor) {
        environmentMaterials.floor.color.setHex(theme.groundColor);
    }

    if (environmentMaterials.directionalLight) {
        environmentMaterials.directionalLight.color.setHex(theme.sunlightColor);
    }

    if (environmentMaterials.ambientLight) {
        environmentMaterials.ambientLight.color.setHex(theme.skyLightColor);
    }

    if (environmentMaterials.hemisphereLight) {
        environmentMaterials.hemisphereLight.color.setHex(theme.skyLightColor);
        environmentMaterials.hemisphereLight.groundColor.setHex(theme.groundColor);
    }

    for (const tree of environmentVisuals.trees) {
        tree.traverse(function(node) {
            if (!node.isMesh || !node.material || !node.material.color) return;
            if (node.userData.themePart === 'treeTrunk') {
                node.material.color.setHex(theme.treeTrunkColor);
            } else if (node.userData.themePart === 'treeFoliage') {
                node.material.color.setHex(theme.treeFoliageColor);
            }
        });
    }

    for (const mountain of environmentVisuals.mountains) {
        mountain.traverse(function(node) {
            if (!node.isMesh || !node.material || !node.material.color) return;
            if (node.userData.themePart === 'mountain') {
                node.material.color.setHex(theme.mountainColor);
            } else if (node.userData.themePart === 'snow') {
                node.material.color.setHex(theme.snowColor);
            }
        });
    }

    if (typeof cloudsToUpdate !== 'undefined') {
        for (const cloud of cloudsToUpdate) {
            cloud.traverse(function(node) {
                if (!node.isMesh || !node.material || !node.material.color) return;
                if (node.userData.themePart === 'cloud') {
                    node.material.color.setHex(theme.cloudColor);
                }
            });
        }
    }
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
        const phase: number = tree.userData.swayPhase || 0;
        const amp: number = (tree.userData.swayAmplitude || 0.015) * swayMultiplier;
        const speed: number = (tree.userData.swaySpeed || 0.9) * swayMultiplier;
        const baseX: number = tree.userData.baseRotationX || 0;
        const baseZ: number = tree.userData.baseRotationZ || 0;


        tree.rotation.x = baseX + Math.sin(animTime * speed + phase) * amp;
        tree.rotation.z = baseZ + Math.cos(
            animTime *
            (speed * TREE.SWAY_Z_SPEED_RATIO) + phase) *
            (amp * TREE.SWAY_Z_AMP_RATIO);
    }
}
