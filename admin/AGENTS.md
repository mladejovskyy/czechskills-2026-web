<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CzechSkills 2026 — Admin Panel

Multi-tenant administration panel for managing blog posts, FAQ, vehicles, and more across tenants.

## Stack

- **Framework:** Next.js 16.2.1 (App Router, Turbopack)
- **Runtime:** Bun (for scripts), Node.js (for Next.js)
- **Language:** TypeScript (strict)
- **ORM:** Prisma 7.5.0 with `@prisma/adapter-pg` driver adapter — **no zero-arg `PrismaClient()` constructor**
- **Database:** PostgreSQL (Neon) with `sslmode=verify-full`
- **Auth:** next-auth 5.0.0-beta.30 (JWT strategy, Credentials provider)
- **UI:** shadcn (Base UI-based, NOT Radix) + Tailwind CSS 4
- **Rich Text:** Tiptap 3 (StarterKit, Link, Underline, Placeholder)
- **Storage:** Cloudflare R2 via `@aws-sdk/client-s3`
- **Notifications:** Sonner
- **Icons:** Lucide React

## Architecture

### Multi-tenancy

All data is scoped by `tenantId`. Every database query must filter by tenant. Tenant routes are **static** (e.g., `/kellycars/`), not dynamic `[tenantSlug]`, because each tenant can have unique pages.

**Auth check pattern in pages:**
```typescript
const session = await auth();
if (!session) redirect("/login");
const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
if (!tenant) redirect("/");
```

Session includes `user.id`, `user.username`, and `user.tenants: { id, slug, name }[]`.

### Prisma 7 — Driver Adapter Required

```typescript
// src/lib/prisma.ts — singleton pattern
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const client = new PrismaClient({ adapter });
```

Generated client lives at `@/generated/prisma/client`. The `@/generated/prisma` path does NOT work.

### API Authentication

Public API routes at `/api/v1/[tenantSlug]/...` use Bearer token auth validated against `Tenant.apiKey`. See `src/lib/api-auth.ts`.

## Directory Structure

```
src/
├── actions/              # Server actions ("use server")
│   ├── blog-posts.ts     # Blog CRUD, publish/unpublish
│   ├── categories.ts     # Blog category CRUD + getCategoryWithPostCount
│   ├── tags.ts           # Tag CRUD + findOrCreateTag(tenantId, name)
│   ├── faq.ts            # FAQ category & item CRUD
│   ├── upload.ts         # R2 image upload/delete + updateMediaAlt
│   └── kellycars/
│       ├── vehicles.ts
│       └── reservations.ts
├── app/
│   ├── (auth)/           # Login, register (unprotected)
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route handler
│   │   └── v1/[tenantSlug]/     # Public API (Bearer token)
│   ├── kellycars/        # Static tenant route
│   │   ├── layout.tsx    # Auth guard + Menu sidebar
│   │   ├── blog/         # Blog list, new, [id] edit
│   │   ├── faq/          # FAQ categories, [categoryId] items
│   │   └── vozy/         # Vehicle list, pridat, upravit/[id]
│   └── page.tsx          # Root redirect
├── components/
│   ├── ui/               # shadcn primitives (button, input, dialog, etc.)
│   ├── blog/             # BlogPostForm, BlogPostActions, CreateCategoryDialog
│   ├── Faq/              # CreateCategoryDialog, CreateItemDialog, FaqItemActions, DeleteCategoryButton
│   └── Menu/             # Sidebar navigation
├── generated/prisma/     # Prisma generated client (DO NOT import from @/generated/prisma)
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma singleton with driver adapter
│   ├── r2.ts             # Cloudflare R2 upload/delete helpers
│   ├── api-auth.ts       # API key validation
│   └── utils.ts          # cn() for Tailwind class merging
└── types/
    └── next-auth.d.ts    # Session type augmentation
```

## Conventions

### UI Language

All user-facing text is in **Czech**. Labels, toasts, button text, empty states — everything.

### Components

- `src/components/` is for **shared** components reusable across tenants
- Tenant-specific colocated components use `_components/` inside route dirs (e.g., `vozy/_components/VehicleTable.tsx`)
- shadcn is based on **Base UI** (NOT Radix):
  - `DialogTrigger` uses `render={<Button />}` prop, not `asChild`
  - `DropdownMenuItem` uses `onClick`, not `onSelect`
  - `Select.onValueChange` can pass `null` — handle with `(v) => setState(v ?? "")`
  - Button `size` values include `"icon-sm"`, `"xs"`, `"sm"`

### Forms

- Use `useState` for controlled form fields
- Track `loading` state, disable submit button during submission
- Auto-generate slug from title via `slugify()` with Czech diacritics normalization (NFD + strip combining marks)
- Track `slugTouched` to stop auto-generation when user manually edits slug
- Tags use `tagNames: string[]` (not IDs) — resolved at submit time via `findOrCreateTag`
- Server actions in try/catch with `toast.success()` / `toast.error()`
- `router.push()` + `router.refresh()` after mutations

### Slugify (used everywhere)

```typescript
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
```

### Server Actions

All mutations are `"use server"` actions in `src/actions/`. They use the Prisma singleton from `src/lib/prisma.ts`. Blog post updates create 301 redirects when slug changes.

### Image Upload

Uses the shared `ImageUpload` component (`src/components/ui/image-upload.tsx`) backed by `uploadImage` server action → Cloudflare R2 → `Media` record. R2 key structure: `{tenantSlug}/{folder}/{filename}`.

### Rich Text Editor

Tiptap with `immediatelyRender: false` for SSR. Stores HTML in the `content` field. Located at `src/components/ui/rich-text-editor.tsx`.

### Decimal Fields

Prisma `Decimal` types (e.g., `pricePerDay`) must be serialized to `number` before passing as props to client components. Use `Omit<Model, "field"> & { field: number }` for the type.

## Key Gotchas

1. **Prisma 7** — No `new PrismaClient()` without adapter. Always use the singleton from `src/lib/prisma.ts`
2. **Import path** — `@/generated/prisma/client`, not `@/generated/prisma`
3. **Base UI shadcn** — Not Radix. Check component source before using unfamiliar props
4. **`params` is a Promise** in Next.js 16 — always `const { id } = await params`
5. **Decimal → number** — Serialize Prisma Decimal fields before passing to client components
6. **Bun scripts** — `scripts/` directory is excluded from tsconfig (uses Bun-specific APIs)
7. **Tiptap SSR** — Must pass `immediatelyRender: false` to `useEditor`
