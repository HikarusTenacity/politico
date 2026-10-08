import * as THREE from 'three';
import * as RenderParams from '../../../constants/rendering-parameters';

/**
 * Creates one arm of the recycling symbol
 * @param rot
 */
function createArrow(rot: number): THREE.Group {
    const config = RenderParams.SC;
    const arrow = new THREE.Group();
    const arrowAngle: number = Math.PI / config.arrowCount;
    let segmentConfig: {
        width: number,
        height: number,
        depth: number,
        x?: number, y?: number, z?: number,
        leftX?: number, leftY?: number, leftZ?: number,
        rightX?: number, rightY?: number, rightZ?: number,
    } = config.arrowBack;

    const arrowBackSegment = new THREE.Mesh(
        new THREE.BoxGeometry(segmentConfig.width, segmentConfig.height, segmentConfig.depth),
        new THREE.MeshPhongMaterial({
            color: RenderParams.SYMBOL.color,
            flatShading: RenderParams.SYMBOL.usesFlatShading
        })
    );
    arrowBackSegment.position.set(
        segmentConfig.x,
        segmentConfig.y,
        segmentConfig.z
    );
    arrowBackSegment.castShadow = RenderParams.SYMBOL.castsShadow;
    arrow.add(arrowBackSegment);

    segmentConfig = config.arrowFront;
    const arrowFrontSegment = new THREE.Mesh(
        new THREE.BoxGeometry(segmentConfig.width, segmentConfig.height, segmentConfig.depth),
        new THREE.MeshPhongMaterial({
            color: RenderParams.SYMBOL.color,
            flatShading: RenderParams.SYMBOL.usesFlatShading
        })
    );
    arrowFrontSegment.position.set(
        segmentConfig.x,
        segmentConfig.y,
        segmentConfig.z
    );
    arrowFrontSegment.rotation.z = arrowAngle;
    arrowFrontSegment.castShadow = RenderParams.SYMBOL.castsShadow;
    arrow.add(arrowFrontSegment);

    segmentConfig = config.arrowTip;
    const arrowTipLeftSegment = new THREE.Mesh(
        new THREE.BoxGeometry(segmentConfig.width, segmentConfig.height, segmentConfig.depth),
        new THREE.MeshPhongMaterial({
            color: RenderParams.SYMBOL.color,
            flatShading: RenderParams.SYMBOL.usesFlatShading
        })
    );
    arrowTipLeftSegment.position.set(
        segmentConfig.leftX,
        segmentConfig.leftY,
        segmentConfig.leftZ
    );
    arrowTipLeftSegment.rotation.z = arrowAngle;
    arrowTipLeftSegment.castShadow = RenderParams.SYMBOL.castsShadow;
    arrow.add(arrowTipLeftSegment);

    const arrowTipRightSegment = new THREE.Mesh(
        new THREE.BoxGeometry(segmentConfig.width, segmentConfig.height, segmentConfig.depth),
        new THREE.MeshPhongMaterial({
            color: RenderParams.SYMBOL.color,
            flatShading: RenderParams.SYMBOL.usesFlatShading
        })
    );
    arrowTipRightSegment.position.set(
        segmentConfig.rightX,
        segmentConfig.rightY,
        segmentConfig.rightZ
    );
    arrowTipRightSegment.rotation.z = arrowAngle;
    arrowTipRightSegment.castShadow = RenderParams.SYMBOL.castsShadow;
    arrow.add(arrowTipRightSegment);


    arrow.rotation.z = rot;
    return arrow;
}

/**
 * Creates the Sierra Club symbol, the recycling symbol
 */
export function createSCSymbol(): THREE.Group {
    const symbolGroup = new THREE.Group();
    symbolGroup.name = 'factionSymbol';
    const config = RenderParams.SC;

    for (let i = 0; i < config.arrowCount; i++) {
        const angle: number = (i / config.arrowCount) * 2 * Math.PI;
        const arrow: THREE.Group = createArrow(angle);

        arrow.position.x = Math.cos(angle) * config.symbolRadius;
        arrow.position.y = Math.sin(angle) * config.symbolRadius;

        symbolGroup.add(arrow);
    }

    return symbolGroup;
}