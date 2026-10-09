import * as THREE from 'three';
import {createGuy} from "../../models/characters/guy";
import {normalizePieceSize} from "./normalize";
import {placePieceOnGround} from "./place";
import { PIECE_CONFIGS } from "../../../constants/piece-parameters";

/**
 * Creates game pieces with specified configurations, normalizes their sizes, places them on the ground, and sets up animation parameters.
 * Saves initial positions and rotations for idle animations.
 * @returns An array of created game pieces.
 *
 */

export function createGamePieces(): THREE.Mesh[] {
    let pieces: THREE.Mesh[] = [];
    const sharedSize = 1.4;
    const groundY = -1.0;

    for (const config of PIECE_CONFIGS) {
        const piece: THREE.Group = createGuy(config.color);

        normalizePieceSize(piece, sharedSize);
        placePieceOnGround(piece, config.x, config.z, groundY);
        piece.userData.baseY = piece.position.y;
        piece.userData.idlePhase = Math.random() * Math.PI * 2; //NOSONAR
        
        // Animation parameters
        piece.userData.idleSpeedMultiplier = 1.0;
        piece.userData.bodySwayAmount = 0.15;
        piece.userData.headBobAmount = 0.08;

        for (const child of piece.children) {
            child.userData.idleBasePosition = child.position.clone();
            child.userData.idleBaseRotation = child.rotation.clone();
        }

        pieces.push(piece);
    }

    return pieces;
}