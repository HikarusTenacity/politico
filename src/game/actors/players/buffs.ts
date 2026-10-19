import {getPlayerById} from "./getters";
import {PLAYER_DEFAULTS} from "../../../constants/player-parameters";

function addPlayerBuff(playerId: number, buffName: string): boolean {
    const player  = getPlayerById(playerId);
    if (!player || !buffName) return false;

    if (player.buffs.length >= PLAYER_DEFAULTS.maxBuffSlots) {
        return false;
    }

    player.buffs.push(buffName);
    return true;
}

function clearPlayerBuffs(playerId: number): void {
    const player = getPlayerById(playerId);
    if (!player) return;

    player.buffs = [];
}

function removePlayerBuff(playerId: number, buffName: string): boolean {
    const player = getPlayerById(playerId);
    if (!player || !buffName) return false;

    const buffIndex = player.buffs.indexOf(buffName);
    if (buffIndex < 0) return false;

    player.buffs.splice(buffIndex, 1);
    return true;
}