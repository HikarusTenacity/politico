import type {DebugSample, FpsSampler} from "../types/debug-types";

export function createFpsSampler(sampleWindowMs: number = 1000): FpsSampler {
    const windowMs: number = sampleWindowMs;
    let lastFrameTime: number = performance.now(),
        lastSample: number = lastFrameTime,
        frameCount: number = 0,
        fps: number        = 0,
        frameMs: number    = 0,
        maxFrameMs: number = 0;

    return {
        tick: function(now: number): DebugSample | null {
            frameCount++;

            frameMs = now - lastFrameTime;
            lastFrameTime = now;
            if (frameMs > maxFrameMs) maxFrameMs = frameMs;

            const elapsed: number = now - lastSample;
            if (elapsed < windowMs) return null;

            fps = Math.floor((frameCount * sampleWindowMs) / elapsed);

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
