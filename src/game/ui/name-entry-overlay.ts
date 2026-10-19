// Name entry overlay - handles style name entry UI
import type {GameManager} from '../../types/game-manager-types';

interface NameEntryOverlay {
    root: HTMLDivElement | null;
    title: HTMLDivElement | null;
    slots: HTMLDivElement | null;
    keyboard: HTMLDivElement | null;
    message: HTMLDivElement | null;
    confirmButton: HTMLButtonElement | null;
    activeGameManager: GameManager | null;
    lastUpdate: number;
    lastSelectedKey: string | null;
    lastCursorPosition: number;
    lastPlayerIndex: number;
    lastSlotContent: string;
    create(): void;
    update(gameManager: GameManager): void;
    handleNameSlotClick(event: MouseEvent): void;
    handleNameKeyClick(event: MouseEvent): void;
    handleNameConfirmClick(): void;
}

const nameEntryOverlay: NameEntryOverlay = {
    root: null,
    title: null,
    slots: null,
    keyboard: null,
    message: null,
    confirmButton: null,
    activeGameManager: null,
    lastUpdate: 0,
    lastSelectedKey: null,
    lastCursorPosition: -1,
    lastPlayerIndex: -1,
    lastSlotContent: '',

    create: function(): void {
        console.log('Creating name entry overlay');
        if (this.root && this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }

        this.root = document.createElement('div');
        this.root.className = 'name-overlay hidden';

        this.title = document.createElement('div');
        this.title.className = 'name-title';
        this.root.appendChild(this.title);

        this.slots = document.createElement('div');
        this.slots.className = 'name-slots';
        this.root.appendChild(this.slots);

        this.keyboard = document.createElement('div');
        this.keyboard.className = 'name-keyboard';
        this.root.appendChild(this.keyboard);

        this.message = document.createElement('div');
        this.message.className = 'name-message';
        this.root.appendChild(this.message);

        this.confirmButton = document.createElement('button');
        this.confirmButton.className = 'name-confirm';
        this.confirmButton.type = 'button';
        this.confirmButton.textContent = 'Confirm Name';
        this.root.appendChild(this.confirmButton);

        this.slots.addEventListener('click', this.handleNameSlotClick.bind(this));
        this.keyboard.addEventListener('click', this.handleNameKeyClick.bind(this));
        this.confirmButton.addEventListener('click', this.handleNameConfirmClick.bind(this));
        console.log('Confirm button event listener attached');

        document.body.appendChild(this.root);
    },

    update: function(gameManager: GameManager): void {
        if (!this.root) return;

        this.activeGameManager = gameManager;

        var showOverlay = 
            gameManager.gameState === 'PRE_GAME_SELECT' &&
            gameManager.isNameEntryActive &&
            gameManager.isNameEntryActive();

        if (!showOverlay) {
            this.root.classList.add('hidden');
            this.lastSelectedKey = null;
            this.lastCursorPosition = -1;
            this.lastPlayerIndex = -1;
            this.lastSlotContent = '';
            return;
        }

        var playerNumber = gameManager.selectingPlayerIndex + 1;
        this.root.classList.remove('hidden');
        
        //title of name select
        if (this.lastPlayerIndex !== gameManager.selectingPlayerIndex) {
            this.title!.textContent = 'Player ' + playerNumber + ' Name Entry';
            this.lastPlayerIndex = gameManager.selectingPlayerIndex;
        }

        var entry = gameManager.pregameNameEntry;
        var currentCursor = entry ? entry.cursor : -1;
        var currentSlotContent = entry ? entry.slots.join('') : '';
        
        // Only rebuild slots if cursor position or content changed
        if (this.lastCursorPosition !== currentCursor || 
            this.lastSlotContent !== currentSlotContent) {
            var slotsHtml = '';
            if (entry) {
                for (var i = 0; i < entry.slots.length; i++) {
                    var slotChar = entry.slots[i] === ' ' ? '_' : entry.slots[i];
                    var activeClass = i === entry.cursor ? ' active' : '';
                    slotsHtml += '<div class="name-slot' + activeClass + '" data-slot-index="' + i + '">' + slotChar + '</div>';
                }
            }
            this.slots!.innerHTML = slotsHtml;
            this.lastCursorPosition = currentCursor;
            this.lastSlotContent = currentSlotContent;
        }

        var selectedKey = gameManager.getNameEntrySelectedCharacter ? gameManager.getNameEntrySelectedCharacter() : ' ';
        
        // Only rebuild keyboard if selected key changed
        if (this.lastSelectedKey !== selectedKey) {
            var keyboardHtml = '';
            var rows = gameManager.pregameNameKeyboardRows || [];
            keyboardHtml += '<div class="name-keyboard-grid">';
            for (var r = 0; r < rows.length; r++) {
                keyboardHtml += '<div class="name-keyboard-row">';
                var row = rows[r];
                if (!row) continue;
                for (var k = 0; k < row.length; k++) {
                    var keyChar = row.charAt(k);
                    var keyLabel = keyChar === ' ' ? '_' : keyChar;
                    var selectedClass = keyChar === selectedKey ? ' selected' : '';
                    keyboardHtml += '<div class="name-key' + selectedClass + '" data-char-code="' + keyChar.charCodeAt(0) + '">' + keyLabel + '</div>';
                }
                keyboardHtml += '</div>';
            }
            keyboardHtml += '</div>';
            keyboardHtml += '<div class="name-keyboard-delete-column">';
            keyboardHtml += '<div class="name-key name-key-delete" data-action="delete">DEL</div>';
            keyboardHtml += '</div>';
            this.keyboard!.innerHTML = keyboardHtml;
            this.lastSelectedKey = selectedKey;
        }

        this.message!.textContent = gameManager.pregameNameMessage || '';
    },

    handleNameSlotClick: function(event: MouseEvent): void {
        if (!this.activeGameManager || !this.activeGameManager.isNameEntryActive || !this.activeGameManager.isNameEntryActive()) {
            return;
        }

        if (!(event.target instanceof Element)) {
            return;
        }
        var slot = event.target.closest('.name-slot');
        if (!slot) {
            return;
        }

        var slotIndex = parseInt(slot.getAttribute('data-slot-index') ?? '', 10);
        if (isNaN(slotIndex) || !this.activeGameManager.setNameEntryCursor) {
            return;
        }

        this.activeGameManager.setNameEntryCursor(slotIndex);
    },

    handleNameKeyClick: function(event: MouseEvent): void {
        if (!this.activeGameManager || !this.activeGameManager.isNameEntryActive || !this.activeGameManager.isNameEntryActive()) {
            return;
        }

        if (!(event.target instanceof Element)) {
            return;
        }
        var key = event.target.closest('.name-key');
        if (!key) {
            return;
        }

        if (key.getAttribute('data-action') === 'delete') {
            if (this.activeGameManager.deleteNameEntryCharacter) {
                this.activeGameManager.deleteNameEntryCharacter();
            }
            return;
        }

        var charCode = parseInt(key.getAttribute('data-char-code') ?? '', 10);
        if (isNaN(charCode) || !this.activeGameManager.setNameEntryCharacter) {
            return;
        }

        var charValue = String.fromCharCode(charCode);
        if (!this.activeGameManager.setNameEntryCharacter(charValue)) {
            return;
        }

        if (this.activeGameManager.moveNameEntryCursor) {
            this.activeGameManager.moveNameEntryCursor(1);
        }
    },

    handleNameConfirmClick: function(): void {
        console.log('Confirm button clicked');
        
        // Check each condition separately for debugging
        const activeGameManager = this.activeGameManager;
        var hasActiveGameManager = !!activeGameManager;
        var hasIsNameEntryActiveMethod = hasActiveGameManager;
        var isNameEntryActiveResult = activeGameManager ? activeGameManager.isNameEntryActive() : null;
        
        console.log('activeGameManager:', hasActiveGameManager);
        console.log('isNameEntryActive method exists:', hasIsNameEntryActiveMethod);
        console.log('isNameEntryActive() returns:', isNameEntryActiveResult);
        console.log('confirmNameEntry method exists:', hasActiveGameManager);
        
        if (!activeGameManager) {
            console.log('Returning: no active game manager');
            return;
        }
        
        if (!activeGameManager.isNameEntryActive()) {
            console.log('Returning: isNameEntryActive() returned false');
            return;
        }

        console.log('All checks passed, calling confirmNameEntry()');
        var result = activeGameManager.confirmNameEntry();
        console.log('confirmNameEntry returned:', result);
    }
};

export default nameEntryOverlay;
