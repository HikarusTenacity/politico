// Piece positioning and distribution logic

// Distribute pieces evenly within a space
// Returns array of positions for each piece
function distributePiecesInSpace(piecesAtSpace: any[], spaceId: number) {
    const spaceBounds = getSpaceBounds(spaceId);
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
        let col = i % cols;
        let row = Math.floor(i / cols);

        let x = spaceBounds.xMin + (col + 0.5) * cellWidth;
        let z = spaceBounds.zMin + (row + 0.5) * cellDepth;

        positions.push({
            x: x,
            z: z,
            playerIndex: piecesAtSpace[i].playerId
        });
    }

    return positions;
}

// Update a piece's position to match its player's space
function updatePiecePosition(piece, position) {
    if (piece && position) {
        piece.position.x = position.x;
        piece.position.z = position.z;
    }
}

// Update all pieces on board based on player positions
function updateAllPiecePositions() {
    for (let playerId = 0; playerId < PLAYERS.length; playerId++) {
        const player = PLAYERS[playerId];
        const piecesAtSpace = getPiecesAtSpace(player.currentSpace);
        const positions = distributePiecesInSpace(piecesAtSpace, player.currentSpace);

        for (let i = 0; i < positions.length; i++) {
            if (positions[i].playerIndex === playerId && player.piece) {
                updatePiecePosition(player.piece, positions[i]);
            }
        }
    }
}


function setPlayerPiece(playerId, piece) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].piece = piece;
        PLAYER_PIECES[playerId] = piece;
    }
}

function movePlayerToSpace(playerId, spaceId) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].currentSpace = spaceId;
    }
}