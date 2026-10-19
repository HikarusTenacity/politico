// Settings Menu UI
import {GRAPHICS_OPTIONS, QUALITY_VALUES} from "../../../constants/ui-parameters";
import type {Option} from "../../../types/ui-types";
import type {GraphicsQuality, SettingsManager} from "../../../types/settings-types";
import type {GameThemeName} from "../../../types/theme";

type SettingSection = HTMLDivElement & {
    controls: HTMLDivElement;
    volumeSlider: HTMLInputElement;
    volumeValue: HTMLSpanElement;
    graphicsButtons: HTMLButtonElement[];
    speedSlider: HTMLInputElement;
    speedValue: HTMLSpanElement;
    themeButtons: HTMLButtonElement[];
};

interface SettingsMenu {
    root: HTMLDivElement;
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClose(callback: () => void): void;
    onReset(callback: () => void): void;
    onVolumeChange(callback: (value: number) => void): void;
    onGraphicsChange(callback: (value: GraphicsQuality) => void): void;
    onThemeChange(callback: (value: GameThemeName) => void): void;
    onGameSpeedChange(callback: (value: number) => void): void;
}

export function createSettingsMenu(settingsManager: SettingsManager): SettingsMenu {
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
    volumeSection.controls.appendChild(volumeSection.volumeSlider);
    volumeSection.controls.appendChild(volumeSection.volumeValue);
    content.appendChild(volumeSection);

    //graphic quality
    const graphicsSection = createSettingSection(
        'Graphics Quality',
        'graphics-quality'
    ) as SettingSection;
    const currentQuality: string = settingsManager.getGraphicsQuality();
    graphicsSection.graphicsButtons = [];
    
    GRAPHICS_OPTIONS.forEach(function(label: string, index: number): void {
        const quality = QUALITY_VALUES[index];
        if (!quality) return;
        const btn: HTMLButtonElement = createOptionButton(label, quality === currentQuality);
        btn.value = quality;
        if (quality === currentQuality) {
            btn.classList.add('selected');
        }
        graphicsSection.graphicsButtons.push(btn);
        graphicsSection.controls.appendChild(btn);
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
        themeSection.controls.appendChild(btn);
    });
    content.appendChild(themeSection);

    // Game Speed Control
    const gameSpeedSection = createSettingSection('Game Speed', 'game-speed') as SettingSection;
    gameSpeedSection.speedSlider = createGameSpeedSlider('game-speed', settingsManager.getGameSpeed());
    gameSpeedSection.speedValue = createValueLabel((settingsManager.getGameSpeed() * 100).toFixed(0) + '%');
    gameSpeedSection.controls.appendChild(gameSpeedSection.speedSlider);
    gameSpeedSection.controls.appendChild(gameSpeedSection.speedValue);
    content.appendChild(gameSpeedSection);

    settingsPanel.appendChild(content);

    // Button bar
    const buttonBar: HTMLDivElement = document.createElement('div');
    buttonBar.className = 'settings-button-bar';

    const resetButton: HTMLButtonElement = document.createElement('button');
    resetButton.className = 'settings-button settings-reset-btn';
    resetButton.type = 'button';
    resetButton.textContent = 'Reset to Defaults';
    buttonBar.appendChild(resetButton);

    const applyButton: HTMLButtonElement = document.createElement('button');
    applyButton.className = 'settings-button settings-apply-btn';
    applyButton.type = 'button';
    applyButton.textContent = 'Close';
    buttonBar.appendChild(applyButton);

    settingsPanel.appendChild(buttonBar);

    root.appendChild(settingsPanel);
    document.body.appendChild(root);

    root.addEventListener('click', function(event: MouseEvent): void {
        if (event.target === root) {
            closeButton.click();
        }
    });

    const menu: SettingsMenu = {
        root: root,
        isVisible: false,

        show: function(): void {
            this.root.classList.remove('hidden');
            this.isVisible = true;
        },

        hide: function(): void {
            this.root.classList.add('hidden');
            this.isVisible = false;
        },

        onClose: function(callback: () => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            closeButton.addEventListener('click', callback);
            applyButton.addEventListener('click', callback);
            
            // Also close on ESC key
            const escHandler = function(event: KeyboardEvent): void {
                if (event.code === 'Escape' && menu.isVisible) {
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
            resetButton.addEventListener('click', function(): void {
                if (confirm('Reset all settings to defaults?')) {
                    callback();
                    // Update UI after reset
                    volumeSection.volumeSlider.value = String(settingsManager.getVolume() * 100);
                    volumeSection.volumeValue.textContent = Math.round(settingsManager.getVolume() * 100) + '%';
                    
                    gameSpeedSection.speedSlider.value = String(settingsManager.getGameSpeed());
                    gameSpeedSection.speedValue.textContent = (settingsManager.getGameSpeed() * 100).toFixed(0) + '%';
                    
                    const newQuality: GraphicsQuality = settingsManager.getGraphicsQuality();
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
            volumeSection.volumeSlider.addEventListener('input', function(e: Event): void {
                const target = e.currentTarget;
                if (!(target instanceof HTMLInputElement)) return;
                const value: number = Number.parseFloat(target.value) / 100;
                volumeSection.volumeValue.textContent = target.value + '%';
                callback(value);
            });
        },

        onGraphicsChange: function(callback: (value: GraphicsQuality) => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            graphicsSection.graphicsButtons.forEach(function(btn: HTMLButtonElement): void {
                btn.addEventListener('click', function() {
                    graphicsSection.graphicsButtons.forEach(function(b: HTMLButtonElement): void {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    if (btn.value === 'low' || btn.value === 'medium' || btn.value === 'high') {
                        callback(btn.value);
                    }
                });
            });
        },

        onThemeChange: function(callback: (value: GameThemeName) => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            themeSection.themeButtons.forEach(function(btn: HTMLButtonElement): void {
                btn.addEventListener('click', function() {
                    themeSection.themeButtons.forEach(function(b: HTMLButtonElement): void {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    if (btn.value === 'default' || btn.value === 'colorblind' || btn.value === 'monochrome') {
                        callback(btn.value);
                    }
                });
            });
        },

        onGameSpeedChange: function(callback: (value: number) => void): void {
            if (typeof callback !== 'function') {
                return;
            }
            gameSpeedSection.speedSlider.addEventListener('input', function(e: Event): void {
                const target = e.currentTarget;
                if (!(target instanceof HTMLInputElement)) return;
                const value: number = Number.parseFloat(target.value);
                gameSpeedSection.speedValue.textContent = (value * 100).toFixed(0) + '%';
                callback(value);
            });
        },
    };
    return menu;
}

// Helper function to create a settings section
function createSettingSection(labelText: string, dataValue?: string): HTMLDivElement {
    const section = document.createElement('div') as SettingSection;
    section.className = 'settings-section';
    if (dataValue) {
        section.dataset.setting = dataValue;
    }

    const label: HTMLLabelElement = document.createElement('label');
    label.className = 'settings-label';
    label.textContent = labelText;
    section.appendChild(label);

    const controlsDiv: HTMLDivElement = document.createElement('div');
    controlsDiv.className = 'settings-controls';
    section.appendChild(controlsDiv);
    section.controls = controlsDiv;

    return section;
}

// Helper function to create volume slider
function createVolumeSlider(id: string, initialValue: number): HTMLInputElement {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'slider-container';

    const slider: HTMLInputElement = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = String(initialValue);
    slider.step = '5';

    container.appendChild(slider);
    return slider;
}

// Helper function to create game speed slider
function createGameSpeedSlider(id: string, initialValue: number): HTMLInputElement {
    const slider: HTMLInputElement = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0.5';
    slider.max = '2.0';
    slider.value = String(initialValue);
    slider.step = '0.1';

    return slider;
}

// Helper function to create value label
function createValueLabel(text: string): HTMLSpanElement {
    const label: HTMLSpanElement = document.createElement('span');
    label.className = 'settings-value-label';
    label.textContent = text;
    return label;
}

// Helper function to create option button
function createOptionButton(label: string, isSelected: boolean): HTMLButtonElement {
    const btn: HTMLButtonElement = document.createElement('button');
    btn.className = 'settings-option-btn';
    btn.type = 'button';
    btn.textContent = label;
    if (isSelected) {
        btn.classList.add('selected');
    }
    return btn;
}
