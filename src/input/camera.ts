import * as THREE from 'three';
import { CameraControls } from '../types/camera-types';
import {GAME_CAMERA_CONFIG, MAX_CAMERA_DISTANCE} from '../constants/camera';
import {clampValue} from "../utils/clampValue";

// Camera controls and management
function setupCameraControls(camera: THREE.PerspectiveCamera, scene: THREE.Scene): CameraControls {
    camera.position.set(
        GAME_CAMERA_CONFIG.defaultPosition.x,
        GAME_CAMERA_CONFIG.defaultPosition.y,
        GAME_CAMERA_CONFIG.defaultPosition.z
    );
    camera.lookAt(
        GAME_CAMERA_CONFIG.defaultLookAt.x,
        GAME_CAMERA_CONFIG.defaultLookAt.y,
        GAME_CAMERA_CONFIG.defaultLookAt.z
    );

    const controls: CameraControls = {
        isDragging: false,
        previousMouseX: 0,
        previousMouseY: 0,
        cameraAngleX: GAME_CAMERA_CONFIG.controls.angleX,
        cameraAngleY: GAME_CAMERA_CONFIG.controls.angleY,
        cameraDistance: GAME_CAMERA_CONFIG.controls.distance,
        updateCamera: function() {}
    };

    document.addEventListener('mousedown', function(event) {
        controls.isDragging = true;
        controls.previousMouseX = event.clientX;
        controls.previousMouseY = event.clientY;
    });


    document.addEventListener('mouseup', function() {
        controls.isDragging = false;
    });

    document.addEventListener('mousemove', function(event) {
        if (controls.isDragging) {
            const deltaX = event.clientX - controls.previousMouseX;
            const deltaY = event.clientY - controls.previousMouseY;

            controls.cameraAngleX -= deltaX * GAME_CAMERA_CONFIG.controls.rotateSpeed;
            controls.cameraAngleY -= deltaY * GAME_CAMERA_CONFIG.controls.rotateSpeed;

            // Limit vertical rotation
            controls.cameraAngleY = Math.max(
                GAME_CAMERA_CONFIG.controls.minPolarAngle, 
                Math.min(
                    GAME_CAMERA_CONFIG.controls.maxPolarAngle, 
                    controls.cameraAngleY
                )
            );
            
            controls.previousMouseX = event.clientX;
            controls.previousMouseY = event.clientY;
        }
    });

    // Zoom with mouse wheel
    document.addEventListener('wheel', function(event: WheelEvent): void {
        controls.cameraDistance += event.deltaY * GAME_CAMERA_CONFIG.controls.zoomSpeed;
        controls.cameraDistance = clampValue(
            controls.cameraDistance,
            GAME_CAMERA_CONFIG.controls.minDistance,
            MAX_CAMERA_DISTANCE
        );
    });

    controls.updateCamera = function(): void {
        //kind of dont know the math on this, used cgpt
        camera.position.x = (
            Math.sin(controls.cameraAngleX) *
            Math.cos(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.position.y = (
            Math.sin(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.position.z = (
            Math.cos(controls.cameraAngleX) * 
            Math.cos(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.lookAt(
            GAME_CAMERA_CONFIG.defaultLookAt.x,
            GAME_CAMERA_CONFIG.defaultLookAt.y,
            GAME_CAMERA_CONFIG.defaultLookAt.z
        );
    };

    return controls;
}
