// Configurações da API
const API_CONFIG = {
    BASE_URL: 'http://147.93.8.153:8000',
    ENDPOINTS: {
        HEALTH: '/health',
        QUERY: '/query'
    },
    TIMEOUT: 30000 // 30 segundos
};

// Estado da aplicação
const appState = {
    isConnected: false,
    isQuerying: false,
    history: []
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar aplicação
async function initializeApp() {
    console.log('🚀 Inicializando RAG Frontend...');
    
    // Carregar histórico do localStorage
    carregarHistorico();
    
    // Verificar conexão com API
    await verificarConexao();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Auto-verificação da conexão a cada 30 segundos
    setInterval(verificarConexao, 30000);
    
    console.log('✅ RAG Frontend inicializado com sucesso!');
}

// Configurar event listeners
function configurarEventListeners() {
    const textarea = document.getElementById('pergunta');
    const btnConsultar = document.getElementById('btn-consultar');
    
    // Contador de caracteres
    textarea.addEventListener('input', function() {
        const charCount = this.value.length;
        document.getElementById('char-count').textContent = charCount;
        
        // Habilitar/desabilitar botão
        btnConsultar.disabled = charCount === 0 || appState.isQuerying;
    });
    
    // Submit com Enter (Ctrl + Enter)
    textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            consultarRAG();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
}

// Verificar conexão com a API
async function verificarConexao() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    
    // Estado de verificação
    statusIndicator.className = 'status-indicator status-checking';
    statusIcon.className = 'fas fa-circle';
    statusText.textContent = 'Verificando conexão...';
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            
            // Status online
            appState.isConnected = true;
            statusIndicator.className = 'status-indicator status-online';
            statusIcon.className = 'fas fa-circle';
            statusText.textContent = 'Conectado - API Online';
            
            console.log('✅ API conectada:', data);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error);
        
        // Status offline
        appState.isConnected = false;
        statusIndicator.className = 'status-indicator status-offline';
        statusIcon.className = 'fas fa-circle';
        statusText.textContent = 'Desconectado - Verifique a API';
        
        // Mostrar erro específico
        if (error.name === 'AbortError') {
            statusText.textContent = 'Timeout - API não responde';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            statusText.textContent = 'Erro de rede - Verifique CORS';
        }
    }
}

// Função principal de consulta
async function consultarRAG() {
    const pergunta = document.getElementById('pergunta').value.trim();
    
    if (!pergunta) {
        mostrarNotificacao('Por favor, digite uma pergunta.', 'warning');
        return;
    }
    
    if (!appState.isConnected) {
        mostrarNotificacao('API não está conectada. Verifique a conexão.', 'error');
        return;
    }
    
    // Iniciar estado de consulta
    iniciarConsulta();
    
    try {
        const startTime = Date.now();
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUERY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: pergunta }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Mostrar resposta
        mostrarResposta(data, pergunta, responseTime);
        
        // Adicionar ao histórico
        adicionarAoHistorico(pergunta, data.answer, responseTime);
        
        console.log('✅ Consulta realizada com sucesso em', responseTime + 'ms');
        
    } catch (error) {
        console.error('❌ Erro na consulta:', error);
        
        let errorMessage = 'Erro desconhecido';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Timeout - A consulta demorou muito para responder';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            errorMessage = 'Erro de rede - Verifique sua conexão e configuração CORS';
        } else if (error.message.includes('HTTP 422')) {
            errorMessage = 'Dados inválidos - Verifique o formato da pergunta';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage = 'Erro interno do servidor - Tente novamente';
        } else {
            errorMessage = error.message;
        }
        
        mostrarErro(errorMessage);
        
    } finally {
        finalizarConsulta();
    }
}

// Iniciar estado de consulta
function iniciarConsulta() {
    appState.isQuerying = true;
    
    const btnConsultar = document.getElementById('btn-consultar');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    btnConsultar.disabled = true;
    btnConsultar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
    
    loadingOverlay.style.display = 'flex';
}

// Finalizar estado de consulta
function finalizarConsulta() {
    appState.isQuerying = false;
    
    const btnConsultar = document.getElementById('btn-consultar');
    const loadingOverlay = document.getElementById('loading-overlay');
    const pergunta = document.getElementById('pergunta').value.trim();
    
    btnConsultar.disabled = pergunta === '';
    btnConsultar.innerHTML = '<i class="fas fa-search"></i> Consultar RAG';
    
    loadingOverlay.style.display = 'none';
}

// Mostrar resposta
function mostrarResposta(data, pergunta, responseTime) {
    const responseSection = document.getElementById('response-section');
    const responseMeta = document.getElementById('response-meta');
    const respostaDiv = document.getElementById('resposta');
    
    // Metadata da resposta
    const now = new Date();
    responseMeta.innerHTML = `
        <i class="fas fa-clock"></i> ${responseTime}ms | 
        <i class="fas fa-calendar"></i> ${now.toLocaleString('pt-BR')}
    `;
    
    // Conteúdo da resposta
    respostaDiv.innerHTML = formatarResposta(data.answer);
    
    // Mostrar seção
    responseSection.style.display = 'block';
    responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Salvar resposta atual para ações
    window.currentResponse = {
        question: pergunta,
        answer: data.answer,
        timestamp: now.toISOString(),
        responseTime
    };
}

// Mostrar erro
function mostrarErro(errorMessage) {
    const responseSection = document.getElementById('response-section');
    const responseMeta = document.getElementById('response-meta');
    const respostaDiv = document.getElementById('resposta');
    
    responseMeta.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Erro na consulta`;
    
    respostaDiv.innerHTML = `
        <div style="color: var(--error-color); padding: 1rem; background: #ffeaea; border-radius: 8px; border-left: 4px solid var(--error-color);">
            <strong><i class="fas fa-times-circle"></i> Erro:</strong> ${errorMessage}
            <br><br>
            <em>Verifique:</em>
            <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                <li>Se a API está rodando na VPS</li>
                <li>Se o CORS está configurado</li>
                <li>Se sua conexão está estável</li>
            </ul>
        </div>
    `;
    
    responseSection.style.display = 'block';
    responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Formatar resposta (markdown básico)
function formatarResposta(texto) {
    return texto
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.*)$/, '<p>$1</p>');
}

// Limpar tudo
function limparTudo() {
    document.getElementById('pergunta').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('response-section').style.display = 'none';
    document.getElementById('btn-consultar').disabled = true;
    
    mostrarNotificacao('Campos limpos', 'success');
}

// Copiar resposta
async function copiarResposta() {
    if (!window.currentResponse) {
        mostrarNotificacao('Nenhuma resposta para copiar', 'warning');
        return;
    }
    
    const texto = `Pergunta: ${window.currentResponse.question}\n\nResposta: ${window.currentResponse.answer}`;
    
    try {
        await navigator.clipboard.writeText(texto);
        mostrarNotificacao('Resposta copiada para a área de transferência!', 'success');
    } catch (error) {
        console.error('Erro ao copiar:', error);
        mostrarNotificacao('Erro ao copiar. Tente selecionar e copiar manualmente.', 'error');
    }
}

// Compartilhar resposta
async function compartilharResposta() {
    if (!window.currentResponse) {
        mostrarNotificacao('Nenhuma resposta para compartilhar', 'warning');
        return;
    }
    
    const shareData = {
        title: 'Consulta RAG',
        text: `Pergunta: ${window.currentResponse.question}\n\nResposta: ${window.currentResponse.answer}`,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            mostrarNotificacao('Resposta compartilhada!', 'success');
        } else {
            // Fallback: copiar para clipboard
            await copiarResposta();
        }
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
        mostrarNotificacao('Erro ao compartilhar', 'error');
    }
}

// Gerenciar histórico
function adicionarAoHistorico(pergunta, resposta, responseTime) {
    const item = {
        id: Date.now(),
        pergunta,
        resposta,
        responseTime,
        timestamp: new Date().toISOString()
    };
    
    appState.history.unshift(item);
    
    // Limitar histórico a 10 itens
    if (appState.history.length > 10) {
        appState.history = appState.history.slice(0, 10);
    }
    
    salvarHistorico();
    atualizarHistoricoUI();
}

function atualizarHistoricoUI() {
    const historyList = document.getElementById('history-list');
    
    if (appState.history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">Nenhuma consulta realizada ainda.</p>';
        return;
    }
    
    historyList.innerHTML = appState.history.map(item => {
        const date = new Date(item.timestamp);
        return `
            <div class="history-item" onclick="reutilizarConsulta('${item.id}')">
                <div class="history-question">${item.pergunta}</div>
                <div class="history-time">
                    <i class="fas fa-clock"></i> ${item.responseTime}ms | 
                    ${date.toLocaleString('pt-BR')}
                </div>
            </div>
        `;
    }).join('');
}

function reutilizarConsulta(id) {
    const item = appState.history.find(h => h.id == id);
    if (item) {
        document.getElementById('pergunta').value = item.pergunta;
        document.getElementById('char-count').textContent = item.pergunta.length;
        document.getElementById('btn-consultar').disabled = false;
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        mostrarNotificacao('Pergunta carregada do histórico', 'success');
    }
}

function limparHistorico() {
    if (appState.history.length === 0) {
        mostrarNotificacao('Histórico já está vazio', 'info');
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        appState.history = [];
        salvarHistorico();
        atualizarHistoricoUI();
        mostrarNotificacao('Histórico limpo', 'success');
    }
}

// LocalStorage
function salvarHistorico() {
    try {
        localStorage.setItem('ragFrontendHistory', JSON.stringify(appState.history));
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

function carregarHistorico() {
    try {
        const saved = localStorage.getItem('ragFrontendHistory');
        if (saved) {
            appState.history = JSON.parse(saved);
            atualizarHistoricoUI();
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        appState.history = [];
    }
}

// Modal
function mostrarInfo() {
    document.getElementById('modal-info').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-info').style.display = 'none';
}

// Sistema de notificações
function mostrarNotificacao(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1002',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'slideInRight 0.3s ease'
    });
    
    // Cores por tipo
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
    
    // Adicionar estilos de animação se não existirem
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Utilitários de debug
window.ragDebug = {
    state: () => appState,
    config: () => API_CONFIG,
    testConnection: verificarConexao,
    clearHistory: () => {
        appState.history = [];
        salvarHistorico();
        atualizarHistoricoUI();
        console.log('✅ Histórico limpo via debug');
    },
    simulate: {
        success: () => {
            mostrarResposta({
                answer: 'Esta é uma resposta de teste do sistema RAG. O sistema está funcionando corretamente!'
            }, 'Pergunta de teste', 1234);
        },
        error: () => {
            mostrarErro('Este é um erro simulado para teste da interface.');
        }
    }
};

console.log('🔧 Debug disponível: window.ragDebug');
