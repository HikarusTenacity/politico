// Player movement and animation system
function createPlayerAnimator(playerPiece, targetSpaceId) {
    var animator = {
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

        setSpeedMultiplier: function(multiplier) {
            this.speedMultiplier = Math.max(0.5, Math.min(2.0, multiplier || 1));
        },

        setWalkDuration: function(durationMs) {
            this.animationDuration = Math.max(250, durationMs || 2000);
        },

        setMotionProfile: function(profile) {
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
            var spaceBounds = getSpaceBounds(this.targetSpaceId);
            if (!spaceBounds) {
                console.log('No space bounds for space', this.targetSpaceId);
                this.playerWalkPath = [];
                this.playerTargetPos = this.playerStartPos.clone();
                return;
            }
            
            // Calculate center of the space
            var targetX = (spaceBounds.xMin + spaceBounds.xMax) / 2;
            var targetZ = (spaceBounds.zMin + spaceBounds.zMax) / 2;
            this.playerTargetPos = new THREE.Vector3(targetX, this.playerPiece.position.y, targetZ);
            
            console.log('Walking from', this.playerStartPos, 'to', this.playerTargetPos);
            
            // Create a smooth path
            this.playerWalkPath = this.createSmoothPath(this.playerStartPos, this.playerTargetPos, 20);
            console.log('Walk path has', this.playerWalkPath.length, 'points');
        },
        
        createSmoothPath: function(start, end, numPoints) {
            var path = [start.clone()];
            
            // Calculate straight-line distance
            var dx = end.x - start.x;
            var dz = end.z - start.z;
            var distance = Math.sqrt(dx * dx + dz * dz);
            
            console.log('Distance to walk:', distance.toFixed(2));
            
            // If already close enough, just stay in place
            if (distance < 0.1) {
                path.push(end.clone());
                return path;
            }
            
            // Create waypoints along a straight path
            for (var i = 1; i <= numPoints; i++) {
                var t = i / numPoints;
                var x = start.x + dx * t;
                var z = start.z + dz * t;
                
                path.push(new THREE.Vector3(x, start.y, z));
            }
            
            return path;
        },
        
        update: function() {
            if (!this.isAnimating) return false;
            
            var elapsed = (Date.now() - this.animationStartTime) * this.speedMultiplier;
            var progress = Math.min(elapsed / this.animationDuration, 1);
            
            if (progress < 1) {
                this.movePlayerAlongPath(progress);
                this.animatePlayerWalk(progress);
                return true;  // Still animating
            } else {
                this.finishAnimation();
                return false;  // Animation complete
            }
        },
        
        movePlayerAlongPath: function(progress) {
            if (this.playerWalkPath.length < 2) {
                return;
            }
            
            // Calculate position along path based on progress
            var targetIndex = progress * (this.playerWalkPath.length - 1);
            var currentIndex = Math.floor(targetIndex);
            var nextIndex = Math.min(currentIndex + 1, this.playerWalkPath.length - 1);
            var segmentProgress = targetIndex - currentIndex;
            
            // Interpolate between two points on path
            var currentPoint = this.playerWalkPath[currentIndex];
            var nextPoint = this.playerWalkPath[nextIndex];
            
            var newX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
            var newZ = currentPoint.z + (nextPoint.z - currentPoint.z) * segmentProgress;
            
            this.playerPiece.position.x = newX;
            this.playerPiece.position.z = newZ;
            
            // Rotate piece to face direction of movement
            var moveDir = new THREE.Vector3(nextPoint.x - currentPoint.x, 0, nextPoint.z - currentPoint.z);
            if (moveDir.length() > 0.01) {
                var angle = Math.atan2(moveDir.x, moveDir.z);
                this.playerPiece.rotation.y = angle;
            }
        },
        
        animatePlayerWalk: function(progress) {
            // Walking animation - legs swing and body bobs up and down
            var walkCycle = (progress * this.walkCycleSpeed) % 1;
            
            // Iterate through all children of the player piece
            for (var i = 0; i < this.playerPiece.children.length; i++) {
                var child = this.playerPiece.children[i];
                
                // Get original position (stored or use current as baseline)
                if (!child.originalPosition) {
                    child.originalPosition = child.position.clone();
                    child.originalRotation = child.rotation.clone();
                }
                
                // Leg detection by y position
                if (child.originalPosition.y < -0.4) {
                    // Legs - swing them forward and backward
                    var legSwing = Math.sin(walkCycle * Math.PI * 2) * this.legSwingAmount;
                    if (child.originalPosition.x < 0) {
                        child.rotation.x = child.originalRotation.x + legSwing;
                    } else if (child.originalPosition.x > 0) {
                        child.rotation.x = child.originalRotation.x - legSwing;
                    }
                } else if (child.originalPosition.y > 0.3) {
                    // Head - bob up and down
                    var bobAmount = Math.sin(walkCycle * Math.PI * 2) * this.headBobAmount;
                    child.position.y = child.originalPosition.y + bobAmount;
                } else if (child.originalPosition.y > -0.1 && child.originalPosition.y < 0.2) {
                    // Body - slight bob
                    var bodyBob = Math.sin(walkCycle * Math.PI * 2) * this.bodyBobAmount;
                    child.position.y = child.originalPosition.y + bodyBob;
                }
                
                // Arms swing opposite to legs
                if (child.originalPosition.x && Math.abs(child.originalPosition.x) > 0.2 && child.originalPosition.y > -0.2 && child.originalPosition.y < 0.3) {
                    var armSwing = Math.sin(walkCycle * Math.PI * 2) * this.armSwingAmount;
                    if (child.originalPosition.x < 0) {
                        child.rotation.x = child.originalRotation.x - armSwing;
                    } else if (child.originalPosition.x > 0) {
                        child.rotation.x = child.originalRotation.x + armSwing;
                    }
                }
            }
        },
        
        finishAnimation: function() {
            console.log('Player animation finished');
            this.isAnimating = false;
            
            // Reset all child positions and rotations
            for (var i = 0; i < this.playerPiece.children.length; i++) {
                var child = this.playerPiece.children[i];
                if (child.originalPosition) {
                    child.position.copy(child.originalPosition);
                    child.rotation.copy(child.originalRotation);
                    delete child.originalPosition;
                    delete child.originalRotation;
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

function applyIdleAnimations(pieces, nowMs) {
    var seconds = nowMs * 0.001;

    for (var pieceIndex = 0; pieceIndex < pieces.length; pieceIndex++) {
        var piece = pieces[pieceIndex];
        if (!piece) {
            continue;
        }

        var pieceHasWalkAnimation = false;
        for (var checkIndex = 0; checkIndex < piece.children.length; checkIndex++) {
            if (piece.children[checkIndex].originalPosition) {
                pieceHasWalkAnimation = true;
                break;
            }
        }

        if (pieceHasWalkAnimation) {
            continue;
        }

        // Get editable animation parameters from piece userData
        var speedMult = piece.userData.idleSpeedMultiplier !== undefined ? piece.userData.idleSpeedMultiplier : 1.0;
        var swayAmount = piece.userData.bodySwayAmount !== undefined ? piece.userData.bodySwayAmount : 0.15;
        var headBobAmount = piece.userData.headBobAmount !== undefined ? piece.userData.headBobAmount : 0.08;

        var phase = (piece.userData.idlePhase || 0) + pieceIndex * 0.35;
        var bodyBob = Math.sin(seconds * 2.2 * speedMult + phase) * headBobAmount;
        piece.position.y = (piece.userData.baseY || piece.position.y) + bodyBob;

        for (var childIndex = 0; childIndex < piece.children.length; childIndex++) {
            var child = piece.children[childIndex];
            var basePos = child.userData.idleBasePosition;
            var baseRot = child.userData.idleBaseRotation;

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
                var armSwing = Math.sin(seconds * 2.4 * speedMult + phase) * swayAmount;
                child.rotation.x += basePos.x < 0 ? -armSwing : armSwing;
            }
        }
    }
}

