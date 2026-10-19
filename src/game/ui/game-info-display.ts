import {getSpaceName, getSpaceType} from "../board/board-queries";
import type { GameInfo } from "../../types/ui-types";
import type {GameManager} from "../../types/game-manager-types";
import {PLAYERS} from "../actors/players/player-manager";
import {MAX_PLAYER_BUFF_SLOTS} from "../actors/players/player-manager";
import {GAME_UI_UPDATE_INTERVAL} from "../../constants/ui-parameters";

const gameInfoDisplay: GameInfo = {
    infoDiv: null,
    lastUpdate: 0,

    init: function(infoDiv: HTMLElement): void {
        this.infoDiv = infoDiv;
    },

    update: function(gameManager: GameManager): void {
        let now = Date.now();
        if (now - this.lastUpdate < GAME_UI_UPDATE_INTERVAL) return;
        this.lastUpdate = now;
        
        if (!this.infoDiv) return;

        const currentPlayer = gameManager.getCurrentPlayer();
        if (!currentPlayer) return;
        const currentSpace = currentPlayer.currentSpace;
        const currentSpaceName = getSpaceName(currentSpace) || ('Space ' + currentSpace);
        const currentSpaceType = getSpaceType(currentSpace) || 'UNKNOWN';
        let html: string = '<div style="color: #' + currentPlayer.color.toString(16).padStart(6, '0') + ';">';
        html += '<strong>' + currentPlayer.name + '\'s Turn</strong><br>';
        html += 'Space: ' + currentSpace + ' - ' + currentSpaceName + ' (' + currentSpaceType + ')<br>';
        
        html += '<br><strong>Players:</strong><br>';
        for (let i = 0; i < PLAYERS.length; i++) {
            const player = PLAYERS[i];
            if (!player) continue;
            const playerColor: string = player.color.toString(16).padStart(6, '0');
            const marker: string = (i === gameManager.currentPlayerIndex && !gameManager.isPregame()) ? '→ ' : '  ';
            const pieceLabel: string = player.pieceType ? player.pieceType : 'Unselected';
            const currencyLabel: string = String(player.currency);
            const buffLabel: string = (player.buffs ? player.buffs.length : 0) + '/' + MAX_PLAYER_BUFF_SLOTS;

            if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS') {
                let rollValue: string = '-';
                for (const element of gameManager.pregameRolls) {
                    if (element.playerIndex === i) {
                        rollValue = String(element.roll);
                        break;
                    }
                }
                html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] — Roll: ' + rollValue + ' | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            } else if (gameManager.gameState === 'PRE_GAME_SELECT') {
                let selectingMarker: string = (i === gameManager.selectingPlayerIndex) ? '► ' : '  ';
                let statusLabel: string = '';
                if (i === gameManager.selectingPlayerIndex &&
                    gameManager.isNameEntryActive?.()) {
                    statusLabel = ' (Naming)';
                } 
                html += selectingMarker + '<span style="color: #' + playerColor + ';">' + player.name + statusLabel + ' [' + pieceLabel + '] | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            } else {
                html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] (Space ' + player.currentSpace + ') | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            }
        }

        if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS' && gameManager.turnOrder.length > 0) {
            html += '<br><strong>Order:</strong><br>';
            let orderLabel: string = '';
            for (let t = 0; t < gameManager.turnOrder.length; t++) {
                const orderPlayerIndex = gameManager.turnOrder[t];
                if (orderPlayerIndex === undefined) continue;
                const orderedPlayer = PLAYERS[orderPlayerIndex];
                if (orderedPlayer) {
                    html += (t + 1) + '. ' + orderedPlayer.name + '<br>';
                }
            }
        }
        this.infoDiv.innerHTML = html;
    }
};

export default gameInfoDisplay;
