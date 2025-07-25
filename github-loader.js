/**
 * GitHub Loader - Carregador Principal do Site Manager Pro
 * Injeta botão flutuante em todas as páginas automaticamente
 */

class GitHubLoader {
    constructor() {
        this.config = {
            repository: 'markessantos/site-manager-pro',
            branch: 'main',
            baseUrl: 'https://raw.githubusercontent.com/markessantos/site-manager-pro/main/',
            files: [
                'floating-button.js',
                'site-manager.js', 
                'crypto-engine.js',
                'floating-ui.css'
            ]
        };
        this.loadedFiles = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Site Manager Pro - Iniciando carregamento do GitHub...');
        
        try {
            await this.loadAllFiles();
            await this.injectFloatingButton();
            this.isInitialized = true;
            console.log('✅ Site Manager Pro - Carregado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao carregar Site Manager Pro:', error);
        }
    }

    async loadAllFiles() {
        const promises = this.config.files.map(file => this.loadFile(file));
        await Promise.all(promises);
    }

    async loadFile(filename) {
        try {
            const url = this.config.baseUrl + filename;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${filename}: ${response.status}`);
            }
            
            const content = await response.text();
            this.loadedFiles.set(filename, content);
            
            // Injeta CSS imediatamente
            if (filename.endsWith('.css')) {
                this.injectCSS(content);
            }
            
            console.log(`📁 Carregado: ${filename}`);
        } catch (error) {
            console.error(`❌ Erro ao carregar ${filename}:`, error);
            throw error;
        }
    }

    injectCSS(cssContent) {
        const style = document.createElement('style');
        style.textContent = cssContent;
        document.head.appendChild(style);
    }

    async injectFloatingButton() {
        // Injeta o script do botão flutuante
        const buttonScript = this.loadedFiles.get('floating-button.js');
        const siteManagerScript = this.loadedFiles.get('site-manager.js');
        const cryptoScript = this.loadedFiles.get('crypto-engine.js');
        
        if (buttonScript && siteManagerScript && cryptoScript) {
            // Executa scripts na ordem correta
            this.executeScript(cryptoScript);
            this.executeScript(siteManagerScript);
            this.executeScript(buttonScript);
        }
    }

    executeScript(scriptContent) {
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
    }

    // Método para recarregar arquivos do GitHub
    async reload() {
        this.loadedFiles.clear();
        this.isInitialized = false;
        await this.init();
    }
}

// Auto-inicialização quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.siteManagerLoader = new GitHubLoader();
        window.siteManagerLoader.init();
    });
} else {
    window.siteManagerLoader = new GitHubLoader();
    window.siteManagerLoader.init();
}
