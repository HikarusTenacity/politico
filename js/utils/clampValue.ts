/**
 * Clamps a value between a minimum and maximum.
 * @param value The value to clamp.
 * @param minValue The minimum value.
 * @param maxValue The maximum value.
 * @returns The clamped value.
 */
export function clampValue(value: number, minValue: number, maxValue: number) {
    if (minValue > maxValue) {
        throw new Error(`[Clamp Error]: ` +
            `minValue (${minValue}) cannot be greater than maxValue (${maxValue}). ` +
            `Value passed: ${value}`);
    }
    return Math.max(minValue, Math.min(maxValue, value));
}