import * as THREE from 'three';

export const GAME_RENDER_CONFIG = {
    pixelationScale: 2,
    rendererOptions: {
        antialias: false,
        powerPreference: 'high-performance'
    },
};

export const CLOUD = {
    color: 0xFFFFFF,
    isTransparent: true,
    usesFlatShading: true,
    opacity: 0.7,
    sphereCount: 8,
    sphereRadiusBase: 10,
    sphereRadiusRange: 10,
    sphereYFlatten: 0.8,
    spreadXZ: 25,
    spreadY: 10,
    minHeight: 30,
    heightRange: 30,
    minScale: 0.5,
    scaleRange: 0.1,
    bounds: {
        xMin: -125,
        xMax: 125,
        zMin: -125,
        zMax: 125 },
    geometryDetail: {
        widthSegments: 8,
        heightSegments: 4
    },
    baseSpeed: 0.01
};

export const MOUNTAIN = {
    geometryDetail: 4,
    color: 0x808080,
    isTransparent: true,
    usesFlatShading: true,
    opacity: 0.7,
    castsShadow: true,
    snow: {
        color: 0xFFFFFF,
        usesFlatShading: true,
        isTransparent: true,
        opacity: 0.8,
        geometryDetail: 4,
        scale: 0.3,
        minHeight: 0.86,
        castsShadow: true,
    },
    ring: {
        distance: 80,
        halfDistance: 40,
        widthBase: 15,
        widthRange: 10,
        heightBase: 25,
        heightRange: 15
    }
}

export const TREE = {
    trunk: {
        castsShadow: true,
        usesFlatShading: true,
        color: 0x4d2600,
        radiusTop: 0.3,
        radiusBottom: 0.4,
        height: 3,
        segments: 6,
        yOffset: -1,
    },
    foliage: {
        color: 0x1a5f1a,
        radius: 1.5,
        segments: 6,
        castsShadow: true,
        usesFlatShading: true,
        height: 3,
        lowerY: 3.5,
        upperY: 5,
        topScale: 0.7,
    },
    ring: {
        minRadius: 18,
        maxRadius: 60,
        count: 150,
        scaleRandomRange: 0.25,
    },
    SWAY_Z_SPEED_RATIO: 0.85,
    SWAY_Z_AMP_RATIO: 0.75
}

export const DICE = {
    color: 0xFFFFFF,
    radius: 0.32,
    faceOffset: 0.1388,
    pipSpacing: 0.06,
    usesFlatShading: true,
    castsShadow: true,
    recievesShadow: true,
    PIPS: {
        color: 0x000000,
        radius: 0.032,
        segments: 8,
        castsShadow: true,
        usesFlatShading: true,
    }
}
export const SYMBOL = {
    color: 0xFFFFFF,
    castsShadow: true,
    usesFlatShading: true,
}
export interface BoxSegmentConfig {
    width: number;
    height: number;
    depth: number;
    x: number;
    y: number;
    z: number;
    rotationZ?: number;
}
export function createSymbolMeshGroup(
    segmentConfigs: BoxSegmentConfig[],
): THREE.Group {
    const symbolGroup = new THREE.Group();
    symbolGroup.name = 'factionSymbol';

    for (const config of segmentConfigs) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(config.width, config.height, config.depth),
            new THREE.MeshPhongMaterial({
                color: SYMBOL.color,
                flatShading: SYMBOL.usesFlatShading
            })
        );
        segment.position.set(config.x, config.y, config.z);
        segment.castShadow = SYMBOL.castsShadow;
        if (config.rotationZ !== undefined) {
            segment.rotation.z = config.rotationZ;
        }
        symbolGroup.add(segment);
    }

    return symbolGroup;
}

export const AEA = {
    color: 0XEAB308,
    TOP: {
        width: 0.1,
        height: 0.2,
        depth: 0.4,
        x: 0.04,
        y: 0.18,
        z: 0,
        rotationZ: 0.35
    },
    MIDDLE: {
        width: 0.2,
        height: 0.1,
        depth: 0.4,
        x: 0,
        y: 0.1,
        z: 0
    },
    UPPER_BOTTOM: {
        width: 0.1,
        height: 0.2,
        depth: 0.4,
        x: -0.06,
        y: 0.05,
        z: 0,
        rotationZ: 0.35
    },
    LOWER_BOTTOM: {
        width: 0.1,
        height: 0.2,
        depth: 0.4,
        x: 0,
        y: -0.13,
        z: 0,
        rotationZ: 0.2
    }
}


export const MHLG = {
    color: 0x16a34a,
    LEFT_TAIL: {
        width: 0.08,
        height: 0.2,
        depth: 0.4,
        x: -0.08,
        y: -0.05,
        z: 0,
        rotationZ: -0.9
    },
    RIGHT_TAIL: {
        width: 0.08,
        height: 0.2,
        depth: 0.4,
        x: 0.08,
        y: -0.05,
        z: 0,
        rotationZ: 0.9
    },
    BADGE: {
        x: 0,
        y: 0.15,
        z: 0,
        segments: 32,
        rotationX: Math.PI / 2,
        vertices: [
            {x: 0.05, y: -0.2},
            {x: 0.15, y: -0.2},
            {x: 0.15, y: 0.2},
            {x: 0.05, y: 0.2}
        ],
    }
}

export const NRA = {
    color: 0xDC2626,
    LEFT: {
        width: 0.08,
        height: 0.35,
        depth: 0.4,
        x: -0.12,
        y: 0.08,
        z: 0,
        rotationZ: -0.2
    },
    RIGHT: {
        width: 0.08,
        height: 0.35,
        depth: 0.4,
        x: 0.12,
        y: 0.08,
        z: 0,
        rotationZ: 0.2
    },
    MIDDLE: {
        width: 0.12,
        height: 0.08,
        depth: 0.4,
        x: 0,
        y: 0.15,
        z: 0,
    },
    TOP: {
        width: 0.18,
        height: 0.08,
        depth: 0.4,
        x: 0,
        y: 0.2,
        z: 0
    }
}

export const SC = {
    color: 0x3b82f6,
    arrowCount: 3,
    symbolRadius: 0.12,
    arrowBack: {
        width: 0.2,
        height: 0.08,
        depth: 0.4,
        x: 0,
        y: 0,
        z: 0
    },
    arrowFront: {
        width: 0.1,
        height: 0.05,
        depth: 0.4,
        x: 0,
        y: 0.13,
        z: 0
    },
    arrowTip: {
        width: 0.1,
        height: 0.05,
        depth: 0.4,
        leftX: 0.17,
        leftY: 0.13,
        leftZ: 0,
        rightX: 0.09,
        rightY: 0.11,
        rightZ: 0
    }
}