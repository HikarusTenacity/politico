export type ButtonColor = 'green' | 'blue' | 'orange' | 'red';

export type LocalMultiplayerInput = {
    onActionForPlayer: ((player: string, action: string) => void) | null;
    onRawKeyInput: ((key: string) => void) | null;
    actionButton: HTMLButtonElement | null;

    init(): void;
    update(): void;
    createActionButton(): void;
    setButtonText(text?: string): void;
    setButtonColor(color?: ButtonColor): void;
};
