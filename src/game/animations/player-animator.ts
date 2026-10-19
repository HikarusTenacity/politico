// Player movement and animation system
import * as THREE from "three";
import {clampValue} from "../../utils/clampValue";
import {PLAYER_ANIMATOR} from "../../constants/animation-parameters";
import {getSpaceBounds} from "../board/board-queries";
import type {MotionProfile, PlayerAnimator} from "../../types/animation-types";

export function createPlayerAnimator(playerPiece: THREE.Group, targetSpaceId: number) {
    const animator: PlayerAnimator = {
        playerPiece: playerPiece,
        targetSpaceId: targetSpaceId,
        isAnimating: false,
        animationStartTime: 0,
        animationDuration: 2000,
        playerStartPos: null,
        playerTargetPos: null,
        playerWalkPath: [],
        speedMultiplier: 1,
        walkCycleSpeed: 8,
        legSwingAmount: 0.35,
        headBobAmount: 0.1,
        bodyBobAmount: 0.06,
        armSwingAmount: 0.4,

        setSpeedMultiplier: function(multiplier: number): void {
            this.speedMultiplier = clampValue(
                multiplier ?? PLAYER_ANIMATOR.fallbackSpeedMultiplier,
                PLAYER_ANIMATOR.minimumSpeedMultiplier,
                PLAYER_ANIMATOR.maximumSpeedMultiplier,
            );
        },

        setWalkDuration: function(durationMs: number): void {
            this.animationDuration = clampValue(
                durationMs ?? PLAYER_ANIMATOR.fallbackDuration,
                PLAYER_ANIMATOR.minimumDuration,
                PLAYER_ANIMATOR.maximumDuration,
            );
        },

        setMotionProfile: function(profile: MotionProfile): void {
            if (!profile) {
                return;
            }

            if (profile.walkCycleSpeed !== undefined) {
                this.walkCycleSpeed = Math.max(0.1, profile.walkCycleSpeed);
            }
            if (profile.legSwingAmount !== undefined) {
                this.legSwingAmount = Math.max(0, profile.legSwingAmount);
            }
            if (profile.headBobAmount !== undefined) {
                this.headBobAmount = Math.max(0, profile.headBobAmount);
            }
            if (profile.bodyBobAmount !== undefined) {
                this.bodyBobAmount = Math.max(0, profile.bodyBobAmount);
            }
            if (profile.armSwingAmount !== undefined) {
                this.armSwingAmount = Math.max(0, profile.armSwingAmount);
            }
        },
        
        init: function() {
            this.playerStartPos = new THREE.Vector3(this.playerPiece.position.x, this.playerPiece.position.y, this.playerPiece.position.z);
            
            // Calculate walking path
            this.calculateWalkPath();
            
            // Start animation
            this.isAnimating = true;
            this.animationStartTime = Date.now();
        },
        
        calculateWalkPath: function() {
            // Get the bounds of the target space
            const spaceBounds = getSpaceBounds(this.targetSpaceId);
            if (!spaceBounds) {
                console.log('No space bounds for space', this.targetSpaceId);
                this.playerWalkPath = [];
                if (this.playerStartPos) {
                    this.playerTargetPos = this.playerStartPos.clone();
                }
                return;
            }

            if (!this.playerStartPos) {
                return;
            }
            
            // Calculate center of the space
            const targetX = (spaceBounds.xMin + spaceBounds.xMax) / 2;
            const targetZ = (spaceBounds.zMin + spaceBounds.zMax) / 2;
            this.playerTargetPos = new THREE.Vector3(targetX, this.playerPiece.position.y, targetZ);
            
            console.log('Walking from', this.playerStartPos, 'to', this.playerTargetPos);
            
            // Create a smooth path
            this.playerWalkPath = this.createSmoothPath(this.playerStartPos, this.playerTargetPos, 20);
            console.log('Walk path has', this.playerWalkPath.length, 'points');
        },
        
        createSmoothPath: function(start: THREE.Vector3, end: THREE.Vector3, numPoints: number) {
            const path = [start.clone()];
            
            // Calculate straight-line distance
            const dx = end.x - start.x;
            const dz = end.z - start.z;
            const distance = Math.hypot(dx, dz);
            
            console.log('Distance to walk:', distance.toFixed(2));
            
            // If already close enough, just stay in place
            if (distance < 0.1) {
                path.push(end.clone());
                return path;
            }
            
            // Create waypoints along a straight path
            for (let i = 1; i <= numPoints; i++) {
                const t = i / numPoints;
                const x = start.x + dx * t;
                const z = start.z + dz * t;
                
                path.push(new THREE.Vector3(x, start.y, z));
            }
            
            return path;
        },
        
        update: function(): boolean {
            if (!this.isAnimating) return false;
            
            const elapsed = (Date.now() - this.animationStartTime) * this.speedMultiplier;
            const progress = Math.min(elapsed / this.animationDuration, 1);
            
            if (progress < 1) {
                this.movePlayerAlongPath(progress);
                this.animatePlayerWalk(progress);
                return true;  // Still animating
            } else {
                this.finishAnimation();
                return false;  // Animation complete
            }
        },
        
        movePlayerAlongPath: function(progress: number): void {
            if (this.playerWalkPath.length < 2) {
                return;
            }
            
            // Calculate position along path based on progress
            const targetIndex = progress * (this.playerWalkPath.length - 1);
            const currentIndex = Math.floor(targetIndex);
            const nextIndex = Math.min(currentIndex + 1, this.playerWalkPath.length - 1);
            const segmentProgress = targetIndex - currentIndex;
            
            // Interpolate between two points on path
            const currentPoint = this.playerWalkPath[currentIndex];
            const nextPoint = this.playerWalkPath[nextIndex];
            if (!currentPoint || !nextPoint) {
                return;
            }

            const newX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
            const newZ = currentPoint.z + (nextPoint.z - currentPoint.z) * segmentProgress;
            
            this.playerPiece.position.x = newX;
            this.playerPiece.position.z = newZ;
            
            // Rotate piece to face direction of movement
            const moveDir = new THREE.Vector3(nextPoint.x - currentPoint.x, 0, nextPoint.z - currentPoint.z);
            if (moveDir.length() > 0.01) {
                this.playerPiece.rotation.y = Math.atan2(moveDir.x, moveDir.z);
            }
        },
        
        animatePlayerWalk: function(progress: number): void {
            // Walking animation - legs swing and body bobs up and down
            const walkCycle = (progress * this.walkCycleSpeed) % 1;
            
            // Iterate through all children of the player piece
            for (const element of this.playerPiece.children) {
                const child = element;
                
                // Get original position (stored or use current as baseline)
                if (!child.userData.originalPosition) {
                    child.userData.originalPosition = child.position.clone();
                    child.userData.originalRotation = child.rotation.clone();
                }
                
                // Leg detection by y position
                const originalPosition = child.userData.originalPosition as THREE.Vector3;
                const originalRotation = child.userData.originalRotation as THREE.Euler;
                if (originalPosition.y < -0.4) {
                    // Legs - swing them forward and backward
                    const legSwing = Math.sin(walkCycle * Math.PI * 2) * this.legSwingAmount;
                    if (originalPosition.x < 0) {
                        child.rotation.x = originalRotation.x + legSwing;
                    } else if (originalPosition.x > 0) {
                        child.rotation.x = originalRotation.x - legSwing;
                    }
                } else if (originalPosition.y > 0.3) {
                    // Head - bob up and down
                    const bobAmount = Math.sin(walkCycle * Math.PI * 2) * this.headBobAmount;
                    child.position.y = originalPosition.y + bobAmount;
                } else if (originalPosition.y > -0.1 && originalPosition.y < 0.2) {
                    // Body - slight bob
                    const bodyBob = Math.sin(walkCycle * Math.PI * 2) * this.bodyBobAmount;
                    child.position.y = originalPosition.y + bodyBob;
                }
                
                // Arms swing opposite to legs
                if (originalPosition.x && Math.abs(originalPosition.x) > 0.2 && originalPosition.y > -0.2 && originalPosition.y < 0.3) {
                    const armSwing = Math.sin(walkCycle * Math.PI * 2) * this.armSwingAmount;
                    if (originalPosition.x < 0) {
                        child.rotation.x = originalRotation.x - armSwing;
                    } else if (originalPosition.x > 0) {
                        child.rotation.x = originalRotation.x + armSwing;
                    }
                }
            }
        },
        
        finishAnimation: function() {
            console.log('Player animation finished');
            this.isAnimating = false;
            
            // Reset all child positions and rotations
            for (const element of this.playerPiece.children) {
                const child: THREE.Object3D = element;
                if (child.userData.originalPosition && child.userData.originalRotation) {
                    child.position.copy(child.userData.originalPosition as THREE.Vector3);
                    child.rotation.copy(child.userData.originalRotation as THREE.Euler);
                    delete child.userData.originalPosition;
                    delete child.userData.originalRotation;
                }
            }
            
            // Ensure player is at final position
            if (this.playerTargetPos) {
                this.playerPiece.position.x = this.playerTargetPos.x;
                this.playerPiece.position.z = this.playerTargetPos.z;
            }
        }
    };
    
    animator.init();
    return animator;
}

export function applyIdleAnimations(pieces: THREE.Group[], nowMs: number): void {
    const seconds: number = nowMs * 0.001;

    for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex++) {
        const piece = pieces[pieceIndex];
        if (!piece) {
            continue;
        }

        let pieceHasWalkAnimation: boolean = false;
        for (const element of piece.children) {
            if (element.userData.originalPosition) {
                pieceHasWalkAnimation = true;
                break;
            }
        }

        if (pieceHasWalkAnimation) {
            continue;
        }

        // Get editable animation parameters from piece userData
        const speedMult: number = piece.userData.idleSpeedMultiplier !== undefined ? piece.userData.idleSpeedMultiplier : 1.0;
        const swayAmount: number = piece.userData.bodySwayAmount !== undefined ? piece.userData.bodySwayAmount : 0.15;
        const headBobAmount: number = piece.userData.headBobAmount !== undefined ? piece.userData.headBobAmount : 0.08;

        const phase = (piece.userData.idlePhase || 0) + pieceIndex * 0.35;
        const bodyBob = Math.sin(seconds * 2.2 * speedMult + phase) * headBobAmount;
        piece.position.y = (piece.userData.baseY || piece.position.y) + bodyBob;

        for (const element of piece.children) {
            const child: THREE.Object3D = element;
            const basePos: THREE.Vector3 = child.userData.idleBasePosition;
            const baseRot: THREE.Euler = child.userData.idleBaseRotation;

            if (!basePos || !baseRot) {
                continue;
            }

            child.position.copy(basePos);
            child.rotation.copy(baseRot);

            if (basePos.y > 0.3) {
                // Head bob
                child.position.y += Math.sin(seconds * 3.0 * speedMult + phase) * headBobAmount * 0.5;
            } else if (basePos.y > -0.2 && Math.abs(basePos.x) > 0.2) {
                // Arm swing with sway amount modifier
                const armSwing: number = Math.sin(seconds * 2.4 * speedMult + phase) * swayAmount;
                child.rotation.x += basePos.x < 0 ? -armSwing : armSwing;
            }
        }
    }
}
