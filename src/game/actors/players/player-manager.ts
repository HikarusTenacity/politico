// Game state and player management
import type * as THREE from 'three';
import type {PlayerState} from '../../../types/player-types';

const globalPlayers = globalThis.PLAYERS ?? (globalThis.PLAYERS = []);
export const PLAYERS: PlayerState[] = globalPlayers;
export const PLAYER_PIECES: Record<number, THREE.Group> = {};
export const MAX_PLAYER_CURRENCY = 99999999;
export const MAX_PLAYER_BUFF_SLOTS = 99;

// Player colors
const PLAYER_COLORS = [0xFF0000, 0x008000, 0x0000FF, 0xFFFF00];  // Red, Green, Blue, Yellow

export function initializePlayers(): void {
    PLAYERS.length = 0;
    for (const playerId of Object.keys(PLAYER_PIECES)) {
        delete PLAYER_PIECES[Number(playerId)];
    }

    for (let i = 0; i < 4; i++) {
        const color = PLAYER_COLORS[i];
        if (color === undefined) {
            continue;
        }
        const player: PlayerState = {
            id: i,
            name: "Player " + (i + 1),
            color,
            pieceType: "Unselected",
            currentSpace: 0,
            currency: 0,
            buffs: [],
            piece: null
        };
        PLAYERS.push(player);
    }
}

initializePlayers();
