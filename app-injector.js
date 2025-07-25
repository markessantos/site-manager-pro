/**
 * App Injector - Injetor Principal do Site Manager Pro
 * Script que o app executa para iniciar todo o sistema
 */

class AppInjector {
    constructor() {
        this.config = {
            repository: 'markessantos/site-manager-pro',
            branch: 'main',
            baseUrl: 'https://raw.githubusercontent.com/markessantos/site-manager-pro/main/',
            loaderFile: 'github-loader.js',
            retryAttempts: 3,
            retryDelay: 2000
        };
        
        this.isInjected = false;
        this.retryCount = 0;
        
        console.log('🚀 App Injector - Site Manager Pro iniciado');
    }

    async inject() {
        if (this.isInjected) {
            console.log('⚠️ Site Manager já foi injetado');
            return;
        }
        
        try {
            console.log('📡 Conectando ao GitHub...');
            
            // Verifica se já existe uma instância
            if (window.siteManagerLoader) {
                console.log('✅ Site Manager já carregado');
                return;
            }
            
            // Carrega o loader principal do GitHub
            await this.loadGitHubLoader();
            
            this.isInjected = true;
            console.log('✅ Site Manager Pro injetado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao injetar Site Manager:', error);
            await this.handleRetry();
        }
    }

    async loadGitHubLoader() {
        const loaderUrl = this.config.baseUrl + this.config.loaderFile;
        
        try {
            // Fetch do arquivo loader
            const response = await fetch(loaderUrl);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const loaderScript = await response.text();
            
            // Executa o script do loader
            this.executeScript(loaderScript);
            
            console.log('📁 GitHub Loader carregado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao carregar GitHub Loader:', error);
            throw error;
        }
    }

    executeScript(scriptContent) {
        try {
            // Cria e executa o script
            const script = document.createElement('script');
            script.textContent = scriptContent;
            script.setAttribute('data-source', 'site-manager-pro');
            
            // Adiciona ao head
            document.head.appendChild(script);
            
            console.log('📜 Script executado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao executar script:', error);
            throw error;
        }
    }

    async handleRetry() {
        if (this.retryCount < this.config.retryAttempts) {
            this.retryCount++;
            console.log(`🔄 Tentativa ${this.retryCount}/${this.config.retryAttempts} em ${this.config.retryDelay}ms...`);
            
            setTimeout(() => {
                this.inject();
            }, this.config.retryDelay);
        } else {
            console.error('❌ Falha ao carregar Site Manager após todas as tentativas');
            this.showFallbackMessage();
        }
    }

    showFallbackMessage() {
        // Cria mensagem de fallback
        const fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                z-index: 1000000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
                ⚠️ Site Manager Pro offline<br>
                <small>Verifique sua conexão com a internet</small>
            </div>
        `;
        
        document.body.appendChild(fallbackDiv);
        
        // Remove após 10 segundos
        setTimeout(() => {
            if (fallbackDiv.parentNode) {
                fallbackDiv.parentNode.removeChild(fallbackDiv);
            }
        }, 10000);
    }

    // Método para verificar status da conexão
    async checkConnection() {
        try {
            const response = await fetch(this.config.baseUrl + 'README.md', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Método para forçar recarregamento
    async forceReload() {
        this.isInjected = false;
        this.retryCount = 0;
        
        // Remove instâncias existentes
        if (window.siteManagerLoader) {
            delete window.siteManagerLoader;
        }
        
        if (window.siteManagerButton) {
            delete window.siteManagerButton;
        }
        
        // Remove elementos existentes
        const existingButton = document.getElementById('site-manager-floating-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        const existingPanel = document.getElementById('site-manager-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Reinicia injeção
        await this.inject();
    }

    // Método para debug
    getStatus() {
        return {
            isInjected: this.isInjected,
            retryCount: this.retryCount,
            hasLoader: !!window.siteManagerLoader,
            hasButton: !!window.siteManagerButton,
            config: this.config
        };
    }
}

// Função principal de inicialização
function initializeSiteManager() {
    // Verifica se já foi inicializado
    if (window.siteManagerInjector) {
        console.log('⚠️ Site Manager Injector já existe');
        return;
    }
    
    // Cria instância global
    window.siteManagerInjector = new AppInjector();
    
    // Inicia injeção
    window.siteManagerInjector.inject();
    
    // Adiciona métodos globais para debug
    window.reloadSiteManager = () => window.siteManagerInjector.forceReload();
    window.getSiteManagerStatus = () => window.siteManagerInjector.getStatus();
}

// Auto-inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSiteManager);
} else {
    initializeSiteManager();
}

// Exporta para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppInjector, initializeSiteManager };
}

// Adiciona listener para mudanças de página (SPA)
let currentUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('🔄 Página mudou, verificando Site Manager...');
        
        // Reinicia se necessário
        if (window.siteManagerInjector && !window.siteManagerButton) {
            setTimeout(() => {
                window.siteManagerInjector.forceReload();
            }, 1000);
        }
    }
}, 1000);

console.log('🎯 App Injector carregado e pronto!');
