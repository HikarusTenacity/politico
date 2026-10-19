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