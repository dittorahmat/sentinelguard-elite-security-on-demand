# Cloudflare Workers React Starter Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dittorahmat/sentinelguard-elite-security-on-demand)

A production-ready full-stack starter template for Cloudflare Workers with a modern React frontend. Built with Durable Objects for scalable, stateful data storage (Users, Chats, Messages), Hono for API routing, and shadcn/ui for beautiful, accessible UI components.

This template provides:
- **Backend**: Type-safe APIs with automatic seeding, pagination, CRUD operations.
- **Frontend**: React 18, TanStack Query, Tailwind CSS, shadcn/ui, dark mode, sidebar layout.
- **Shared types**: Zero-downtime development with full TypeScript support across client/server.
- **Observability**: Built-in logging, error reporting, health checks.

Perfect for real-time apps, dashboards, or any stateful Worker application.

## 🚀 Features
- Stateful entities (Users, Chats) using a single shared Durable Object for cost-efficiency.
- Indexed listing with cursor-based pagination.
- Pre-seeded mock data for instant demos.
- Reactive frontend with infinite queries, forms, and optimistic updates.
- Responsive design with mobile support, theme toggle, sidebar.
- Hot reload for both frontend and Worker APIs.
- Error boundaries, client error reporting to `/api/client-errors`.
- SEO-friendly SPA routing with React Router.

## 🛠 Tech Stack
| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects |
| **Frontend** | React 18, TypeScript, Vite, TanStack Query, React Router |
| **UI/UX** | shadcn/ui, Tailwind CSS, Lucide Icons, Framer Motion |
| **State/Data** | Zustand, Immer, Zod validation |
| **Dev Tools** | Bun, ESLint, Wrangler, Cloudflare Vite plugin |
| **Other** | Sonner (toasts), Date-fns, UUID |

## 📋 Prerequisites
- [Bun](https://bun.sh/) (package manager & runtime)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (auto-installed via `bun install`)

## 🏁 Installation
1. Clone or download the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Generate Worker types (one-time):
   ```bash
   bun run cf-typegen
   ```

## 🔄 Local Development
- Start the dev server (frontend + Worker proxy):
  ```bash
  bun run dev
  ```
- Open [http://localhost:3000](http://localhost:3000) (or `bun run dev --port 8080`).
- Edit `src/pages/HomePage.tsx` for UI, `worker/user-routes.ts` for APIs.
- Worker routes auto-reload on changes.

**Hot Paths**:
- `src/pages/` → Client pages
- `worker/user-routes.ts` → Add GET/POST/DELETE routes using `Entity` helpers
- `worker/entities.ts` → Extend `IndexedEntity` for new models
- `shared/types.ts` → Shared client/server types

## 📱 Usage Examples
### Frontend API Calls (via `api-client.ts`)
```tsx
// List users (paginated)
const { items: users, next } = await api<{ items: User[]; next: string | null }>('/api/users?limit=10')

// Create user
const newUser = await api<User>('/api/users', { method: 'POST', body: JSON.stringify({ name: 'Alice' }) })

// List chats
const chats = await api<{ items: Chat[]; next: string | null }>('/api/chats')

// Send message to chat
await api<ChatMessage>('/api/chats/c1/messages', {
  method: 'POST',
  body: JSON.stringify({ userId: 'u1', text: 'Hello!' })
})
```

### Backend Entities (in `worker/entities.ts`)
```ts
export class PostEntity extends IndexedEntity<{ id: string; title: string; content: string }> {
  static readonly entityName = 'post';
  static readonly indexName = 'posts';
  static readonly initialState = { id: '', title: '', content: '' };
}

// Usage in routes
app.post('/api/posts', async (c) => ok(c, await PostEntity.create(c.env, { id: crypto.randomUUID(), title, content })));
```

## ☁️ Deployment
Deploy to Cloudflare Workers in one command:
```bash
bun run deploy
```

This builds the frontend assets, bundles the Worker, and deploys via Wrangler.

**Custom Domain**: Edit `wrangler.jsonc` → `assets.directory` for static assets.

**Environment Variables**: Add via Wrangler dashboard or `wrangler.toml`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dittorahmat/sentinelguard-elite-security-on-demand)

## 🏗 Architecture Overview
```
Frontend (Vite + React) → Worker (Hono APIs) → Durable Objects (Entities + Indexes)
                          ↓
                   GlobalDurableObject (KV-like storage)
```
- **Single DO per entity** (e.g., `user:abc123`) for strong consistency.
- **Global index** (`index:users`) for listing.
- **CAS transactions** for concurrency safety.
- **Assets SPA mode**: Worker handles `/api/*`, serves frontend for all else.

## 🤝 Contributing
1. Fork & clone.
2. `bun install && bun run dev`.
3. Make changes, test locally.
4. Commit with conventional commits.
5. PR to `main`.

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Docs](https://hono.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

Built with ❤️ for the Cloudflare ecosystem. Issues? Open a GitHub issue!