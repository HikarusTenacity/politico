// Settings Manager for game configuration
import {GAME_SETTINGS_CONFIG, GAME_SETTINGS_STORAGE_KEY} from "../../../constants/settings";
import {GameSettings, SettingsManager} from "../../../types/settings-types";
import {getGameThemeNames} from "../../themes/game-theme";

function createSettingsManager() {
    const STORAGE_KEY: string = GAME_SETTINGS_STORAGE_KEY;
    const defaultSettings: GameSettings = GAME_SETTINGS_CONFIG;
    const cloneDefaultSettings: () => GameSettings = function(): GameSettings {
        return {...defaultSettings};
    };
    const validThemes = getGameThemeNames();
    
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
            theme: ""
        },
        listeners: [],
        
        init: function() {
            this.loadSettings();
        },
        
        loadSettings: function(): void {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    this.settings = cloneDefaultSettings();
                    if (parsed && typeof parsed === 'object') {
                        Object.keys(defaultSettings).forEach(function(key) {
                            if (Object.prototype.hasOwnProperty.call(parsed, key)) {
                                this.settings[key] = parsed[key];
                            }
                        }, this);
                        if (!validThemes.includes(this.settings.theme)) {
                            this.settings.theme = defaultSettings.theme;
                        }
                    }
                } catch (e) {
                    console.warn('cant parse settings, defaulting :/', e);
                    this.settings = cloneDefaultSettings();
                }
            } else {
                this.settings = cloneDefaultSettings();
            }
        },
        
        saveSettings: function() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
                this.notifyListeners();
            } catch (e) {
                console.error('couldnt save settings :(', e);
            }
        },
        
        getSetting: function(key) {
            return this.settings[key];
        },
        
        setSetting: function(key, value) {
            if (this.settings.hasOwnProperty(key)) {
                this.settings[key] = value;
                this.saveSettings();
                return true;
            }
            return false;
        },
        
        getAll: function() {
            return Object.assign({}, this.settings);
        },
        
        resetToDefaults: function() {
            this.settings = cloneDefaultSettings();
            this.saveSettings();
        },
        
        // Observer pattern for settings changes
        subscribe: function(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        },
        
        unsubscribe: function(callback) {
            this.listeners = this.listeners.filter(function(listener) {
                return listener !== callback;
            });
        },
        
        notifyListeners: function() {
            var settings = this.settings;
            this.listeners.forEach(function(callback) {
                callback(settings);
            });
        },
        
        // Helper methods for specific settings
        getVolume: function() {
            return this.settings.volume;
        },
        
        setVolume: function(value) {
            value = Math.max(0, Math.min(1, value));
            this.settings.volume = value;
            this.settings.musicVolume = value * 0.85;
            this.settings.sfxVolume = value * 1.0;
            this.saveSettings();
        },
        
        getGraphicsQuality: function() {
            return this.settings.graphicsQuality;
        },
        
        setGraphicsQuality: function(quality) {
            var validQualities = ['low', 'medium', 'high'];
            if (validQualities.indexOf(quality) !== -1) {
                this.settings.graphicsQuality = quality;
                this.saveSettings();
            }
        },
        
        getGameSpeed: function() {
            return this.settings.gameSpeed;
        },
        
        setGameSpeed: function(speed) {
            speed = Math.max(0.5, Math.min(2.0, speed));
            this.settings.gameSpeed = speed;
            this.saveSettings();
        },

        getTheme: function() {
            return this.settings.theme;
        },

        setTheme: function(theme) {
            if (validThemes.indexOf(theme) !== -1) {
                this.settings.theme = theme;
                this.saveSettings();
            }
        }
    };
    
    manager.init();
    return manager;
}
