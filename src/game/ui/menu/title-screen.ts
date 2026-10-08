import { TitleScreen } from '../../../types/ui-types';

export function createTitleScreen(): TitleScreen {
    const root = document.createElement('div');
    root.className = 'title-screen-overlay';

    const logo = document.createElement('h1');
    logo.className = 'title-screen-logo';
    logo.textContent = 'Politico!';
    root.appendChild(logo);

    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '12px';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.flexDirection = 'column';

    var startButton = document.createElement('button');
    startButton.className = 'title-screen-start';
    startButton.type = 'button';
    startButton.textContent = 'Begin';
    startButton.classList.add('title-pop-in');
    startButton.style.animationDelay = '40ms';
    buttonContainer.appendChild(startButton);

    var settingsButton = document.createElement('button');
    settingsButton.className = 'title-screen-start';
    settingsButton.type = 'button';
    settingsButton.textContent = 'Settings';
    settingsButton.classList.add('title-pop-in');
    settingsButton.style.animationDelay = '140ms';
    settingsButton.style.background = 'var(--theme-title-settings-bg)';
    settingsButton.style.borderColor = 'var(--theme-title-settings-border)';
    buttonContainer.appendChild(settingsButton);

    var creditsButton = document.createElement('button');
    creditsButton.className = 'title-screen-start';
    creditsButton.type = 'button';
    creditsButton.textContent = 'Credits';
    creditsButton.classList.add('title-pop-in');
    creditsButton.style.animationDelay = '240ms';
    creditsButton.style.background = 'var(--theme-title-credits-bg)';
    creditsButton.style.borderColor = 'var(--theme-title-credits-border)';
    buttonContainer.appendChild(creditsButton);

    root.appendChild(buttonContainer);

    var rulesModal = document.createElement('div');
    rulesModal.className = 'title-rules-modal';

    var rulesTitle = document.createElement('h2');
    rulesTitle.className = 'title-rules-title';
    rulesTitle.textContent = 'How To Play';
    rulesModal.appendChild(rulesTitle);

    var rulesText = document.createElement('div');
    rulesText.className = 'title-rules-text';
    rulesText.innerHTML =
        '1. Pick a character and enter your name.<br>' +
        '2. Roll the dice on your turn to move.<br>' +
        '3. Highest roll in pregame decides turn order.<br>' +
        '4. Pass turns and race around the board.';
    rulesModal.appendChild(rulesText);

    var rulesButton = document.createElement('button');
    rulesButton.className = 'title-rules-close';
    rulesButton.type = 'button';
    rulesButton.textContent = 'Got It';
    rulesModal.appendChild(rulesButton);

    root.appendChild(rulesModal);

    document.body.appendChild(root);

    var screen = {
        root: root,
        startButton: startButton,
        settingsButton: settingsButton,
        creditsButton: creditsButton,
        rulesModal: rulesModal,
        rulesButton: rulesButton,
        isVisible: true,
        isRulesVisible: true,

        dismissRules: function() {
            if (!this.isRulesVisible) return;
            this.isRulesVisible = false;
            this.rulesModal.classList.add('hidden');
        },

        onStart: function(callback) {
            if (typeof callback !== 'function') return;
            var self = this;

            var startHandler = function() {
                if (self.isRulesVisible) return;
                if (!self.isVisible) return;
                callback();
            };

            this.startButton.addEventListener('click', startHandler);

            window.addEventListener('keydown', function(event) {
                if (self.isRulesVisible) return;
                if (!self.isVisible) return;

                if (event.code === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    callback();
                }
            });
        },

        onButton: function(buttonName, callback) {
            var self = this;
            var target = null;

            if (buttonName === 'settings') {
                target = this.settingsButton;
            } else if (buttonName === 'credits') {
                target = this.creditsButton;
            } else if (buttonName === 'start') {
                target = this.startButton;
            }

            if (typeof callback !== 'function' || !target) return;

            target.addEventListener('click', function() {
                if (self.isRulesVisible) return;
                if (!self.isVisible) return;
                callback();
            });
        },

        hide: function() {
            if (!this.isVisible) return;
            this.isVisible = false;
            this.root.classList.add('hidden');
        }
    };

    rulesButton.addEventListener('click', function() {
        screen.dismissRules();
    });

    window.addEventListener('keydown', function(event) {
        if (!screen.isVisible || !screen.isRulesVisible) return;

        if (event.code === 'Enter' || event.code === 'Space' || event.code === 'Escape') {
            event.preventDefault();
            screen.dismissRules();
        }
    });

    return screen;
}