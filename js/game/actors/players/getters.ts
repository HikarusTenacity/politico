/**
 * Gets the pieces at a specific space.
 * @param spaceId The ID of the space.
 * @returns An array of pieces at the space.
 */
export function getPiecesAtSpace(spaceId: number) {
    let pieces = [];
    for (const element of PLAYERS) {
        if (element.currentSpace === spaceId && element.piece) {
            pieces.push({
                playerId: element.id,
                piece: element.piece,
                index: pieces.length
            });
        }
    }
    return pieces;
}

/**
 * Gets a player by their ID.
 * @param playerId The ID of the space.
 * @returns The player with the specified ID, or null if not found.
 */
export function getPlayerById(playerId: number) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        return PLAYERS[playerId];
    }
    return null;
}