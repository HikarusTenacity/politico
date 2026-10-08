import * as THREE from 'three';
import * as RenderParams from '../../../constants/rendering-parameters';

/**
 * Create the Mental Health Liason Group symbol, ribbon w/ two tails.
 */
export function createMHLGSymbol(): THREE.Group {
    const symbolGroup = new THREE.Group();
    symbolGroup.name = 'factionSymbol';
    const config = RenderParams.MHLG;

    const badgeConfig = config.BADGE;
    const ribbonBadge = new THREE.Mesh(
        new THREE.LatheGeometry( //torus
            badgeConfig.vertices.map(
                (vertice: {x: number, y: number}): THREE.Vector2 =>
                new THREE.Vector2(vertice.x, vertice.y)),
            badgeConfig.segments,
        ),
        new THREE.MeshPhongMaterial({
            color: RenderParams.SYMBOL.color,
            flatShading: RenderParams.SYMBOL.usesFlatShading
        })
    );
    ribbonBadge.position.set(badgeConfig.x, badgeConfig.y, badgeConfig.z);
    ribbonBadge.rotation.x = badgeConfig.rotationX;
    ribbonBadge.castShadow = RenderParams.SYMBOL.castsShadow;
    symbolGroup.add(ribbonBadge);

    const segmentConfigs: RenderParams.BoxSegmentConfig[] = [
        { ...config.LEFT_TAIL, rotationZ: config.LEFT_TAIL.rotationZ },
        { ...config.RIGHT_TAIL, rotationZ: config.RIGHT_TAIL.rotationZ }
    ];

    for (const segmentConfig of segmentConfigs) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(segmentConfig.width, segmentConfig.height, segmentConfig.depth),
            new THREE.MeshPhongMaterial({
                color: RenderParams.SYMBOL.color,
                flatShading: RenderParams.SYMBOL.usesFlatShading
            })
        );
        segment.position.set(segmentConfig.x, segmentConfig.y, segmentConfig.z);
        segment.castShadow = RenderParams.SYMBOL.castsShadow;
        if (segmentConfig.rotationZ !== undefined) {
            segment.rotation.z = segmentConfig.rotationZ;
        }
        symbolGroup.add(segment);
    }

    return symbolGroup;
}