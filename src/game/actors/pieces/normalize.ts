import * as THREE from 'three';

export function normalizePieceSize(piece: THREE.Group, targetSize: number): void {
    piece.updateMatrixWorld(true);

    const box: THREE.Box3 = new THREE.Box3().setFromObject(piece);
    const size: THREE.Vector3 = box.getSize(new THREE.Vector3());
    const maxDim: number = Math.max(size.x, size.y, size.z);

    // Scale the piece to match targetSize while keeping proportions. (size up or down)
    if (maxDim > 0) {
        const uniformScale: number = targetSize / maxDim;
        piece.scale.multiplyScalar(uniformScale);
    }

    //force immediate update of the world matrix after scaling
    piece.updateMatrixWorld(true);
    box.setFromObject(piece);

    const center: THREE.Vector3 = box.getCenter(new THREE.Vector3());
    piece.position.x -= center.x;
    piece.position.z -= center.z;

    piece.updateMatrixWorld(true);
    box.setFromObject(piece);
    piece.position.y -= box.min.y;
}