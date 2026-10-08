export interface CameraControls {
    isDragging: boolean;
    previousMouseX: number;
    previousMouseY: number;
    cameraAngleX: number;
    cameraAngleY: number;
    cameraDistance: number;
    updateCamera: () => void;
}