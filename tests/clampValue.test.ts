import { describe, expect, it } from 'vitest';
import {clampValue} from "../src/utils/clampValue";

describe('clampValue', (): void => {
    it('returns the same value when in range', ():void => {
        expect(clampValue(
            5,
            0,
            10)
        ).toBe(5);
    });

    it('clamps to lower bound', (): void  => {
        expect(clampValue(
            -10,
            0,
            10)
        ).toBe(0);
    });

    it('clamps to upper bound', (): void => {
        expect(clampValue(
            42,
            0,
            10)
        ).toBe(10);
    });
});
