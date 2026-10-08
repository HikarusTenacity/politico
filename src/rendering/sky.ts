import * as THREE from 'three';
import { cloudEffectsEnabled, skyQuality, skyColor, fogColor, cloudSpeedMultiplier, skyThemeColors } from "../constants/environment-parameters";


const cloudsToUpdate: THREE.Mesh[] = [];
const skyScene: THREE.Scene = null;
const sunMesh: THREE.Mesh = null;
const haloMesh: THREE.Mesh = null;

function setupSky(scene: THREE.Scene, directionalLight: THREE.DirectionalLight) {
    if (typeof getGameTheme === 'function') {
        skyThemeColors = getGameTheme().visuals.sky;
    }

    const sunColor = skyThemeColors.sunColor;
    skyScene = scene;

    const sunGeometry = new THREE.SphereGeometry(3, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({color: sunColor, flatShading: true});
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(directionalLight.position);
    scene.add(sunMesh);

    // Glow halo around sun
    const haloGeometry = new THREE.SphereGeometry(8, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: sunColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.position.copy(directionalLight.position);
    scene.add(haloMesh);
    
    //generate clouds
    cloudsToUpdate = [];
    for (let i = 0; i < 80; i++) {
        const cloud = generateCloud();
        scene.add(cloud);
        cloudsToUpdate.push(cloud);
    }

    applySkyQuality();
}

function updateClouds() {
    if (!cloudEffectsEnabled || skyQuality !== 'high') return;
    for (const c of cloudsToUpdate) updateCloudPosition(c);
}

function setCloudEffectsEnabled(enabled: boolean) {
    cloudEffectsEnabled = enabled;
    applySkyQuality();
}

function setCloudSpeedMultiplier(multiplier: number) {
    cloudSpeedMultiplier = Math.max(0, multiplier || 1);
}

function setSkyQuality(quality: SkyQuality = 'high') {
    skyQuality = quality;
    applySkyQuality();
}

function applySkyQuality() {
    const showBackground = skyQuality !== 'low';
    const showClouds = skyQuality === 'high';
    const cloudsVisible = showClouds && cloudEffectsEnabled;

    if (sunMesh) sunMesh.visible = showBackground;
    if (haloMesh) haloMesh.visible = showBackground;

    if (skyScene) {
        if (showBackground) {
            skyScene.background = new THREE.Color(skyThemeColors.skyColor);
            skyScene.fog = new THREE.Fog(skyThemeColors.fogColor, 5, 100);
        } else {
            skyScene.background = null;
            skyScene.fog = null;
        }
    }

    for (const cloud of cloudsToUpdate) {
        cloud.visible = cloudsVisible;
    }
}

function setSkyTheme(themeColors: { skyColor: number; fogColor: number; sunColor: number; }) {
    skyThemeColors = themeColors;

    if (skyScene) {
        skyScene.background = new THREE.Color(themeColors.skyColor);
        skyScene.fog = new THREE.Fog(themeColors.fogColor, 5, 100);
    }

    if (sunMesh) {
        (sunMesh.material as THREE.MeshBasicMaterial).color.setHex(themeColors.sunColor);
    }

    if (haloMesh) {
        (haloMesh.material as THREE.MeshBasicMaterial).color.setHex(themeColors.sunColor);
    }
}
