// Game state and player management
const globalPlayers = ((globalThis as any).PLAYERS || ((globalThis as any).PLAYERS = [] as any[])) as any[];
let PLAYERS: any[] = globalPlayers;
let PLAYER_PIECES = {};  // Maps player ID to piece object
const MAX_PLAYER_CURRENCY = 99999999;
const MAX_PLAYER_BUFF_SLOTS = 99;

// Player colors
const PLAYER_COLORS = [0xFF0000, 0x008000, 0x0000FF, 0xFFFF00];  // Red, Green, Blue, Yellow

export function initializePlayers() {
    PLAYERS = [];
    PLAYER_PIECES = {};

    for (let i = 0; i < 4; i++) {
        const player = {
            id: i,
            name: "Player " + (i + 1),
            color: PLAYER_COLORS[i],
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
