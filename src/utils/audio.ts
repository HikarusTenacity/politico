import { clampValue } from './clampValue';

export function applyMasterVolume(volume: number): void {
    const vol: number = clampValue(
        volume,
        0,
        1
    );
    const mediaNodes = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
    for (const element of mediaNodes) {
        element.volume = vol;
    }
    (window as any).__GAME_MASTER_VOLUME__ = vol;
}