import {GameSettings} from "../types/settings-types";



export const GAME_SETTINGS_STORAGE_KEY: string = 'politico-settings';
export const GAME_SETTINGS_CONFIG: GameSettings = {
    masterVolume: 0.7,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    masterMuted: false,
    musicMuted: false,
    sfxMuted: false,
    graphicsQuality: 'high',
    gameSpeed: 1.0,
    theme: 'default'
};