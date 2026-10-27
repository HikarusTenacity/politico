import { creditsLines } from '../../../constants/credits';
import type {CreditsScreen} from "../../../types/credits-types";

export function createCreditsScreen(): CreditsScreen {
    const root: HTMLDivElement = document.createElement('div');
    root.className = 'credits-overlay hidden';

    const panel: HTMLDivElement = document.createElement('div');
    panel.className = 'credits-panel';

    const titleBar: HTMLDivElement = document.createElement('div');
    titleBar.className = 'credits-title-bar';

    const title: HTMLHeadingElement = document.createElement('h2');
    title.className = 'credits-title';
    title.textContent = 'Credits';
    titleBar.appendChild(title);

    const closeButton: HTMLButtonElement = document.createElement('button');
    closeButton.className = 'credits-close-button';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    titleBar.appendChild(closeButton);

    panel.appendChild(titleBar);

    const viewport: HTMLDivElement = document.createElement('div');
    viewport.className = 'credits-scroll-viewport';

    const track: HTMLDivElement = document.createElement('div');
    track.className = 'credits-scroll-track';

    for (let i = 0; i < creditsLines.length; i++) {
        const line = document.createElement('div');
        line.className = i % 2 === 0 ? 'credits-line credits-line-strong' : 'credits-line';
        line.textContent = creditsLines[i] || '\u00A0';
        track.appendChild(line);
    }

    viewport.appendChild(track);
    panel.appendChild(viewport);
    root.appendChild(panel);
    document.body.appendChild(root);

    const screen: CreditsScreen = {
        root: root,
        viewport: viewport,
        track: track,
        scrollTimer: null,
        isVisible: false,
        show: function() {
            this.root.classList.remove('hidden');
            this.isVisible = true;

            this.viewport.scrollTop = 0;

            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
            }

            this.scrollTimer = setInterval((): void => {
                if (!this.isVisible) return;

                this.viewport.scrollTop += 1;
                // prevent overscrolling, loop
                if (this.viewport.scrollTop + this.viewport.clientHeight >= this.viewport.scrollHeight) {
                    this.viewport.scrollTop = 0;
                }
            }, 22);
        },
        hide: function(): void {
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
                this.scrollTimer = null;
            }
            this.root.classList.add('hidden');
            this.isVisible = false;
        }
    };

    closeButton.addEventListener('click', function(): void {
        screen.hide();
    });

    root.addEventListener('click', function(event: MouseEvent): void {
        if (event.target === root) screen.hide();
    });

    window.addEventListener('keydown', function(event: KeyboardEvent): void {
        if (event.code === 'Escape' && screen.isVisible) {
            event.preventDefault();
            screen.hide();
        }
    });

    return screen;
}
