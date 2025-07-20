# RAG Frontend

Frontend moderno e responsivo para consulta do sistema RAG (Retrieval-Augmented Generation) hospedado em VPS.

## 🌟 Características

### Interface
- ✅ **Design Moderno**: Interface limpa e profissional com gradientes
- ✅ **Totalmente Responsivo**: Funciona em desktop, tablet e mobile
- ✅ **Dark Theme**: Tema escuro elegante com glassmorphism
- ✅ **Animações Suaves**: Transições e feedback visual

### Funcionalidades
- ✅ **Status da API**: Indicador de conexão em tempo real
- ✅ **Consultas RAG**: Interface intuitiva para perguntas
- ✅ **Histórico**: Salvamento local das últimas 10 consultas
- ✅ **Ações**: Copiar, compartilhar respostas
- ✅ **Notificações**: Feedback visual das operações

### Tecnologia
- ✅ **Vanilla JavaScript**: Sem dependências externas
- ✅ **CSS Moderno**: Flexbox, Grid, CSS Variables
- ✅ **Fetch API**: Comunicação assíncrona com backend
- ✅ **LocalStorage**: Persistência do histórico

## 🚀 Deploy no GitHub Pages

### 1. Preparação
```bash
# Clone ou baixe este repositório
git clone https://github.com/SEU_USUARIO/rag-frontend.git
cd rag-frontend
```

### 2. Configuração da API
No arquivo `script.js`, configure a URL da sua API:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://147.93.8.153:8000', // Substitua pelo IP da sua VPS
    ENDPOINTS: {
        HEALTH: '/health',
        QUERY: '/query'
    }
};
```

### 3. Deploy no GitHub Pages
1. Faça push dos arquivos para o repositório GitHub
2. Vá em **Settings** → **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Escolha **main** branch e **/ (root)**
5. Clique **Save**

### 4. Configurar CORS no Backend
No seu arquivo `api_organizada_v2_fixed.py` na VPS, adicione:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://seu-usuario.github.io",  # Substitua pelo seu domínio
        "http://localhost:3000"  # Para desenvolvimento
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 📁 Estrutura de Arquivos

```
rag-frontend/
├── index.html          # Página principal
├── style.css           # Estilos e design
├── script.js           # Lógica e funcionalidades
└── README.md           # Documentação
```

## 🎯 Como Usar

### Consulta Básica
1. Digite sua pergunta no campo de texto
2. Clique em **"Consultar RAG"** ou use **Ctrl + Enter**
3. Aguarde a resposta da IA
4. Use os botões para **copiar** ou **compartilhar** a resposta

### Histórico
- As últimas 10 consultas são salvas automaticamente
- Clique em qualquer item do histórico para reutilizar a pergunta
- Use o botão 🗑️ para limpar todo o histórico

### Status da Conexão
- 🟢 **Verde**: API online e funcionando
- 🟡 **Amarelo**: Verificando conexão
- 🔴 **Vermelho**: API offline ou erro

## 🔧 Personalização

### Cores e Tema
Edite as variáveis CSS em `style.css`:

```css
:root {
    --primary-color: #667eea;     /* Cor principal */
    --secondary-color: #764ba2;   /* Cor secundária */
    --success-color: #28a745;     /* Verde (sucesso) */
    --error-color: #dc3545;       /* Vermelho (erro) */
}
```

### Configurações da API
Ajuste no `script.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'SUA_API_URL',
    TIMEOUT: 30000 // Timeout em ms
};
```

## 🧪 Desenvolvimento Local

### Servidor Local Simples
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# Live Server (VS Code)
# Instale a extensão "Live Server" e clique com botão direito em index.html
```

### Debug
Abra o console do navegador e use:

```javascript
// Verificar estado da aplicação
ragDebug.state()

// Testar conexão manualmente
ragDebug.testConnection()

// Simular resposta de sucesso
ragDebug.simulate.success()

// Simular erro
ragDebug.simulate.error()

// Limpar histórico
ragDebug.clearHistory()
```

## 🔐 Segurança

### Considerações
- ✅ **Sem API Keys**: Frontend não armazena chaves sensíveis
- ✅ **CORS Configurado**: Controle de origem das requisições
- ✅ **HTTPS**: GitHub Pages força HTTPS automaticamente
- ✅ **Validação**: Sanitização básica de entradas

### Recomendações para Produção
- [ ] Implementar autenticação JWT
- [ ] Rate limiting no frontend
- [ ] CSP (Content Security Policy)
- [ ] Logs de auditoria

## 🚨 Troubleshooting

### Problemas Comuns

**❌ "API não está conectada"**
- Verifique se a VPS está online
- Confirme se a porta 8000 está aberta
- Teste: `curl http://147.93.8.153:8000/health`

**❌ "Erro de rede - Verifique CORS"**
- Configure CORS no backend (veja seção 4)
- Reinicie a API na VPS
- Verifique logs: `tail -f /opt/rag_project/api.log`

**❌ "Timeout - API não responde"**
- API pode estar sobrecarregada
- Aumente o timeout no `script.js`
- Verifique recursos da VPS

**❌ Layout quebrado no mobile**
- Limpe cache do navegador
- Verifique se CSS carregou completamente

### Logs e Debug
1. **Console do Navegador**: F12 → Console
2. **Network Tab**: F12 → Network (verificar requisições)
3. **Debug Tools**: Use `window.ragDebug` no console

## 📊 Métricas

### Performance
- **Primeira Carga**: ~2-3 segundos
- **Consultas**: ~1-5 segundos (depende da API)
- **Tamanho**: ~50KB total (HTML+CSS+JS)

### Compatibilidade
- ✅ **Chrome/Edge**: 88+
- ✅ **Firefox**: 85+
- ✅ **Safari**: 14+
- ✅ **Mobile**: iOS 14+, Android 8+

## 🔄 Atualizações

### Versão Atual: 1.0.0
- Interface completa com histórico
- Status de conexão em tempo real
- Design responsivo e moderno
- Sistema de notificações

### Próximas Versões
- [ ] Modo offline com Service Worker
- [ ] Múltiplos temas (claro/escuro)
- [ ] Export de conversas (PDF/TXT)
- [ ] Busca no histórico
- [ ] Configurações avançadas

## 📞 Suporte

### Problemas?
1. Consulte esta documentação
2. Verifique o console do navegador (F12)
3. Teste a API diretamente: `curl http://147.93.8.153:8000/health`
4. Abra issue no GitHub

### Links Úteis
- **API Swagger**: http://147.93.8.153:8000/docs
- **Status da API**: http://147.93.8.153:8000/health
- **GitHub Pages**: https://seu-usuario.github.io/rag-frontend

---

**🚀 RAG Frontend v1.0 - Interface moderna para consulta RAG**  
*Desenvolvido por Danilo M. Faria - 2025*
