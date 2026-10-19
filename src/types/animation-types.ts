import * as THREE from 'three';

export interface MotionProfile {
    walkCycleSpeed?: number;
    legSwingAmount?: number;
    headBobAmount?: number;
    bodyBobAmount?: number;
    armSwingAmount?: number;
}

export interface PlayerAnimator {
    playerPiece: THREE.Group;
    targetSpaceId: number;
    isAnimating: boolean;
    animationStartTime: number;
    animationDuration: number;
    playerStartPos: THREE.Vector3 | null;
    playerTargetPos: THREE.Vector3 | null;
    playerWalkPath: THREE.Vector3[];
    speedMultiplier: number;
    walkCycleSpeed: number;
    legSwingAmount: number;
    headBobAmount: number;
    bodyBobAmount: number;
    armSwingAmount: number;

    setSpeedMultiplier(multiplier: number): void;
    setWalkDuration(durationMs: number): void;
    setMotionProfile(profile?: MotionProfile): void;
    init(): void;
    calculateWalkPath(): void;
    createSmoothPath(start: THREE.Vector3, end: THREE.Vector3, numPoints: number): THREE.Vector3[];
    update(): boolean;
    movePlayerAlongPath(progress: number): void;
    animatePlayerWalk(progress: number): void;
    finishAnimation(): void;
}

export type DiceAnimationPhase =
    | 'PAN'
    | 'WAIT_FOR_CLICK'
    | 'ROLLING'
    | 'WAIT_AFTER_ROLL'
    | 'MOVING';

export interface DiceAnimatorGameManager {
    setPieceGlow(
        piece: THREE.Object3D,
        enabled: boolean
    ): void;
}

export interface DiceRotation {
    x: number;
    y: number;
    z: number;
}

export interface DiceAnimator {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    dice: THREE.Group;
    isAnimating: boolean;
    animationPhase: DiceAnimationPhase | null;
    currentThrowType: number;
    result: number;

    animationDuration: number;
    rollDuration: number;
    panDuration: number;
    animationStartTime: number;

    cameraStartPos: THREE.Vector3 | null;
    targetCameraPos: THREE.Vector3 | null;
    targetCameraLookAt: THREE.Vector3 | null;

    turnDisplayElement: HTMLElement | null;
    currentPlayerPiece: THREE.Group | null;
    currentPlayerName: string;
    currentPlayerColor: number;
    targetSpaceId: number;
    targetDiceRotation: DiceRotation;
    startDiceRotation: DiceRotation;

    playerAnimator: PlayerAnimator | null;
    waitAfterRollStartTime: number;
    waitAfterRollDuration: number;

    gameManager: DiceAnimatorGameManager | null;
    speedMultiplier: number;
    spinAmount: number;
    rollForwardAmount: number;
    cameraAlignStrength: number;

    setSpeedMultiplier(multiplier: number): void;
    setPanDuration(durationMs: number): void;
    setRollDuration(durationMs: number): void;
    setSpinAmount(amount: number): void;
    setupCutscene(): void;
    restoreCutscene(): void;
    showTurnDisplay(playerName: string, playerColor: number, message?: string): void;
    hideTurnDisplay(): void;
    rollDice(
        playerName: string,
        playerColor: number,
        playerPiece: THREE.Group,
        targetSpaceId: number,
        diceRoll: number
    ): number;
    setupCameraTargets(playerPiece: THREE.Group): void;
    getRotationForResult(result: number): DiceRotation;
    smoothRotationtoward(targetRotation: DiceRotation, progress: number): void;
    update(): void;
    updateCameraAnimation(progress: number): void;
    handleClick(mouse: THREE.Vector2, raycaster: THREE.Raycaster): boolean;
    finishAnimation(): void;
}