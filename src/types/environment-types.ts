import * as THREE from "three";

export type SkyQuality = 'low' | 'medium' | 'high';
export interface EnvironmentTheme {
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
}

export interface EnvironmentVisuals {
    trees: THREE.Object3D[];
    mountains: THREE.Object3D[];
}

export interface EnvironmentMaterials {
    ground: THREE.MeshPhongMaterial | null;
    floor: THREE.MeshPhongMaterial | null;
    directionalLight: THREE.DirectionalLight | null;
    ambientLight: THREE.AmbientLight | null;
    hemisphereLight: THREE.HemisphereLight | null;
}

export interface SkyThemeColors {
    skyColor: number;
    fogColor: number;
    sunColor: number;
}