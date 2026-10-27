export interface CreditsScreen {
    root: HTMLDivElement;
    viewport: HTMLDivElement;
    track: HTMLDivElement;
    scrollTimer: number | null;
    isVisible: boolean;
    show(): void;
    hide(): void;
}