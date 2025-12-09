# FTP Uploader - Análise Técnica

## 📋 Visão Geral do Projeto

O **FTP Uploader** é uma aplicação web full-stack que permite fazer upload, download, gerenciamento e navegação de arquivos em servidores FTP remotos através de uma interface web intuitiva e responsiva. É uma solução **PWA (Progressive Web App)** que funciona tanto em navegadores desktop quanto mobile.

---

## 🏗️ Arquitetura Técnica

### 1. Backend (Node.js + Express)

#### **Tecnologias Core:**
- **Express.js** `4.21.2` - Framework web lightweight e modular
- **basic-ftp** `5.0.5` - Cliente FTP moderno baseado em promessas
- **Multer** `1.4.5` - Middleware para handling de upload de arquivos multipart/form-data
- **CORS** `2.8.5` - Middleware para Cross-Origin Resource Sharing
- **Node.js fs (Promise API)** - Operações assíncronas com filesystem

#### **Características de Segurança:**

##### Path Traversal Prevention
- Função `sanitizePath()` normaliza caminhos usando POSIX format
- Remove barras iniciais e valida traversal com `..`
- Impede acesso fora do diretório base

##### Validações
- Limite de tamanho de arquivo: **1 GB**
- Proteção contra deletar diretório raiz
- Validação obrigatória de credenciais

#### **Gerenciamento de Conexões FTP:**

A abordagem mais sofisticada é o **sistema de fila (Queue) por cliente**:

```
ftpLocks Map → Evita concorrência causada por "Client is closed"
├─ Serializa operações por chave (host:user:port)
├─ Previne múltiplas requisições simultâneas no mesmo servidor
└─ Implementa backoff/retry automático (até 3 tentativas)
```

**Características do Cliente FTP:**

- **PASV Mode IPv4 Forçado** - Sobrescreve `enterPassiveModeIPv6` para compatibilidade
- **Suporte FTPS (Explícito)** - TLS/SSL configurável via variáveis de ambiente
- **Certificados Self-signed** - Aceita certificados não-verificados por padrão
- **Fallback lftp** - Se basic-ftp falhar, usa comando `lftp` como alternativa

#### **Rotas da API REST:**

| Rota | Método | Função |
|------|--------|--------|
| `/api/ftp-test` | POST | Testa conexão FTP |
| `/api/ftp-list` | POST | Lista arquivos em diretório remoto |
| `/api/ftp-upload` | POST | Upload de múltiplos arquivos (com retry) |
| `/api/ftp-mkdir` | POST | Cria diretório remoto + aplica CHMOD 777 |
| `/api/ftp-delete` | POST | Deleta arquivo ou diretório |
| `/api/ftp-download` | POST | Download de arquivo remoto |
| `/` | GET | Serve index.html (SPA) |

#### **Fluxo de Upload Avançado:**

```javascript
1. Recebe múltiplos arquivos via Multer
2. Sanitiza caminho remoto
3. Garante existência do diretório remoto
4. Para cada arquivo:
   └─ Tenta upload com 3 retries (200ms backoff exponencial)
   └─ Se falhar com ECONNRESET → Fallback para lftp
5. Limpa arquivos temporários
6. Retorna status detalhado (sucesso/falha por arquivo)
```

---

### 2. Frontend (HTML5 + Vanilla JavaScript + PWA)

#### **Arquitetura:**

- **SPA (Single Page Application)** - Sem frameworks (React/Vue)
- **Responsive Design** - Mobile-first com viewport adaptativo
- **Service Worker** - Suporte offline parcial

#### **Funcionalidades JavaScript:**

##### Gerenciamento de Estado
```javascript
selectedFiles = []  // Files selecionados localmente
ftpCredentials = {} // Credenciais FTP armazenadas
currentPath = '.'   // Path atual no servidor FTP
busyCounter = 0     // Estado de loading
```

##### Utilitários de Navegação
- `pathJoin()` - Normaliza caminhos (trata `..` para voltar)
- `loadRemoteFiles()` - Carrega listagem do servidor FTP
- Navegação por clique em diretórios

##### Drag & Drop
- Drop zone com efeito visual `hover`
- Suporta arquivos via drag & drop ou clique
- Detecção de duplicatas antes de adicionar

##### Upload com Progresso
- Bar de progresso visual
- Modo de teste (dry-run) sem enviar arquivos
- Desabilita controles durante operação (setState com `busyCounter`)

##### Operações Remotas
- Download direto de arquivos
- Deletar arquivos/diretórios com confirmação
- Criar diretórios com CHMOD automático

#### **Styling & UX:**
- **CSS Customizado** - No framework CSS (estilo inline + arquivo externo)
- **Spinner de Loading** - Overlay visual durante operações
- **Status Messages** - Feedback em tempo real (success/error)
- **File Size Formatting** - Exibe tamanhos legíveis (B, KB, MB, GB)

---

### 3. Configuração (Environment-based)

#### **Variáveis de Ambiente (`config.js`):**

| Variável | Default | Descrição |
|----------|---------|-----------|
| `PORT` | 3000 | Porta do servidor Express |
| `FTP_SECURE` | true | Usar FTPS (true/false) |
| `FTP_STRICT_CERT` | false | Rejeitar certificados inválidos |

#### **Limites Configuráveis:**
- `fileSizeLimit`: 1 GB
- `upload.dest`: `/uploads` (cria automaticamente)

---

### 4. PWA (Progressive Web App)

#### **Web App Manifest** (`manifest.json`):
- Nome: "FTP Uploader"
- Tema: Azul (#1976d2)
- Modo Display: `standalone` (sem barra do navegador)
- Ícones: 192x192 e 512x512 (regular + maskable)
- Categorias: productivity, utilities
- Atalhos de aplicativo (upload rápido)

#### **Service Worker** (`sw.js`):
- Registra automaticamente no navegador
- Permite instalação como app nativo (PWA)
- Suporte para navegação offline

---

## 🔌 Fluxo de Conexão Detalhado

### 1. AUTENTICAÇÃO
```
Usuário preenche: server, port, username, password
         ↓
POST /api/ftp-test → withFtpClient()
         ↓
basic-ftp.Client.access({ FTPS settings })
         └─→ Conecta com TLS explícito (PASV IPv4)
         ↓
Credenciais armazenadas em ftpCredentials
```

### 2. UPLOAD PARALELO COM SEGURANÇA
```
FormData contém: files[], server, user, password, etc
         ↓
Multer processa: req.files[] → /uploads/{uuid}
         ↓
withFtpClient() enfileira operação (ftpLocks)
         ↓
setupDirectory() → ensureDir() + SITE CHMOD 777
         ↓
Para cada arquivo:
  ├─ Renomeia: espaços → underscores
  ├─ Tenta upload (maxAttempts = 3)
  ├─ Se ECONNRESET → spawn('lftp', [...])
  └─ sleep(100ms) entre uploads para estabilidade
         ↓
cleanupFiles() → delete /uploads/{uuid}
         ↓
JSON response com status individual por arquivo
```

### 3. NAVEGAÇÃO REMOTA
```
POST /api/ftp-list → client.list(sanitizedPath)
         ↓
Resposta com: [{name, type, size, modifiedAt}, ...]
         ↓
Frontend renderiza com ícones (📁 / 📄)
         ↓
Clique em pasta → pathJoin(currentPath, dirname)
         ↓
Recursivamente carrega próxima listagem
```

---

## 🛡️ Tratamento de Erros e Resiliência

### Retry Logic
- 3 tentativas com backoff exponencial (200ms, 400ms, 600ms)
- Detecta erros fatais vs. transitórios

### Fallback Mechanism
- Se `basic-ftp` falha com ECONNRESET → tenta `lftp` CLI
- lftp com argumentos via `spawn()` (previne shell injection)

### Logging
- FTP verbose logging (sem senhas)
- Console logs estruturados: `[FTP-QUEUE]`, `[FTP-UPLOAD]`, `[FTP-FALLBACK]`

### Limpeza
- Sempre fecha cliente FTP (no finally)
- Deleta arquivos temporários mesmo com erro

---

## 📦 Dependências

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| express | 4.21.2 | HTTP server |
| basic-ftp | 5.0.5 | Cliente FTP |
| multer | 1.4.5-lts.1 | Upload handling |
| cors | 2.8.5 | Cross-origin requests |
| nodemon | 3.1.11 (dev) | Auto-reload em desenvolvimento |

---

## 🔐 Segurança Implementada

✅ Path traversal prevention  
✅ FTPS com TLS/SSL  
✅ Validação de entrada (credenciais obrigatórias)  
✅ Limite de tamanho de arquivo  
✅ Proteção contra shell injection (spawn ao invés de exec)  
✅ Sanitização de nomes de arquivo (espaços → underscores)  
✅ CORS para requisições cross-domain  
✅ Temporários deletados automaticamente  

---

## 🚀 Como Iniciar

```bash
# Instalar dependências
npm install

# Iniciar servidor (desenvolvimento com nodemon)
npm start

# Ou com FTP Plain (sem FTPS)
npm run restart:plain-ftp

# Acesso
# http://localhost:3000
```

---

## 📁 Estrutura de Diretórios

```
ftp-uploader/
├── server.js              # Servidor Express + lógica FTP
├── config.js              # Configurações (ports, limits, env vars)
├── package.json           # Dependências Node.js
├── public/                # Frontend SPA
│   ├── index.html         # HTML principal
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service Worker
│   ├── css/
│   │   └── style.css      # Estilos
│   └── js/
│       └── main.js        # Lógica frontend (Vanilla JS)
├── uploads/               # Diretório temporário de uploads
└── tools/                 # Scripts auxiliares e ferramentas
```

---

## 🎯 Conclusão

O **FTP Uploader** é um projeto production-ready com foco em:

- **Robustez**: Retry logic, fallback mecanisms, tratamento de erros completo
- **Segurança**: Sanitização de caminhos, FTPS, validações, proteção contra injection
- **Experiência de Usuário**: Interface responsiva, PWA, drag & drop, feedback visual
- **Compatibilidade**: Suporte FTPS, PASV IPv4, certificados self-signed, fallback lftp

A combinação de `basic-ftp` + fallback `lftp` garante compatibilidade com diversos servidores FTP, mesmo em cenários de falha transitória.
