// Piece positioning and distribution logic

// Distribute pieces evenly within a space
// Returns array of positions for each piece
import * as THREE from 'three';
import {getSpaceBounds} from "../board/board-queries";
import {getPiecesAtSpace} from "./players/getters";
import {PLAYER_PIECES, PLAYERS} from './players/player-manager';

function distributePiecesInSpace(
    piecesAtSpace: ReturnType<typeof getPiecesAtSpace>,
    spaceId: number
) {
    const spaceBounds = getSpaceBounds(spaceId) || { xMin: 0, xMax: 1, zMin: 0, zMax: 1 };
    const pieceCount = piecesAtSpace.length;

    if (pieceCount === 0) return [];

    let positions = [];
    let width = spaceBounds.xMax - spaceBounds.xMin;
    let depth = spaceBounds.zMax - spaceBounds.zMin;

    let cols, rows;
    cols = (pieceCount % 2 === 0) ? 2 : 1;
    rows = (pieceCount < 4) ? 1 : 2; 

    let cellWidth = width / cols;
    let cellDepth = depth / rows;

    for (let i = 0; i < pieceCount; i++) {
        const pieceAtSpace = piecesAtSpace[i];
        if (!pieceAtSpace) {
            continue;
        }
        let col = i % cols;
        let row = Math.floor(i / cols);

        let x = spaceBounds.xMin + (col + 0.5) * cellWidth;
        let z = spaceBounds.zMin + (row + 0.5) * cellDepth;

        positions.push({
            x: x,
            z: z,
            playerIndex: pieceAtSpace.playerId
        });
    }

    return positions;
}

// Update a piece's position to match its player's space
function updatePiecePosition(piece: THREE.Group, position: { x: number; z: number }) {
    if (piece && position) {
        piece.position.x = position.x;
        piece.position.z = position.z;
    }
}

// Update all pieces on board based on player positions
export function updateAllPiecePositions() {
    for (let playerId = 0; playerId < PLAYERS.length; playerId++) {
        const player = PLAYERS[playerId];
        if (!player) {
            continue;
        }
        const piecesAtSpace = getPiecesAtSpace(player.currentSpace);
        const positions = distributePiecesInSpace(piecesAtSpace, player.currentSpace);

        for (const element of positions) {
            if (element.playerIndex === playerId && player.piece) {
                updatePiecePosition(player.piece, element);
            }
        }
    }
}



export function setPlayerPiece(playerId: number, piece: THREE.Group) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        const player = PLAYERS[playerId];
        if (!player) {
            return;
        }
        player.piece = piece;
        PLAYER_PIECES[playerId] = piece;
    }
}

export function movePlayerToSpace(playerId: number, spaceId: number) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        const player = PLAYERS[playerId];
        if (player) {
            player.currentSpace = spaceId;
        }
    }
}