import * as THREE from 'three';
import * as RenderParams from '../../constants/rendering-parameters';
import {cloudSpeedMultiplier} from "../../constants/environment-parameters";

/**
 * Creates a cloud composed of multiple spheres
 * @param x
 * @param y
 * @param z
 * @param scale
 */
function createCloud(x: number, y: number, z: number, scale: number): THREE.Group {
    const cloud = new THREE.Group();
    const cloudConfig = RenderParams.CLOUD;

    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: cloudConfig.color,
        flatShading: cloudConfig.usesFlatShading,
        transparent: cloudConfig.isTransparent,
        opacity: cloudConfig.opacity,
    });
    cloud.userData.themePart = 'cloud';

    for (let i = 0; i < cloudConfig.sphereCount; i++) {
        const randomOffset = Math.random() * cloudConfig.sphereRadiusRange;
        const randomRadius: number = (cloudConfig.sphereRadiusBase + randomOffset) * scale;
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                randomRadius,
                cloudConfig.geometryDetail.widthSegments,
                cloudConfig.geometryDetail.heightSegments
            ),
            cloudMaterial);

        sphere.scale.y = cloudConfig.sphereYFlatten;
        sphere.position.set(
            (Math.random() - 0.5) * cloudConfig.spreadXZ * scale,
            (Math.random() - 0.5) * cloudConfig.spreadY * scale,
            (Math.random() - 0.5) * cloudConfig.spreadXZ * scale
        );
        cloud.add(sphere);
    }

    cloud.position.set(x, y, z);

    cloud.userData.velocity = {
        x: (Math.random() - 0.5) * cloudConfig.baseSpeed,
        z: (Math.random() - 0.5) * cloudConfig.baseSpeed
    };
    cloud.userData.movementBounds = cloudConfig.bounds;
    
    return cloud;
}

/**
 * Creates a random cloud within range
 */
export function generateCloud(): THREE.Group {
    const cloudConfig = RenderParams.CLOUD;

    const halfWidth = (cloudConfig.bounds.xMax - cloudConfig.bounds.xMin) / 2;
    const randomScale = Math.random() * cloudConfig.scaleRange + cloudConfig.minScale;

    return createCloud(
        Math.random() * (halfWidth * 2) - halfWidth,
        Math.random() * cloudConfig.heightRange + cloudConfig.minHeight,
        Math.random() * (halfWidth * 2) - halfWidth,
        randomScale
    );
}

/**
 * Updates cloud pos based on velo/pos bounds
 * @param cloud
 */
export function updateCloudPosition(cloud: THREE.Group) {
    if (cloud.userData.velocity) {
        const speedMult = typeof cloudSpeedMultiplier === 'number' ? cloudSpeedMultiplier : 1;
        cloud.position.x += cloud.userData.velocity.x * speedMult;
        cloud.position.z += cloud.userData.velocity.z * speedMult;

        const bounds = cloud.userData.movementBounds;

        cloud.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, cloud.position.x));
        cloud.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, cloud.position.z));
    }
}
