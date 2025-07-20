# 🚨 Problema: Mixed Content (HTTPS ↔ HTTP)

## ❌ **O que está acontecendo?**

O GitHub Pages serve seu frontend via **HTTPS** (seguro), mas sua API RAG na VPS está rodando em **HTTP** (não seguro). Navegadores modernos **bloqueiam** requisições HTTP de páginas HTTPS por questões de segurança - isso é chamado de **"Mixed Content"**.

## ✅ **Soluções Disponíveis:**

### **1. 🏠 Desenvolvimento Local (Recomendado para testes)**
```bash
# Na pasta do frontend
python3 -m http.server 8080

# Acesse: http://localhost:8080
# ✅ Funciona perfeitamente pois ambos usam HTTP
```

### **2. 🔒 Configurar HTTPS na VPS (Solução definitiva)**

#### **Opção A: Certificado SSL com Let's Encrypt**
```bash
# Na VPS
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d seu-dominio.com

# Configurar FastAPI para HTTPS
# uvicorn main:app --host 0.0.0.0 --port 8000 --ssl-keyfile=privkey.pem --ssl-certfile=cert.pem
```

#### **Opção B: Proxy Reverso com Nginx**
```bash
# Instalar nginx
sudo apt install nginx

# Configurar proxy HTTPS → HTTP interno
# nginx vai servir HTTPS e repassar para FastAPI HTTP
```

### **3. 🌐 Proxy CORS (Temporário)**
```javascript
// Alterar script.js
const API_CONFIG = {
    BASE_URL: 'https://cors-anywhere.herokuapp.com/http://147.93.8.153:8000',
    // ⚠️ Não recomendado para produção
};
```

### **4. 📱 Aplicativo Híbrido**
- Electron (Desktop)
- Cordova/PhoneGap (Mobile)
- ✅ Não sofrem limitação de Mixed Content

## 🎯 **Recomendação:**

1. **Para desenvolvimento:** Use `http://localhost:8080`
2. **Para produção:** Configure HTTPS na VPS
3. **Alternativo:** Use serviço de proxy confiável

## 📋 **Status Atual:**

- ✅ **Frontend:** Funcionando no GitHub Pages
- ✅ **Backend:** Funcionando na VPS (HTTP)
- ❌ **Conexão:** Bloqueada por Mixed Content
- ✅ **Solução:** Múltiplas opções disponíveis

## 🔧 **Teste Local Rápido:**

```bash
# Clone o repositório
git clone https://github.com/DaniloMFaria/rag-frontend.git
cd rag-frontend

# Inicie servidor local
python3 -m http.server 8080

# Acesse http://localhost:8080
# ✅ Status da API deve ficar verde!
```

---

**💡 O frontend está perfeito - é apenas uma limitação de segurança dos navegadores!**
