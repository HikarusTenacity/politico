import {afterEach, describe, expect, it, vi} from 'vitest';
import {createFpsSampler} from "../src/utils/fps-sampler";

describe('createFpsSampler', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    it('does not emit a sample before the sample window', (): void => {
        vi.spyOn(performance, 'now').mockReturnValue(0);
        const sampler = createFpsSampler(1000);
        expect(sampler.tick(100)).toBeNull();
        expect(sampler.tick(999)).toBeNull();
    });

    it('emits fps and timing data once window threshold is crossed', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0);
        const sampler = createFpsSampler(1000);
        sampler.tick(500);
        const sample = sampler.tick(1000);

        expect(sample).not.toBeNull();
        expect(sample.fps).toBe(2);
        expect(sample.frameMs).toBe(500);
        expect(sample.maxFrameMs).toBe(500);
    });
});
