/**
 * Get the grid coordinates for a given world position.
 * @param worldX The world X coordinate.
 * @param worldZ The world Z coordinate.
 * @returns An object containing the grid coordinates and space ID.
 */

export function getGridCoordinates(worldX: number, worldZ: number): {
    x: string;
    z: string;
    spaceId: number
} {
    const spaceId = getSpaceIdFromCoordinates(worldX, worldZ);
    
    return {
        x: worldX.toFixed(2),
        z: worldZ.toFixed(2),
        spaceId: spaceId
    };
}
