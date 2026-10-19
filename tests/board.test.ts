import { describe, expect, it } from 'vitest';
import { initializeBoardSpaces } from "../src/game/board/board-layout";
import {
    getSpaceById,
    getSpaceIdFromCoordinates,
    getSpaceName,
    getSpacesByType,
    setSpaceName
} from "../src/game/board/board-queries";

initializeBoardSpaces();

describe('board layout and queries', () => {
    it('initializes all 40 spaces', () => {

        let count = 0;
        for (let i = 0; i < 40; i++) {
            const space = getSpaceById(i);
            expect(space).not.toBeNull();
            count++;
        }

        expect(count).toBe(40);
        expect(getSpaceById(-1)).toBeNull();
        expect(getSpaceById(40)).toBeNull();
    });

    it('maps center coordinates back to each space id', () => {
        for (let i = 0; i < 40; i++) {
            const space = getSpaceById(i);
            const foundId = getSpaceIdFromCoordinates(space.centerX, space.centerZ);
            expect(foundId).toBe(i);
        }
    });

    it('returns null for out-of-board coordinates', () => {
        expect(getSpaceIdFromCoordinates(50, 50)).toBeNull();
        expect(getSpaceIdFromCoordinates(-50, -50)).toBeNull();
    });

    it('updates names only for valid spaces', () => {
        const originalName = getSpaceName(5);
        setSpaceName(5, 'Renamed');
        expect(getSpaceName(5)).toBe('Renamed');

        setSpaceName(99, 'Invalid');
        expect(getSpaceName(5)).not.toBe(originalName);
    });

    it('filters spaces by type', () => {
        const taxSpaces = getSpacesByType('TAX');
        expect(taxSpaces.length).toBeGreaterThan(0);
        for (const space of taxSpaces) {
            expect(space.type).toBe('TAX');
        }
    });
});
