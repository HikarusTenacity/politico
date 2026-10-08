import * as THREE from 'three';
import { PLAYERS, setPlayerPiece, movePlayerToSpace, updateAllPiecePositions } from './player-manager';
import { createDiceAnimator } from './dice-animator';
import { createLocalMultiplayerInput } from './input-handler';

// Game manager for local 4-player co-op
function createGameManager(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    worldPieces: THREE.Object3D[],
    rendererDomElement: HTMLElement) {
    const manager = {
        currentPlayerIndex: 0,
        gameState: 'PRE_GAME_SELECT',  // PRE_GAME_SELECT, PRE_GAME_ROLL_RESULTS, TURN_START, ROLLING, MOVING, TURN_END
        diceRoll: 0,
        targetSpace: 0,
        isLocalGame: true,
        scene: scene,
        camera: camera,
        worldPieces: worldPieces || [],
        diceAnimator: null,
        selectingPlayerIndex: 0,
        availablePieceIndices: [],
        selectedPieceByPlayer: [],
        selectionCursor: 0,
        pregameRolls: [],
        turnOrder: [],
        hoveredPieceIndex: -1,
        pregameRaycaster: new THREE.Raycaster(),
        pregameMouse: new THREE.Vector2(0, 0),
        pregameExitAnimations: [],
        pregameNameEntry: null,
        pregameNameMessage: '',
        pregameNameCharacters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?#',
        pregameNameKeyboardRows: ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ.!?#','1234567890'],
        pregameNameLength: 8,
        animationSpeed: 1,
        rendererDomElement: rendererDomElement,
        
        // Input handler for controllers/keyboard
        inputHandler: null,
        
        init: function() {
            // Initialize dice animator
            let self = this;
            this.diceAnimator = createDiceAnimator(this.scene, this.camera);
            this.diceAnimator.gameManager = self;
            this.diceAnimator.setSpeedMultiplier(this.animationSpeed);

            this.initializeCharacterSelect();
            this.setupPregamePointerHandlers();
            
            // Initialize multi-controller input
            this.inputHandler = createLocalMultiplayerInput();
            this.inputHandler.init();
            
            // Bind input actions
            self = this;
            this.inputHandler.onActionForPlayer = function(playerId: number, action: string) {
                self.handlePlayerAction(playerId, action);
            };
            this.inputHandler.onRawKeyInput = function(key: string, event: KeyboardEvent) {
                return self.handleRawKeyboardInput(key, event);
            };
        },
        
        update: function() {
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

        updateActionButton: function() {
            if (!this.inputHandler || !this.inputHandler.actionButton) return;
            
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
        
        updateGameState: function() {
            switch(this.gameState) {
                case 'PRE_GAME_SELECT':
                case 'PRE_GAME_ROLL_RESULTS':
                    break;
                case 'TURN_START':
                    // Wait for player to roll
                    break;
                case 'ROLLING':
                    // Wait for animation to finish
                    if (!this.diceAnimator.isAnimating) {
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
        
        handlePlayerAction: function(playerId: string, action: string) {
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

        handleRawKeyboardInput: function(key: string, event: KeyboardEvent) {
            return false;
        },

        initializeCharacterSelect: function() {
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

            for (let i = 0; i < PLAYERS.length; i++) {
                this.selectedPieceByPlayer.push(-1);
                PLAYERS[i].piece = null;
            }

            this.initNameEntryForCurrentPlayer();

            this.layoutCharacterSelectPieces();
        },

        setupPregamePointerHandlers: function() {
            if (!this.rendererDomElement) return;

            const self = this;

            this.rendererDomElement.addEventListener('mousemove', function(event) {
                self.handlePregameMouseMove(event);
            });

            this.rendererDomElement.addEventListener('mouseleave', function() {
                self.setHoveredPieceIndex(-1);
            });

            this.rendererDomElement.addEventListener('click', function(event) {
                self.handleClick(event);
            });
        },

        handlePregameMouseMove: function(event: MouseEvent) {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            const rect = this.rendererDomElement.getBoundingClientRect();
            this.pregameMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pregameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.pregameRaycaster.setFromCamera(this.pregameMouse, this.camera);

            const availableRoots = [];
            for (let i = 0; i < this.availablePieceIndices.length; i++) {
                availableRoots.push(this.worldPieces[this.availablePieceIndices[i]]);
            }

            const intersections = this.pregameRaycaster.intersectObjects(availableRoots, true);
            if (intersections.length === 0) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            const hoveredIndex = this.resolvePieceIndexFromObject(intersections[0].object);
            this.setHoveredPieceIndex(hoveredIndex);
        },

        handlePregameClick: function() {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) return;

            if (this.hoveredPieceIndex >= 0) {
                if (this.isNameEntryActive() && !this.confirmNameEntry()) return;
                this.confirmCharacterSelectionByPieceIndex(this.hoveredPieceIndex);
            }
        },
        
        handleClick: function(event: MouseEvent) {
            if (this.gameState === 'PRE_GAME_SELECT') {
                this.handlePregameClick();
                return;
            }

            if (this.diceAnimator && this.gameState === 'ROLLING') {
                const rect = this.rendererDomElement.getBoundingClientRect();
                const mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                const raycaster = new THREE.Raycaster();
                this.diceAnimator.handleClick(mouse, raycaster);
            }
        },

        resolvePieceIndexFromObject: function(object3D: THREE.Object3D) {
            let cursor = object3D;
            while (cursor) {
                for (var i = 0; i < this.worldPieces.length; i++) {
                    if (this.worldPieces[i] === cursor) return i;
                }
                cursor = cursor.parent;
            }
            return -1;
        },

        setHoveredPieceIndex: function(pieceIndex: number) {
            if (pieceIndex === this.hoveredPieceIndex) return;

            if (this.hoveredPieceIndex >= 0) {
                this.setPieceGlow(this.worldPieces[this.hoveredPieceIndex], false);
            }

            this.hoveredPieceIndex = pieceIndex;

            if (this.hoveredPieceIndex >= 0) {
                this.setPieceGlow(this.worldPieces[this.hoveredPieceIndex], true);
                const cursorInAvailable = this.availablePieceIndices.indexOf(this.hoveredPieceIndex);
                if (cursorInAvailable >= 0) {
                    this.selectionCursor = cursorInAvailable;
                }
            }
        },

        setPieceGlow: function(piece: THREE.Object3D, glowOn: boolean) {
            if (!piece) return;

            if (glowOn) {
                if (!piece.userData.outlineObjects) {
                    piece.userData.outlineObjects = [];
                }
                if (piece.userData.outlineObjects.length === 0) {
                    piece.traverse(function(node: THREE.Object3D) {
                        if (!node.isMesh || !node.geometry) return;

                        const box = new THREE.Box3().setFromObject(node);
                        const size = box.getSize(new THREE.Vector3());
                        const volume = size.x * size.y * size.z;
                        if (volume < 0.025) return;

                        const edges = new THREE.EdgesGeometry(node.geometry);
                        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
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
                    for (let i = 0; i < piece.userData.outlineObjects.length; i++) {
                        const obj = piece.userData.outlineObjects[i];
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

        confirmCharacterSelection: function() {
            if (this.availablePieceIndices.length === 0) return;

            var pieceIndex = this.availablePieceIndices[this.selectionCursor];
            this.confirmCharacterSelectionByPieceIndex(pieceIndex);
        },

        confirmCharacterSelectionByPieceIndex: function(pieceIndex: number) {
            const availableIndex = this.availablePieceIndices.indexOf(pieceIndex);
            if (availableIndex < 0) return;

            this.selectionCursor = availableIndex;
            const playerIndex = this.selectingPlayerIndex;
            const piece = this.worldPieces[pieceIndex];

            this.setPieceGlow(piece, false);
            this.hoveredPieceIndex = -1;

            setPlayerPiece(playerIndex, piece);
            PLAYERS[playerIndex].pieceType = 'Character ' + (pieceIndex + 1);
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

        normalizePlayerName: function(rawName) {
            if (typeof rawName !== 'string') return '';

            let trimmed = rawName.toUpperCase().trim();
            if (!trimmed) return '';

            if (trimmed.length > this.pregameNameLength) {
                trimmed = trimmed.slice(0, this.pregameNameLength);
            }

            return trimmed;
        },

        isNameEntryActive: function() {
            return this.gameState === 'PRE_GAME_SELECT' &&
                this.selectingPlayerIndex < PLAYERS.length &&
                !!this.pregameNameEntry;
        },

        initNameEntryForCurrentPlayer: function() {
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.pregameNameEntry = null;
                return;
            }

            const playerIndex = this.selectingPlayerIndex;
            let slots = [];

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

            return this.pregameNameEntry.slots[this.pregameNameEntry.cursor] ?? ' ';
        },

        moveNameEntryCursor: function(delta: number) {
            if (!this.isNameEntryActive()) return;

            const entry = this.pregameNameEntry;
            entry.cursor = (entry.cursor + delta + this.pregameNameLength) % this.pregameNameLength;
        },

        changeNameEntryCharacter: function(delta: number) {
            if (!this.isNameEntryActive()) {
                return;
            }

            const entry = this.pregameNameEntry;
            const chars = this.pregameNameCharacters;
            const currentChar = entry.slots[entry.cursor] ?? ' ';
            
            let index = chars.indexOf(currentChar);
            if (index < 0) {
                index = 0;
            }

            const nextIndex = (index + delta + chars.length) % chars.length;

            entry.slots[entry.cursor] = chars.charAt(nextIndex);
        },

        setNameEntryCursor: function(cursorIndex: number) {
            if (!this.isNameEntryActive()) return false;

            if (cursorIndex < 0 || cursorIndex >= this.pregameNameLength) {
                return false;
            }

            this.pregameNameEntry.cursor = cursorIndex;
            return true;
        },

        setNameEntryCharacter: function(character: string) {
            if (!this.isNameEntryActive()) return false;

            let normalizedChar = character === '_' ? ' ' : character;
            if (typeof normalizedChar !== 'string' || normalizedChar.length === 0) {
                return false;
            }

            normalizedChar = normalizedChar.charAt(0).toUpperCase();
            if (this.pregameNameCharacters.indexOf(normalizedChar) < 0) {
                return false;
            }

            this.pregameNameEntry.slots[this.pregameNameEntry.cursor] = normalizedChar;
            return true;
        },

        deleteNameEntryCharacter: function() {
            if (!this.isNameEntryActive()) return false;

            const entry = this.pregameNameEntry;
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

            var entry = this.pregameNameEntry;
            var name = this.normalizePlayerName(entry.slots.join(''));
            
            //default name
            if (!name) name = 'player_' + (entry.playerIndex + 1);

            //taken name
            if (this.isPlayerNameTaken(name, entry.playerIndex)) {
                this.pregameNameMessage = 'Name already used by another player.';
                return false;
            }

            PLAYERS[entry.playerIndex].name = name;
            this.pregameNameEntry = null;
            this.pregameNameMessage = '';
            this.selectingPlayerIndex += 1;
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.rollPregameOrder();
            }
            return true;
        },

        isPlayerNameTaken: function(candidateName: string, currentPlayerIndex: number) {
            const lowerCandidate = candidateName.toLowerCase();
            for (let i = 0; i < PLAYERS.length; i++) {
                if (i === currentPlayerIndex) {
                    continue;
                }
                const existingName = this.normalizePlayerName(PLAYERS[i].name);
                if (existingName && existingName.toLowerCase() === lowerCandidate) {
                    return true;
                }
            }
            return false;
        },

        startPieceExitAnimation: function(piece, playerIndex) {
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

        updatePregameExitAnimations: function() {
            if (this.pregameExitAnimations.length === 0) return;

            const now = Date.now();
            for (let i = this.pregameExitAnimations.length - 1; i >= 0; i--) {
                const anim = this.pregameExitAnimations[i];
                const speed = Math.max(0.25, this.animationSpeed || 1);
                const progress = Math.min(((now - anim.startTime) * speed) / anim.duration, 1);
                const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                anim.piece.position.x = anim.startX + (anim.endX - anim.startX) * eased;
                anim.piece.position.z = anim.startZ + (anim.endZ - anim.startZ) * eased;
                anim.piece.rotation.y = Math.PI * 1.5;

                if (progress >= 1) {
                    this.pregameExitAnimations.splice(i, 1);
                }
            }
        },

        rollPregameOrder: function() {
            this.pregameRolls = [];
            this.turnOrder = [];

            for (let i = 0; i < PLAYERS.length; i++) {
                const roll = Math.floor(Math.random() * 6) + 1;
                this.pregameRolls.push({ playerIndex: i, roll: roll });
            }

            const sorted = this.pregameRolls.slice().sort(function(a, b) {
                if (b.roll !== a.roll) {
                    return b.roll - a.roll;
                }
                return a.playerIndex - b.playerIndex;
            });

            for (let j = 0; j < sorted.length; j++) {
                this.turnOrder.push(sorted[j].playerIndex);
            }

            this.currentPlayerIndex = this.turnOrder[0] || 0;
            this.gameState = 'PRE_GAME_ROLL_RESULTS';
            this.layoutCharacterSelectPieces();
        },

        startGameAfterPregame: function() {
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

            for (let i = 0; i < this.worldPieces.length; i++) {
                const piece = this.worldPieces[i];
                if (!piece.userData.baseScale) {
                    piece.userData.baseScale = piece.scale.clone();
                }
                piece.scale.copy(piece.userData.baseScale);
            }

            for (let k = 0; k < this.availablePieceIndices.length; k++) {
                const availablePieceIndex = this.availablePieceIndices[k];
                const availablePiece = this.worldPieces[availablePieceIndex];
                availablePiece.position.x = availableStartX + k * availableSpacing;
                availablePiece.position.z = availableZ;
                availablePiece.rotation.y = Math.PI;

                if (this.gameState === 'PRE_GAME_SELECT' && k === this.selectionCursor) {
                    availablePiece.scale.multiplyScalar(1.18);
                }
            }
        },

        isPregame: function() {
            return this.gameState === 'PRE_GAME_SELECT' || 
                   this.gameState === 'PRE_GAME_ROLL_RESULTS';
        },
        
        startRolling: function() {
            this.gameState = 'ROLLING';
            const currentPlayer = PLAYERS[this.currentPlayerIndex];
            this.diceRoll = Math.floor(Math.random() * 6) + 1;
            this.targetSpace = (currentPlayer.currentSpace + this.diceRoll) % 40;
            movePlayerToSpace(this.currentPlayerIndex, this.targetSpace);
            this.diceAnimator.rollDice(
                currentPlayer.name,
                currentPlayer.color,
                currentPlayer.piece,
                this.targetSpace,
                this.diceRoll
            );
        },
        
        endTurn: function() {
            if (this.turnOrder.length > 0) {
                let currentTurnOrderIndex = this.turnOrder.indexOf(this.currentPlayerIndex);
                const nextOrderIndex = (currentTurnOrderIndex + 1) % this.turnOrder.length;
                this.currentPlayerIndex = this.turnOrder[nextOrderIndex];
            } else {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
            }
            this.gameState = 'TURN_START';
            this.diceRoll = 0;
        },
        
        getCurrentPlayer: function() {
            return PLAYERS[this.currentPlayerIndex];
        },

        setGameSpeed: function(multiplier: number) {
            this.animationSpeed = Math.max(0.5, Math.min(2.0, multiplier || 1));

            if (this.diceAnimator && this.diceAnimator.setSpeedMultiplier) {
                this.diceAnimator.setSpeedMultiplier(this.animationSpeed);
            }
        }
    };
    
    manager.init();
    return manager;
}
