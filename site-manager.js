/**
 * Site Manager - Gerenciador Principal do Site Manager Pro
 * Substitui as funcionalidades da extensão original
 */

class SiteManager {
    constructor() {
        this.config = {
            targetUrl: 'brasil.uaitool.in/content/p/id/2/',
            requiredUrl: 'https://brasil.uaitool.in/content/p/id/2/',
            clipboardTimeout: 5000,
            maxRetries: 3
        };
        
        this.cryptoEngine = null;
        this.isActivated = false;
        this.currentData = null;
        
        this.init();
    }

    init() {
        // Inicializa o motor de criptografia
        if (window.CryptoEngine) {
            this.cryptoEngine = new window.CryptoEngine();
        }
        
        console.log('🎯 Site Manager inicializado');
    }

    async activate() {
        try {
            console.log('🚀 Iniciando ativação do site...');
            
            // Verifica se está na página correta
            if (!this.isOnTargetSite()) {
                throw new Error('Você precisa estar em brasil.uaitool.in/content/p/id/2/');
            }
            
            // Lê dados da área de transferência
            const clipboardData = await this.readClipboard();
            if (!clipboardData) {
                throw new Error('Nenhum dado encontrado na área de transferência');
            }
            
            // Descriptografa os dados
            const decryptedData = await this.decryptData(clipboardData);
            if (!decryptedData) {
                throw new Error('Falha ao descriptografar os dados');
            }
            
            // Aplica os dados no site
            await this.applySiteData(decryptedData);
            
            this.isActivated = true;
            this.showSuccess('Site ativado com sucesso! 🎉');
            
        } catch (error) {
            console.error('❌ Erro na ativação:', error);
            this.showError(error.message);
        }
    }

    isOnTargetSite() {
        return window.location.href.includes(this.config.targetUrl);
    }

    async readClipboard() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                console.log('📋 Dados lidos da área de transferência');
                return text;
            } else {
                throw new Error('API de área de transferência não disponível');
            }
        } catch (error) {
            console.error('❌ Erro ao ler área de transferência:', error);
            return null;
        }
    }

    async decryptData(encryptedData) {
        if (!this.cryptoEngine) {
            console.error('❌ Motor de criptografia não disponível');
            return null;
        }
        
        try {
            const decrypted = await this.cryptoEngine.decrypt(encryptedData);
            console.log('🔓 Dados descriptografados com sucesso');
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('❌ Erro na descriptografia:', error);
            return null;
        }
    }

    async applySiteData(data) {
        try {
            // Aplica cookies se existirem
            if (data.cookies && Array.isArray(data.cookies)) {
                await this.applyCookies(data.cookies);
            }
            
            // Aplica dados de formulário se existirem
            if (data.formData) {
                await this.applyFormData(data.formData);
            }
            
            // Executa auto-login se configurado
            if (data.autoLogin) {
                await this.performAutoLogin(data.autoLogin);
            }
            
            console.log('✅ Dados aplicados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao aplicar dados:', error);
            throw error;
        }
    }

    async applyCookies(cookies) {
        for (const cookie of cookies) {
            try {
                // Aplica cookie usando document.cookie
                const cookieString = `${cookie.name}=${cookie.value}; path=${cookie.path || '/'}; domain=${cookie.domain || window.location.hostname}`;
                document.cookie = cookieString;
                console.log(`🍪 Cookie aplicado: ${cookie.name}`);
            } catch (error) {
                console.error(`❌ Erro ao aplicar cookie ${cookie.name}:`, error);
            }
        }
    }

    async applyFormData(formData) {
        for (const [selector, value] of Object.entries(formData)) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.value = value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`📝 Campo preenchido: ${selector}`);
                }
            } catch (error) {
                console.error(`❌ Erro ao preencher campo ${selector}:`, error);
            }
        }
    }

    async performAutoLogin(loginData) {
        try {
            // Preenche campos de login
            if (loginData.username && loginData.usernameSelector) {
                const usernameField = document.querySelector(loginData.usernameSelector);
                if (usernameField) {
                    usernameField.value = loginData.username;
                    usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            if (loginData.password && loginData.passwordSelector) {
                const passwordField = document.querySelector(loginData.passwordSelector);
                if (passwordField) {
                    passwordField.value = loginData.password;
                    passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            // Clica no botão de login se especificado
            if (loginData.submitSelector) {
                setTimeout(() => {
                    const submitButton = document.querySelector(loginData.submitSelector);
                    if (submitButton) {
                        submitButton.click();
                        console.log('🔑 Auto-login executado');
                    }
                }, 1000);
            }
            
        } catch (error) {
            console.error('❌ Erro no auto-login:', error);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Cria notificação flutuante
        const notification = document.createElement('div');
        notification.className = `sm-notification sm-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 1000001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // Define cor baseada no tipo
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Método para recarregar configurações do GitHub
    async reloadConfig() {
        try {
            // Recarrega configurações do GitHub se necessário
            console.log('🔄 Recarregando configurações...');
        } catch (error) {
            console.error('❌ Erro ao recarregar configurações:', error);
        }
    }
}

// Disponibiliza globalmente
window.SiteManager = SiteManager;
