function escapeDebugHtml(value: unknown) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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

function setDebugStatsTheme(themeName: string) {
    const getGameTheme = (window as any).getGameTheme;
    if (!getGameTheme) return false;

    const theme = getGameTheme(themeName);
    if (theme?.debugStatsColors) {
        activeDebugStatsTheme = theme.debugStatsColors;
        return true;
    }

    return false;
}

function getDebugPlayerColor(
    player?: { name: string, color?: number | string }
) {
    if (!player) return activeDebugStatsTheme.playerFallback;

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

function formatDebugStatsColored(sample: DebugSample, debugInfo: DebugInfo) {
    let lines: string[] = [];
    const theme = activeDebugStatsTheme;

    lines.push(`FPS: ${debugValueSpan(sample.fps, theme.fps)}`);
    lines.push(`FT: ${debugValueSpan(sample.frameMs.toFixed(1) + 'ms', theme.frameTime)} / ${debugValueSpan(sample.maxFrameMs.toFixed(1) + 'ms', theme.maxFrameTime)}`);

    if (debugInfo?.renderer?.info) {
        const renderInfo = debugInfo.renderer.info.render;
        const memInfo = debugInfo.renderer.info.memory;

        lines.push(`DC: ${debugValueSpan(renderInfo.calls, theme.drawCalls)} TRI: ${debugValueSpan(renderInfo.triangles, theme.triangles)}`);
        lines.push(`GEO: ${debugValueSpan(memInfo.geometries, theme.geometries)} TEX: ${debugValueSpan(memInfo.textures, theme.textures)}`);
    }

    if (debugInfo?.gameManager) {
        const gm = debugInfo?.gameManager;
        const currentPlayer = gm?.getCurrentPlayer?.();
        const playerName = currentPlayer?.name ?? 'N/A';
        const playerColor = getDebugPlayerColor(currentPlayer);

        lines.push(`GAMESTATE: ${debugValueSpan(gm.gameState, theme.gameState)}`);
        lines.push(`PLAYER: ${debugValueSpan(playerName, playerColor)}`);
    }

    return lines.join('\n');
}
