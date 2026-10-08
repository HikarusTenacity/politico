import * as THREE from 'three';

export function placePieceOnGround(piece: THREE.Mesh, x: number, z: number, groundY: number): void {
    piece.position.x = x;
    piece.position.z = z;

    piece.updateMatrixWorld(true);
    const box: THREE.Box3 = new THREE.Box3().setFromObject(piece);
    const deltaY: number = groundY - box.min.y;
    piece.position.y += deltaY;
}

export function positionPiecesForCharacterSelect(pieces: THREE.Mesh[]) {
    const spacing = 2.2;
    const startX: number = -((pieces.length - 1) * spacing) / 2;
    const centerZ = 1.2;

    for (const piece of pieces) {
        piece.position.x = startX + spacing * pieces.indexOf(piece);
        piece.position.z = centerZ;
        piece.rotation.y = Math.PI;
    }
}