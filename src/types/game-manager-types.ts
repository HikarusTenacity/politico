import type * as THREE from 'three';
import type { DiceAnimator } from './animation-types';
import type { LocalMultiplayerInput } from './input';
import type {PlayerState} from "./player-types";

export type GameState =
    | 'PRE_GAME_SELECT'
    | 'PRE_GAME_ROLL_RESULTS'
    | 'TURN_START'
    | 'ROLLING'
    | 'MOVING'
    | 'TURN_END';

export interface PregameRoll {
    playerIndex: number;
    roll: number;
}

export interface NameEntryState {
    playerIndex: number;
    slots: string[];
    cursor: number;
}

export interface PieceExitAnimation {
    piece: THREE.Object3D;
    startX: number;
    startZ: number;
    endX: number;
    endZ: number;
    startTime: number;
    duration: number;
}

export interface OutlineObject {
    mesh: THREE.Object3D;
    line: THREE.LineSegments;
}

export interface PieceUserData extends Record<string, unknown> {
    baseScale?: THREE.Vector3;
    outlineObjects?: OutlineObject[];
    outlineLight?: THREE.PointLight | null;
}

export interface GameManager {
    currentPlayerIndex: number;
    gameState: GameState;
    diceRoll: number;
    targetSpace: number;
    isLocalGame: boolean;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    worldPieces: THREE.Group[];
    rendererDomElement: HTMLElement;

    diceAnimator: DiceAnimator | null;
    inputHandler: LocalMultiplayerInput | null;

    selectingPlayerIndex: number;
    availablePieceIndices: number[];
    selectedPieceByPlayer: number[];
    selectionCursor: number;
    pregameRolls: PregameRoll[];
    turnOrder: number[];
    hoveredPieceIndex: number;
    pregameRaycaster: THREE.Raycaster;
    pregameMouse: THREE.Vector2;
    pregameExitAnimations: PieceExitAnimation[];

    pregameNameEntry: NameEntryState | null;
    pregameNameMessage: string;
    pregameNameCharacters: string;
    pregameNameKeyboardRows: string[];
    pregameNameLength: number;
    animationSpeed: number;

    init(): void;
    update(): void;
    isPregame(): boolean;
    startRolling(): void;
    endTurn(): void;
    getCurrentPlayer(): PlayerState | undefined;
    setGameSpeed(multiplier: number): void;
    isNameEntryActive(): boolean;
    getNameEntrySelectedCharacter(): string;
    setNameEntryCursor(cursorIndex: number): boolean;
    setNameEntryCharacter(character: string): boolean;
    deleteNameEntryCharacter(): void;
    moveNameEntryCursor(delta: number): void;
    confirmNameEntry(): boolean;
    setPieceGlow(piece: THREE.Object3D, glowOn: boolean): void;
}