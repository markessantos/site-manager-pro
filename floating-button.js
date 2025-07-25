/**
 * Floating Button - Botão Flutuante do Site Manager Pro
 * Interface principal que substitui a extensão Chrome
 */

class FloatingButton {
    constructor() {
        this.isVisible = false;
        this.isDragging = false;
        this.position = { x: window.innerWidth - 80, y: 100 };
        this.button = null;
        this.panel = null;
        this.siteManager = null;
        
        this.init();
    }

    init() {
        this.createButton();
        this.createPanel();
        this.attachEvents();
        
        // Inicializa o gerenciador de sites
        if (window.SiteManager) {
            this.siteManager = new window.SiteManager();
        }
        
        console.log('🎯 Botão flutuante criado com sucesso!');
    }

    createButton() {
        this.button = document.createElement('div');
        this.button.id = 'site-manager-floating-btn';
        this.button.innerHTML = `
            <div class="sm-btn-icon">🚀</div>
            <div class="sm-btn-text">Site Manager</div>
        `;
        
        this.button.style.cssText = `
            position: fixed;
            top: ${this.position.y}px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            user-select: none;
        `;
        
        document.body.appendChild(this.button);
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'site-manager-panel';
        this.panel.innerHTML = `
            <div class="sm-panel-header">
                <h3>🚀 Site Manager Pro</h3>
                <button class="sm-close-btn">×</button>
            </div>
            <div class="sm-panel-content">
                <div class="sm-status" id="sm-status">
                    <span class="sm-status-icon">⏳</span>
                    <span class="sm-status-text">Verificando...</span>
                </div>
                
                <button class="sm-activate-btn" id="sm-activate-btn" disabled>
                    🚀 Ativar Site
                </button>
                
                <div class="sm-instructions">
                    <h4>📋 Como usar:</h4>
                    <ol>
                        <li>Abra <strong>brasil.uaitool.in/content/p/id/2/</strong></li>
                        <li>Gere dados no gerador</li>
                        <li>Clique em "🚀 Ativar Site"</li>
                    </ol>
                </div>
                
                <div class="sm-github-info">
                    <small>📡 Carregado do GitHub</small>
                </div>
            </div>
        `;
        
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 1000000;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        document.body.appendChild(this.panel);
    }

    attachEvents() {
        // Clique no botão
        this.button.addEventListener('click', () => this.togglePanel());
        
        // Fechar painel
        const closeBtn = this.panel.querySelector('.sm-close-btn');
        closeBtn.addEventListener('click', () => this.hidePanel());
        
        // Ativar site
        const activateBtn = this.panel.querySelector('#sm-activate-btn');
        activateBtn.addEventListener('click', () => this.activateSite());
        
        // Arrastar botão
        this.button.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && !this.button.contains(e.target)) {
                this.hidePanel();
            }
        });
        
        // Hover effects
        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'scale(1.1)';
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'scale(1)';
        });
    }

    togglePanel() {
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    showPanel() {
        this.panel.style.display = 'block';
        this.isVisible = true;
        
        // Verifica status do site
        this.checkSiteStatus();
    }

    hidePanel() {
        this.panel.style.display = 'none';
        this.isVisible = false;
    }

    async checkSiteStatus() {
        const statusEl = this.panel.querySelector('#sm-status');
        const activateBtn = this.panel.querySelector('#sm-activate-btn');
        
        // Verifica se está na página correta
        if (window.location.href.includes('brasil.uaitool.in/content/p/id/2/')) {
            statusEl.innerHTML = '<span class="sm-status-icon">✅</span><span class="sm-status-text">Pronto para ativar</span>';
            activateBtn.disabled = false;
        } else {
            statusEl.innerHTML = '<span class="sm-status-icon">⚠️</span><span class="sm-status-text">Abra a página correta</span>';
            activateBtn.disabled = true;
        }
    }

    async activateSite() {
        if (this.siteManager) {
            await this.siteManager.activate();
        } else {
            console.error('SiteManager não disponível');
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.dragOffset = {
            x: e.clientX - this.button.offsetLeft,
            y: e.clientY - this.button.offsetTop
        };
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // Limita às bordas da tela
        const maxX = window.innerWidth - this.button.offsetWidth;
        const maxY = window.innerHeight - this.button.offsetHeight;
        
        this.position.x = Math.max(0, Math.min(x, maxX));
        this.position.y = Math.max(0, Math.min(y, maxY));
        
        this.button.style.left = this.position.x + 'px';
        this.button.style.top = this.position.y + 'px';
        this.button.style.right = 'auto';
    }

    stopDrag() {
        this.isDragging = false;
    }
}

// Inicializa o botão flutuante
if (!window.siteManagerButton) {
    window.siteManagerButton = new FloatingButton();
}
