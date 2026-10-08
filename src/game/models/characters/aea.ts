import * as THREE from 'three';
import * as RenderParams from '../../../constants/rendering-parameters';

/**
 * Creates the American Energy Alliance symbol, a lightning bolt.
 */
export function createAEASymbol(): THREE.Group {
    const config = RenderParams.AEA;
    const segmentConfigs: RenderParams.BoxSegmentConfig[] = [
        { ...config.TOP, rotationZ: config.TOP.rotationZ },
        { ...config.MIDDLE },
        { ...config.UPPER_BOTTOM, rotationZ: config.UPPER_BOTTOM.rotationZ },
        { ...config.LOWER_BOTTOM, rotationZ: config.LOWER_BOTTOM.rotationZ }
    ];

    return RenderParams.createSymbolMeshGroup(segmentConfigs);
}