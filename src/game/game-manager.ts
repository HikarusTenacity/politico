import * as THREE from 'three';
import { setPlayerPiece, movePlayerToSpace, updateAllPiecePositions } from './actors/actor-manager';
import { createDiceAnimator } from './animations/dice-animator';
import { createLocalMultiplayerInput } from '../input/local-multiplayer';
import type { DiceAnimator } from '../types/animation-types';
import type { LocalMultiplayerInput } from "../types/input";
import type {
    GameManager,
    GameState,
    NameEntryState,
    PieceExitAnimation,
    PregameRoll
} from '../types/game-manager-types';
import type {PlayerState} from "../types/player-types";
import {BOARD_SPACES} from "./board/board-layout";
import {PLAYERS} from "./actors/players/player-manager";

// Game manager for local 4-player co-op
export function createGameManager(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    worldPieces: THREE.Group[],
    rendererDomElement: HTMLElement
): GameManager {
    const manager = {
        currentPlayerIndex: 0,
        gameState: 'PRE_GAME_SELECT' as GameState,
        diceRoll: 0,
        targetSpace: 0,
        isLocalGame: true,
        scene: scene,
        camera: camera,
        worldPieces: worldPieces || [],
        diceAnimator: null as DiceAnimator | null,
        selectingPlayerIndex: 0,
        availablePieceIndices: [] as number[],
        selectedPieceByPlayer: [] as number[],
        selectionCursor: 0,
        pregameRolls: [] as PregameRoll[],
        turnOrder: [] as number[],
        hoveredPieceIndex: -1,
        pregameRaycaster: new THREE.Raycaster(),
        pregameMouse: new THREE.Vector2(0, 0),
        pregameNameEntry: null as NameEntryState | null,
        pregameExitAnimations: [] as PieceExitAnimation[],
        pregameNameMessage: '',
        pregameNameCharacters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?#',
        pregameNameKeyboardRows: ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ.!?#','1234567890'],
        pregameNameLength: 8,
        animationSpeed: 1,
        rendererDomElement: rendererDomElement,
        
        // Input handler for controllers/keyboard
        inputHandler: null as LocalMultiplayerInput | null,
        
        init: function(): void {
            // Initialize dice animator
            this.diceAnimator = createDiceAnimator(this.scene, this.camera);
            this.diceAnimator.gameManager = this;
            this.diceAnimator.setSpeedMultiplier(this.animationSpeed);

            this.initializeCharacterSelect();
            this.setupPregamePointerHandlers();
            
            // Initialize multi-controller input
            this.inputHandler = createLocalMultiplayerInput();
            this.inputHandler.init();
            
            // Bind input actions
            this.inputHandler.onActionForPlayer = (playerId: string | number, action: string): void => {
                this.handlePlayerAction(playerId, action);
            };
            this.inputHandler.onRawKeyInput = (key: string, event: KeyboardEvent): boolean => {
                return this.handleRawKeyboardInput(key, event);
            };
        },
        
        update: function(): void {
            if (this.inputHandler) {
                this.inputHandler.update();
                this.updateActionButton();
            }
            
            // Update dice animator
            if (this.diceAnimator) {
                this.diceAnimator.update();
            }

            this.updatePregameExitAnimations();
            
            // Update game state based on current player
            this.updateGameState();
        },

        updateActionButton: function(): void {
            if (!this.inputHandler?.actionButton) return;
            
            switch(this.gameState) {
                case 'PRE_GAME_SELECT':
                    if (this.isNameEntryActive()) {
                        this.inputHandler.setButtonText('Confirm');
                        this.inputHandler.setButtonColor('blue');
                    } else {
                        this.inputHandler.setButtonText('Select Character');
                        this.inputHandler.setButtonColor('green');
                    }
                    break;
                case 'PRE_GAME_ROLL_RESULTS':
                    this.inputHandler.setButtonText('Start Game');
                    this.inputHandler.setButtonColor('green');
                    break;
                case 'TURN_START':
                    this.inputHandler.setButtonText('Roll Dice');
                    this.inputHandler.setButtonColor('orange');
                    break;
                case 'ROLLING':
                    this.inputHandler.setButtonText('Rolling...');
                    this.inputHandler.setButtonColor('blue');
                    break;
                case 'MOVING':
                    this.inputHandler.setButtonText('End Turn');
                    this.inputHandler.setButtonColor('red');
                    break;
                case 'TURN_END':
                    this.inputHandler.setButtonText('Next Turn');
                    this.inputHandler.setButtonColor('green');
                    break;
            }
        },
        
        updateGameState: function(): void {
            switch(this.gameState) {
                case 'PRE_GAME_SELECT':
                case 'PRE_GAME_ROLL_RESULTS':
                    break;
                case 'TURN_START':
                    // Wait for player to roll
                    break;
                case 'ROLLING':
                    // Wait for animation to finish
                    if (this.diceAnimator && !this.diceAnimator.isAnimating) {
                        // Animation finished, move to MOVING state
                        this.gameState = 'MOVING';
                    }
                    break;
                case 'MOVING':
                    // Wait for move input
                    break;
                case 'TURN_END':
                    // Move to next player
                    this.endTurn();
                    break;
            }
        },
        
        handlePlayerAction: function(playerId: string | number, action: string): void {
            if (action === 'ACTION') {
                action = 'ROLL';
            }

            if ((this.gameState === 'TURN_START' || this.gameState === 'ROLLING' || this.gameState === 'MOVING' || this.gameState === 'TURN_END') &&
                playerId !== 'ANY' && playerId !== this.currentPlayerIndex) {
                return;
            }

            if (this.gameState === 'PRE_GAME_SELECT') {
                if (this.isNameEntryActive()) {
                    if (action === 'SELECT_PREV') {
                        this.changeNameEntryCharacter(-1);
                    } else if (action === 'SELECT_NEXT') {
                        this.changeNameEntryCharacter(1);
                    } else if (action === 'SELECT_UP') {
                        this.moveNameEntryCursor(-1);
                    } else if (action === 'SELECT_DOWN') {
                        this.moveNameEntryCursor(1);
                    } else if (action === 'ROLL') {
                        this.confirmNameEntry();
                    }
                } else if (action === 'SELECT_PREV') {
                    this.moveSelectionCursor(-1);
                } else if (action === 'SELECT_NEXT') {
                    this.moveSelectionCursor(1);
                } else if (action === 'ROLL') {
                    this.confirmCharacterSelection();
                }
                return;
            }

            if (this.gameState === 'PRE_GAME_ROLL_RESULTS') {
                if (action === 'ROLL') {
                    this.startGameAfterPregame();
                }
                return;
            }
            
            if (action === 'ROLL') {
                if (this.gameState === 'TURN_START') {
                    this.startRolling();
                } else if (this.gameState === 'MOVING') {
                    this.endTurn();
                }
            }
        },

        handleRawKeyboardInput: function(key: string, event: KeyboardEvent): boolean {
            return false;
        },

        initializeCharacterSelect: function(): void {
            this.availablePieceIndices = [];
            this.selectedPieceByPlayer = [];
            this.selectingPlayerIndex = 0;
            this.selectionCursor = 0;
            this.hoveredPieceIndex = -1;
            this.pregameExitAnimations = [];
            this.pregameNameMessage = '';

            for (let i = 0; i < this.worldPieces.length; i++) {
                this.availablePieceIndices.push(i);
            }

            for (const element of PLAYERS) {
                this.selectedPieceByPlayer.push(-1);
                element.piece = null;
            }

            this.initNameEntryForCurrentPlayer();

            this.layoutCharacterSelectPieces();
        },

        setupPregamePointerHandlers: function(): void {
            if (!this.rendererDomElement) return;

            this.rendererDomElement.addEventListener(
                'mousemove',
                (event: MouseEvent): void => {
                this.handlePregameMouseMove(event);
            });

            this.rendererDomElement.addEventListener(
                'mouseleave',
                (): void => {
                this.setHoveredPieceIndex(-1);
            });

            this.rendererDomElement.addEventListener(
                'click',
                (event: MouseEvent): void => {
                this.handleClick(event);
            });
        },

        handlePregameMouseMove: function(event: MouseEvent): void {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            const rect: DOMRect = this.rendererDomElement.getBoundingClientRect();
            this.pregameMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pregameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.pregameRaycaster.setFromCamera(this.pregameMouse, this.camera);

            const availableRoots: THREE.Object3D[] = [];
            for (const element of this.availablePieceIndices) {
                const piece = this.worldPieces[element];
                if (piece) {
                    availableRoots.push(piece);
                }
            }

            const intersections = this.pregameRaycaster.intersectObjects(availableRoots, true);
            if (intersections.length === 0) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            const intersection = intersections[0];
            if (!intersection) return;
            const hoveredIndex: number = this.resolvePieceIndexFromObject(intersection.object);
            this.setHoveredPieceIndex(hoveredIndex);
        },

        handlePregameClick: function(): void {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) return;

            if (this.hoveredPieceIndex >= 0) {
                if (this.isNameEntryActive() && !this.confirmNameEntry()) return;
                this.confirmCharacterSelectionByPieceIndex(this.hoveredPieceIndex);
            }
        },
        
        handleClick: function(event: MouseEvent): void {
            if (this.gameState === 'PRE_GAME_SELECT') {
                this.handlePregameClick();
                return;
            }

            if (this.diceAnimator && this.gameState === 'ROLLING') {
                const rect: DOMRect = this.rendererDomElement.getBoundingClientRect();
                const mouse: THREE.Vector2 = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                const raycaster = new THREE.Raycaster();
                this.diceAnimator.handleClick(mouse, raycaster);
            }
        },

        resolvePieceIndexFromObject: function(object3D: THREE.Object3D): number {
            let cursor: THREE.Object3D | null = object3D;
            while (cursor) {
                for (let i = 0; i < this.worldPieces.length; i++) {
                    if (this.worldPieces[i] === cursor) return i;
                }
                cursor = cursor.parent;
            }
            return -1;
        },

        setHoveredPieceIndex: function(pieceIndex: number) {
            if (pieceIndex === this.hoveredPieceIndex) return;

            if (this.hoveredPieceIndex >= 0) {
                const piece = this.worldPieces[this.hoveredPieceIndex];
                if (piece) {
                    this.setPieceGlow(piece, false);
                }
            }

            this.hoveredPieceIndex = pieceIndex;

            if (this.hoveredPieceIndex >= 0) {
                const piece = this.worldPieces[this.hoveredPieceIndex];
                if (piece) {
                    this.setPieceGlow(piece, true);
                }
                const cursorInAvailable = this.availablePieceIndices.indexOf(this.hoveredPieceIndex);
                if (cursorInAvailable >= 0) {
                    this.selectionCursor = cursorInAvailable;
                }
            }
        },

        setPieceGlow: function(piece: THREE.Object3D, glowOn: boolean): void {
            if (!piece) return;

            if (glowOn) {
                if (!piece.userData.outlineObjects) {
                    piece.userData.outlineObjects = [];
                }
                if (piece.userData.outlineObjects.length === 0) {
                    piece.traverse(function(node: THREE.Object3D): void {
                        if (!(node instanceof THREE.Mesh) || !node.geometry) return;

                        const box: THREE.Box3 = new THREE.Box3().setFromObject(node);
                        const size: THREE.Vector3 = box.getSize(new THREE.Vector3());
                        const volume: number = size.x * size.y * size.z;
                        if (volume < 0.025) return;

                        const edges: THREE.EdgesGeometry = new THREE.EdgesGeometry(node.geometry);
                        const line: THREE.LineSegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                            color: 0xffffff, 
                            linewidth: 2,
                            fog: false
                        }));
                        node.add(line);
                        piece.userData.outlineObjects.push({ 
                            mesh: node, 
                            line: line 
                        });
                    });
                    if (!piece.userData.outlineLight) {
                        const light = new THREE.PointLight(0xffffff, 2.5, 50);
                        light.position.copy(piece.position);
                        light.position.y += 5;
                        piece.add(light);
                        piece.userData.outlineLight = light;
                    }
                }
            } else {
                if (piece.userData.outlineObjects) {
                    for (const element of piece.userData.outlineObjects) {
                        const obj: { mesh: THREE.Object3D, line: THREE.LineSegments } = element;
                        obj.mesh.remove(obj.line);
                    }
                    piece.userData.outlineObjects = [];
                }
                if (piece.userData.outlineLight) {
                    piece.remove(piece.userData.outlineLight);
                    piece.userData.outlineLight = null;
                }
            }
        },

        moveSelectionCursor: function(direction: number) {
            if (this.availablePieceIndices.length === 0) return;

            const length = this.availablePieceIndices.length;
            this.selectionCursor = (this.selectionCursor + direction + length) % length;

            this.layoutCharacterSelectPieces();
        },

        confirmCharacterSelection: function(): void {
            if (this.availablePieceIndices.length === 0) return;

            const pieceIndex: number | undefined = this.availablePieceIndices[this.selectionCursor];
            if (pieceIndex === undefined) return;
            this.confirmCharacterSelectionByPieceIndex(pieceIndex);
        },

        confirmCharacterSelectionByPieceIndex: function(pieceIndex: number): void {
            const availableIndex: number = this.availablePieceIndices.indexOf(pieceIndex);
            if (availableIndex < 0) return;

            this.selectionCursor = availableIndex;
            const playerIndex: number = this.selectingPlayerIndex;
            const piece: THREE.Group | undefined = this.worldPieces[pieceIndex];
            if (!piece) return;

            this.setPieceGlow(piece, false);
            this.hoveredPieceIndex = -1;

            setPlayerPiece(playerIndex, piece);
            const player = PLAYERS[playerIndex];
            if (!player) return;
            player.pieceType = 'Character ' + (pieceIndex + 1);
            this.selectedPieceByPlayer[playerIndex] = pieceIndex;

            this.availablePieceIndices.splice(availableIndex, 1);
            if (this.selectionCursor >= this.availablePieceIndices.length) {
                this.selectionCursor = Math.max(0, this.availablePieceIndices.length - 1);
            }

            this.startPieceExitAnimation(piece, playerIndex);

            this.selectingPlayerIndex += 1;

            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.rollPregameOrder();
            } else {
                this.initNameEntryForCurrentPlayer();
                this.layoutCharacterSelectPieces();
            }
        },

        normalizePlayerName: function(rawName: string): string {
            let trimmed: string = rawName.toUpperCase().trim();
            if (!trimmed) return '';

            if (trimmed.length > this.pregameNameLength) {
                trimmed = trimmed.slice(0, this.pregameNameLength);
            }

            return trimmed;
        },

        isNameEntryActive: function(): boolean {
            return this.gameState === 'PRE_GAME_SELECT' &&
                this.selectingPlayerIndex < PLAYERS.length &&
                !!this.pregameNameEntry;
        },

        initNameEntryForCurrentPlayer: function(): void {
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.pregameNameEntry = null;
                return;
            }

            const playerIndex: number = this.selectingPlayerIndex;
            let slots: string[] = [];

            for (let i = 0; i < this.pregameNameLength; i++) {
                slots.push(' ');
            }

            this.pregameNameEntry = {
                playerIndex: playerIndex,
                slots: slots,
                cursor: 0
            };
            this.pregameNameMessage = '';
        },

        getNameEntryDisplayText: function() {
            if (!this.isNameEntryActive()) return '';

            const entry = this.pregameNameEntry;
            if (!entry) return '';

            let out = '';
            for (let i = 0; i < entry.slots.length; i++) {
                const slotChar = entry.slots[i] === ' ' ? '_' : entry.slots[i];
                out += i === entry.cursor ?
                            `[${slotChar}]` :
                            ` ${slotChar} `;
            }

            return out;
        },

        getNameEntrySelectedCharacter: function() {
            if (!this.isNameEntryActive()) return ' ';

            const entry = this.pregameNameEntry;
            if (!entry) return ' ';
            return entry.slots[entry.cursor] ?? ' ';
        },

        moveNameEntryCursor: function(delta: number) {
            if (!this.isNameEntryActive()) return;

            const entry = this.pregameNameEntry;
            if (!entry) return;
            entry.cursor = (entry.cursor + delta + this.pregameNameLength) % this.pregameNameLength;
        },

        changeNameEntryCharacter: function(delta: number) {
            if (!this.isNameEntryActive()) {
                return;
            }

            const entry = this.pregameNameEntry;
            if (!entry) return;
            const chars: string = this.pregameNameCharacters;
            const currentChar: string = entry.slots[entry.cursor] ?? ' ';
            
            let index: number = chars.indexOf(currentChar);
            if (index < 0) {
                index = 0;
            }

            const nextIndex: number = (index + delta + chars.length) % chars.length;

            entry.slots[entry.cursor] = chars.charAt(nextIndex);
        },

        setNameEntryCursor: function(cursorIndex: number): boolean {
            if (!this.isNameEntryActive()) return false;

            if (cursorIndex < 0 || cursorIndex >= this.pregameNameLength) {
                return false;
            }

            const entry = this.pregameNameEntry;
            if (!entry) return false;
            entry.cursor = cursorIndex;
            return true;
        },

        setNameEntryCharacter: function(character: string): boolean {
            if (!this.isNameEntryActive()) return false;

            let normalizedChar = character === '_' ? ' ' : character;
            if (typeof normalizedChar !== 'string' || normalizedChar.length === 0) {
                return false;
            }

            normalizedChar = normalizedChar.charAt(0).toUpperCase();
            if (!this.pregameNameCharacters.includes(normalizedChar)) {
                return false;
            }

            const entry = this.pregameNameEntry;
            if (!entry) return false;
            entry.slots[entry.cursor] = normalizedChar;
            return true;
        },

        deleteNameEntryCharacter: function() {
            if (!this.isNameEntryActive()) return false;

            const entry = this.pregameNameEntry;
            if (!entry) return false;
            const cursor = entry.cursor;

            if (entry.slots[cursor] !== ' ') {
                entry.slots[cursor] = ' ';
                return true;
            }

            entry.cursor = (cursor + this.pregameNameLength - 1) % this.pregameNameLength;
            entry.slots[entry.cursor] = ' ';
            return true;
        },

        confirmNameEntry: function() {
            if (!this.isNameEntryActive()) {
                return false;
            }

            const entry = this.pregameNameEntry;
            if (!entry) return false;
            let name: string = this.normalizePlayerName(entry.slots.join(''));
            
            //default name
            if (!name) name = 'player_' + (entry.playerIndex + 1);

            //taken name
            if (this.isPlayerNameTaken(name, entry.playerIndex)) {
                this.pregameNameMessage = 'Name already used by another player.';
                return false;
            }

            const player = PLAYERS[entry.playerIndex];
            if (!player) return false;
            player.name = name;
            this.pregameNameEntry = null;
            this.pregameNameMessage = '';
            this.selectingPlayerIndex += 1;
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.rollPregameOrder();
            }
            return true;
        },

        isPlayerNameTaken: function(candidateName: string, currentPlayerIndex: number): boolean {
            const lowerCandidate: string = candidateName.toLowerCase();
            for (let i = 0; i < PLAYERS.length; i++) {
                if (i === currentPlayerIndex) {
                    continue;
                }
                const player = PLAYERS[i];
                if (!player) continue;
                const existingName = this.normalizePlayerName(player.name);
                if (existingName?.toLowerCase() === lowerCandidate) {
                    return true;
                }
            }
            return false;
        },

        startPieceExitAnimation: function(piece: THREE.Object3D, playerIndex: number): void {
            this.pregameExitAnimations.push({
                piece: piece,
                startX: piece.position.x,
                startZ: piece.position.z,
                endX: -12 + playerIndex * 8,
                endZ: 16,
                startTime: Date.now(),
                duration: 550
            });
        },

        updatePregameExitAnimations: function(): void {
            if (this.pregameExitAnimations.length === 0) return;

            const now: number = Date.now();
            for (let i = this.pregameExitAnimations.length - 1; i >= 0; i--) {
                const anim = this.pregameExitAnimations[i];
                if (!anim) continue;
                const speed: number = Math.max(0.25, this.animationSpeed || 1);
                const progress: number = Math.min(((now - anim.startTime) * speed) / anim.duration, 1);
                const eased: number = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                anim.piece.position.x = anim.startX + (anim.endX - anim.startX) * eased;
                anim.piece.position.z = anim.startZ + (anim.endZ - anim.startZ) * eased;
                anim.piece.rotation.y = Math.PI * 1.5;

                if (progress >= 1) {
                    this.pregameExitAnimations.splice(i, 1);
                }
            }
        },

        rollPregameOrder: function(): void {
            this.pregameRolls = [];
            this.turnOrder = [];

            for (let i = 0; i < PLAYERS.length; i++) {
                const roll: number = Math.floor(Math.random() * 6) + 1; //NOSONAR
                this.pregameRolls.push({ playerIndex: i, roll: roll });
            }

            const sorted: PregameRoll[] = this.pregameRolls.slice().sort(function(a, b) {
                if (b.roll !== a.roll) {
                    return b.roll - a.roll;
                }
                return a.playerIndex - b.playerIndex;
            });

            for (const element of sorted) {
                this.turnOrder.push(element.playerIndex);
            }

            this.currentPlayerIndex = this.turnOrder[0] || 0;
            this.gameState = 'PRE_GAME_ROLL_RESULTS';
            this.layoutCharacterSelectPieces();
        },

        startGameAfterPregame: function(): void {
            for (let i = 0; i < PLAYERS.length; i++) {
                movePlayerToSpace(i, 0);
            }
            updateAllPiecePositions();
            this.gameState = 'TURN_START';
        },

        layoutCharacterSelectPieces: function() {
            const availableCount = this.availablePieceIndices.length;
            const availableSpacing = 2.2;
            const availableStartX = -((availableCount - 1) * availableSpacing) / 2;
            const availableZ = 0.9;

            for (const element of this.worldPieces) {
                const piece = element;
                if (!piece.userData.baseScale) {
                    piece.userData.baseScale = piece.scale.clone();
                }
                piece.scale.copy(piece.userData.baseScale);
            }

            for (let k = 0; k < this.availablePieceIndices.length; k++) {
                const availablePieceIndex = this.availablePieceIndices[k];
                if (availablePieceIndex === undefined) continue;
                const availablePiece = this.worldPieces[availablePieceIndex];
                if (!availablePiece) continue;
                availablePiece.position.x = availableStartX + k * availableSpacing;
                availablePiece.position.z = availableZ;
                availablePiece.rotation.y = Math.PI;

                if (this.gameState === 'PRE_GAME_SELECT' && k === this.selectionCursor) {
                    availablePiece.scale.multiplyScalar(1.18);
                }
            }
        },

        isPregame: function(): boolean {
            return this.gameState === 'PRE_GAME_SELECT' || 
                   this.gameState === 'PRE_GAME_ROLL_RESULTS';
        },
        
        startRolling: function(): void {
            this.gameState = 'ROLLING';
            const currentPlayer = PLAYERS[this.currentPlayerIndex];
            const diceAnimator = this.diceAnimator;
            if (!currentPlayer || !currentPlayer.piece || !diceAnimator) {
                this.gameState = 'TURN_START';
                return;
            }
            this.diceRoll = Math.floor(Math.random() * 6) + 1; //NOSONAR
            this.targetSpace = (currentPlayer.currentSpace + this.diceRoll) % BOARD_SPACES.length;
            movePlayerToSpace(this.currentPlayerIndex, this.targetSpace);
            diceAnimator.rollDice(
                currentPlayer.name,
                currentPlayer.color,
                currentPlayer.piece,
                this.targetSpace,
                this.diceRoll
            );
        },
        
        endTurn: function(): void {
            if (this.turnOrder.length > 0) {
                let currentTurnOrderIndex = this.turnOrder.indexOf(this.currentPlayerIndex);
                const nextOrderIndex = (currentTurnOrderIndex + 1) % this.turnOrder.length;
                this.currentPlayerIndex = this.turnOrder[nextOrderIndex] ?? this.currentPlayerIndex;
            } else {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
            }
            this.gameState = 'TURN_START';
            this.diceRoll = 0;
        },
        
        getCurrentPlayer: function(): PlayerState | undefined {
            return PLAYERS[this.currentPlayerIndex];
        },

        setGameSpeed: function(multiplier: number): void {
            this.animationSpeed = Math.max(0.5, Math.min(2.0, multiplier || 1));

            if (this.diceAnimator?.setSpeedMultiplier) {
                this.diceAnimator.setSpeedMultiplier(this.animationSpeed);
            }
        }
    };
    
    manager.init();
    return manager;
}
