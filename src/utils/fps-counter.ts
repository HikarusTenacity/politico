import {createFpsSampler} from "./fps-sampler";
import type {DebugInfo, DebugSample, FpsSampler} from "../types/debug-types";
import {formatDebugStatsColored} from "./debug-stats-formatter";

export function createFpsCounter(): {
    update: (debugInfo: DebugInfo) => void
} {
    let fpsCounter: HTMLDivElement = document.createElement('div');
    fpsCounter.textContent = 'FPS: --';
    fpsCounter.style.cssText = `
        position: fixed;
        right: 8px;
        bottom: 50%;
        z-index: 999;
        pointer-events: none;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.2;
        white-space: pre;
        text-align: right;
        color: #e8e8e8;
        text-shadow: 1px 1px 0 var(--theme-fps-shadow, #000);
    `;
    document.body.appendChild(fpsCounter);

    const sampler: FpsSampler = createFpsSampler(1000);

    return {
        update: function(debugInfo: DebugInfo): void {
            fpsCounter.style.color = 'var(--theme-fps-text, #e8e8e8)';

            const now: number = performance.now();
            const sample: DebugSample | null = sampler.tick(now);
            if (!sample) return;

            fpsCounter.innerHTML = formatDebugStatsColored(sample, debugInfo);
        }
    };
}
