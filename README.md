# ⚡ AnimeVibe — Plataforma Cyberpunk de Catalogação e Avaliação de Animes

<div align="center">

  <img src="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1200&h=400" alt="AnimeVibe Banner" width="100%" style="border-radius: 12px; box-shadow: 0 0 20px rgba(183, 33, 255, 0.4);" />

  <br />
  <br />

  [![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-8E44AD?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

  <p align="center">
    <b>Catalogação imersiva, avaliações em tempo real e experiência visual neon vibrante para amantes de animes.</b>
  </p>

  <p align="center">
    <a href="#-recursos-principais">Recursos</a> •
    <a href="#-design-system--paleta-de-cores">Design System</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-como-executar">Instalação</a> •
    <a href="#-estrutura-do-banco-de-dados">Banco de Dados</a> •
    <a href="#-envio-para-o-github-branches">Guia GitHub</a>
  </p>

</div>

---

## 📖 Sobre o Projeto

O **AnimeVibe** é uma plataforma moderna desenvolvida em **Next.js 15 App Router** com arquitetura full-stack. O projeto foi projetado sob uma identidade estéticamente futurista (*Cyberpunk / Neon Graphit*) para catalogar animes, permitir avaliações interativas da comunidade, gerenciamento de listas pessoais e um painel de controle administrativo integrado ao **Supabase**.

---

## ✨ Recursos Principais

<details open>
  <summary><b>🎬 Experiência Visual & Catálogo Dinâmico</b></summary>
  <br />
  <ul>
    <li><b>Hero Section Imersiva:</b> Apresentação de destaques com trailer, filtros de áudio (Dublado/Legendado), qualidade (HD/4K) e sinopse expansível.</li>
    <li><b>Grid Reativo de Animes:</b> Exibição paginada com ordenação por popularidade, lançamentos e notas da comunidade.</li>
    <li><b>Barra de Pesquisa com Auto-complete:</b> Busca instantânea por título, gênero ou ano.</li>
  </ul>
</details>

<details>
  <summary><b>⭐️ Sistema Interativo de Avaliação</b></summary>
  <br />
  <ul>
    <li><b>Modal Neonisado de Rating:</b> Avaliação fluida de 1 a 5 estrelas com contagem dinâmica e feedback visual imediato via <code>sonner</code> toasts.</li>
    <li><b>Página Detalhada do Anime (Dynamic Slug):</b> Rota individual (<code>/anime/[slug]</code>) com background blurred dinâmico e estatísticas completas.</li>
  </ul>
</details>

<details>
  <summary><b>🔐 Autenticação e Painel Administrativo</b></summary>
  <br />
  <ul>
    <li><b>Autenticação Supabase:</b> Login e registro seguros com suporte a papéis de usuário (Admin / Membro).</li>
    <li><b>Painel de Usuários (<code>/admin/users</code>):</b> Gerenciamento de permissões, controle de status de usuários e uploads de imagens com <code>ImageUpload</code>.</li>
    <li><b>CRUD Completo de Animes:</b> Server Actions nativos do Next.js 15 para adição, edição e remoção instantânea no banco de dados.</li>
  </ul>
</details>

<details>
  <summary><b>🤖 Inteligência Artificial (Google Gemini AI)</b></summary>
  <br />
  <ul>
    <li><b>Geração e Correção de Sinopses:</b> Integração server-side com a biblioteca oficial <code>@google/genai</code> para auxílio de conteúdo.</li>
  </ul>
</details>

---

## 🎨 Design System & Paleta de Cores

A interface foi concebida utilizando **Design Tokens** refinados e bordas marcantes sem *border-radius* suavizado excessivo (`radius: 0px`), priorizando brilho neon e contraste alto (*Deep Void Graphite*).

| Token | Cor Hex | Exemplo Visual | Aplicação |
| :--- | :---: | :---: | :--- |
| **Primary** | `#B721FF` | ![#B721FF](https://via.placeholder.com/15/B721FF/B721FF.png) | Botões principais, estados ativos, neon glow |
| **Accent** | `#00E5FF` | ![#00E5FF](https://via.placeholder.com/15/00E5FF/00E5FF.png) | Tags de destaque, classificações, bordas secundárias |
| **Background** | `#0B0C10` | ![#0B0C10](https://via.placeholder.com/15/0B0C10/0B0C10.png) | Fundo principal da aplicação |
| **Surface** | `#181A20` | ![#181A20](https://via.placeholder.com/15/181A20/181A20.png) | Cards, modais e containers internos |
| **Text** | `#F8F8F8` | ![#F8F8F8](https://via.placeholder.com/15/F8F8F8/F8F8F8.png) | Texto principal de leitura |
| **Muted** | `#8B8C9A` | ![#8B8C9A](https://via.placeholder.com/15/8B8C9A/8B8C9A.png) | Textos secundários e bordas inativas |

### 🔤 Tipografia

- **Títulos & Botões:** `Rajdhani` (Bold 700 / Semi-Bold 600, uppercase, letter-spacing 2px)
- **Corpo & Legendas:** `Space Grotesk` (Regular 400 / Medium 500)

---

## 🛠️ Tecnologias

```
AnimeVibe
├── Framework: Next.js 15 (App Router, Server Actions, Dynamic Rendering)
├── Linguagem: TypeScript 5.9
├── Estilização: Tailwind CSS v4 + PostCSS + tw-animate-css
├── Componentes UI: Lucide React + Sonner (Toasts) + Class Variance Authority
├── Banco de Dados: Supabase (PostgreSQL + RLS Security Rules)
└── Inteligência Artificial: @google/genai (Google Gemini API)
```

---

## 🚀 Como Executar o Projeto Localmente

### 1️⃣ Pré-requisitos
Certifique-se de possuir instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 20 ou superior)
- Gerenciador de pacotes (`npm`, `pnpm` ou `yarn`)

### 2️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/animevibe.git
cd animevibe
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com base no arquivo `.env.example`:

```env
# Gemini AI
GEMINI_API_KEY="SuaChaveGeminiAqui"

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"

# App URL
APP_URL="http://localhost:3000"
```

### 4️⃣ Instalar Dependências e Iniciar
```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse no seu navegador: `http://localhost:3000`

---

## 🗄️ Estrutura do Banco de Dados

O banco de dados relacional é mantido no **Supabase** através do arquivo SQL `supabase_schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.animes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  year INTEGER NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  audio TEXT DEFAULT 'DUBLADO',
  quality TEXT DEFAULT 'HD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## 📁 Estrutura de Diretórios

```
├── app/
│   ├── admin/
│   │   └── users/        # Gerenciamento de usuários
│   ├── anime/
│   │   └── [slug]/       # Detalhes dinâmicos do anime
│   ├── login/            # Página de autenticação
│   ├── layout.tsx        # Layout raiz com Providers e Header/Footer
│   ├── page.tsx          # Home page (Hero + Grid)
│   └── globals.css       # Estilos globais e tokens Tailwind v4
├── components/           # Componentes reusáveis (Navbar, Grid, Modais, etc)
├── lib/
│   ├── animes.ts         # Server actions para manipulação de animes
│   ├── supabase.ts       # Cliente e configuração do Supabase
│   └── utils.ts          # Helpers utilitários
└── supabase_schema.sql   # Script DDL do banco de dados
```

---

## 🌿 Envio para o GitHub em uma Branch Específica

Para publicar este repositório no GitHub trabalhando com branches específicas (ex: `dev`, `feature/novos-recursos` ou `main`), siga este passo a passo:

### 1. Inicializar o Git (se ainda não iniciado)
```bash
git init
```

### 2. Adicionar o Repositório Remoto
```bash
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

### 3. Criar e Mudar para a Branch Desejada
```bash
# Para criar e acessar uma nova branch (ex: 'dev' ou 'feature/rating-system'):
git checkout -b feature/minha-nova-branch
```

### 4. Adicionar os Arquivos e Realizar o Commit
```bash
git add .
git commit -m "feat: adiciona documentacao completa no README e estrutura do projeto"
```

### 5. Enviar (Push) para a Branch Específica no GitHub
```bash
git push -u origin feature/minha-nova-branch
```

> 💡 **Dica:** Se você quiser mesclar suas alterações na branch principal (`main`), você pode abrir um *Pull Request* (PR) diretamente na interface do GitHub!

---

<div align="center">
  <p>Desenvolvido com 💜 por <b>FC Dev System</b> para a comunidade <b>AnimeVibe</b>.</p>
</div>
