import * as THREE from 'three';
import {
    CLOUD_EFFECTS_ENABLED,
    SKY_QUALITY,
    CLOUD_SPEED_MULTIPLIER,
    FOG_END_DISTANCE,
    FOG_START_DISTANCE
} from '../constants/environment-parameters';
import { getGameTheme } from '../game/themes/game-theme';
import { SkyQuality, SkyThemeColors } from '../types/environment-types';
import { generateCloud, updateCloudPosition } from '../game/models/cloud';
import { SUN } from '../constants/rendering-parameters';

let cloudsToUpdate: THREE.Group[] = [];
let skyScene: THREE.Scene | null = null;
let sunMesh: THREE.Mesh | null = null;
let haloMesh: THREE.Mesh | null = null;

let skyThemeColors: SkyThemeColors = getGameTheme().visuals.sky;
let cloudEffectsEnabled = CLOUD_EFFECTS_ENABLED;
let skyQuality: SkyQuality = SKY_QUALITY;
let cloudSpeedMultiplier = CLOUD_SPEED_MULTIPLIER;

export function setCloudTheme(themeColor: number): void {
    for (const cloud of cloudsToUpdate) {
        cloud.traverse((node: THREE.Object3D): void => {
            if (!(node instanceof THREE.Mesh)) return;

            const material = node.material;

            if (material instanceof THREE.MeshPhongMaterial) {
                material.color.setHex(themeColor);
            }
        });
    }
}

export function setupSky(
    scene: THREE.Scene,
    directionalLight: THREE.DirectionalLight
): void {
    skyScene = scene;
    skyThemeColors = getGameTheme().visuals.sky;

    const sunColor = skyThemeColors.sunColor;

    const sunGeometry = new THREE.SphereGeometry(
        SUN.radius,
        SUN.segments,
        SUN.segments
    );
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: sunColor
    });

    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(directionalLight.position);
    scene.add(sunMesh);

    const haloGeometry = new THREE.SphereGeometry(
        SUN.haloRadius,
        SUN.haloSegments,
        SUN.haloSegments
    );
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: sunColor,
        transparent: SUN.haloIsTransparent,
        opacity: SUN.haloOpacity,
        side: THREE.BackSide
    });

    haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.position.copy(directionalLight.position);
    scene.add(haloMesh);

    cloudsToUpdate = [];

    for (let i = 0; i < 80; i++) {
        const cloud = generateCloud();
        scene.add(cloud);
        cloudsToUpdate.push(cloud);
    }

    applySkyQuality();
}

export function updateClouds(): void {
    if (!cloudEffectsEnabled || skyQuality !== 'high') return;

    for (const cloud of cloudsToUpdate) {
        updateCloudPosition(cloud, cloudSpeedMultiplier);
    }
}

export function setCloudEffectsEnabled(enabled: boolean): void {
    cloudEffectsEnabled = enabled;
    applySkyQuality();
}

export function setCloudSpeedMultiplier(multiplier: number): void {
    if (!Number.isFinite(multiplier)) {
        cloudSpeedMultiplier = CLOUD_SPEED_MULTIPLIER;
        return;
    }

    cloudSpeedMultiplier = Math.max(0, multiplier);
}

export function setSkyQuality(quality: SkyQuality = 'high'): void {
    skyQuality = quality;
    applySkyQuality();
}

function applySkyQuality(): void {
    const showBackground = skyQuality !== 'low';
    const showClouds = skyQuality === 'high';
    const cloudsVisible = showClouds && cloudEffectsEnabled;

    if (sunMesh) sunMesh.visible = showBackground;
    if (haloMesh) haloMesh.visible = showBackground;

    if (skyScene) {
        skyScene.background = showBackground
            ? new THREE.Color(skyThemeColors.skyColor)
            : null;

        skyScene.fog = showBackground
            ? new THREE.Fog(
                skyThemeColors.fogColor,
                FOG_START_DISTANCE,
                FOG_END_DISTANCE
            )
            : null;
    }

    for (const cloud of cloudsToUpdate) {
        cloud.visible = cloudsVisible;
    }
}

export function setSkyTheme(themeColors: SkyThemeColors): void {
    skyThemeColors = themeColors;

    if (skyScene) {
        skyScene.background = new THREE.Color(themeColors.skyColor);
        skyScene.fog = new THREE.Fog(
            themeColors.fogColor,
            FOG_START_DISTANCE,
            FOG_END_DISTANCE
        );
    }

    if (sunMesh?.material instanceof THREE.MeshBasicMaterial) {
        sunMesh.material.color.setHex(themeColors.sunColor);
    }

    if (haloMesh?.material instanceof THREE.MeshBasicMaterial) {
        haloMesh.material.color.setHex(themeColors.sunColor);
    }
}