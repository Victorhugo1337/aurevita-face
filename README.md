# Presence Front — protótipo

Front-end da loja **Presence Nutrition for Life**.
Projeto de curricularização. Stack: **React + Vite + Tailwind CSS + React Router**.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Estrutura

```
src/
├── components/          Componentes reutilizáveis (ProductCard, ProductVisual)
├── data/mock.js         Dados mock — trocar por chamadas REST quando back-end existir
├── layouts/             StoreLayout (loja) e AdminLayout (painel)
├── lib/store.jsx        Context global: carrinho + auth
├── pages/
│   ├── store/           Home, Catalog, ProductDetail, Cart
│   ├── auth/            Login, Register
│   └── admin/           Dashboard, AdminProducts, AdminOrders, ...
├── App.jsx              Rotas
└── index.css            Tailwind + design tokens
```

## Rotas

| Rota                | Descrição                              |
|---------------------|----------------------------------------|
| `/`                 | Landing da loja                        |
| `/loja`             | Catálogo (filtra por `?cat=slug`)      |
| `/produto/:id`      | Detalhe do produto                     |
| `/carrinho`         | Carrinho                               |
| `/login`            | Login (use `admin@presence.com` p/ admin) |
| `/cadastro`         | Cadastro                               |
| `/admin`            | Dashboard (protegido — só admin)       |
| `/admin/produtos`   | CRUD de produtos                       |
| `/admin/pedidos`    | Lista de pedidos                       |

## Design tokens

Cores em `tailwind.config.js`:
- `moss-*` — verde profundo (cor principal)
- `bone-*` — off-white quente (fundo)
- `clay-*` — terroso/cobre (acento)

Tipografia:
- **Fraunces** (display, serif)
- **Inter** (body, sans)
- **JetBrains Mono** (códigos, SKUs, datas)

## Próximos passos (integração com seu back-end Java)

1. Criar `src/lib/api.js` com `fetch` configurado pra `VITE_API_URL`
2. Substituir imports de `data/mock.js` por chamadas reais:
   - `GET /api/products` → catálogo
   - `GET /api/products/:id` → detalhe
   - `POST /api/auth/login` → retorna JWT
   - `GET /api/orders` (admin) → pedidos
   - `POST /api/orders` → checkout
3. Trocar `login()` no `lib/store.jsx` por chamada real à API + persistir token em `localStorage`
4. Adicionar interceptor pra anexar `Authorization: Bearer <token>` nas requisições autenticadas
