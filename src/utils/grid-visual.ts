let playableSpaceMaterial: THREE.MeshBasicMaterial | null = null;
let boardLineMaterial: THREE.LineBasicMaterial | null = null;

function createPlayableSpacesVisualization(scene: any) {
    const spacesGroup = new THREE.Group();
    
    const boardY = -0.98;
    
    const spaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,  // Green
        opacity: 0.4,
        transparent: true,
        side: THREE.DoubleSide
    });
    playableSpaceMaterial = spaceMaterial;
    
    // create plane for space based on bounds
    for (let spaceId = 0; spaceId < 40; spaceId++) {
        const bounds = getSpaceBounds(spaceId);
        if (!bounds) continue;
        
        const centerX = (bounds.xMin + bounds.xMax) / 2;
        const centerZ = (bounds.zMin + bounds.zMax) / 2;
        const width = bounds.xMax - bounds.xMin;
        const depth = bounds.zMax - bounds.zMin;
        
        // create plane geometry for space
        const geometry = new THREE.PlaneGeometry(width, depth);
        const plane = new THREE.Mesh(geometry, spaceMaterial);
        plane.position.set(centerX, boardY, centerZ);
        plane.rotation.x = -Math.PI / 2; 
        plane.userData.spaceId = spaceId;
        spacesGroup.add(plane);
    }
    
    scene.add(spacesGroup);
    return spacesGroup;
}

// create board lines
function createBoardGridVisualization(scene: any) {
    const gridGroup = new THREE.Group();
    const boardY = -0.97;
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    });
    boardLineMaterial = lineMaterial;
    
    const xCoords = generateCoordinates(-10, CORNER, PROPERTY);
    const zCoords = generateCoordinates(10, -CORNER, -PROPERTY);
    
    // vertical
    for (const element of xCoords) {
        const geometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(element, boardY, -10),
            new THREE.Vector3(element, boardY, 10)
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    // horizontal
    for (const element of zCoords) {
        const geometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-10, boardY, element),
            new THREE.Vector3(10, boardY, element)
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    scene.add(gridGroup);
    return gridGroup;
}

function generateCoordinates(start: number, step1: number, step2: number) {
    const coords = [start];
    for (let i = 0; i < 10; i++) {
        start += (i === 0 || i === 9) ? step1 : step2;
        coords.push(start);
    }
    return coords;
}

function setBoardTheme(spaceColor: number, gridColor: number): void {
    if (playableSpaceMaterial) {
        playableSpaceMaterial.color.setHex(spaceColor);
    }
    if (boardLineMaterial) {
        boardLineMaterial.color.setHex(gridColor);
    }
}
