export const PLAYER_ANIMATOR = {
    fallbackSpeedMultiplier: 1.0,
    minimumSpeedMultiplier: 0.5,
    maximumSpeedMultiplier: 2.0,
    fallbackDuration: 2000,
    minimumDuration: 250, // 250ms
    maximumDuration: 30000, // 30 seconds
}

export const DICE_ANIMATOR = {
    fallbackSpeedMultiplier: 1,
    minimumSpeedMultiplier: 0.5,
    maximumSpeedMultiplier: 2,

    fallbackPanDuration: 1200,
    fallbackRollDuration: 1200,
    minimumDuration: 250,
    maximumDuration: 30000,

    waitAfterRollDuration: 1000,
    fallbackSpinAmount: 1,
    minimumSpinAmount: 0,
    maximumSpinAmount: 100,
    rollForwardAmount: 0.5,
    cameraAlignStrength: 0.3
}