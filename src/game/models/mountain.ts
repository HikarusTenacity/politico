import * as THREE from 'three';
import * as RenderParams from '../../constants/rendering-parameters';

/**
 * Creates a mountain with snow at (x, z) with width/height.
 * @param x
 * @param z
 * @param width
 * @param height
 */
function createMountain(x: number, z: number, width: number, height: number) {
    const mountain = new THREE.Group();
    const mountainConfig = RenderParams.MOUNTAIN;

    // Create a pyramid-like mountain
    const geometry = new THREE.ConeGeometry(width, height, mountainConfig.geometryDetail);
    const material = new THREE.MeshPhongMaterial({
        color: mountainConfig.color,
        flatShading: mountainConfig.usesFlatShading,
        transparent: mountainConfig.isTransparent,
        opacity: mountainConfig.opacity
    });

    const cone = new THREE.Mesh(geometry, material);
    cone.userData.themePart = 'mountain';
    cone.position.y = height / 2 - 1;
    cone.rotation.y = Math.PI / 4; //rot 45 deg
    cone.castShadow = mountainConfig.castsShadow;
    mountain.add(cone);
    
    const snowConfig = RenderParams.MOUNTAIN.snow;
    const snowGeometry = new THREE.ConeGeometry(width * snowConfig.scale, height * snowConfig.scale, snowConfig.geometryDetail);
    const snowMaterial = new THREE.MeshPhongMaterial({
        color: snowConfig.color,
        flatShading: snowConfig.usesFlatShading,
        transparent: snowConfig.isTransparent,
        opacity: snowConfig.opacity
    });
    const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
    snowCap.userData.themePart = 'snow';
    snowCap.position.y = height * snowConfig.minHeight - 1;
    snowCap.rotation.y = Math.PI / 4; //rot 45 deg
    snowCap.castShadow = snowConfig.castsShadow;
    mountain.add(snowCap);
    
    mountain.position.set(x, 0, z);
    return mountain;
}

/**
 * Creates a ring of mountains around the center
 */
export function createMountains(): THREE.Group[] {
    let mountains: THREE.Group[] = [];
    const mountainConfig = RenderParams.MOUNTAIN;

    /**
     * Spawns a mountain at (x, z)
     * @param x
     * @param z
     */
    const spawnMountain = (x: number, z: number): void => {
        const mountain: THREE.Group = createRandomMountain(x, z);
        scene.add(mountain);
        mountains.push(mountain);
    };

    /**
     * Creates a random mountain with a random width/height at (x, z)
     * @param x
     * @param z
     */
    const createRandomMountain = (x: number, z: number): THREE.Group => {
        const width = mountainConfig.ring.widthBase + (Math.random() * mountainConfig.ring.widthRange);
        const height = mountainConfig.ring.heightBase + (Math.random() * mountainConfig.ring.heightRange);
        return createMountain(x, z, width, height);
    };

    for (let i = 0; i < 5; i++) {
        spawnMountain((i-1) * mountainConfig.ring.halfDistance, -mountainConfig.ring.distance);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain((i-1) * mountainConfig.ring.halfDistance, mountainConfig.ring.distance);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain(mountainConfig.ring.distance, (i-1) * mountainConfig.ring.halfDistance);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain(-mountainConfig.ring.distance, (i-1) * mountainConfig.ring.halfDistance);
    }

    return mountains;
}
