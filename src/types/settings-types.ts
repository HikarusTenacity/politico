import type {GameThemeName} from "./theme";

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface GameSettings {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    masterMuted: boolean;
    musicMuted: boolean;
    sfxMuted: boolean;
    graphicsQuality: GraphicsQuality;
    gameSpeed: number;
    theme: GameThemeName;
}

export interface SettingsManager {
    settings: GameSettings;
    listeners: Array<Function>;
    init: () => void;
    loadSettings: () => void;
    saveSettings: () => void;
    getSetting: (key: keyof GameSettings) => unknown;
    setSetting: (key: keyof GameSettings, value: unknown) => boolean;
    getAll: () => GameSettings;
    resetToDefaults: () => void;
    subscribe: (callback: Function) => void;
    unsubscribe: (callback: Function) => void;
    notifyListeners: () => void;
    getVolume: () => number;
    setVolume: (value: number) => void;
    getGraphicsQuality: () => GraphicsQuality;
    setGraphicsQuality: (quality: GraphicsQuality) => void;
    getGameSpeed: () => number;
    setGameSpeed: (speed: number) => void;
    getTheme: () => GameThemeName;
    setTheme: (theme: GameThemeName) => void;
}

export type SettingSection = HTMLDivElement & {
    controls: HTMLDivElement;
    volumeSlider: HTMLInputElement;
    volumeValue: HTMLSpanElement;
    graphicsButtons: HTMLButtonElement[];
    speedSlider: HTMLInputElement;
    speedValue: HTMLSpanElement;
    themeButtons: HTMLButtonElement[];
};

export interface SettingsMenu {
    root: HTMLDivElement;
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClose(callback: () => void): void;
    onReset(callback: () => void): void;
    onVolumeChange(callback: (value: number) => void): void;
    onGraphicsChange(callback: (value: GraphicsQuality) => void): void;
    onThemeChange(callback: (value: GameThemeName) => void): void;
    onGameSpeedChange(callback: (value: number) => void): void;
}