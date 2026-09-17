export function createFpsCounter() {
    let fpsCounter = document.createElement('div');
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

    const sampler = createFpsSampler(1000);

    return {
        update: function(debugInfo: any) {
            fpsCounter.style.color = 'var(--theme-fps-text, #e8e8e8)';

            const now = performance.now();
            const sample = sampler.tick(now);
            if (!sample) return;

            if (typeof formatDebugStatsColored === 'function') {
                fpsCounter.innerHTML = formatDebugStatsColored(sample, debugInfo);
            } else {
                fpsCounter.textContent = 'FPS: ' + sample.fps + '\n' +
                                         'FT: ' + sample.frameMs.toFixed(1) + 'ms';
            }
        }
    };
}
