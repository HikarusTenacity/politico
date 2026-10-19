import { beforeEach, describe, expect, it, vi } from 'vitest';
import {createSettingsManager} from "../src/game/ui/settings/settings-manager";

const STORAGE_KEY = 'politico-settings';

function createLocalStorageMock(): Storage {
    const values = new Map<string, string>();

    return {
        getItem: (key: string): string | null => values.get(key) ?? null,
        setItem: (key: string, value: string): void => {
            values.set(key, value);
        },
        removeItem: (key: string): void => {
            values.delete(key);
        },
        clear: (): void => {
            values.clear();
        },
        key: (index: number): string | null => [...values.keys()][index] ?? null,
        get length(): number {
            return values.size;
        }
    };
}

describe('settings manager', (): void => {
    beforeEach((): void => {
        vi.stubGlobal('localStorage', createLocalStorageMock());
    });

    it('loads default settings when storage is empty', (): void => {
        const manager = createSettingsManager();

        expect(manager.getSetting('masterVolume')).toBe(0.7);
        expect(manager.getSetting('graphicsQuality')).toBe('high');
        expect(manager.getSetting('gameSpeed')).toBe(1.0);
        expect(manager.getSetting('theme')).toBe('default');
    });

    it('falls back to defaults when stored JSON is invalid', (): void => {
        localStorage.setItem(STORAGE_KEY, '{bad json');
        const manager = createSettingsManager();

        expect(manager.getSetting('masterVolume')).toBe(0.7);
        expect(manager.getSetting('gameSpeed')).toBe(1.0);
    });

    it('normalizes invalid stored values', (): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            masterVolume: 2,
            musicVolume: -1,
            gameSpeed: 5,
            graphicsQuality: 'ultra',
            theme: 'unknown',
            masterMuted: 'yes'
        }));
        const manager = createSettingsManager();

        expect(manager.getSetting('masterVolume')).toBe(1);
        expect(manager.getSetting('musicVolume')).toBe(0);
        expect(manager.getSetting('gameSpeed')).toBe(2);
        expect(manager.getSetting('graphicsQuality')).toBe('high');
        expect(manager.getSetting('theme')).toBe('default');
        expect(manager.getSetting('masterMuted')).toBe(false);
    });

    it('clamps master volume and derives music and sfx values', (): void => {
        const manager = createSettingsManager();

        manager.setVolume(2);
        expect(manager.getSetting('masterVolume')).toBe(1);
        expect(manager.getSetting('musicVolume')).toBe(0.85);
        expect(manager.getSetting('sfxVolume')).toBe(1);

        manager.setVolume(-1);
        expect(manager.getSetting('masterVolume')).toBe(0);
    });

    it('accepts valid graphics quality values and rejects invalid runtime values', (): void => {
        const manager = createSettingsManager();

        manager.setGraphicsQuality('medium');
        expect(manager.getGraphicsQuality()).toBe('medium');

        manager.setGraphicsQuality('ultra' as 'low');
        expect(manager.getGraphicsQuality()).toBe('medium');
    });

    it('clamps game speed to the allowed range', (): void => {
        const manager = createSettingsManager();

        manager.setGameSpeed(5);
        expect(manager.getGameSpeed()).toBe(2.0);

        manager.setGameSpeed(0.1);
        expect(manager.getGameSpeed()).toBe(0.5);
    });

    it('notifies subscribers on change and can unsubscribe', (): void => {
        const manager = createSettingsManager();
        let callCount = 0;
        const callback = (): void => {
            callCount++;
        };

        manager.subscribe(callback);
        manager.setSetting('masterVolume', 0.8);
        expect(callCount).toBe(1);

        manager.unsubscribe(callback);
        manager.setSetting('masterVolume', 0.6);
        expect(callCount).toBe(1);
    });

    it('saves settings to localStorage', (): void => {
        const manager = createSettingsManager();

        manager.setGameSpeed(1.2);

        const saved = localStorage.getItem(STORAGE_KEY);
        expect(saved).toBeTruthy();
        expect(saved).toContain('"gameSpeed":1.2');
    });
});
