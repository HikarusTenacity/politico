import {getSpaceName, getSpaceType} from "../board/board-queries";
import { GameInfo } from "../../types/ui-types";

const gameInfoDisplay: GameInfo = {
    infoDiv: null,
    lastUpdate: 0,

    init: function(infoDiv: any) {
        this.infoDiv = infoDiv;
    },

    update: function(gameManager: any) {
        let now = Date.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = now;
        
        if (!this.infoDiv) return;

        var currentPlayer = gameManager.getCurrentPlayer();
        var currentSpace = currentPlayer ? currentPlayer.currentSpace : null;
        var currentSpaceName = getSpaceName(currentSpace) || ('Space ' + currentSpace);
        var currentSpaceType = getSpaceType(currentSpace) || 'UNKNOWN';
        var html = '<div style="color: #' + currentPlayer.color.toString(16).padStart(6, '0') + ';">';
        html += '<strong>' + currentPlayer.name + '\'s Turn</strong><br>';
        html += 'Space: ' + currentSpace + ' - ' + currentSpaceName + ' (' + currentSpaceType + ')<br>';
        
        html += '<br><strong>Players:</strong><br>';
        for (var i = 0; i < PLAYERS.length; i++) {
            var player = PLAYERS[i];
            var playerColor = player.color.toString(16).padStart(6, '0');
            var marker = (i === gameManager.currentPlayerIndex && !gameManager.isPregame()) ? '→ ' : '  ';
            var pieceLabel = player.pieceType ? player.pieceType : 'Unselected';
            var currencyLabel = String(player.currency);
            var buffLabel = (player.buffs ? player.buffs.length : 0) + '/' + MAX_PLAYER_BUFF_SLOTS;

            if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS') {
                var rollValue = '-';
                for (var r = 0; r < gameManager.pregameRolls.length; r++) {
                    if (gameManager.pregameRolls[r].playerIndex === i) {
                        rollValue = gameManager.pregameRolls[r].roll;
                        break;
                    }
                }
                html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] — Roll: ' + rollValue + ' | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            } else if (gameManager.gameState === 'PRE_GAME_SELECT') {
                var selectingMarker = (i === gameManager.selectingPlayerIndex) ? '► ' : '  ';
                var statusLabel = '';
                if (i === gameManager.selectingPlayerIndex && 
                    gameManager.isNameEntryActive && 
                    gameManager.isNameEntryActive()) {
                    statusLabel = ' (Naming)';
                } 
                html += selectingMarker + '<span style="color: #' + playerColor + ';">' + player.name + statusLabel + ' [' + pieceLabel + '] | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            } else {
                html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] (Space ' + player.currentSpace + ') | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
            }
        }

        if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS' && gameManager.turnOrder.length > 0) {
            html += '<br><strong>Order:</strong><br>';
            for (var t = 0; t < gameManager.turnOrder.length; t++) {
                var orderPlayerIndex = gameManager.turnOrder[t];
                html += (t + 1) + '. ' + PLAYERS[orderPlayerIndex].name + '<br>';
            }
        }
        this.infoDiv.innerHTML = html;
    }
};
