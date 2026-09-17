export function createFpsSampler(sampleWindowMs: number = 1000) {
    const windowMs = sampleWindowMs;
    let lastFrameTime = performance.now();
    let lastSample = lastFrameTime;
    let frameCount = 0, fps = 0, frameMs = 0, maxFrameMs = 0;

    return {
        tick: function(now: number) {
            frameCount++;

            frameMs = now - lastFrameTime;
            lastFrameTime = now;
            if (frameMs > maxFrameMs) maxFrameMs = frameMs;

            const elapsed = now - lastSample;
            if (elapsed < windowMs) return null;

            fps = Math.floor((frameCount * 1000) / elapsed);

            frameCount = 0;
            lastSample = now;

            return {
                fps: fps,
                frameMs: frameMs,
                maxFrameMs: maxFrameMs
            };
        }
    };
}
