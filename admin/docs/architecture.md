# Architecture

Multi-tenant Next.js 16 admin dashboard for CzechSkills 2026. Currently manages the **KellyCars** car rental tenant with blog, FAQ, and vehicle inventory modules.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS 4, shadcn/ui components |
| Database | PostgreSQL via Prisma 7.5 |
| Auth | NextAuth.js v5 (JWT, Credentials provider) |
| Storage | Cloudflare R2 (S3-compatible) |
| Rich Text | TipTap editor |
| Notifications | Sonner (toast) |
| Icons | Lucide React |

## Project Structure

```
admin/
├── prisma/
│   └── schema.prisma           # Database models & relations
├── src/
│   ├── actions/                 # Server actions (all backend logic)
│   │   ├── blog-posts.ts
│   │   ├── categories.ts
│   │   ├── faq.ts
│   │   ├── tags.ts
│   │   ├── upload.ts
│   │   └── kellycars/
│   │       ├── vehicles.ts
│   │       └── reservations.ts
│   ├── app/                     # Routes & pages
│   │   ├── (auth)/              # Login & register
│   │   ├── kellycars/           # Tenant routes
│   │   │   ├── blog/
│   │   │   ├── faq/
│   │   │   └── vozy/
│   │   └── api/auth/            # NextAuth API handler
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives + custom (image-upload, rich-text-editor)
│   │   ├── blog/                # Blog-specific components
│   │   ├── Faq/                 # FAQ-specific components
│   │   └── Menu/                # Sidebar navigation
│   ├── lib/                     # Shared utilities
│   │   ├── auth.ts              # NextAuth config
│   │   ├── prisma.ts            # Prisma singleton
│   │   ├── r2.ts                # Cloudflare R2 client
│   │   ├── api-auth.ts          # API key validation
│   │   └── utils.ts             # cn() helper
│   ├── types/                   # Type augmentations (next-auth.d.ts)
│   └── generated/prisma/        # Auto-generated Prisma client
├── scripts/                     # Database seed scripts
└── docs/                        # This documentation
```

## Multi-Tenancy

Users belong to tenants via a many-to-many `UserTenant` join table. The session JWT carries the user's full tenant list. Every route checks tenant access and every database query filters by `tenantId`.

```
User ──M:N── Tenant
               │
    ┌──────────┼──────────┐
    │          │          │
 BlogPost  FaqCategory  KellyCarsVehicle
    │          │
 Category   FaqItem
 Tag
```

## Authentication Flow

1. User submits credentials at `/login`
2. NextAuth Credentials provider verifies password (bcryptjs)
3. JWT created with `{ id, username, tenants[] }`
4. All protected pages call `auth()` and redirect to `/login` if unauthenticated
5. Tenant access checked per-route (`session.user.tenants`)

## Layout

Two-column layout: fixed sidebar (`Menu` component) + scrollable main content. The sidebar is configured per-tenant in the tenant layout file.
