export interface DebugSample {
    fps: number;
    frameMs: number;
    maxFrameMs: number;
}

export interface RenderStats {
    calls: number;
    triangles: number;
    geometries: number;
    textures: number;
}

export interface PlayerDebugSummary {
    name: string;
    color?: number | string;
}

export interface GameManagerDebugInfo {
    gameState: string;
    getCurrentPlayer?(): PlayerDebugSummary | null;
}

export interface DebugInfo {
    renderStats?: RenderStats;
    gameManager?: GameManagerDebugInfo;
    fps?: number;
}

export interface DebugTheme {
    fps: string;
    frameTime: string;
    maxFrameTime: string;
    drawCalls: string;
    triangles: string;
    geometries: string;
    textures: string;
    gameState: string;
    playerFallback: string;
}