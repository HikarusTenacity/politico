function addPlayerBuff(playerId: number, buffName: string) {
    const player  = getPlayerById(playerId);
    if (!player || !buffName) return false;

    if (player.buffs.length >= MAX_PLAYER_BUFF_SLOTS) {
        return false;
    }

    player.buffs.push(buffName);
    return true;
}

function clearPlayerBuffs(playerId: number) {
    const player = getPlayerById(playerId);
    if (!player) return;

    player.buffs = [];
}

function removePlayerBuff(playerId: number, buffName: string) {
    var player = getPlayerById(playerId);
    if (!player || !buffName) return false;

    var buffIndex = player.buffs.indexOf(buffName);
    if (buffIndex < 0) return false;

    player.buffs.splice(buffIndex, 1);
    return true;
}