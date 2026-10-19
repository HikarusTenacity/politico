import type {
    DebugInfo,
    DebugSample,
    DebugTheme,
    GameManagerDebugInfo,
    PlayerDebugSummary
} from '../types/debug-types';

function escapeDebugHtml(value: unknown) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function debugValueSpan(value: unknown, color: string) {
    return '<span style="color: ' + color + ';">' + escapeDebugHtml(value) + '</span>';
}
    
let activeDebugStatsTheme: DebugTheme = {
    fps: '#00E5FF',
    frameTime: '#39FF14',
    maxFrameTime: '#FF006E',
    drawCalls: '#FCEE0A',
    triangles: '#FF9F1C',
    geometries: '#8A2BE2',
    textures: '#FF4F81',
    gameState: '#00B0FF',
    playerFallback: '#B388FF'
};

export function setDebugStatsTheme(themeName: string): boolean {
    const getGameTheme = (window as any).getGameTheme;
    if (!getGameTheme) return false;

    const theme = getGameTheme(themeName);
    if (theme?.debugStatsColors) {
        activeDebugStatsTheme = theme.debugStatsColors;
        return true;
    }

    return false;
}

function getDebugPlayerColor(player: PlayerDebugSummary | null | undefined): string {
    if (!player) return activeDebugStatsTheme.playerFallback;

    //idfk gemini did this
    if (typeof player.color === 'number') {
        const hex = player.color.toString(16).padStart(6, '0');
        return '#' + hex;
    }

    if (typeof player.color === 'string') {
        const trimmed = player.color.trim();
        if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed) ||
            /^[a-zA-Z]+$/.test(trimmed)) {
            return trimmed;
        }
    }

    return activeDebugStatsTheme.playerFallback;
}

export function formatDebugStatsColored(sample: DebugSample, debugInfo: DebugInfo): string {
    let lines: string[] = [];
    const theme: DebugTheme = activeDebugStatsTheme;

    lines.push(`FPS: ${debugValueSpan(sample.fps, theme.fps)}`);
    lines.push(`FT: ${debugValueSpan(sample.frameMs.toFixed(1) + 'ms', theme.frameTime)} / ${debugValueSpan(sample.maxFrameMs.toFixed(1) + 'ms', theme.maxFrameTime)}`); //NOSONAR

    if (debugInfo.renderStats) {
        const renderStats = debugInfo.renderStats;

        lines.push(
            `DC: ${debugValueSpan(renderStats.calls, theme.drawCalls)} 
            TRI: ${debugValueSpan(renderStats.triangles, theme.triangles)}`,
            `GEO: ${debugValueSpan(renderStats.geometries, theme.geometries)} 
            TEX: ${debugValueSpan(renderStats.textures, theme.textures)}`
        );
    }

    if (debugInfo?.gameManager) {
        const gameManager: GameManagerDebugInfo = debugInfo?.gameManager;
        const currentPlayer: PlayerDebugSummary | null | undefined = gameManager?.getCurrentPlayer?.();
        const playerName: string = currentPlayer?.name ?? 'N/A';
        const playerColor: string = getDebugPlayerColor(currentPlayer);

        lines.push(
            `GAMESTATE: ${debugValueSpan(gameManager.gameState, theme.gameState)}`,
            `PLAYER: ${debugValueSpan(playerName, playerColor)}`
        );
    }

    return lines.join('\n');
}
