// Player corner panels - displays player info and 3D portrait in corners
var playerCornerPanels = {
    cornerPositions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    fallbackGuyColors: ['red', 'green', 'blue', 'yellow'],
    portraitWidth: 100,
    portraitHeight: 100,
    cornerPanels: [],
    portraitViewports: [],

    createCornerPanels: function() {
        this.destroyCornerPanels();

        for (var i = 0; i < 4; i++) {
            var panel = document.createElement('div');
            panel.className = 'player-corner ' + this.cornerPositions[i];
            panel.id = 'player-corner-' + i;

            var header = document.createElement('div');
            header.className = 'player-corner-header';

            var portrait = document.createElement('span');
            portrait.className = 'player-portrait';
            portrait.innerHTML =
                '<span class="player-portrait">' +
                    '<span class="player-portrait-head"></span>' +
                    '<span class="player-portrait-body"></span>' +
                '</span>';

            var name = document.createElement('span');
            name.className = 'player-corner-name';

            header.appendChild(portrait);
            header.appendChild(name);

            var characterLine = document.createElement('div');
            var currencyLine = document.createElement('div');
            var buffsLine = document.createElement('div');

            panel.appendChild(header);
            panel.appendChild(characterLine);
            panel.appendChild(currencyLine);
            panel.appendChild(buffsLine);

            document.body.appendChild(panel);
            this.cornerPanels.push({
                panel: panel,
                header: header,
                portrait: portrait,
                name: name,
                characterLine: characterLine,
                currencyLine: currencyLine,
                buffsLine: buffsLine
            });

            this.createPortraitViewport(i);
        }
    },

    createPortraitViewport: function(index) {
        if (typeof THREE === 'undefined' || !this.cornerPanels[index]) return;

        var portraitHost = this.cornerPanels[index].portrait;
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(this.portraitWidth, this.portraitHeight, false);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.className = 'portrait-canvas';

        portraitHost.innerHTML = '';
        portraitHost.appendChild(renderer.domElement);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(42, this.portraitWidth / this.portraitHeight, 0.1, 20);
        camera.position.set(0, 0.65, 2.1);
        camera.lookAt(new THREE.Vector3(0, 0.35, 0));

        var ambient = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambient);

        var keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
        keyLight.position.set(2.5, 3.5, 3.5);
        scene.add(keyLight);

        var rimLight = new THREE.PointLight(0xffffff, 1.5, 8);
        rimLight.position.set(-2, 2, 2);
        scene.add(rimLight);

        this.portraitViewports[index] = {
            renderer: renderer,
            scene: scene,
            camera: camera,
            rimLight: rimLight,
            model: null,
            sourcePiece: null,
            baseY: -0.20
        };
    },

    getPortraitModelForPlayer: function(player, index) {
        var model;

        if (player.piece) {
            model = player.piece.clone(true);
        } else {
            model = createGuy(this.fallbackGuyColors[index % this.fallbackGuyColors.length]);
        }

        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        model.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = false;
                node.receiveShadow = false;
            }
        });

        var box = new THREE.Box3().setFromObject(model);
        var center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        box.setFromObject(model);
        var size = box.getSize(new THREE.Vector3());
        if (size.y > 0) {
            var scale = 2.35 / size.y;
            model.scale.set(scale, scale, scale);
        }

        box.setFromObject(model);
        var scaledSize = box.getSize(new THREE.Vector3());
        var scaledMinY = box.min.y;
        var chestY = scaledMinY + scaledSize.y * 0.65;
        model.position.y -= chestY;
        model.position.y += 0.05;

        return model;
    },

    setFallbackGuyColors: function(colors: string[]) {
        if (Array.isArray(colors) && colors.length) {
            this.fallbackGuyColors = colors.slice();
        }
    },

    updatePortraitViewport: function(player, index, isCurrentTurn) {
        var viewport = this.portraitViewports[index];
        if (!viewport) {
            return;
        }

        if (viewport.sourcePiece !== player.piece) {
            if (viewport.model) {
                viewport.scene.remove(viewport.model);
            }
            viewport.model = this.getPortraitModelForPlayer(player, index);
            viewport.sourcePiece = player.piece;
            viewport.scene.add(viewport.model);
        }

        if (viewport.model) {
            viewport.model.rotation.y = 0;
            viewport.model.position.y = viewport.baseY;
        }

        viewport.rimLight.intensity = isCurrentTurn ? 2.1 : 1.4;
        viewport.renderer.render(viewport.scene, viewport.camera);
    },

    destroyCornerPanels: function() {
        for (var r = 0; r < this.portraitViewports.length; r++) {
            var viewport = this.portraitViewports[r];
            if (!viewport) {
                continue;
            }

            if (viewport.model) {
                viewport.scene.remove(viewport.model);
                viewport.model = null;
            }

            if (viewport.renderer) {
                viewport.renderer.dispose();
            }
        }
        this.portraitViewports = [];

        for (var i = 0; i < this.cornerPanels.length; i++) {
            var panel = this.cornerPanels[i].panel;
            if (panel && panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
        }
        this.cornerPanels = [];
    },

    updateCornerPanels: function(gameManager) {
        for (var i = 0; i < PLAYERS.length && i < this.cornerPanels.length; i++) {
            var player = PLAYERS[i];
            var panelData = this.cornerPanels[i];
            var panel = panelData.panel;
            var playerColor = '#' + player.color.toString(16).padStart(6, '0');
            var isCurrentTurn = !gameManager.isPregame() && gameManager.currentPlayerIndex === i;
            var buffsCount = player.buffs ? player.buffs.length : 0;
            var pieceLabel = player.pieceType ? player.pieceType : 'Unselected';

            panel.className = 'player-corner ' + this.cornerPositions[i] + (isCurrentTurn ? ' active-turn' : '');
            panelData.header.style.color = playerColor;
            panelData.portrait.style.color = playerColor;
            panelData.name.textContent = player.name;
            panelData.characterLine.textContent = 'Character: ' + pieceLabel;
            panelData.currencyLine.textContent = 'Currency: ' + player.currency;
            panelData.buffsLine.textContent = 'Buff Slots: ' + buffsCount + ' / ' + MAX_PLAYER_BUFF_SLOTS;

            this.updatePortraitViewport(player, i, isCurrentTurn);
        }
    }
};

function setPlayerFallbackColors(colors: string[]) {
    playerCornerPanels.setFallbackGuyColors(colors);
}
