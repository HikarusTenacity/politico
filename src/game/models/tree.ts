import * as THREE from 'three';
import * as RenderParams from '../../constants/rendering-parameters';

/**
 * Creates a tree model w/ trunk and foliage composed of 2 segments
 * @param x
 * @param z
 * @param scale
 */
function createTree(x: number, z: number, scale: number): THREE.Group {
    const tree = new THREE.Group();
    const treeConfig = RenderParams.TREE;

    const trunkConfig = treeConfig.trunk;
    const trunkGeometry = new THREE.CylinderGeometry(
        trunkConfig.radiusTop * scale,
        trunkConfig.radiusBottom * scale,
        trunkConfig.height * scale,
        trunkConfig.segments
    );
    const trunkMaterial = new THREE.MeshPhongMaterial({
        color: trunkConfig.color,
        flatShading: trunkConfig.usesFlatShading
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.userData.themePart = 'treeTrunk';
    trunk.position.y = (trunkConfig.height / 2) * scale + trunkConfig.yOffset;
    trunk.castShadow = trunkConfig.castsShadow;
    tree.add(trunk);

    const foliageConfig = treeConfig.foliage;
    const foliageGeometry = new THREE.ConeGeometry(
        foliageConfig.radius * scale,
        foliageConfig.height * scale,
        foliageConfig.segments
    );
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: foliageConfig.color, flatShading: foliageConfig.usesFlatShading });

    const bottomFoliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    bottomFoliage.userData.themePart = 'treeFoliage';
    bottomFoliage.position.y = foliageConfig.lowerY * scale + trunkConfig.yOffset;
    bottomFoliage.castShadow = foliageConfig.castsShadow;
    tree.add(bottomFoliage);

    const topFoliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    topFoliage.userData.themePart = 'treeFoliage';
    topFoliage.position.y = foliageConfig.upperY * scale + trunkConfig.yOffset;
    topFoliage.scale.set(foliageConfig.topScale, foliageConfig.topScale, foliageConfig.topScale);
    topFoliage.castShadow = foliageConfig.castsShadow;
    tree.add(topFoliage);
    
    tree.position.set(x, 0, z);
    return tree;
}

/**
 * Creates a ring of trees around the center of the scene, with random positions and sizes within specified ranges
 * @param scene
 */
export function createTreeRing(scene: THREE.Scene): THREE.Group[] {
    let trees: THREE.Group[] = [];
    const treeConfig = RenderParams.TREE;

    const treeRingConfig = treeConfig.ring;
    for (let i = 0; i < treeRingConfig.count; i++) {
        const angle = (i / treeRingConfig.count) * Math.PI * 2;
        const radius = treeRingConfig.minRadius + Math.random() * (treeRingConfig.maxRadius - treeRingConfig.minRadius);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        //increase in size based on dist from center4
        const distFromCenter = THREE.MathUtils.inverseLerp(
            treeRingConfig.minRadius,
            treeRingConfig.maxRadius,
            radius
        );
        const sizeCurve = distFromCenter ** 2;
        const scale = 1 + sizeCurve + Math.random() * treeConfig.ring.scaleRandomRange;
        const tree: THREE.Group = createTree(x, z, scale);
        scene.add(tree);
        trees.push(tree);
    }

    return trees;
}
