import { creditsLines } from '../../../constants/credits';

export function createCreditsScreen(): {
    root: HTMLDivElement;
    viewport: HTMLDivElement;
    track: HTMLDivElement;
    scrollTimer: number | null;
    isVisible: boolean;
    show(): void;
    hide(): void;
} {
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

    const screen = {
        root: root,
        viewport: viewport,
        track: track,
        scrollTimer: null,
        isVisible: false,
        show: function() {
            this.root.classList.remove('hidden');
            this.isVisible = true;

            this.viewport.scrollTop = 0;

            let self = this;
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
            }

            this.scrollTimer = setInterval(function() {
                if (!self.isVisible) return;

                self.viewport.scrollTop += 1;
                // prevent overscrolling, loop
                if (self.viewport.scrollTop + self.viewport.clientHeight >= self.viewport.scrollHeight) {
                    self.viewport.scrollTop = 0;
                }
            }, 22);
        },
        hide: function() {
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
                this.scrollTimer = null;
            }
            this.root.classList.add('hidden');
            this.isVisible = false;
        }
    };

    closeButton.addEventListener('click', function() {
        screen.hide();
    });

    root.addEventListener('click', function(event) {
        if (event.target === root) screen.hide();
    });

    window.addEventListener('keydown', function(event) {
        if (event.code === 'Escape' && screen.isVisible) {
            event.preventDefault();
            screen.hide();
        }
    });

    return screen;
}
