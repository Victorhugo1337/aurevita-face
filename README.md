# Aurevita front-end — protótipo

Front-end B2B da plataforma **Aurevita*. Stack: **React + Vite + Tailwind CSS + React Router**.

Integrado com a API Spring Boot (`api-aurevita`).

## Como rodar

```bash
npm install
cp .env.example .env.development   # ajuste VITE_API_URL se necessário
npm run dev
```

Abre em `http://localhost:5173`. A API deve estar em `http://localhost:8080`.

```env
VITE_API_URL=http://localhost:8080
VITE_DOCS_URL=http://localhost:8080/swagger-ui/index.html
```

## Painéis por perfil

| Perfil | Login demo | Painel |
|--------|------------|--------|
| ADMIN | `admin@aurevita.com` | `/admin` |
| SENIOR / DIRECTOR / DISTRIBUTOR | ver API | `/app` |
| REPRESENTANT | `rep.joao@aurevita.com` | `/app/pedidos` (sem dashboard) |

Senha demo: `123@Mudar`

## Rotas principais

**Público:** `/` (landing), `/login`, `/cadastro`

**Admin (`/admin/*`):** dashboard, movimentações, produtos, pedidos, clientes, configurações

**Parceiro (`/app/*`):** dashboard (exceto representante), pedidos, catálogo, carrinho, movimentações, config (sênior)

## Integração com a API

### Admin — clientes
- `GET /admin/network-summary` — cards de contagem
- `GET /admin/clients` — lista de parceiros
- `POST /admin/clients` — cadastro unificado (hierarquia + login)

### Admin — equipe
- `GET /users` — lista admins (filtro no front)
- `POST /admin/admins` — novo administrador

### Catálogo
- `GET /products` — retorna `price`, `priceLevel`, `priceLevelLabel` conforme JWT
- Checkout: `POST /orders` com `Idempotency-Key`

### Dashboard
- `GET /dashboard/summary` — KPIs + `recentOrders` + `recentMovements` (escopo por role)

### Movimentações
- `GET /movements` — escopo automático por perfil no back-end

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

A API de produção está na Azure:

- API: `https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net`
- Swagger: [documentação](https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net/swagger-ui/index.html)

### Passo a passo

1. Suba o código no GitHub (branch `main` ou `dev`).
2. Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe o repositório `aurevita-face`.
3. Framework: **Vite** (detectado automaticamente).
4. Em **Environment Variables**, adicione (Production, Preview e Development):

   | Nome | Valor |
   |------|--------|
   | `VITE_API_URL` | `https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net` |
   | `VITE_DOCS_URL` | `https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net/swagger-ui/index.html` |

5. **Deploy**. A Vercel roda `npm run build` e publica a pasta `dist`.

O arquivo `vercel.json` já configura fallback SPA para rotas como `/admin` e `/app`.

### CORS na API (Azure)

O back-end precisa aceitar o domínio da Vercel (ex.: `https://seu-projeto.vercel.app`). No Spring, confira se `SecurityConfig` inclui `https://*.vercel.app` em `allowedOriginPatterns`. Se usar domínio customizado, adicione-o também.

### Teste local apontando para a nuvem

Crie `.env.production.local` (não commitar) ou altere temporariamente `.env.development`:

```env
VITE_API_URL=https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net
VITE_DOCS_URL=https://api-aurevita-hvh2e5dmdwe7aca8.centralus-01.azurewebsites.net/swagger-ui/index.html
```

Depois: `npm run dev` e teste o login.
