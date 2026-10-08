import * as THREE from 'three';
import { createNRASymbol } from './nra';
import { createSCSymbol } from './sc';
import { createMHLGSymbol } from './mhlg';
import { createAEASymbol } from './aea';

export function createGuy(color: string): THREE.Group {
    const guy = new THREE.Group();
    let bodyColor: number;

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.8, 0.35),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    body.position.y = 0;
    body.castShadow = true;
    guy.add(body);

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    head.position.y = 0.575;
    head.castShadow = true;
    guy.add(head);

    // Arms
    const leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.75, 0.2),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    leftArm.position.set(-0.375, 0.05, 0);
    leftArm.castShadow = true;
    guy.add(leftArm);

    const rightArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.75, 0.2),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    rightArm.position.set(0.375, 0.05, 0);
    rightArm.castShadow = true;
    guy.add(rightArm);

    // Legs
    const leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.6, 0.25),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    leftLeg.position.set(-0.15, -0.55, 0);
    leftLeg.castShadow = true;
    guy.add(leftLeg);

    const rightLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.6, 0.25),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    rightLeg.position.set(0.15, -0.55, 0);
    rightLeg.castShadow = true;
    guy.add(rightLeg);

    let symbolGroup = new THREE.Group();
    if (color === "red") {
        symbolGroup = createNRASymbol();
        symbolGroup.position.set(0, 0.2, 0);
        guy.add(symbolGroup);
    } else if (color === "blue") {
        symbolGroup = createSCSymbol();
        symbolGroup.position.set(0, 0.2, 0);
        guy.add(symbolGroup);
    } else if (color === "green") {
        symbolGroup = createMHLGSymbol();
        symbolGroup.position.set(0, 0.2, 0);
        guy.add(symbolGroup);
    } else if (color === "yellow") {
        symbolGroup = createAEASymbol();
        symbolGroup.position.set(0, 0.2, 0);
        guy.add(symbolGroup);
    }

    return guy;
}