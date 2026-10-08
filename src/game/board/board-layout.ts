import * as BoardParams from '../../constants/board-parameters';
import { SPACE_DEFINITIONS_BY_ID } from './board-data';
import * as BoardTypes from '../../types/board-types';

export const BOARD_SPACES: BoardTypes.BoardSpace[] = [] as BoardTypes.BoardSpace[];
const SPACE_BOUNDS: Record<number, BoardTypes.BoardBounds> = {} as Record<number, BoardTypes.BoardBounds>;
//no clue why copilot wants me to add the record part

/**
 * Adds a space to SPACE_BOUNDS with id and space bounds
 * @param id
 * @param xMin
 * @param xMax
 * @param zMin
 * @param zMax
 */
function addSpace(id: number, xMin: number, xMax: number, zMin: number, zMax: number) {
    SPACE_BOUNDS[id] = {
        xMin: xMin,
        xMax: xMax,
        zMin: zMin,
        zMax: zMax };
}

/**
 * Defines the layout of the board spaces in SPACE_BOUNDS
 * Numbered from 0-39, starting at top-right corner and going counterclockwise
 * 0: top-right corner
 * 1-9: top row (right to left)
 * 10: top-left corner
 * 11-19: left column (top to bottom)
 * 20: bottom-left corner
 * 21-29: bottom row (left to right)
 * 30: bottom-right corner
 * 31-39: right column (bottom to top)
 * values are hardcoded to 40 which should be fine because it's always the same board layout
 */
export function defineSpaceLayout(): void {
    
    // Start at top-right corner (space 0), then go counterclockwise
    let zTop = 10 - BoardParams.CORNER_SIZE;
    let xRight = 10 - BoardParams.CORNER_SIZE;
    let xLeft = -10 + BoardParams.CORNER_SIZE;
    let zBottom = -10 + BoardParams.CORNER_SIZE;

    //probably keeping the hardcoded numbers forever, i won't ever change the board nor use this engine again so its ok

    //topright 0
    addSpace(0, xRight, 10, zTop, 10);

    //top 1-9
    let x = xRight;
    for (let i = 1; i <= 9; i++) {
        addSpace(i, x - BoardParams.PROPERTY_SIZE, x, zTop, 10);
        x -= BoardParams.PROPERTY_SIZE;
    }

    //topleft 10
    addSpace(10, -10, -10 + BoardParams.CORNER_SIZE, zTop, 10);

    //left 11-19
    let z = 10 - BoardParams.CORNER_SIZE;
    for (let i = 11; i <= 19; i++) {
        addSpace(i, -10, xLeft, z - BoardParams.PROPERTY_SIZE, z);
        z -= BoardParams.PROPERTY_SIZE;
    }

    //bottomleft 20
    addSpace(20, -10, xLeft, -10, zBottom);

    //bottom 21-29
    x = -10 + BoardParams.CORNER_SIZE;
    for (let i = 21; i <= 29; i++) {
        addSpace(i, x, x + BoardParams.PROPERTY_SIZE, -10, zBottom);
        x += BoardParams.PROPERTY_SIZE;
    }

    //bottomright 30
    addSpace(30, xRight, 10, -10, zBottom);

    //right 31-39
    z = -10 + BoardParams.CORNER_SIZE;
    for (let i = 31; i <= 39; i++) {
        addSpace(i, xRight, 10, z, z + BoardParams.PROPERTY_SIZE);
        z += BoardParams.PROPERTY_SIZE;
    }
}

/**
 * Initializes BOARD_SPACES with SPACE_BOUNDS and SPACE_DEFINITIONS_BY_ID.
 */
export function initializeBoardSpaces(): void {
    defineSpaceLayout();

    //inplace, clear array (from copilot)
    BOARD_SPACES.length = 0;
    
    for (let id = 0; id < 40; id++) {
        const bounds: BoardTypes.BoardBounds = SPACE_BOUNDS[id];
        if (!bounds) continue;

        const definition: BoardTypes.SpaceDefinition = SPACE_DEFINITIONS_BY_ID[id] || {
            id,
            type: 'GENERAL_COMMITTEE' as BoardTypes.SpaceType,
            name: 'Unassigned Space'
        };
        
        let centerX = (bounds.xMin + bounds.xMax) / 2;
        let centerZ = (bounds.zMin + bounds.zMax) / 2;
        let width = bounds.xMax - bounds.xMin;
        let depth = bounds.zMax - bounds.zMin;
        
        BOARD_SPACES.push({
            id: id,
            name: definition.name,
            type: definition.type,
            bounds: bounds,
            centerX: centerX,
            centerZ: centerZ,
            width: width,
            depth: depth
        });
    }
}