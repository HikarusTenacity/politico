import * as THREE from "three";
import {createPlayerAnimator} from "../animations/player-animator";
import {gameManager, worldPieces} from "../../main";
import type {PlayerAnimator} from "../../types/animation-types";

(window as any).testAnimations = {
    playPlayerWalk: function(playerIndex: number, targetSpace: number): void {
        const piece: THREE.Group | undefined = worldPieces[playerIndex ?? 0];
        if (!piece) {
            console.error('Player ' + playerIndex + ' not found');
            return;
        }
        let animator: PlayerAnimator = createPlayerAnimator(piece, targetSpace);
        animator.init();
        (window as any).playerAnimator = animator;
    },

    rollDice: function(speedMultiplier: number): void {
        if (!gameManager?.diceAnimator) {
            console.error('Dice animator not available');
            return;
        }
        gameManager.diceAnimator.setupCutscene();
        gameManager.diceAnimator.setSpeedMultiplier(speedMultiplier || 1.0);
    },

    setIdleSpeedMultiplier: function(mult: number): void {
        worldPieces.forEach((piece: THREE.Object3D): void => {
            piece.userData.idleSpeedMultiplier = mult;
        });
    },

    setBodySwayAmount: function(amount: number): void {
        worldPieces.forEach((piece: THREE.Object3D): void => {
            piece.userData.bodySwayAmount = amount;
        });
    },

    resetIdlePhases: function(): void {
        worldPieces.forEach((piece: THREE.Object3D): void => {
            piece.userData.idlePhase = Math.random() * Math.PI * 2; //NOSONAR
        });
    }
};