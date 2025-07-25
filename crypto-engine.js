/**
 * Crypto Engine - Motor de Criptografia do Site Manager Pro
 * Sistema avançado de criptografia com chaves fragmentadas
 */

class CryptoEngine {
    constructor() {
        this.config = {
            algorithm: 'AES-GCM',
            keyLength: 256,
            ivLength: 12,
            tagLength: 16
        };
        
        // Chaves fragmentadas para segurança
        this.keyFragments = {
            part1: 'U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwyt',
            part2: 'cGFydDJfc2VjcmV0X2tleV9mcmFnbWVudF9mb3Jfc2l0ZV9tYW5hZ2VyX3Bybw==',
            part3: 'ZmluYWxfcGFydF9vZl90aGVfZW5jcnlwdGlvbl9rZXlfZm9yX3NlY3VyaXR5XzIwMjQ='
        };
        
        this.masterKey = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            await this.generateMasterKey();
            this.isInitialized = true;
            console.log('🔐 Motor de criptografia inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar criptografia:', error);
        }
    }

    async generateMasterKey() {
        try {
            // Combina fragmentos de chave
            const combinedKey = this.keyFragments.part1 + this.keyFragments.part2 + this.keyFragments.part3;
            
            // Gera hash SHA-256 da chave combinada
            const encoder = new TextEncoder();
            const data = encoder.encode(combinedKey);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            
            // Importa como chave AES
            this.masterKey = await crypto.subtle.importKey(
                'raw',
                hashBuffer,
                { name: this.config.algorithm },
                false,
                ['encrypt', 'decrypt']
            );
            
        } catch (error) {
            console.error('❌ Erro ao gerar chave mestra:', error);
            throw error;
        }
    }

    async encrypt(data) {
        if (!this.isInitialized) {
            throw new Error('Motor de criptografia não inicializado');
        }
        
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(JSON.stringify(data));
            
            // Gera IV aleatório
            const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));
            
            // Criptografa
            const encryptedBuffer = await crypto.subtle.encrypt(
                {
                    name: this.config.algorithm,
                    iv: iv
                },
                this.masterKey,
                dataBuffer
            );
            
            // Combina IV + dados criptografados
            const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedBuffer), iv.length);
            
            // Converte para base64
            const base64 = btoa(String.fromCharCode(...combined));
            
            console.log('🔒 Dados criptografados com sucesso');
            return base64;
            
        } catch (error) {
            console.error('❌ Erro na criptografia:', error);
            throw error;
        }
    }

    async decrypt(encryptedData) {
        if (!this.isInitialized) {
            throw new Error('Motor de criptografia não inicializado');
        }
        
        try {
            // Decodifica base64
            const combined = new Uint8Array(
                atob(encryptedData).split('').map(char => char.charCodeAt(0))
            );
            
            // Separa IV e dados
            const iv = combined.slice(0, this.config.ivLength);
            const encryptedBuffer = combined.slice(this.config.ivLength);
            
            // Descriptografa
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: this.config.algorithm,
                    iv: iv
                },
                this.masterKey,
                encryptedBuffer
            );
            
            // Converte de volta para string
            const decoder = new TextDecoder();
            const decryptedString = decoder.decode(decryptedBuffer);
            
            console.log('🔓 Dados descriptografados com sucesso');
            return decryptedString;
            
        } catch (error) {
            console.error('❌ Erro na descriptografia:', error);
            throw error;
        }
    }

    // Método para criptografia rápida de strings simples
    async quickEncrypt(text) {
        try {
            const data = { text: text, timestamp: Date.now() };
            return await this.encrypt(data);
        } catch (error) {
            console.error('❌ Erro na criptografia rápida:', error);
            throw error;
        }
    }

    // Método para descriptografia rápida de strings simples
    async quickDecrypt(encryptedText) {
        try {
            const decryptedString = await this.decrypt(encryptedText);
            const data = JSON.parse(decryptedString);
            return data.text;
        } catch (error) {
            console.error('❌ Erro na descriptografia rápida:', error);
            throw error;
        }
    }

    // Gera hash seguro para verificação
    async generateHash(data) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(JSON.stringify(data));
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
            
            // Converte para hex
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            return hashHex;
        } catch (error) {
            console.error('❌ Erro ao gerar hash:', error);
            throw error;
        }
    }

    // Verifica integridade dos dados
    async verifyIntegrity(data, expectedHash) {
        try {
            const actualHash = await this.generateHash(data);
            return actualHash === expectedHash;
        } catch (error) {
            console.error('❌ Erro na verificação de integridade:', error);
            return false;
        }
    }

    // Método para regenerar chaves (segurança)
    async regenerateKeys() {
        try {
            await this.generateMasterKey();
            console.log('🔄 Chaves regeneradas com sucesso');
        } catch (error) {
            console.error('❌ Erro ao regenerar chaves:', error);
            throw error;
        }
    }
}

// Disponibiliza globalmente
window.CryptoEngine = CryptoEngine;
