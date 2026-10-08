export type GameThemeName = 'default' | 'colorblind' | 'monochrome';

export type ThemeButtonColor = 'green' | 'blue' | 'orange' | 'red';

export type DebugStatsThemeName = 'neon' | 'terminal' | 'sunset';

export interface GameTheme {
    name: GameThemeName;
    canvasFilter: string;
    debugStatsTheme: DebugStatsThemeName;
    cssVars: Record<string, string>;
    actionButtons: Record<ThemeButtonColor, {
        bg: string;
        border: string;
        shadow: string;
        text: string;
    }>;
    titleButtons: {
        startBg: string;
        startBorder: string;
        settingsBg: string;
        settingsBorder: string;
        creditsBg: string;
        creditsBorder: string;
    };
    visuals: {
        sky: {
            skyColor: number;
            fogColor: number;
            sunColor: number;
        };
        environment: {
            groundColor: number;
            sunlightColor: number;
            skyLightColor: number;
            treeTrunkColor: number;
            treeFoliageColor: number;
            mountainColor: number;
            snowColor: number;
            cloudColor: number;
            boardSpaceColor: number;
            boardGridColor: number;
        };
        playerFallbackColors: string[];
    };
    debugStatsColors: {
        fps: string;
        frameTime: string;
        maxFrameTime: string;
        drawCalls: string;
        triangles: string;
        geometries: string;
        textures: string;
        gameState: string;
        playerFallback: string;
    };
}
