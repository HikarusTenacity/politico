import type * as THREE from 'three';

export interface PlayerState {
    id: number;
    name: string;
    color: number;
    pieceType: string;
    currentSpace: number;
    currency: number;
    buffs: string[];
    piece: THREE.Group | null;
}