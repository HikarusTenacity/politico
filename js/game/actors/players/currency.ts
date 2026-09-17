import { clampValue } from "../../../utils/clampValue";

/**
 * Sets the currency of a player, ensuring it stays within bounds.
 * @param playerId The ID of the player.
 * @param amount The amount to set.
 */
export function setPlayerCurrency(playerId: number, amount: number) {
    if (amount < 0) {
        console.error("Currency cannot be negative.");
        return;
    }

    const player = getPlayerById(playerId);
    if (!player) return;

    player.currency = clampValue(amount, 0, MAX_PLAYER_CURRENCY);
}

/**
 * Adds or subtracts currency from a player, ensuring it stays within bounds.
 * @param playerId The ID of the player.
 * @param amountDelta The amount to add (positive) or subtract (negative).
 */
export function addPlayerCurrency(playerId: number, amountDelta: number) {
    const player = getPlayerById(playerId);
    if (!player) return;

    setPlayerCurrency(playerId, player.currency + amountDelta);
}