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

Front na Vercel; API em servidor separado. Configure `VITE_API_URL` apontando para a URL pública da API.
