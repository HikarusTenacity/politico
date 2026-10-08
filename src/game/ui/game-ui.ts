export function createGameUI(infoDiv: HTMLDivElement): {
    infoDiv: HTMLDivElement;
    activeGameManager: any;
    init(): void;
    update(gameManager: any): void;
} {
    const ui = {
        infoDiv: infoDiv,
        activeGameManager: null,
        init: function(): void {
            playerCornerPanels.createCornerPanels();
            nameEntryOverlay.create();
            gameInfoDisplay.init(infoDiv);
        },
        update: function(gameManager): void {
            this.activeGameManager = gameManager;
            gameInfoDisplay.update(gameManager);
            playerCornerPanels.updateCornerPanels(gameManager);
            nameEntryOverlay.update(gameManager);
        }
    };
    ui.init();
    return ui;
}
