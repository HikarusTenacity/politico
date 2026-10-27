// src/rendering/graphics-quality.ts
import type * as THREE from 'three';
import { setEnvironmentQuality } from './environment';
import { setCloudEffectsEnabled, setSkyQuality } from './sky';
import type { SkyQuality } from '../types/environment-types';

export interface GraphicsContext {
    renderer: THREE.WebGLRenderer;
    directionalLight: THREE.DirectionalLight;
}

export function createGraphicsQualityApplier(context: GraphicsContext) {
    function setSceneShadowsEnabled(enabled: boolean): void {
        context.renderer.shadowMap.enabled = enabled;
        context.directionalLight.castShadow = enabled;
    }

    return function applyGraphicsQuality(quality: SkyQuality): void {
        const shadowsEnabled = quality !== 'low';
        const effectsEnabled = quality === 'high';

        setSceneShadowsEnabled(shadowsEnabled);
        setCloudEffectsEnabled(effectsEnabled);
        setEnvironmentQuality(quality);
        setSkyQuality(quality);
    };
}