# 🚀 Configuração NGINX + HTTPS para RAG

## ✅ STATUS ATUAL
- **RAG API:** Funcionando em http://147.93.8.153:8000
- **Frontend:** Atualizado para https://147.93.8.153 
- **Problema:** Mixed Content (HTTPS → HTTP)
- **Solução:** Nginx Proxy + SSL Certificate

---

## 📋 INSTRUÇÕES PASSO A PASSO

### **1. Conectar ao VPS**
```bash
ssh raguser@147.93.8.153
```

### **2. Instalar Nginx**
```bash
sudo apt update
sudo apt install -y nginx
```

### **3. Criar Configuração**
```bash
sudo nano /etc/nginx/sites-available/rag-api
```

**Cole este conteúdo COMPLETO:**
```nginx
server {
    listen 80;
    server_name 147.93.8.153;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        proxy_hide_header Access-Control-Allow-Origin;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, DELETE, PUT';
        add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
        
        # Handle preflight OPTIONS requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, DELETE, PUT';
            add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Access-Control-Allow-Origin *;
    }
    
    access_log /var/log/nginx/rag-api-access.log;
    error_log /var/log/nginx/rag-api-error.log;
}
```

**Salvar:** `Ctrl+X` → `Y` → `Enter`

### **4. Ativar Configuração**
```bash
sudo ln -sf /etc/nginx/sites-available/rag-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

### **5. Testar e Iniciar**
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **6. Testar HTTP**
```bash
curl http://147.93.8.153/health
```
*Esperado: `{"status":"healthy",...}`*

### **7. Instalar SSL**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx
```

**Durante instalação:**
- **Email:** Digite seu email
- **Termos:** `Y`
- **Marketing:** `N`
- **Domínio:** Pressione Enter (usa IP automaticamente)

### **8. Teste Final**
```bash
curl https://147.93.8.153/health
```

### **9. Commit Frontend Atualizado**
```bash
# No diretório local:
cd "04 - rag-frontend"
git add .
git commit -m "Update API URL to HTTPS after Nginx setup"
git push origin main
```

---

## 🎯 RESULTADO ESPERADO

Após completar todos os passos:

1. ✅ **API HTTP:** http://147.93.8.153/health
2. ✅ **API HTTPS:** https://147.93.8.153/health  
3. ✅ **Frontend:** Conecta via HTTPS sem Mixed Content
4. ✅ **Certificado SSL:** Válido e automático

## 🔧 TROUBLESHOOTING

### Nginx não inicia:
```bash
sudo nginx -t  # Verificar configuração
sudo systemctl status nginx  # Ver status
```

### SSL falha:
```bash
sudo certbot --nginx --dry-run  # Teste
sudo ufw allow 80
sudo ufw allow 443
```

### API não responde:
```bash
curl http://127.0.0.1:8000/health  # Testar diretamente
sudo systemctl status nginx  # Status do proxy
```

---

## 📞 PRÓXIMOS PASSOS

1. Execute as instruções acima no VPS
2. Verifique se HTTPS funciona
3. Teste o frontend em: https://danilomfaria.github.io/rag-frontend
4. O sistema estará 100% funcional com HTTPS! 🎉
