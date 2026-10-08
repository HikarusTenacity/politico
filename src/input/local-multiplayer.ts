import {ButtonColor, LocalMultiplayerInput} from "../types/input";

function createLocalMultiplayerInput() {
    const bcolors = {
        green:  { bg: 'var(--theme-action-green-bg)', border: 'var(--theme-action-green-border)', shadow: 'var(--theme-action-green-shadow)' },
        blue:   { bg: 'var(--theme-action-blue-bg)', border: 'var(--theme-action-blue-border)', shadow: 'var(--theme-action-blue-shadow)' },
        orange: { bg: 'var(--theme-action-orange-bg)', border: 'var(--theme-action-orange-border)', shadow: 'var(--theme-action-orange-shadow)' },
        red:    { bg: 'var(--theme-action-red-bg)', border: 'var(--theme-action-red-border)', shadow: 'var(--theme-action-red-shadow)' }
    };

    const input: LocalMultiplayerInput = {
        onActionForPlayer: null,
        onRawKeyInput: null,
        actionButton: null,
        
        init: function() {
            let self = this;
            this.createActionButton();
        },

        update: function() {
        },
        
        createActionButton: function() {
            let self = this;
            
            this.actionButton = document.createElement('button');
            this.actionButton.id = 'actionButton';
            this.actionButton.textContent = 'Click to Start';
            this.actionButton.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 20px 60px;
                font-size: 28px;
                font-weight: bold;
                font-family: var(--game-font);
                background: linear-gradient(180deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: 4px solid #2d6b2f;
                border-radius: 12px;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 6px 0 #1e4620, 0 10px 20px rgba(0,0,0,0.4);
                text-transform: uppercase;
                letter-spacing: 2px;
                transition: all 0.1s ease;
                pointer-events: auto;
                -webkit-font-smoothing: none;
                text-rendering: optimizeSpeed;
                filter: blur(var(--lofi-text-blur-controls));
            `;

            this.actionButton.addEventListener('click', () => {
                this.onActionForPlayer?.('ANY', 'ACTION');
            });

            this.actionButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(-50%) translateY(-2px)';
                this.style.boxShadow = '0 8px 0 #1e4620, 0 12px 25px rgba(0,0,0,0.5)';
            });
            
            this.actionButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(-50%)';
                this.style.boxShadow = '0 6px 0 #1e4620, 0 10px 20px rgba(0,0,0,0.4)';
            });
            
            this.actionButton.addEventListener('mousedown', function() {
                this.style.transform = 'translateX(-50%) translateY(3px)';
                this.style.boxShadow = '0 3px 0 #1e4620, 0 5px 15px rgba(0,0,0,0.4)';
            });
            
            this.actionButton.addEventListener('mouseup', function() {
                this.style.transform = 'translateX(-50%) translateY(-2px)';
                this.style.boxShadow = '0 8px 0 #1e4620, 0 12px 25px rgba(0,0,0,0.5)';
            });
            
            document.body.appendChild(this.actionButton);
        },
        
        setButtonText: function(text: string = "placeholder") {
            if (this.actionButton) {
                this.actionButton.textContent = text;
            }
        },
        
        setButtonColor: function(color: ButtonColor = 'green') {
            if (this.actionButton) {
                const c: {
                    bg: string,
                    border: string,
                    shadow: string
                } = bcolors[color] ?? bcolors.green;
                this.actionButton.style.background = c.bg;
                this.actionButton.style.borderColor = c.border;
                this.actionButton.style.boxShadow = `0 6px 0 ${c.shadow}, 0 10px 20px rgba(0,0,0,0.4)`;
            }
        }
    };
    
    return input;
}
