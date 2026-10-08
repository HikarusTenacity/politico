import { BOARD_SPACES } from './board-layout';
import { BoardSpace, BoardBounds, SpaceType } from '../../types/board-types';

/**
 * Gets board space by id, returns null if invalid id
 * @param spaceId
 * @returns BoardSpace | null
 */
export function getSpaceById(spaceId: number): BoardSpace | null {
    return (spaceId >= 0 && spaceId < BOARD_SPACES.length)
        ? BOARD_SPACES[spaceId] :
        null;
}

/**
 * Gets id of board space from world coordinates, returns null if coordinates aren't on the board
 * @param worldX
 * @param worldZ
 * @returns spaceId | null
 */
export function getSpaceIdFromCoordinates(worldX: number, worldZ: number): number | null {
    for (let id = 0; id < BOARD_SPACES.length; id++) {
        const space = BOARD_SPACES[id];
        const bounds = space.bounds;
        if (worldX >= bounds.xMin && worldX < bounds.xMax &&
            worldZ >= bounds.zMin && worldZ < bounds.zMax) {
            return id;
        }
    }
    return null;
}

/**
 * Gets bounds of board space by id, return null if invalid id
 * @param spaceId
 */
export function getSpaceBounds(spaceId: number): BoardBounds | null {
    const space = getSpaceById(spaceId);
    return space?.bounds ?? null;
}

/**
 * Gets name of board space by id, return null if invalid id
 * @param spaceId
 */
export function getSpaceName(spaceId: number): string | null {
    let space = getSpaceById(spaceId);
    return space?.name ?? null;
}

/**
 * Gets type of board space by id, return null if invalid id
 * @param spaceId
 */
export function getSpaceType(spaceId: number): SpaceType | null {
    let space = getSpaceById(spaceId);
    return space?.type ?? null;
}

/**
 * Sets name of board space by id
 * @param spaceId
 * @param name
 */
export function setSpaceName(spaceId: number, name: string): void {
    const space = getSpaceById(spaceId);
    if (space) space.name = name;
}

/**
 * Gets all board spaces of a specific type
 * @param type
 */
export function getSpacesByType(type: string): BoardSpace[] {
    let matching: BoardSpace[] = [];
    for (const element of BOARD_SPACES) {
        if (element.type === type) {
            matching.push(element);
        }
    }
    return matching;
}

/**
 * Checks if the given world coordinates are on the board
 * @param worldX
 * @param worldZ
 */
export function isOnBoard(worldX: number, worldZ: number): boolean {
    return getSpaceIdFromCoordinates(worldX, worldZ) !== null;
}