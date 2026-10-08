import {GameTheme, GameThemeName} from "../../types/theme";

export const GAME_THEME_PRESETS: Record<GameThemeName, GameTheme> = {
    default: {
        name: 'default',
        canvasFilter: 'none',
        debugStatsTheme: 'neon',
        cssVars: { //FIXME chatgpt generated random colors i need to make them not hardcoded when my brain isnt fried
            '--game-canvas-filter': 'none',
            '--theme-info-bg': 'rgba(0, 0, 0, 0.7)',
            '--theme-info-text': '#00ff00',
            '--theme-info-border': '#00ff00',
            '--theme-panel-bg': 'rgba(11, 24, 47, 0.96)',
            '--theme-panel-border': '#f5d080',
            '--theme-panel-text': '#f8f5e9',
            '--theme-panel-shadow': '0 16px 50px rgba(0, 0, 0, 0.6)',
            '--theme-title-screen-bg': 'linear-gradient(160deg, #101e3e 0%, #0f2f4a 45%, #153b2b 100%)',
            '--theme-title-screen-text': '#f8f5e9',
            '--theme-title-logo-shadow': '0 3px 0 #112647, 0 7px 16px rgba(0, 0, 0, 0.65)',
            '--theme-button-text': '#fff9e1',
            '--theme-button-border': '#7a3f09',
            '--theme-button-shadow': '0 7px 0 #582b07, 0 18px 35px rgba(0, 0, 0, 0.45)',
            '--theme-button-bg': 'linear-gradient(180deg, #f8a53f 0%, #d67a15 100%)',
            '--theme-button-selected-bg': 'linear-gradient(180deg, #FFD700, #FFA500)',
            '--theme-button-selected-border': '#4A2511',
            '--theme-button-selected-text': '#8B4513',
            '--theme-action-green-bg': 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)',
            '--theme-action-green-border': '#2d6b2f',
            '--theme-action-green-shadow': '#1e4620',
            '--theme-action-blue-bg': 'linear-gradient(180deg, #2196F3 0%, #1976D2 100%)',
            '--theme-action-blue-border': '#0d47a1',
            '--theme-action-blue-shadow': '#0a3270',
            '--theme-action-orange-bg': 'linear-gradient(180deg, #FF9800 0%, #F57C00 100%)',
            '--theme-action-orange-border': '#E65100',
            '--theme-action-orange-shadow': '#bf360c',
            '--theme-action-red-bg': 'linear-gradient(180deg, #f44336 0%, #d32f2f 100%)',
            '--theme-action-red-border': '#b71c1c',
            '--theme-action-red-shadow': '#7f0000',
            '--theme-title-start-bg': 'linear-gradient(180deg, #FFE4B5, #FFB347)',
            '--theme-title-start-border': '#8B4513',
            '--theme-title-settings-bg': 'linear-gradient(180deg, #8b95e8 0%, #5b6fc9 100%)',
            '--theme-title-settings-border': '#3d4799',
            '--theme-title-credits-bg': 'linear-gradient(180deg, #7ac18f 0%, #46895f 100%)',
            '--theme-title-credits-border': '#2f6043',
            '--theme-canvas-filter': 'none'
        },
        actionButtons: {
            green: { bg: 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)', border: '#2d6b2f', shadow: '#1e4620', text: '#ffffff' },
            blue: { bg: 'linear-gradient(180deg, #2196F3 0%, #1976D2 100%)', border: '#0d47a1', shadow: '#0a3270', text: '#ffffff' },
            orange: { bg: 'linear-gradient(180deg, #FF9800 0%, #F57C00 100%)', border: '#E65100', shadow: '#bf360c', text: '#ffffff' },
            red: { bg: 'linear-gradient(180deg, #f44336 0%, #d32f2f 100%)', border: '#b71c1c', shadow: '#7f0000', text: '#ffffff' }
        },
        titleButtons: {
            startBg: 'linear-gradient(180deg, #FFE4B5, #FFB347)',
            startBorder: '#8B4513',
            settingsBg: 'linear-gradient(180deg, #8b95e8 0%, #5b6fc9 100%)',
            settingsBorder: '#3d4799',
            creditsBg: 'linear-gradient(180deg, #7ac18f 0%, #46895f 100%)',
            creditsBorder: '#2f6043'
        },
        visuals: {
            sky: {
                skyColor: 0x87ceeb,
                fogColor: 0x5a7a9e,
                sunColor: 0xffff00
            },
            environment: {
                groundColor: 0x4CAF50,
                sunlightColor: 0xfff8dc,
                skyLightColor: 0x87ceeb,
                treeTrunkColor: 0x4d2600,
                treeFoliageColor: 0x1a5f1a,
                mountainColor: 0x808080,
                snowColor: 0xffffff,
                cloudColor: 0xffffff,
                boardSpaceColor: 0x4CAF50,
                boardGridColor: 0xffffff
            },
            playerFallbackColors: ['red', 'green', 'blue', 'yellow']
        },
        debugStatsColors: {
            fps: '#00E5FF',
            frameTime: '#39FF14',
            maxFrameTime: '#FF006E',
            drawCalls: '#FCEE0A',
            triangles: '#FF9F1C',
            geometries: '#8A2BE2',
            textures: '#FF4F81',
            gameState: '#00B0FF',
            playerFallback: '#B388FF'
        }
    },
    colorblind: {
        name: 'colorblind',
        canvasFilter: 'none',
        debugStatsTheme: 'sunset',
        cssVars: {
            '--game-canvas-filter': 'none',
            '--theme-info-bg': 'rgba(16, 24, 42, 0.78)',
            '--theme-info-text': '#f4f6ff',
            '--theme-info-border': '#ffb000',
            '--theme-panel-bg': 'linear-gradient(165deg, rgba(18, 25, 48, 0.96), rgba(14, 42, 66, 0.96))',
            '--theme-panel-border': '#ffb000',
            '--theme-panel-text': '#f7fbff',
            '--theme-panel-shadow': '0 16px 50px rgba(0, 0, 0, 0.7)',
            '--theme-title-screen-bg': 'linear-gradient(140deg, #11213f 0%, #0f3d56 46%, #17324e 100%)',
            '--theme-title-screen-text': '#f7fbff',
            '--theme-title-logo-shadow': '0 3px 0 #0b1730, 0 7px 16px rgba(0, 0, 0, 0.72)',
            '--theme-button-text': '#ffffff',
            '--theme-button-border': '#1c4f88',
            '--theme-button-shadow': '0 7px 0 #16395f, 0 18px 35px rgba(0, 0, 0, 0.45)',
            '--theme-button-bg': 'linear-gradient(180deg, #5ab0ff 0%, #2b7bd3 100%)',
            '--theme-button-selected-bg': 'linear-gradient(180deg, #ffd166, #ff9f1c)',
            '--theme-button-selected-border': '#7a4f0f',
            '--theme-button-selected-text': '#1f2430',
            '--theme-action-green-bg': 'linear-gradient(180deg, #1aa7ec 0%, #0b78c7 100%)',
            '--theme-action-green-border': '#064a7a',
            '--theme-action-green-shadow': '#05375a',
            '--theme-action-blue-bg': 'linear-gradient(180deg, #7b61ff 0%, #5140c7 100%)',
            '--theme-action-blue-border': '#2c2a84',
            '--theme-action-blue-shadow': '#201e5f',
            '--theme-action-orange-bg': 'linear-gradient(180deg, #ffb000 0%, #d98600 100%)',
            '--theme-action-orange-border': '#915b00',
            '--theme-action-orange-shadow': '#6a4300',
            '--theme-action-red-bg': 'linear-gradient(180deg, #f95f62 0%, #c73649 100%)',
            '--theme-action-red-border': '#7b2130',
            '--theme-action-red-shadow': '#571723',
            '--theme-title-start-bg': 'linear-gradient(180deg, #f0f3ff, #bcc6ff)',
            '--theme-title-start-border': '#5461aa',
            '--theme-title-settings-bg': 'linear-gradient(180deg, #7b61ff 0%, #5140c7 100%)',
            '--theme-title-settings-border': '#2c2a84',
            '--theme-title-credits-bg': 'linear-gradient(180deg, #1aa7ec 0%, #0b78c7 100%)',
            '--theme-title-credits-border': '#064a7a',
            '--theme-canvas-filter': 'none'
        },
        actionButtons: {
            green: { bg: 'linear-gradient(180deg, #1aa7ec 0%, #0b78c7 100%)', border: '#064a7a', shadow: '#05375a', text: '#ffffff' },
            blue: { bg: 'linear-gradient(180deg, #7b61ff 0%, #5140c7 100%)', border: '#2c2a84', shadow: '#201e5f', text: '#ffffff' },
            orange: { bg: 'linear-gradient(180deg, #ffb000 0%, #d98600 100%)', border: '#915b00', shadow: '#6a4300', text: '#1f2430' },
            red: { bg: 'linear-gradient(180deg, #f95f62 0%, #c73649 100%)', border: '#7b2130', shadow: '#571723', text: '#ffffff' }
        },
        titleButtons: {
            startBg: 'linear-gradient(180deg, #f0f3ff, #bcc6ff)',
            startBorder: '#5461aa',
            settingsBg: 'linear-gradient(180deg, #7b61ff 0%, #5140c7 100%)',
            settingsBorder: '#2c2a84',
            creditsBg: 'linear-gradient(180deg, #1aa7ec 0%, #0b78c7 100%)',
            creditsBorder: '#064a7a'
        },
        visuals: {
            sky: {
                skyColor: 0x2b385f,
                fogColor: 0x24324e,
                sunColor: 0xffd166
            },
            environment: {
                groundColor: 0x4f7651,
                sunlightColor: 0xfff2cc,
                skyLightColor: 0x7bb7ff,
                treeTrunkColor: 0x5f4b32,
                treeFoliageColor: 0x5b7a3b,
                mountainColor: 0x71788f,
                snowColor: 0xf3f7ff,
                cloudColor: 0xf8fbff,
                boardSpaceColor: 0x34c3ff,
                boardGridColor: 0xffffff
            },
            playerFallbackColors: ['#0072B2', '#E69F00', '#CC79A7', '#009E73']
        },
        debugStatsColors: {
            fps: '#FFB347',
            frameTime: '#FF8C42',
            maxFrameTime: '#E63946',
            drawCalls: '#F4A261',
            triangles: '#FFD166',
            geometries: '#6D597A',
            textures: '#B56576',
            gameState: '#355070',
            playerFallback: '#6D597A'
        }
    },
    monochrome: {
        name: 'monochrome',
        canvasFilter: 'grayscale(1) contrast(1.15)',
        debugStatsTheme: 'terminal',
        cssVars: {
            '--game-canvas-filter': 'grayscale(1) contrast(1.15)',
            '--theme-info-bg': 'rgba(20, 20, 20, 0.82)',
            '--theme-info-text': '#f2f2f2',
            '--theme-info-border': '#d0d0d0',
            '--theme-panel-bg': 'linear-gradient(165deg, rgba(18, 18, 18, 0.96), rgba(40, 40, 40, 0.96))',
            '--theme-panel-border': '#d0d0d0',
            '--theme-panel-text': '#f5f5f5',
            '--theme-panel-shadow': '0 16px 50px rgba(0, 0, 0, 0.8)',
            '--theme-title-screen-bg': 'linear-gradient(160deg, #1b1b1b 0%, #2a2a2a 45%, #111111 100%)',
            '--theme-title-screen-text': '#f5f5f5',
            '--theme-title-logo-shadow': '0 3px 0 #000, 0 7px 16px rgba(0, 0, 0, 0.7)',
            '--theme-button-text': '#f5f5f5',
            '--theme-button-border': '#777',
            '--theme-button-shadow': '0 7px 0 #333, 0 18px 35px rgba(0, 0, 0, 0.45)',
            '--theme-button-bg': 'linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%)',
            '--theme-button-selected-bg': 'linear-gradient(180deg, #f0f0f0, #bdbdbd)',
            '--theme-button-selected-border': '#444',
            '--theme-button-selected-text': '#111',
            '--theme-action-green-bg': 'linear-gradient(180deg, #6a6a6a 0%, #444 100%)',
            '--theme-action-green-border': '#2e2e2e',
            '--theme-action-green-shadow': '#151515',
            '--theme-action-blue-bg': 'linear-gradient(180deg, #7a7a7a 0%, #545454 100%)',
            '--theme-action-blue-border': '#2f2f2f',
            '--theme-action-blue-shadow': '#161616',
            '--theme-action-orange-bg': 'linear-gradient(180deg, #8a8a8a 0%, #666 100%)',
            '--theme-action-orange-border': '#333',
            '--theme-action-orange-shadow': '#111',
            '--theme-action-red-bg': 'linear-gradient(180deg, #9a9a9a 0%, #707070 100%)',
            '--theme-action-red-border': '#414141',
            '--theme-action-red-shadow': '#1b1b1b',
            '--theme-title-start-bg': 'linear-gradient(180deg, #f0f0f0, #bababa)',
            '--theme-title-start-border': '#555',
            '--theme-title-settings-bg': 'linear-gradient(180deg, #9d9d9d 0%, #6f6f6f 100%)',
            '--theme-title-settings-border': '#444',
            '--theme-title-credits-bg': 'linear-gradient(180deg, #c6c6c6 0%, #8f8f8f 100%)',
            '--theme-title-credits-border': '#555',
            '--theme-canvas-filter': 'grayscale(1) contrast(1.15)'
        },
        actionButtons: {
            green: { bg: 'linear-gradient(180deg, #6a6a6a 0%, #444 100%)', border: '#2e2e2e', shadow: '#151515', text: '#f5f5f5' },
            blue: { bg: 'linear-gradient(180deg, #7a7a7a 0%, #545454 100%)', border: '#2f2f2f', shadow: '#161616', text: '#f5f5f5' },
            orange: { bg: 'linear-gradient(180deg, #8a8a8a 0%, #666 100%)', border: '#333', shadow: '#111', text: '#f5f5f5' },
            red: { bg: 'linear-gradient(180deg, #9a9a9a 0%, #707070 100%)', border: '#414141', shadow: '#1b1b1b', text: '#f5f5f5' }
        },
        titleButtons: {
            startBg: 'linear-gradient(180deg, #f0f0f0, #bababa)',
            startBorder: '#555',
            settingsBg: 'linear-gradient(180deg, #9d9d9d 0%, #6f6f6f 100%)',
            settingsBorder: '#444',
            creditsBg: 'linear-gradient(180deg, #c6c6c6 0%, #8f8f8f 100%)',
            creditsBorder: '#555'
        },
        visuals: {
            sky: {
                skyColor: 0x2a2a2a,
                fogColor: 0x3a3a3a,
                sunColor: 0xe0e0e0
            },
            environment: {
                groundColor: 0x666666,
                sunlightColor: 0xe0e0e0,
                skyLightColor: 0xb0b0b0,
                treeTrunkColor: 0x666666,
                treeFoliageColor: 0x8a8a8a,
                mountainColor: 0x808080,
                snowColor: 0xf0f0f0,
                cloudColor: 0xe8e8e8,
                boardSpaceColor: 0xaaaaaa,
                boardGridColor: 0xf0f0f0
            },
            playerFallbackColors: ['#f0f0f0', '#d0d0d0', '#a0a0a0', '#707070']
        },
        debugStatsColors: {
            fps: '#4AF626',
            frameTime: '#4AF626',
            maxFrameTime: '#4AF626',
            drawCalls: '#4AF626',
            triangles: '#4AF626',
            geometries: '#4AF626',
            textures: '#4AF626',
            gameState: '#4AF626',
            playerFallback: '#4AF626'
        }
    }
};

let activeGameTheme: GameTheme = GAME_THEME_PRESETS.default;

function setThemeCssVars(theme: GameTheme) {
    const root = document.documentElement;
    const body = document.body;

    if (!root) return;

    root.dataset.gameTheme = theme.name;
    if (body) {
        body.dataset['data-game-theme'] = theme.name;
    }
    Object.keys(theme.cssVars).forEach(function(key: string): void {
        root.style.setProperty(
            key,
            theme.cssVars[key]
        );
    });
}

export function applyGameTheme(themeName: GameThemeName): GameTheme {
    const nextTheme: GameTheme = GAME_THEME_PRESETS[themeName] || GAME_THEME_PRESETS.default;
    activeGameTheme = nextTheme;
    setThemeCssVars(nextTheme);

    if (typeof setDebugStatsTheme === 'function') {
        setDebugStatsTheme(nextTheme.debugStatsTheme);
    }

    if (typeof setSkyTheme === 'function') {
        setSkyTheme(nextTheme.visuals.sky);
    }

    if (typeof setEnvironmentTheme === 'function') {
        setEnvironmentTheme(nextTheme.visuals.environment);
    }

    if (typeof setBoardTheme === 'function') {
        setBoardTheme(nextTheme.visuals.environment.boardSpaceColor, nextTheme.visuals.environment.boardGridColor);
    }

    if (typeof setPlayerFallbackColors === 'function') {
        setPlayerFallbackColors(nextTheme.visuals.playerFallbackColors);
    }

    return nextTheme;
}


export function getGameTheme(): GameTheme {
    return activeGameTheme;
}

export function getGameThemeNames(): GameThemeName[] {
    return Object.keys(GAME_THEME_PRESETS) as GameThemeName[];
}

if (typeof document !== 'undefined' && document.documentElement) {
    setThemeCssVars(activeGameTheme);
}
