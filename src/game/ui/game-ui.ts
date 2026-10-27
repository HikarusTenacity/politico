import type {GameManager} from "../../types/game-manager-types";
import {playerCornerPanels} from "./player-corner-panel";
import nameEntryOverlay from "./name-entry-overlay";
import gameInfoDisplay from "./game-info-display";
import type {GameUI} from "../../types/ui-types";

export function createGameUI(infoDiv: HTMLDivElement): GameUI {
    const ui = {
        infoDiv: infoDiv,
        activeGameManager: null as GameManager | null,
        init: function(): void {
            playerCornerPanels.createCornerPanels();
            nameEntryOverlay.create();
            gameInfoDisplay.init(infoDiv);
        },
        update: function(gameManager: GameManager): void {
            this.activeGameManager = gameManager;
            gameInfoDisplay.update(gameManager);
            playerCornerPanels.updateCornerPanels(gameManager);
            nameEntryOverlay.update(gameManager);
        }
    };
    ui.init();
    return ui;
}
