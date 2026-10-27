// Player corner panels - displays player info and 3D portrait in corners
import * as THREE from 'three';
import {createGuy} from '../models/characters/guy';
import {MAX_PLAYER_BUFF_SLOTS, PLAYERS} from '../actors/players/player-manager';
import type {GameManager} from '../../types/game-manager-types';
import type {PlayerState} from '../../types/player-types';
import type {CornerPanel, PortraitViewport} from "../../types/ui-types";

export const playerCornerPanels = {
    cornerPositions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    fallbackGuyColors: ['red', 'green', 'blue', 'yellow'],
    portraitWidth: 100,
    portraitHeight: 100,
    cornerPanels: [] as CornerPanel[],
    portraitViewports: [] as (PortraitViewport | undefined)[],

    createCornerPanels: function(): void {
        this.destroyCornerPanels();

        for (let i: number = 0; i < 4; i++) {
            const panel: HTMLDivElement = document.createElement('div');
            panel.className = 'player-corner ' + this.cornerPositions[i];
            panel.id = 'player-corner-' + i;

            const header: HTMLDivElement = document.createElement('div');
            header.className = 'player-corner-header';

            const portrait: HTMLSpanElement = document.createElement('span');
            portrait.className = 'player-portrait';
            portrait.innerHTML =
                '<span class="player-portrait">' +
                    '<span class="player-portrait-head"></span>' +
                    '<span class="player-portrait-body"></span>' +
                '</span>';

            const name: HTMLSpanElement = document.createElement('span');
            name.className = 'player-corner-name';

            header.appendChild(portrait);
            header.appendChild(name);

            const characterLine: HTMLDivElement = document.createElement('div');
            const currencyLine: HTMLDivElement = document.createElement('div');
            const buffsLine: HTMLDivElement = document.createElement('div');

            panel.appendChild(header);
            panel.appendChild(characterLine);
            panel.appendChild(currencyLine);
            panel.appendChild(buffsLine);

            document.body.appendChild(panel);
            this.cornerPanels.push({
                panel: panel,
                header: header,
                portrait: portrait,
                name: name,
                characterLine: characterLine,
                currencyLine: currencyLine,
                buffsLine: buffsLine
            });

            this.createPortraitViewport(i);
        }
    },

    createPortraitViewport: function(index: number): void {
        if (!this.cornerPanels[index]) return;

        const portraitHost: HTMLElement = this.cornerPanels[index].portrait;
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(this.portraitWidth, this.portraitHeight, false);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.className = 'portrait-canvas';

        portraitHost.innerHTML = '';
        portraitHost.appendChild(renderer.domElement);

        const scene: THREE.Scene = new THREE.Scene();
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(42, this.portraitWidth / this.portraitHeight, 0.1, 20);
        camera.position.set(0, 0.65, 2.1);
        camera.lookAt(new THREE.Vector3(0, 0.35, 0));

        const ambient: THREE.AmbientLight = new THREE.AmbientLight(
            0xffffff,
            0.9
        );
        scene.add(ambient);

        const keyLight: THREE.DirectionalLight = new THREE.DirectionalLight(
            0xffffff,
            1.1
        );
        keyLight.position.set(
            2.5,
            3.5,
            3.5
        );
        scene.add(keyLight);

        const rimLight: THREE.PointLight = new THREE.PointLight(
            0xffffff,
            1.5,
            8
        );
        rimLight.position.set(
            -2,
            2,
            2
        );
        scene.add(rimLight);

        this.portraitViewports[index] = {
            renderer: renderer,
            scene: scene,
            camera: camera,
            rimLight: rimLight,
            model: null,
            sourcePiece: null,
            baseY: -0.20
        };
    },

    getPortraitModelForPlayer: function(player: PlayerState, index: number): THREE.Group {
        let model: THREE.Group;

        if (player.piece) {
            model = player.piece.clone(true);
        } else {
            const fallbackColor = this.fallbackGuyColors[index % this.fallbackGuyColors.length];
            model = createGuy(fallbackColor ?? 'white');
        }

        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        model.traverse(function(node: THREE.Object3D): void {
            if (node instanceof THREE.Mesh) {
                node.castShadow = false;
                node.receiveShadow = false;
            }
        });

        const box: THREE.Box3 = new THREE.Box3().setFromObject(model);
        const center: THREE.Vector3 = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        box.setFromObject(model);
        const size: THREE.Vector3 = box.getSize(new THREE.Vector3());
        if (size.y > 0) {
            const scale: number = 2.35 / size.y;
            model.scale.set(scale, scale, scale);
        }

        box.setFromObject(model);
        const scaledSize: THREE.Vector3 = box.getSize(new THREE.Vector3());
        const scaledMinY: number = box.min.y;
        const chestY: number = scaledMinY + scaledSize.y * 0.65;
        model.position.y -= chestY;
        model.position.y += 0.05;

        return model;
    },

    setFallbackGuyColors: function(colors: string[]): void {
        if (Array.isArray(colors) && colors.length) {
            this.fallbackGuyColors = colors.slice();
        }
    },

    updatePortraitViewport: function(player: PlayerState, index: number, isCurrentTurn: boolean): void {
        let viewport: PortraitViewport | undefined = this.portraitViewports[index];
        if (!viewport) {
            return;
        }

        if (viewport.sourcePiece !== player.piece) {
            if (viewport.model) {
                viewport.scene.remove(viewport.model);
            }
            viewport.model = this.getPortraitModelForPlayer(player, index);
            viewport.sourcePiece = player.piece;
            viewport.scene.add(viewport.model);
        }

        if (viewport.model) {
            viewport.model.rotation.y = 0;
            viewport.model.position.y = viewport.baseY;
        }

        viewport.rimLight.intensity = isCurrentTurn ? 2.1 : 1.4;
        viewport.renderer.render(viewport.scene, viewport.camera);
    },

    destroyCornerPanels: function(): void {
        for (const element of this.portraitViewports) {
            let viewport: PortraitViewport | undefined = element;
            if (!viewport) {
                continue;
            }

            if (viewport.model) {
                viewport.scene.remove(viewport.model);
                viewport.model = null;
            }

            if (viewport.renderer) {
                viewport.renderer.dispose();
            }
        }
        this.portraitViewports = [];

        for (const element of this.cornerPanels) {
            const panelData: CornerPanel = element;
            if (!panelData) continue;
            let panel: HTMLDivElement = panelData.panel;
            if (panel?.parentNode) {
                panel.remove();
            }
        }
        this.cornerPanels = [];
    },

    updateCornerPanels: function(gameManager: GameManager): void {
        for (let i = 0; i < PLAYERS.length && i < this.cornerPanels.length; i++) {
            const player = PLAYERS[i];
            if (!player || !this.cornerPanels[i]) {
                continue;
            }
            const panelData = this.cornerPanels[i];
            if (!panelData) continue;
            const panel = panelData.panel;
            const playerColor: string = '#' + player.color.toString(16).padStart(6, '0');
            const isCurrentTurn: boolean = !gameManager.isPregame() && gameManager.currentPlayerIndex === i;
            const buffsCount: number = player.buffs ? player.buffs.length : 0;
            const pieceLabel: string = player.pieceType ? player.pieceType : 'Unselected';

            panel.className = 'player-corner ' + this.cornerPositions[i] + (isCurrentTurn ? ' active-turn' : '');
            panelData.header.style.color = playerColor;
            panelData.portrait.style.color = playerColor;
            panelData.name.textContent = player.name;
            panelData.characterLine.textContent = 'Character: ' + pieceLabel;
            panelData.currencyLine.textContent = 'Currency: ' + player.currency;
            panelData.buffsLine.textContent = 'Buff Slots: ' + buffsCount + ' / ' + MAX_PLAYER_BUFF_SLOTS;

            this.updatePortraitViewport(player, i, isCurrentTurn);
        }
    }
};

export function setPlayerFallbackColors(colors: string[]): void {
    playerCornerPanels.setFallbackGuyColors(colors);
}