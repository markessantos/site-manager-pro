// Anti-debug protection
(function(){var a=0;setInterval(function(){if(a++>100)debugger;},50);})();
// ... existing code ...
// Sistema de criptografia ultra-avançado com múltiplas camadas
const _enc = {
    // Camada 1: Fragmentos criptografados com XOR
    a: 'WVAkMGNITTZMeTlpY21GemFXd3VkV0ZwZEc5dmJDNXBiaTlqYjI1MFpXNTBMM0F2YVdRdk1pOD0=',
    b: 'VEc1VlXkDBMjlzTGladQ==',
    c: 'TDJOdmJuUmxiblF2Y0M5cFpDOHlMdz09',
    d: 'VEhkOVBRPT0=',
    
    // Camada 2: Chaves de verificação
    k1: 'VTJsMFpVMWg=',
    k2: 'Ym1GblpYST0=',
    k3: 'TWpBeU5BPT0=',
    
    // Camada 3: Selo para aferição adicional
    seal: 'U2l0ZU1hbmFnZXJQcm8yMDI0',
    
    // Função de decodificação multi-camada
    decode: function(str) {
        try {
            return atob(str);
        } catch (e) {
            console.error('Erro na decodificação:', e);
            return '';
        }
    },
    
    // Verificação de integridade temporal
    checkTime: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        return (year >= 2024 && month >= 1);
    },
    
    // Reconstrução da URL com verificação
    getUrl: function() {
        if (!this.checkTime()) {
            throw new Error('Verificação temporal falhou');
        }
        
        const key = this.decode(this.k1) + this.decode(this.k2) + this.decode(this.k3);
        if (key !== 'SiteManagerPro2024') {
            throw new Error('Verificação de chave falhou');
        }
        
        return this.decode(this.a) + this.decode(this.b) + this.decode(this.c) + this.decode(this.d);
    }
};

// Site Manager Pro - Service Worker Avançado
// Compatível com Cookie Editor e Cookies de Sessão

chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Site Manager Pro instalado com sucesso!');
});

// Listener principal para mensagens
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSitePopup') {
        handleOpenSitePopup(request.data)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error('❌ Erro no background:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Resposta assíncrona
    }
    
    // NOVO: Listener para abrir novos popups
    if (request.action === 'openNewPopup') {
        handleOpenNewPopup(request.url)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error('❌ Erro ao abrir novo popup:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

// NOVA FUNÇÃO: Abre novo popup do Chrome
async function handleOpenNewPopup(url) {
    try {
        console.log('🆕 Abrindo novo popup para:', url);
        
        const popup = await chrome.windows.create({
            url: url,
            type: 'popup',
            width: 1000,
            height: 700,
            focused: true,
            setSelfAsOpener: false
        });
        
        const tab = popup.tabs[0];
        activeTabIds.add(tab.id);
        
        // Aguarda carregamento e injeta controles
        await waitForCompleteLoad(tab.id);
        setupNavigationMonitoring(tab.id);
        await injectFloatingNavigationButtons(tab.id);
        await injectF12Blocker(tab.id);
        await injectNavigationControl(tab.id);
        
        return { success: true, tabId: tab.id, windowId: popup.id };
    } catch (error) {
        console.error('💥 Erro ao abrir novo popup:', error);
        return { success: false, error: error.message };
    }
}

// Armazena IDs de abas ativas para monitoramento
const activeTabIds = new Set();

// Função principal renovada para abrir site em popup
async function handleOpenSitePopup(siteData) {
    try {
        console.log('📦 Dados recebidos:', siteData);
        
        // Verificação da URL obrigatória
        const tabs = await chrome.tabs.query({});
        const requiredUrl = 'https://brasil.uaitool.in/content/p/id/2/';
        const requiredUrlFound = tabs.some(tab => 
            tab.url && tab.url.includes(requiredUrl)
        );
        
        if (!requiredUrlFound) {
            throw new Error('URL obrigatória não encontrada. Abra https://brasil.uaitool.in/content/p/id/2/ em qualquer aba primeiro.');
        }
        
        // Validação rigorosa dos dados
        if (!siteData || (!siteData.url && !siteData.site)) {
            throw new Error('URL do site não fornecida nos dados');
        }

        const targetUrl = siteData.url || siteData.site;
        console.log('🌐 URL de destino:', targetUrl);
        
        // Configuração de proxy se fornecido
        if (siteData.proxy) {
            console.log('🔄 Proxy configurado:', siteData.proxy);
            // Aqui você pode implementar configuração de proxy se necessário
        }
        
        // Cria janela popup otimizada - TAMANHO REDUZIDO
        const popup = await chrome.windows.create({
            url: 'about:blank',
            type: 'popup',
            width: 1000,  // Reduzido de 1400 para 1000
            height: 700,  // Reduzido de 900 para 700
            focused: true,
            setSelfAsOpener: false
        });

        const tab = popup.tabs[0];
        console.log('🪟 Popup criado - Tab ID:', tab.id);
        
        // Adiciona o ID da aba à lista de monitoramento
        activeTabIds.add(tab.id);
        
        // Aplica cookies com sistema ultra-robusto
        if (siteData.cookies) {
            console.log('🍪 Aplicando cookies...');
            await applyCookiesUltraRobust(targetUrl, siteData.cookies);
        }

        // Navega para o site
        console.log('🧭 Navegando para:', targetUrl);
        await chrome.tabs.update(tab.id, { url: targetUrl });

        // Aguarda carregamento completo
        await waitForCompleteLoad(tab.id);

        // Configura monitoramento de navegação para esta aba
        setupNavigationMonitoring(tab.id);

        // Injeta botões flutuantes de navegação
        await injectFloatingNavigationButtons(tab.id);

        // Injeta bloqueio F12 e DevTools
        await injectF12Blocker(tab.id);

        // Injeta controle de navegação
        await injectNavigationControl(tab.id);

        // Login automático se há credenciais
        if (siteData.email && siteData.password) {
            console.log('🔐 Iniciando login automático...');
            await injectMegaAutoLogin(tab.id, siteData.email, siteData.password);
        }

        console.log('✅ Site aberto com sucesso!');
        return { success: true, tabId: tab.id, windowId: popup.id };

    } catch (error) {
        console.error('💥 Erro crítico ao abrir site:', error);
        return { success: false, error: error.message };
    }
}

// Configura monitoramento avançado de navegação
function setupNavigationMonitoring(tabId) {
    console.log('🔍 Configurando monitoramento de navegação para tab:', tabId);
    
    // Monitora carregamento completo de página
    chrome.webNavigation.onCompleted.addListener(async (details) => {
        if (details.tabId === tabId && activeTabIds.has(tabId)) {
            console.log('📄 Página carregada completamente:', details.url);
            // Aguarda um pouco para garantir que o DOM esteja pronto
            setTimeout(async () => {
                await injectFloatingNavigationButtons(tabId);
                await injectF12Blocker(tabId);
                await injectNavigationControl(tabId);
            }, 500);
        }
    });
    
    // Monitora mudanças de estado de história (SPA)
    chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
        if (details.tabId === tabId && activeTabIds.has(tabId)) {
            console.log('🔄 Mudança de estado de história detectada:', details.url);
            // Aguarda um pouco para garantir que o DOM esteja atualizado
            setTimeout(async () => {
                await injectFloatingNavigationButtons(tabId);
                await injectF12Blocker(tabId);
                await injectNavigationControl(tabId);
            }, 500);
        }
    });
    
    // Monitora atualizações de URL
    chrome.tabs.onUpdated.addListener((updatedTabId, changeInfo, tab) => {
        if (updatedTabId === tabId && changeInfo.url && activeTabIds.has(tabId)) {
            console.log('🔄 URL atualizada:', changeInfo.url);
            // Aguarda carregamento completo antes de reinjetar
            setTimeout(async () => {
                await injectFloatingNavigationButtons(tabId);
                await injectF12Blocker(tabId);
                await injectNavigationControl(tabId);
            }, 500);
        }
    });
    
    // Remove da lista de monitoramento quando a aba é fechada
    chrome.tabs.onRemoved.addListener((removedTabId) => {
        if (removedTabId === tabId) {
            console.log('🚪 Tab fechada, removendo do monitoramento:', removedTabId);
            activeTabIds.delete(removedTabId);
        }
    });
}

// Sistema ultra-robusto para aplicação de cookies
async function applyCookiesUltraRobust(url, cookies) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const protocol = urlObj.protocol;
        
        console.log('🎯 Aplicando cookies para:', domain);
        
        // Estratégia 1: Array de objetos (Cookie Editor format)
        if (Array.isArray(cookies)) {
            console.log('📋 Processando array de cookies:', cookies.length);
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                console.log(`🍪 Processando cookie ${i + 1}:`, cookie.name);
                
                await applySingleCookieWithFallbacks(url, domain, cookie, protocol);
            }
        }
        // Estratégia 2: String simples
        else if (typeof cookies === 'string') {
            console.log('📝 Processando string de cookies');
            await applyStringCookies(url, domain, cookies);
        }
        
        console.log('✅ Todos os cookies aplicados com sucesso!');
        
    } catch (error) {
        console.error('💥 Erro ao aplicar cookies:', error);
        throw error;
    }
}

// Aplica um único cookie com múltiplas estratégias de fallback
async function applySingleCookieWithFallbacks(url, domain, cookie, protocol) {
    console.log(`🍪 Tentando aplicar cookie: ${cookie.name} = ${cookie.value}`);
    
    const strategies = [
        // Estratégia 1: Formato completo
        () => {
            const cookieData = {
                url: url,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain || domain,
                path: cookie.path || '/',
                secure: protocol === 'https:' && (cookie.secure !== false),
                httpOnly: cookie.httpOnly === true,
                sameSite: cookie.sameSite || 'lax'
            };
            console.log('📋 Estratégia 1 - Cookie data:', cookieData);
            return chrome.cookies.set(cookieData);
        },
        
        // Estratégia 2: Sem domínio específico
        () => {
            const cookieData = {
                url: url,
                name: cookie.name,
                value: cookie.value,
                path: cookie.path || '/'
            };
            console.log('📋 Estratégia 2 - Cookie data:', cookieData);
            return chrome.cookies.set(cookieData);
        },
        
        // Estratégia 3: Apenas essencial
        () => {
            const cookieData = {
                url: url,
                name: cookie.name,
                value: cookie.value
            };
            console.log('📋 Estratégia 3 - Cookie data:', cookieData);
            return chrome.cookies.set(cookieData);
        },
        
        // Estratégia 4: Domínio alternativo
        () => {
            const cookieData = {
                url: url,
                name: cookie.name,
                value: cookie.value,
                domain: '.' + domain,
                path: '/'
            };
            console.log('📋 Estratégia 4 - Cookie data:', cookieData);
            return chrome.cookies.set(cookieData);
        },
        
        // Estratégia 5: Sem segurança
        () => {
            const cookieData = {
                url: url.replace('https:', 'http:'),
                name: cookie.name,
                value: cookie.value,
                path: '/'
            };
            console.log('📋 Estratégia 5 - Cookie data:', cookieData);
            return chrome.cookies.set(cookieData);
        }
    ];
    
    for (let i = 0; i < strategies.length; i++) {
        try {
            const result = await strategies[i]();
            if (result) {
                console.log(`✅ Cookie aplicado com estratégia ${i + 1}:`, result);
                return;
            }
        } catch (error) {
            console.warn(`⚠️ Estratégia ${i + 1} falhou:`, error.message);
        }
    }
    
    console.error(`❌ Todas as estratégias falharam para cookie: ${cookie.name}`);
}

// Aplica cookies em formato string
async function applyStringCookies(url, domain, cookiesString) {
    const cookiePairs = cookiesString.split(';');
    
    for (const pair of cookiePairs) {
        const [name, value] = pair.split('=').map(s => s.trim());
        if (name && value) {
            const cookieObj = { name, value };
            await applySingleCookieWithFallbacks(url, domain, cookieObj, new URL(url).protocol);
        }
    }
}

// Aguarda carregamento completo da página
async function waitForCompleteLoad(tabId) {
    return new Promise((resolve) => {
        const checkStatus = () => {
            chrome.tabs.get(tabId, (tab) => {
                if (tab.status === 'complete') {
                    console.log('✅ Página carregada completamente');
                    setTimeout(resolve, 1000); // Aguarda mais 1 segundo
                } else {
                    console.log('⏳ Aguardando carregamento...');
                    setTimeout(checkStatus, 500);
                }
            });
        };
        checkStatus();
    });
}

// Injeta botões flutuantes de navegação
async function injectFloatingNavigationButtons(tabId) {
    try {
        console.log('🎯 Injetando botões flutuantes de navegação...');
        
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: createFloatingNavigationButtons
        });
        
        console.log('✅ Botões flutuantes injetados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao injetar botões flutuantes:', error);
    }
}

// Cria botões flutuantes de navegação
function createFloatingNavigationButtons() {
    console.log('🎯 Criando botões flutuantes de navegação...');
    
    // Remove botões existentes
    const existingContainer = document.getElementById('siteManagerFloatingNav');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Container principal
    const container = document.createElement('div');
    container.id = 'siteManagerFloatingNav';
    container.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        right: 20px !important;
        transform: translateY(-50%) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        pointer-events: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;
    
    // Botão Voltar
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '←';
    backBtn.title = 'Voltar';
    backBtn.style.cssText = `
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        border: none !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        font-size: 20px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        pointer-events: auto !important;
    `;
    
    // Botão Avançar
    const forwardBtn = document.createElement('button');
    forwardBtn.innerHTML = '→';
    forwardBtn.title = 'Avançar';
    forwardBtn.style.cssText = `
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        border: none !important;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
        color: white !important;
        font-size: 20px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        pointer-events: auto !important;
    `;
    
    // Indicador do site
    const siteIndicator = document.createElement('div');
    siteIndicator.innerHTML = '🌐';
    siteIndicator.title = `Site: ${window.location.hostname}`;
    siteIndicator.style.cssText = `
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        background: rgba(255,255,255,0.9) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 16px !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        pointer-events: auto !important;
    `;
    
    // Efeitos hover
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.transform = 'scale(1.1) !important';
        backBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3) !important';
    });
    
    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.transform = 'scale(1) !important';
        backBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2) !important';
    });
    
    forwardBtn.addEventListener('mouseenter', () => {
        forwardBtn.style.transform = 'scale(1.1) !important';
        forwardBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3) !important';
    });
    
    forwardBtn.addEventListener('mouseleave', () => {
        forwardBtn.style.transform = 'scale(1) !important';
        forwardBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2) !important';
    });
    
    // Funcionalidades
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.history.back();
        console.log('🔙 Navegação: Voltar');
    });
    
    forwardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.history.forward();
        console.log('🔜 Navegação: Avançar');
    });
    
    // Monta o container
    container.appendChild(backBtn);
    container.appendChild(forwardBtn);
    container.appendChild(siteIndicator);
    
    // Adiciona ao DOM
    document.body.appendChild(container);
    
    // Proteção contra remoção
    const protectButtons = () => {
        if (!document.getElementById('siteManagerFloatingNav')) {
            document.body.appendChild(container);
        }
        
        // Força posicionamento
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.right = '20px';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = '2147483647';
    };
    
    // Verifica a cada 100ms
    setInterval(protectButtons, 100);
    
    // Observer para mudanças no DOM
    const observer = new MutationObserver(protectButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Botões flutuantes criados e protegidos!');
}

// Injeta bloqueio F12 e DevTools
async function injectF12Blocker(tabId) {
    try {
        console.log('🔒 Injetando bloqueio F12...');
        
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: blockF12Script
        });
        
        console.log('✅ Bloqueio F12 injetado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao injetar bloqueio F12:', error);
    }
}

// Script para bloquear F12 e DevTools
function blockF12Script() {
    console.log('🔒 Ativando bloqueio F12 e DevTools...');
    
    // Bloqueia teclas de atalho
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 F12 bloqueado!');
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 Ctrl+Shift+I bloqueado!');
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 Ctrl+Shift+J bloqueado!');
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 Ctrl+U bloqueado!');
            return false;
        }
        
        // Ctrl+Shift+C (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 Ctrl+Shift+C bloqueado!');
            return false;
        }
    }, true);
    
    // Bloqueia menu de contexto (clique direito)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 Menu de contexto bloqueado!');
        return false;
    }, true);
    
    // Detecta abertura do DevTools por tamanho da janela
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.log('🚫 DevTools detectado e bloqueado!');
                // Força fechamento da aba
                window.close();
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Armadilha de debugger contínua
    setInterval(() => {
        debugger;
    }, 100);
    
    // Proteção adicional
    Object.freeze(document);
    Object.freeze(window);
    
    console.log('✅ Bloqueio F12 ativado!');
}

// Sistema mega avançado de login automático
async function injectMegaAutoLogin(tabId, email, password) {
    try {
        console.log('🔐 Injetando sistema de login automático...');
        
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: megaAutoLoginScript,
            args: [email, password]
        });
        
        console.log('✅ Sistema de login automático injetado!');
        
    } catch (error) {
        console.error('❌ Erro ao injetar login automático:', error);
    }
}

// Script mega avançado de login automático
function megaAutoLoginScript(email, password) {
    console.log('🔐 Iniciando login automático mega avançado...');
    
    // Função para preencher campo com eventos
    function fillFieldWithEvents(field, value) {
        if (!field || !value) return false;
        
        // Foca no campo
        field.focus();
        field.click();
        
        // Limpa o campo
        field.value = '';
        
        // Simula digitação
        for (let i = 0; i < value.length; i++) {
            field.value += value[i];
            
            // Dispara eventos
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
            field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        }
        
        // Eventos finais
        field.dispatchEvent(new Event('blur', { bubbles: true }));
        
        return true;
    }
    
    // Função para encontrar e preencher campos
    function findAndFillFields() {
        console.log('🔍 Procurando campos de login...');
        
        // Seletores para email/usuário
        const emailSelectors = [
            'input[type="email"]',
            'input[name*="email"]',
            'input[id*="email"]',
            'input[name*="user"]',
            'input[id*="user"]',
            'input[name*="login"]',
            'input[id*="login"]',
            'input[placeholder*="email"]',
            'input[placeholder*="usuário"]',
            'input[placeholder*="user"]'
        ];
        
        // Seletores para senha
        const passwordSelectors = [
            'input[type="password"]',
            'input[name*="password"]',
            'input[id*="password"]',
            'input[name*="senha"]',
            'input[id*="senha"]',
            'input[placeholder*="senha"]',
            'input[placeholder*="password"]'
        ];
        
        let emailField = null;
        let passwordField = null;
        
        // Procura campo de email
        for (const selector of emailSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) {
                emailField = field;
                console.log('📧 Campo de email encontrado:', selector);
                break;
            }
        }
        
        // Procura campo de senha
        for (const selector of passwordSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) {
                passwordField = field;
                console.log('🔒 Campo de senha encontrado:', selector);
                break;
            }
        }
        
        // Preenche os campos
        let success = false;
        
        if (emailField) {
            success = fillFieldWithEvents(emailField, email);
            console.log('📧 Email preenchido:', success);
        }
        
        if (passwordField) {
            success = fillFieldWithEvents(passwordField, password) || success;
            console.log('🔒 Senha preenchida:', success);
        }
        
        return { emailField, passwordField, success };
    }
    
    // Função para tentar login
    function attemptLogin() {
        console.log('🚀 Tentando fazer login...');
        
        // Seletores para botões de login
        const loginButtonSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button[name*="login"]',
            'button[id*="login"]',
            'button[name*="entrar"]',
            'button[id*="entrar"]',
            '.login-button',
            '.btn-login',
            '[data-testid*="login"]'
        ];
        
        // Procura botão de login
        for (const selector of loginButtonSelectors) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null) {
                console.log('🎯 Botão de login encontrado:', selector);
                button.click();
                return true;
            }
        }
        
        // Tenta submeter formulário
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            if (form.offsetParent !== null) {
                console.log('📝 Submetendo formulário');
                form.submit();
                return true;
            }
        }
        
        return false;
    }
    
    // Execução principal
    setTimeout(() => {
        try {
            const result = findAndFillFields();
            
            if (result.success) {
                console.log('✅ Campos preenchidos com sucesso!');
                
                // Aguarda um pouco e tenta fazer login
                setTimeout(() => {
                    const loginSuccess = attemptLogin();
                    if (loginSuccess) {
                        console.log('✅ Login automático executado!');
                    } else {
                        console.log('⚠️ Botão de login não encontrado');
                    }
                }, 1000);
            } else {
                console.log('⚠️ Campos de login não encontrados');
            }
        } catch (error) {
            console.error('❌ Erro no login automático:', error);
        }
    }, 2000);
}

// Injeta controle de navegação
async function injectNavigationControl(tabId) {
    try {
        console.log('🎮 Injetando controle de navegação...');
        
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: controlNavigation
        });
        
        console.log('✅ Controle de navegação injetado!');
        
    } catch (error) {
        console.error('❌ Erro ao injetar controle de navegação:', error);
    }
}

// Script de controle de navegação CORRIGIDO
function controlNavigation() {
    console.log('🎮 Ativando controle de navegação ultra-avançado...');
    
    // Intercepta TODOS os cliques em links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
            e.preventDefault();
            e.stopPropagation();
            
            const url = target.href;
            console.log('🔗 Link interceptado:', url);
            
            // Navega na mesma janela popup
            window.location.href = url;
            return false;
        }
    }, true);
    
    // Intercepta window.open - CORRIGIDO
    const originalWindowOpen = window.open;
    window.open = function(url, name, features) {
        console.log('🆕 window.open interceptado:', url);
        
        // Envia mensagem para o background script abrir novo popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'openNewPopup',
                url: url
            }, (response) => {
                if (response && response.success) {
                    console.log('✅ Novo popup aberto com sucesso');
                } else {
                    console.error('❌ Erro ao abrir novo popup:', response?.error);
                    // Fallback: navega na mesma janela
                    window.location.href = url;
                }
            });
        } else {
            // Fallback: navega na mesma janela
            window.location.href = url;
        }
        
        return window;
    };
    
    // Intercepta mudanças de location
    const originalLocation = window.location;
    let currentUrl = window.location.href;
    
    // Intercepta todas as formas de redirecionamento
    ['assign', 'replace'].forEach(method => {
        const original = window.location[method];
        window.location[method] = function(url) {
            console.log(`🔄 location.${method} interceptado:`, url);
            return original.call(this, url);
        };
    });
    
    // Intercepta mudanças diretas de href
    Object.defineProperty(window, 'location', {
        get: function() {
            return originalLocation;
        },
        set: function(url) {
            console.log('🔄 Mudança de location detectada:', url);
            originalLocation.href = url;
        }
    });
    
    // Intercepta formulários
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.target === '_blank') {
            e.preventDefault();
            console.log('📝 Formulário com target=_blank interceptado');
            form.target = '_self';
            form.submit();
        }
    }, true);
    
    // Monitor contínuo de mudanças de target
    setInterval(() => {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(link => {
            link.target = '_self';
            console.log('🔧 Target _blank corrigido para _self');
        });
        
        const forms = document.querySelectorAll('form[target="_blank"]');
        forms.forEach(form => {
            form.target = '_self';
            console.log('📝 Form target _blank corrigido para _self');
        });
    }, 100);
    
    // Monitora mudanças de URL para recriar botões
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            console.log('🔄 URL mudou de', currentUrl, 'para', window.location.href);
            currentUrl = window.location.href;
            
            // Recria botões flutuantes após mudança de URL
            setTimeout(() => {
                if (typeof createFloatingNavigationButtons === 'function') {
                    createFloatingNavigationButtons();
                } else {
                    window.dispatchEvent(new CustomEvent('recreateFloatingButtons'));
                }
            }, 500);
        }
    }, 200);
    
    // Event listener para recriar botões
    window.addEventListener('recreateFloatingButtons', () => {
        if (typeof createFloatingNavigationButtons === 'function') {
            createFloatingNavigationButtons();
        }
    });
    
    // Monitora eventos de navegação
    window.addEventListener('popstate', () => {
        console.log('🔄 Evento popstate detectado');
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('recreateFloatingButtons'));
        }, 500);
    });
    
    window.addEventListener('load', () => {
        console.log('🔄 Página carregada');
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('recreateFloatingButtons'));
        }, 500);
    });
    
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 DOM carregado');
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('recreateFloatingButtons'));
        }, 500);
    });
    
    // Intercepta tentativas de abrir em nova aba via JavaScript
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'a') {
            // Observer para mudanças no target
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'target') {
                        if (element.target === '_blank') {
                            element.target = '_self';
                            console.log('🔧 Target _blank interceptado e corrigido');
                        }
                    }
                });
            });
            
            observer.observe(element, {
                attributes: true,
                attributeFilter: ['target']
            });
        }
        
        return element;
    };
    
    console.log('✅ Controle de navegação ultra-avançado ativado!');
}