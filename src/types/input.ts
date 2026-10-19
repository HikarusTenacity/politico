export type ButtonColor = 'green' | 'blue' | 'orange' | 'red';

export type LocalMultiplayerInput = {
    onActionForPlayer: ((player: string | number, action: string) => void) | null;
    onRawKeyInput: ((key: string, event: KeyboardEvent) => boolean) | null;
    actionButton: HTMLButtonElement | null;

    init(): void;
    update(): void;
    createActionButton(): void;
    setButtonText(text?: string): void;
    setButtonColor(color?: ButtonColor): void;
};
