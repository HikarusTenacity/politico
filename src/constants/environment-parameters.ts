import * as THREE from 'three';

export const GROUND_WIDTH: number = 225;
export const GROUND_LENGTH: number = 225;
export const GROUND_FLAT_SHADING: boolean = true;

export const cloudEffectsEnabled = true;
export const skyQuality = 'high';
export const skyColor = 0x87ceeb;
export const fogColor = 0x5a7a9e;
export const cloudSpeedMultiplier = 1;
export const skyThemeColors = {
    skyColor: skyColor,
    fogColor: fogColor,
    sunColor: 0xffff00
};
export const environmentTheme = {
    groundColor: 0x4CAF50,
    sunlightColor: 0xfff8dc,
    skyLightColor: 0x87ceeb,
    treeTrunkColor: 0x4d2600,
    treeFoliageColor: 0x1a5f1a,
    mountainColor: 0x808080,
    snowColor: 0xffffff,
    cloudColor: 0xffffff,
    boardSpaceColor: 0x4CAF50,
    boardGridColor: 0xffffff
};
export const environmentMaterials = {
    ground: null as THREE.MeshPhongMaterial,
    floor: null as THREE.MeshPhongMaterial,
    directionalLight: null as THREE.DirectionalLight,
    ambientLight: null as THREE.AmbientLight,
    hemisphereLight: null as THREE.HemisphereLight
};
export const environmentVisuals = {
    trees: [],
    mountains: []
};