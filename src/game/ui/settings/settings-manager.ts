import {GAME_SETTINGS_CONFIG, GAME_SETTINGS_STORAGE_KEY} from "../../../constants/settings";
import {getGameThemeNames} from "../../themes/game-theme";
import {clampValue} from "../../../utils/clampValue";
import type {GameThemeName} from "../../../types/theme";
import type {GameSettings, GraphicsQuality, SettingsManager} from "../../../types/settings-types";

export function createSettingsManager(): SettingsManager {
    const STORAGE_KEY: string = GAME_SETTINGS_STORAGE_KEY;
    const defaultSettings: GameSettings = GAME_SETTINGS_CONFIG;
    const cloneDefaultSettings: () => GameSettings = (): GameSettings => ({...defaultSettings});

    const validThemes: GameThemeName[] = getGameThemeNames();
    const validGraphicsQualities: Set<GraphicsQuality> = new Set(['low', 'medium', 'high']);

    function normalizeSettings(value: unknown): GameSettings {
        const parsed = value && typeof value === 'object'
            ? value as Partial<Record<keyof GameSettings, unknown>>
            : {};
        const masterVolume: number = typeof parsed.masterVolume === 'number'
            ? clampValue(parsed.masterVolume, 0, 1)
            : defaultSettings.masterVolume;
        const musicVolume: number = typeof parsed.musicVolume === 'number'
            ? clampValue(parsed.musicVolume, 0, 1)
            : masterVolume * 0.85;
        const sfxVolume: number = typeof parsed.sfxVolume === 'number'
            ? clampValue(parsed.sfxVolume, 0, 1)
            : masterVolume;
        const graphicsQuality: GraphicsQuality = validGraphicsQualities.has(
            parsed.graphicsQuality as GraphicsQuality
        ) ? parsed.graphicsQuality as GraphicsQuality : defaultSettings.graphicsQuality;
        const gameSpeed: number = typeof parsed.gameSpeed === 'number'
            ? clampValue(parsed.gameSpeed, 0.5, 2)
            : defaultSettings.gameSpeed;
        const theme: GameThemeName = validThemes.includes(parsed.theme as GameThemeName)
            ? parsed.theme as GameThemeName
            : defaultSettings.theme;

        return {
            masterVolume,
            musicVolume,
            sfxVolume,
            masterMuted: typeof parsed.masterMuted === 'boolean'
                ? parsed.masterMuted : defaultSettings.masterMuted,
            musicMuted: typeof parsed.musicMuted === 'boolean'
                ? parsed.musicMuted : defaultSettings.musicMuted,
            sfxMuted: typeof parsed.sfxMuted === 'boolean'
                ? parsed.sfxMuted : defaultSettings.sfxMuted,
            graphicsQuality,
            gameSpeed,
            theme
        };
    }

    const manager: SettingsManager = {
        settings: {
            masterVolume: 0,
            musicVolume: 0,
            sfxVolume: 0,
            masterMuted: false,
            musicMuted: false,
            sfxMuted: false,
            graphicsQuality: "low",
            gameSpeed: 0,
            theme: "default"
        },
        listeners: [],

        init: function (): void {
            this.loadSettings();
        },

        loadSettings: function (): void {
            const stored: string | null = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    this.settings = normalizeSettings(JSON.parse(stored));
                } catch (error) {
                    console.warn('Unable to parse saved settings; using defaults.', error);
                    this.settings = cloneDefaultSettings();
                }
            } else {
                this.settings = cloneDefaultSettings();
            }
        },

        saveSettings: function (): void {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
                this.notifyListeners();
            } catch (e) {
                console.error('couldnt save settings :(', e);
            }
        },

        getSetting<K extends keyof GameSettings>(key: K): GameSettings[K] {
            return this.settings[key];
        },

        setSetting: function (key: keyof GameSettings, value: unknown): boolean {
            if (Object.hasOwn(this.settings, key)) {
                this.settings = normalizeSettings({...this.settings, [key]: value});
                this.saveSettings();
                return true;
            }
            return false;
        },

        getAll: function (): GameSettings {
            return {...this.settings};
        },

        resetToDefaults: function (): void {
            this.settings = cloneDefaultSettings();
            this.saveSettings();
        },

        // Observer pattern for settings changes
        subscribe: function (callback: Function): void {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        },

        unsubscribe: function (callback: Function): void {
            this.listeners = this.listeners.filter(function (listener: Function): boolean {
                return listener !== callback;
            });
        },

        notifyListeners: function (): void {
            const settings: GameSettings = this.settings;
            this.listeners.forEach(function (callback: Function): void {
                callback(settings);
            });
        },

        // Helper methods for specific settings
        getVolume: function (): number {
            return this.settings.masterVolume;
        },

        setVolume: function (value: number): void {
            value = clampValue(
                value,
                0,
                1
            );
            this.settings.masterVolume = value;
            this.settings.musicVolume = value * 0.85;
            this.settings.sfxVolume = value;
            this.saveSettings();
        },

        getGraphicsQuality: function (): GraphicsQuality {
            return this.settings.graphicsQuality;
        },

        setGraphicsQuality: function (quality: GraphicsQuality): void {
            if (validGraphicsQualities.has(quality)) {
                this.settings.graphicsQuality = quality;
                this.saveSettings();
            }
        },
        
        getGameSpeed: function(): number {
            return this.settings.gameSpeed;
        },
        
        setGameSpeed: function(speed: number): void {
            speed = clampValue(
                speed,
                0.5,
                2.0
            );
            this.settings.gameSpeed = speed;
            this.saveSettings();
        },

        getTheme: function(): GameThemeName {
            return this.settings.theme;
        },

        setTheme: function(theme: GameThemeName): void {
            if (validThemes.includes(theme)) {
                this.settings.theme = theme;
                this.saveSettings();
            }
        }
    };
    
    manager.init();
    return manager;
}
