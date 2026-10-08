export type buttonName = 'start' | 'settings' | 'credits' | 'rules';



export interface GameInfo {
    infoDiv: HTMLElement | null;
    lastUpdate: number;
    init: (infoDiv: HTMLElement) => void;
    update: (gameManager: any) => void;
}
export interface TitleScreen {
    root: HTMLDivElement;
    startButton: HTMLButtonElement;
    settingsButton: HTMLButtonElement;
    creditsButton: HTMLButtonElement;
    rulesModal: HTMLDivElement;
    rulesButton: HTMLButtonElement;
    isVisible: boolean;
    isRulesVisible: boolean;
    dismissRules(): void;
    onStart(callback: () => void): void;
    onButton(buttonName: buttonName, callback: () => void): void;
    hide(): void;
}

export interface Option {
    label: string,
    value: string
}