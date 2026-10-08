// Dice animator for rolling cutscenes
function createDiceAnimator(scene, camera) {
    var animator = {
        scene: scene,
        camera: camera,
        dice: null,
        isAnimating: false,
        animationPhase: null,  // 'PAN', 'WAIT_FOR_CLICK', 'ROLLING', 'WAIT_AFTER_ROLL', 'MOVING'
        currentThrowType: 0,
        result: 0,
        animationDuration: 1200,  // milliseconds for pan and roll
        rollDuration: 1200,
        panDuration: 1200,
        animationStartTime: 0,
        cameraStartPos: null,
        targetCameraPos: null,
        targetCameraLookAt: null,
        turnDisplayElement: null,
        currentPlayerPiece: null,
        playerAnimator: null,
        waitAfterRollStartTime: 0,
        waitAfterRollDuration: 1000,  // 1 second wait
        gameManager: null,
        speedMultiplier: 1,
        spinAmount: 1,
        rollForwardAmount: 0.5,
        cameraAlignStrength: 0.3,

        setSpeedMultiplier: function(multiplier) {
            this.speedMultiplier = Math.max(0.5, Math.min(2.0, multiplier || 1));
        },

        setPanDuration: function(durationMs) {
            this.panDuration = Math.max(250, durationMs || 1200);
        },

        setRollDuration: function(durationMs) {
            this.rollDuration = Math.max(250, durationMs || 1200);
        },

        setSpinAmount: function(amount) {
            this.spinAmount = Math.max(0, amount || 1);
        },
        
        setupCutscene: function() {
            //get original camera position
            this.cameraStartPos = new THREE.Vector3(
                this.camera.position.x, 
                this.camera.position.y, 
                this.camera.position.z
            );
        },
        
        restoreCutscene: function() {
            // set camera back to original pos
            if (this.cameraStartPos) {
                this.camera.position.copy(this.cameraStartPos);
                this.camera.lookAt(0, 0, 0);
            }
            
            // Hide turn display
            this.hideTurnDisplay();
        },
        
        showTurnDisplay: function(playerName, playerColor, message) {
            // Get or create turn display element
            if (!this.turnDisplayElement) {
                this.turnDisplayElement = document.getElementById('turnDisplay');
            }
            
            // Update content and color
            var colorHex = '#' + playerColor.toString(16).padStart(6, '0');
            var displayMessage = message || (playerName + "'s Turn");
            this.turnDisplayElement.innerHTML = displayMessage;
            this.turnDisplayElement.style.color = colorHex;
            this.turnDisplayElement.style.display = 'block';
        },
        
        hideTurnDisplay: function() {
            if (this.turnDisplayElement) {
                this.turnDisplayElement.style.display = 'none';
            }
        },
        
        rollDice: function(playerName, playerColor, playerPiece, targetSpaceId, diceRoll) {
            console.log('Starting animation for', playerName, 'to space', targetSpaceId);
            
            this.result = diceRoll;
            this.animationStartTime = Date.now();
            this.isAnimating = true;
            this.animationPhase = 'PAN';
            this.currentPlayerPiece = playerPiece;
            this.currentPlayerName = playerName;
            this.currentPlayerColor = playerColor;
            this.targetSpaceId = targetSpaceId;
            
            // Position dice at player's arm/hand (ready to throw)
            this.dice.position.set(playerPiece.position.x + 0.375, playerPiece.position.y + 0.6, playerPiece.position.z);
            this.dice.rotation.set(0, 0, 0);
            
            // Pre-calculate target rotation based on result
            this.targetDiceRotation = this.getRotationForResult(diceRoll);
            this.startDiceRotation = { x: 0, y: 0, z: 0 };
            
            // Setup camera target position
            this.setupCameraTargets(playerPiece);
            
            // Save the current camera state
            this.setupCutscene();
            
            // Show turn display overlay
            this.showTurnDisplay(playerName, playerColor);
            
            return this.result;
        },
        
        setupCameraTargets: function(playerPiece) {
            var pieceX = playerPiece.position.x;
            var pieceZ = playerPiece.position.z;
            this.targetCameraPos = new THREE.Vector3(pieceX-3, 2, pieceZ);
            this.targetCameraLookAt = new THREE.Vector3(pieceX, 0, pieceZ);
        },
        
        getRotationForResult: function(result) {
            // Get the dice rotation for displaying the correct face on top
            // Face mapping: 1=right(+X), 2=bottom(-Y), 3=front(+Z), 4=back(-Z), 5=top(+Y), 6=left(-X)
            var rotations = {
                1: { x: 0, y: 0, z: Math.PI / 2 },          // Rotate right face to top
                2: { x: Math.PI, y: 0, z: 0 },              // Rotate bottom face to top
                3: { x: -Math.PI / 2, y: 0, z: 0 },         // Rotate front face to top
                4: { x: Math.PI / 2, y: 0, z: 0 },          // Rotate back face to top
                5: { x: 0, y: 0, z: 0 },                    // Top face already on top
                6: { x: 0, y: 0, z: -Math.PI / 2 }          // Rotate left face to top
            };
            
            return rotations[result] || rotations[5];
        },
        
        smoothRotationtoward: function(targetRotation, progress) {
            // Smoothly interpolate current rotation toward target rotation
            if (!this.dice) return;
            
            this.dice.rotation.x += (targetRotation.x - this.dice.rotation.x) * progress * 0.1;
            this.dice.rotation.y += (targetRotation.y - this.dice.rotation.y) * progress * 0.1;
            this.dice.rotation.z += (targetRotation.z - this.dice.rotation.z) * progress * 0.1;
        },
        
        update: function() {
            if (!this.isAnimating) return;
            
            if (this.animationPhase === 'PAN') {
                var elapsed = (Date.now() - this.animationStartTime) * this.speedMultiplier;
                var progress = Math.min(elapsed / this.panDuration, 1);
                
                this.updateCameraAnimation(progress);
                
                if (progress >= 1) {
                    // Pan complete, wait for click
                    this.animationPhase = 'WAIT_FOR_CLICK';
                    this.showTurnDisplay(this.currentPlayerName, this.currentPlayerColor, 'Click to Roll!');
                    // Make piece glow
                    if (this.gameManager && this.gameManager.setPieceGlow) {
                        this.gameManager.setPieceGlow(this.currentPlayerPiece, true);
                    }
                }
            } else if (this.animationPhase === 'ROLLING') {
                var elapsed = (Date.now() - this.animationStartTime) * this.speedMultiplier;
                var progress = Math.min(elapsed / this.rollDuration, 1);
                
                // Animate dice rolling onto the floor in front of player
                if (this.dice && this.currentPlayerPiece) {
                    // Start from dice's current position (at player's hand), roll down and forward onto the floor
                    var startX = this.dice.position.x;
                    var startY = this.dice.position.y;
                    var startZ = this.dice.position.z;
                    
                    var endX = this.currentPlayerPiece.position.x + 2;
                    var endY = -0.74;  // Ground level for 0.32 size dice (center at -0.74 puts bottom at ~-0.90)
                    var endZ = this.currentPlayerPiece.position.z + 1;
                    
                    // Hit ground early (by 60%), then stay on ground
                    var groundHitProgress = 0.6;
                    var fallProgress;
                    
                    if (progress < groundHitProgress) {
                        // Quick gravity-based fall to the ground
                        var fallPortion = progress / groundHitProgress;
                        fallProgress = Math.min(fallPortion * fallPortion * 2.5, 1); // Cap at 1 to avoid overshooting
                    } else {
                        // Landed, stay on ground
                        fallProgress = 1;
                    }
                    
                    var lateralProgress = progress < 0.5
                        ? 2 * progress * progress
                        : -1 + (4 - 2 * progress) * progress;
                    
                    this.dice.position.x = startX + (endX - startX) * lateralProgress;
                    this.dice.position.y = startY + (endY - startY) * fallProgress;
                    this.dice.position.z = startZ + (endZ - startZ) * lateralProgress;
                    
                    // Continuously spin the dice throughout entire animation
                    var spinMultiplier = (1 - progress); // Spin decreases toward end
                    this.dice.rotation.x += 0.16 * this.spinAmount * spinMultiplier;
                    this.dice.rotation.y += 0.24 * this.spinAmount * spinMultiplier;
                    this.dice.rotation.z += 0.12 * this.spinAmount * spinMultiplier;
                    
                    // Add rolling rotation (forward rotation based on forward movement)
                    // This makes it look like rolling instead of sliding
                    this.dice.rotation.x += lateralProgress * this.rollForwardAmount;
                    
                    // After hitting ground, smoothly rotate to show correct number
                    if (progress > groundHitProgress) {
                        var alignProgress = (progress - groundHitProgress) / (1 - groundHitProgress);
                        this.smoothRotationtoward(this.targetDiceRotation, alignProgress * this.cameraAlignStrength);
                    }
                }
                
                if (progress >= 1) {
                    // Snap to final rotation at the very end
                    this.dice.rotation.x = this.targetDiceRotation.x;
                    this.dice.rotation.y = this.targetDiceRotation.y;
                    this.dice.rotation.z = this.targetDiceRotation.z;
                    
                    // Show result and wait
                    this.animationPhase = 'WAIT_AFTER_ROLL';
                    this.waitAfterRollStartTime = Date.now();
                    this.showTurnDisplay(this.currentPlayerName, this.currentPlayerColor, 'Rolled: ' + this.result);
                }
            } else if (this.animationPhase === 'WAIT_AFTER_ROLL') {
                var elapsed = (Date.now() - this.waitAfterRollStartTime) * this.speedMultiplier;
                
                if (elapsed >= this.waitAfterRollDuration) {
                    // Start moving
                    this.animationPhase = 'MOVING';
                    this.playerAnimator = createPlayerAnimator(this.currentPlayerPiece, this.targetSpaceId);
                    this.playerAnimator.setSpeedMultiplier(this.speedMultiplier);
                    this.hideTurnDisplay();
                }
            } else if (this.animationPhase === 'MOVING') {
                // Update player animator
                if (this.playerAnimator) {
                    var stillMoving = this.playerAnimator.update();
                    if (!stillMoving) {
                        this.finishAnimation();
                    }
                }
                
                // Keep camera centered over moving player with 45 degree angle, much closer
                if (this.currentPlayerPiece) {
                    var desiredCameraPos = new THREE.Vector3(
                        this.currentPlayerPiece.position.x - 2,
                        3,
                        this.currentPlayerPiece.position.z - 2
                    );

                    // Smoothly pan camera toward the follow position instead of cutting
                    this.camera.position.lerp(desiredCameraPos, 0.12);
                    this.camera.lookAt(this.currentPlayerPiece.position.x, 0, this.currentPlayerPiece.position.z);
                }
            }
        },
        
        updateCameraAnimation: function(progress) {
            // Smoothly glide camera to player piece
            if (this.currentPlayerPiece && this.cameraStartPos && this.targetCameraPos) {
                // Easing function for smooth glide (ease-in-out cubic)
                var easeProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : -1 + (4 - 2 * progress) * progress;
                
                // Interpolate camera position smoothly
                this.camera.position.x = this.cameraStartPos.x + (this.targetCameraPos.x - this.cameraStartPos.x) * easeProgress;
                this.camera.position.y = this.cameraStartPos.y + (this.targetCameraPos.y - this.cameraStartPos.y) * easeProgress;
                this.camera.position.z = this.cameraStartPos.z + (this.targetCameraPos.z - this.cameraStartPos.z) * easeProgress;
                
                // Update camera look-at to follow player
                var pieceX = this.currentPlayerPiece.position.x;
                var pieceZ = this.currentPlayerPiece.position.z;
                this.camera.lookAt(pieceX, 0.2, pieceZ);
            }
        },
        
        handleClick: function(mouse, raycaster) {
            // Only handle clicks during WAIT_FOR_CLICK phase
            if (!this.isAnimating || this.animationPhase !== 'WAIT_FOR_CLICK') {
                return false;
            }
            
            // Check if click is on the player piece
            raycaster.setFromCamera(mouse, this.camera);
            var intersects = raycaster.intersectObjects([this.currentPlayerPiece], true);
            
            if (intersects.length > 0) {
                // Start rolling
                this.animationPhase = 'ROLLING';
                this.animationStartTime = Date.now();
                this.showTurnDisplay(this.currentPlayerName, this.currentPlayerColor, 'Rolling...');
                // Remove glow
                if (this.gameManager && this.gameManager.setPieceGlow) {
                    this.gameManager.setPieceGlow(this.currentPlayerPiece, false);
                }
                return true;
            }
            
            return false;
        },
        
        finishAnimation: function() {
            console.log('Animation finished');
            this.isAnimating = false;
            this.animationPhase = null;
            this.playerAnimator = null;
            
            // Remove glow if still active
            if (this.gameManager && this.gameManager.setPieceGlow) {
                this.gameManager.setPieceGlow(this.currentPlayerPiece, false);
            }
            
            this.restoreCutscene();
            if (this.dice) {
                this.dice.position.set(1000, 1000, 1000);  // Hide dice far off-screen
            }
        }
    };
    
    // Create the dice using the standalone function
    animator.dice = createDice();
    scene.add(animator.dice);
    
    return animator;
}
