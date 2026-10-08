import * as THREE from 'three';
import * as RenderParams from '../../../constants/rendering-parameters';

/**
 * Creates the National Rifle Association symbol, an A
 */
export function createNRASymbol(): THREE.Group {
    const symbolGroup = new THREE.Group();
    symbolGroup.name = 'factionSymbol';
    const config = RenderParams.NRA;

    const segmentConfigs: RenderParams.BoxSegmentConfig[] = [
        { ...config.LEFT, rotationZ: config.LEFT.rotationZ },
        { ...config.RIGHT, rotationZ: config.RIGHT.rotationZ },
        { ...config.MIDDLE },
        { ...config.TOP }
    ];

    return RenderParams.createSymbolMeshGroup(segmentConfigs);
}