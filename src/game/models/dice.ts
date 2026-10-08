import * as THREE from 'three';
import * as RenderParams from '../../constants/rendering-parameters';

/**
 * Creates a pip for dice at (x,y,z)
 * @param diceGroup
 * @param x
 * @param y
 * @param z
 */
function createPip(diceGroup: THREE.Group, x: number, y: number, z: number): void {
    const pipGeometry = new THREE.SphereGeometry(RenderParams.DICE.PIPS.radius, RenderParams.DICE.PIPS.segments, RenderParams.DICE.PIPS.segments);
    const pipMaterial = new THREE.MeshPhongMaterial({
        color: RenderParams.DICE.PIPS.color,
        flatShading: RenderParams.DICE.PIPS.usesFlatShading
    });
    const pip = new THREE.Mesh(pipGeometry, pipMaterial);
    pip.position.set(x, y, z);
    pip.castShadow = RenderParams.DICE.PIPS.castsShadow;
    diceGroup.add(pip);
}

/**
 * Creates a die model with pips
 * I'm hardcoding the faces for now, maybe more dynamic later
 * FIXME - allow for dynamic faces (because there are special types of die)
 * @returns A THREE.Group containing the dice model
 */
export function createDice(): THREE.Group {
    const dice = new THREE.Group();
    const diceConfig = RenderParams.DICE;

    const geometry = new THREE.BoxGeometry(diceConfig.radius, diceConfig.radius, diceConfig.radius);
    const materials: THREE.Material[] = new Array(6).fill(
        new THREE.MeshPhongMaterial({
            color: diceConfig.color,
            flatShading: diceConfig.usesFlatShading
        })
    );
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = diceConfig.castsShadow;
    cube.receiveShadow = diceConfig.recievesShadow;
    dice.add(cube);

    /**
     * Adds face to die at a given axis
     * @param axis
     * @param depth
     * @param pips
     */
    const addFace = (
        axis: 'x' | 'y' | 'z',
        depth: number,
        pips: [number, number][]
    ): void => {
        for (const [horizOffset, vertOffset] of pips) {
            if (axis === 'x') createPip(dice, depth, horizOffset, vertOffset);
            if (axis === 'y') createPip(dice, horizOffset, depth, vertOffset);
            if (axis === 'z') createPip(dice, horizOffset, vertOffset, depth);
        }
    };

    // facing right - 1
    addFace('x', diceConfig.faceOffset, [[0, 0]]);

    // facing down - 2
    addFace('y', -diceConfig.faceOffset, [
        [-diceConfig.pipSpacing, diceConfig.pipSpacing], // top left
        [diceConfig.pipSpacing, -diceConfig.pipSpacing] // bottom right
    ]);

    // facing front - 3
    addFace('z', diceConfig.faceOffset, [
        [-diceConfig.pipSpacing, diceConfig.pipSpacing], // top left
        [0, 0], // center
        [diceConfig.pipSpacing, -diceConfig.pipSpacing] // bottom right
    ]);

    // facing back - 4
    addFace('z', -RenderParams.DICE.faceOffset, [
        [-diceConfig.pipSpacing, diceConfig.pipSpacing], // top left
        [diceConfig.pipSpacing, diceConfig.pipSpacing], // top right
        [-diceConfig.pipSpacing, -diceConfig.pipSpacing], // bottom left
        [diceConfig.pipSpacing, -diceConfig.pipSpacing] // bottom right
    ]);

    // facing top - 5
    addFace('y', diceConfig.faceOffset, [
        [-diceConfig.pipSpacing, diceConfig.pipSpacing], // top left
        [diceConfig.pipSpacing, diceConfig.pipSpacing], // top right
        [-diceConfig.pipSpacing, -diceConfig.pipSpacing], // bottom left
        [diceConfig.pipSpacing, -diceConfig.pipSpacing], // bottom right
        [0, 0] // center
    ]);

    // facing left - 6
    addFace('x', -RenderParams.DICE.faceOffset, [
        [-diceConfig.pipSpacing, diceConfig.pipSpacing], // top left
        [diceConfig.pipSpacing, diceConfig.pipSpacing], // top right
        [-diceConfig.pipSpacing, -diceConfig.pipSpacing], // bottom left
        [diceConfig.pipSpacing, -diceConfig.pipSpacing], // bottom right
        [-diceConfig.pipSpacing, 0], // center left
        [diceConfig.pipSpacing, 0] // center right
    ]);

    return dice;
}