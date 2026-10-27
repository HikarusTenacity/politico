import type {GameManager} from "./game-manager-types";
import * as THREE from "three";

export type buttonName = 'start' | 'settings' | 'credits' | 'rules';



export interface GameInfo {
    infoDiv: HTMLElement | null;
    lastUpdate: number;
    init: (infoDiv: HTMLElement) => void;
    update: (gameManager: any) => void;
}
export interface TitleScreen {
    root: HTMLDivElement;
    startButton: HTMLButtonElement;
    settingsButton: HTMLButtonElement;
    creditsButton: HTMLButtonElement;
    rulesModal: HTMLDivElement;
    rulesButton: HTMLButtonElement;
    isVisible: boolean;
    isRulesVisible: boolean;
    dismissRules(): void;
    onStart(callback: () => void): void;
    onButton(buttonName: buttonName, callback: () => void): void;
    hide(): void;
}

export interface Option {
    label: string,
    value: string
}

export interface GameUI {
    infoDiv: HTMLDivElement;
    activeGameManager: GameManager | null;
    init(): void;
    update(GameManager: GameManager): void;
}

export interface CornerPanel {
    panel: HTMLDivElement;
    header: HTMLDivElement;
    portrait: HTMLSpanElement;
    name: HTMLSpanElement;
    characterLine: HTMLDivElement;
    currencyLine: HTMLDivElement;
    buffsLine: HTMLDivElement;
}

export interface PortraitViewport {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    rimLight: THREE.PointLight;
    model: THREE.Group | null;
    sourcePiece: THREE.Group | null;
    baseY: number;
}