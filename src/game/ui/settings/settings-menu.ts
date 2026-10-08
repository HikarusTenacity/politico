// Settings Menu UI
import {GRAPHICS_OPTIONS, QUALITY_VALUES} from "../../../constants/ui-constants";
import {Option} from "../../../types/ui-types";

function createSettingsMenu(settingsManager: SettingsManager) {
    type SettingSection = HTMLDivElement & {
        volumeSlider?: HTMLInputElement;
        volumeValue?: HTMLSpanElement;
        graphicsButtons?: HTMLButtonElement[];
        speedSlider?: HTMLInputElement;
        speedValue?: HTMLSpanElement;
        themeButtons?: HTMLButtonElement[];
    };
    const root: HTMLDivElement = document.createElement('div');
    root.className = 'settings-overlay';
    root.classList.add('hidden');

    const settingsPanel: HTMLDivElement = document.createElement('div');
    settingsPanel.className = 'settings-panel';

    const titleBar: HTMLDivElement = document.createElement('div');
    titleBar.className = 'settings-title-bar';

    const title: HTMLHeadingElement = document.createElement('h2');
    title.className = 'settings-title';
    title.textContent = 'Settings';
    titleBar.appendChild(title);

    const closeButton: HTMLButtonElement = document.createElement('button');
    closeButton.className = 'settings-close-btn';
    closeButton.textContent = '✕';
    closeButton.type = 'button';
    titleBar.appendChild(closeButton);

    settingsPanel.appendChild(titleBar);

    // Settings content
    const content: HTMLDivElement = document.createElement('div');
    content.className = 'settings-content';

    // Volume Control
    const volumeSection = createSettingSection('Master Volume', 'volume') as SettingSection;
    volumeSection.volumeSlider = createVolumeSlider('volume', settingsManager.getVolume() * 100);
    volumeSection.volumeValue = createValueLabel(Math.round(settingsManager.getVolume() * 100) + '%');
    volumeSection.appendChild(volumeSection.volumeSlider);
    volumeSection.appendChild(volumeSection.volumeValue);
    content.appendChild(volumeSection);

    //graphic quality
    const graphicsSection = createSettingSection('Graphics Quality', 'graphics-quality') as SettingSection;
    const currentQuality: String = settingsManager.getGraphicsQuality();
    graphicsSection.graphicsButtons = [];
    
    GRAPHICS_OPTIONS.forEach(function(label: string, index: number): void {
        const btn: HTMLButtonElement = createOptionButton(label, QUALITY_VALUES[index] === currentQuality);
        btn.value = QUALITY_VALUES[index];
        if (QUALITY_VALUES[index] === currentQuality) {
            btn.classList.add('selected');
        }
        graphicsSection.graphicsButtons.push(btn);
        graphicsSection.appendChild(btn);
    });
    content.appendChild(graphicsSection);

    //themes
    const themeSection = createSettingSection('Theme Preset', 'theme-preset') as SettingSection;
    const currentTheme: string = settingsManager.getTheme();
    const themeOptions = [
        { label: 'Default', value: 'default' },
        { label: 'Colorblind', value: 'colorblind' },
        { label: 'Monochrome', value: 'monochrome' }
    ];
    themeSection.themeButtons = [];

    themeOptions.forEach(function(option: Option): void {
        const btn: HTMLButtonElement = createOptionButton(option.label, option.value === currentTheme);
        btn.value = option.value;
        if (option.value === currentTheme) {
            btn.classList.add('selected');
        }
        themeSection.themeButtons.push(btn);
        themeSection.appendChild(btn);
    });
    content.appendChild(themeSection);

    // Game Speed Control
    var gameSpeedSection = createSettingSection('Game Speed', 'game-speed') as SettingSection;
    gameSpeedSection.speedSlider = createGameSpeedSlider('game-speed', settingsManager.getGameSpeed());
    gameSpeedSection.speedValue = createValueLabel((settingsManager.getGameSpeed() * 100).toFixed(0) + '%');
    gameSpeedSection.appendChild(gameSpeedSection.speedSlider);
    gameSpeedSection.appendChild(gameSpeedSection.speedValue);
    content.appendChild(gameSpeedSection);

    settingsPanel.appendChild(content);

    // Button bar
    var buttonBar = document.createElement('div');
    buttonBar.className = 'settings-button-bar';

    var resetButton = document.createElement('button');
    resetButton.className = 'settings-button settings-reset-btn';
    resetButton.type = 'button';
    resetButton.textContent = 'Reset to Defaults';
    buttonBar.appendChild(resetButton);

    var applyButton = document.createElement('button');
    applyButton.className = 'settings-button settings-apply-btn';
    applyButton.type = 'button';
    applyButton.textContent = 'Close';
    buttonBar.appendChild(applyButton);

    settingsPanel.appendChild(buttonBar);

    root.appendChild(settingsPanel);
    document.body.appendChild(root);

    root.addEventListener('click', function(event) {
        if (event.target === root) {
            closeButton.click();
        }
    });

    return {
        root: root,
        isVisible: false,

        show: function() {
            this.root.classList.remove('hidden');
            this.isVisible = true;
        },

        hide: function() {
            this.root.classList.add('hidden');
            this.isVisible = false;
        },

        onClose: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            closeButton.addEventListener('click', callback);
            applyButton.addEventListener('click', callback);
            
            // Also close on ESC key
            var self = this;
            var escHandler = function(event) {
                if (event.code === 'Escape' && self.isVisible) {
                    event.preventDefault();
                    callback();
                }
            };
            window.addEventListener('keydown', escHandler);
        },

        onReset: function(callback: () => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            resetButton.addEventListener('click', function() {
                if (confirm('Reset all settings to defaults?')) {
                    callback();
                    // Update UI after reset
                    volumeSection.volumeSlider.value = String(settingsManager.getVolume() * 100);
                    volumeSection.volumeValue.textContent = Math.round(settingsManager.getVolume() * 100) + '%';
                    
                    gameSpeedSection.speedSlider.value = settingsManager.getGameSpeed();
                    gameSpeedSection.speedValue.textContent = (settingsManager.getGameSpeed() * 100).toFixed(0) + '%';
                    
                    var newQuality = settingsManager.getGraphicsQuality();
                    graphicsSection.graphicsButtons.forEach(function(btn) {
                        btn.classList.remove('selected');
                        if (btn.value === newQuality) {
                            btn.classList.add('selected');
                        }
                    });
                    themeSection.themeButtons.forEach(function(btn) {
                        btn.classList.remove('selected');
                        if (btn.value === settingsManager.getTheme()) {
                            btn.classList.add('selected');
                        }
                    });
                }
            });
        },

        onVolumeChange: function(callback: (value: number) => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            volumeSection.volumeSlider.addEventListener('input', function(e: any) {
                var value = parseFloat(e.target.value) / 100;
                volumeSection.volumeValue.textContent = e.target.value + '%';
                callback(value);
            });
        },

        onGraphicsChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            graphicsSection.graphicsButtons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    graphicsSection.graphicsButtons.forEach(function(b) {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    callback(btn.value);
                });
            });
        },

        onThemeChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            themeSection.themeButtons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    themeSection.themeButtons.forEach(function(b) {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    callback(btn.value);
                });
            });
        },

        onGameSpeedChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            gameSpeedSection.speedSlider.addEventListener('input', function(e: any) {
                var value = parseFloat(e.target.value);
                gameSpeedSection.speedValue.textContent = (value * 100).toFixed(0) + '%';
                callback(value);
            });
        },
    };
}

// Helper function to create a settings section
function createSettingSection(labelText: string, dataValue?: string) {
    var section = document.createElement('div');
    section.className = 'settings-section';
    if (dataValue) {
        section.dataset.setting = dataValue;
    }

    var label = document.createElement('label');
    label.className = 'settings-label';
    label.textContent = labelText;
    section.appendChild(label);

    var controlsDiv = document.createElement('div');
    controlsDiv.className = 'settings-controls';
    section.appendChild(controlsDiv);

    // Override appendChild to add to controlsDiv instead
    var originalAppend = section.appendChild.bind(section);
    (section as any).appendChild = function(element: Node) {
        if (element === controlsDiv || element === label) {
            return originalAppend(element);
        }
        return controlsDiv.appendChild(element);
    };

    return section;
}

// Helper function to create volume slider
function createVolumeSlider(id, initialValue) {
    var container = document.createElement('div');
    container.className = 'slider-container';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = initialValue;
    slider.step = '5';

    container.appendChild(slider);
    return slider;
}

// Helper function to create game speed slider
function createGameSpeedSlider(id, initialValue) {
    var container = document.createElement('div');
    container.className = 'slider-container';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0.5';
    slider.max = '2.0';
    slider.value = initialValue;
    slider.step = '0.1';

    container.appendChild(slider);
    return slider;
}

// Helper function to create value label
function createValueLabel(text) {
    var label = document.createElement('span');
    label.className = 'settings-value-label';
    label.textContent = text;
    return label;
}

// Helper function to create option button
function createOptionButton(label, isSelected) {
    var btn = document.createElement('button');
    btn.className = 'settings-option-btn';
    btn.type = 'button';
    btn.textContent = label;
    if (isSelected) {
        btn.classList.add('selected');
    }
    return btn;
}
