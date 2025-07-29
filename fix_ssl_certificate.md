# 🔐 Soluções para Certificado SSL

## 1. Let's Encrypt (Gratuito e Válido)
```bash
# Na VPS
sudo apt update
sudo apt install certbot

# Gerar certificado para IP (limitado)
sudo certbot certonly --standalone --preferred-challenges http -d 147.93.8.153

# OU usar um domínio (recomendado)
# sudo certbot certonly --standalone -d seudominio.com
```

## 2. Cloudflare SSL (Gratuito)
- Adicionar domínio no Cloudflare
- Usar certificado Cloudflare
- Configurar proxy

## 3. Nginx Proxy com Let's Encrypt
```bash
# Configurar nginx na porta 443 com certificado válido
sudo certbot --nginx
```

## 4. Alternativa: Usar Domínio
- Registrar um domínio barato
- Apontar para o IP da VPS
- Gerar certificado SSL válido
