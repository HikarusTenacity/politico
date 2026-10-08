export interface GameSettings {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    masterMuted: boolean;
    musicMuted: boolean;
    sfxMuted: boolean;
    graphicsQuality: 'low' | 'medium' | 'high';
    gameSpeed: number;
    theme: string;
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
    getGraphicsQuality: () => 'low' | 'medium' | 'high';
    setGraphicsQuality: (quality: 'low' | 'medium' | 'high') => void;
    getGameSpeed: () => number;
    setGameSpeed: (speed: number) => void;
}