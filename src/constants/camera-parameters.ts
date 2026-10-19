export const GAME_CAMERA_CONFIG = {
    defaultPosition: { x: 0, y: 8, z: 15 },
    defaultLookAt: { x: 0, y: 0, z: 0 },
    pregamePosition: { x: 0, y: 0.7, z: 5.2 },
    pregameLookAt: { x: 0, y: 0.8, z: 0 },
    boardPosition: { x: 0, y: 0, z: 5 },
    boardLookAt: { x: 0, y: 0.8, z: 0 },
    controls: {
        angleX: 0,
        angleY: 0.5,
        distance: 17,
        rotateSpeed: 0.005,
        zoomSpeed: 0.01,
        minPolarAngle: 0.01,
        maxPolarAngle: Math.PI / 2 - 0.01,
        minDistance: 1
    }
};

export const MAX_CAMERA_DISTANCE = 100;