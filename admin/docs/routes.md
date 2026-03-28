# Routes

All routes are in `src/app/`. The app uses Next.js App Router with server components by default and `"use client"` where interactivity is needed.

## Auth Routes — `(auth)/`

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login form | Username/password, redirects to `/` |
| `/register` | Register page | Minimal stub |

Grouped in `(auth)` layout that centers content.

## Root

| Route | Description |
|-------|-------------|
| `/` | Redirects to first tenant dashboard (e.g. `/kellycars`) |

## Tenant: KellyCars — `kellycars/`

Layout: sidebar menu + main content area (`min-w-0 flex-1` to prevent overflow).

### Dashboard

| Route | Description |
|-------|-------------|
| `/kellycars` | Overview placeholder |

### Blog — `kellycars/blog/`

| Route | Description |
|-------|-------------|
| `/kellycars/blog` | Post list table with status badges, publish/delete actions |
| `/kellycars/blog/new` | Create new post (BlogPostForm) |
| `/kellycars/blog/[id]` | Edit existing post (BlogPostForm with initial data) |

### FAQ — `kellycars/faq/`

| Route | Description |
|-------|-------------|
| `/kellycars/faq` | Category cards grid with delete buttons |
| `/kellycars/faq/[categorySlug]` | Category detail — item table with edit/publish/delete |

FAQ categories are routed by **slug**, not ID.

### Vehicles — `kellycars/vozy/`

| Route | Description |
|-------|-------------|
| `/kellycars/vozy` | Vehicle list with filters (URL search params) |
| `/kellycars/vozy/pridat` | Add new vehicle (VehicleForm) |
| `/kellycars/vozy/upravit/[id]` | Edit vehicle (VehicleForm with initial data) |

### API — Internal

| Route | Description |
|-------|-------------|
| `/api/auth/[...nextauth]` | NextAuth handler (GET/POST) |

## REST API — `api/v1/[tenantSlug]/`

Public read-only GET endpoints for the frontend. All require Bearer token authentication via the tenant's API key.

**Auth header:** `Authorization: Bearer <apiKey>`

### Blog

| Endpoint | Query Params | Description |
|----------|-------------|-------------|
| `GET /api/v1/{tenant}/blog` | `category`, `tag`, `page`, `limit` | Paginated published posts |
| `GET /api/v1/{tenant}/blog/{slug}` | — | Single published post by slug |

**Blog list response:**
```json
{
  "data": [
    {
      "id", "slug", "title", "content", "status", "publishedAt",
      "category": { "id", "name", "slug" },
      "tags": [{ "id", "name", "slug" }],
      "author": { "id", "name", "username" },
      "coverImage": { "id", "url", "alt" },
      "faqs": [{ "id", "question", "answer", "sortOrder" }]
    }
  ],
  "pagination": { "page", "limit", "total", "totalPages" }
}
```

**Blog detail response:** Same shape as list item, wrapped in `{ "data": { ... } }`. Category includes `description`, `metaTitle`, `metaDesc`.

### Categories & Tags

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/{tenant}/categories` | All categories (sorted by name) |
| `GET /api/v1/{tenant}/tags` | All tags (sorted by name) |

**Categories response:** `{ "data": [{ "id", "name", "slug", "description", "metaTitle", "metaDesc" }] }`

**Tags response:** `{ "data": [{ "id", "name", "slug" }] }`

### FAQ

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/{tenant}/faq` | All FAQ categories with published items (sorted by sortOrder) |
| `GET /api/v1/{tenant}/faq/{slug}` | Single FAQ category by slug with published items |

**FAQ response:**
```json
{
  "data": [
    {
      "id", "name", "slug", "description", "metaTitle", "metaDesc", "sortOrder",
      "items": [{ "id", "question", "slug", "answer", "metaTitle", "metaDesc", "sortOrder" }]
    }
  ]
}
```

### Vehicles

| Endpoint | Query Params | Description |
|----------|-------------|-------------|
| `GET /api/v1/{tenant}/vehicles` | `category`, `transmission` | Available vehicles (sorted by createdAt desc) |
| `GET /api/v1/{tenant}/vehicles/{slug}` | — | Single vehicle by slug |

**Vehicles response:**
```json
{
  "data": [
    {
      "id", "slug", "name", "category", "transmission", "available",
      "image": { "id", "url", "alt" }
    }
  ]
}
```

Vehicle list only returns `available: true`. Vehicle detail returns regardless of availability.

### Redirects

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/{tenant}/redirects` | All redirects (sorted by createdAt desc) |

**Response:** `{ "data": [{ "id", "fromPath", "toPath", "type" }] }`

### Error Responses

| Status | Body |
|--------|------|
| 401 | `{ "error": "Missing or invalid Authorization header" }` |
| 404 | `{ "error": "Blog post not found" }` (varies by resource) |
| 500 | `{ "error": "Failed to fetch ..." }` |

## Menu Configuration

Defined in `kellycars/layout.tsx`:

```
Přehled          → /kellycars
─── Obsah ───
Blog             → /kellycars/blog
FAQ              → /kellycars/faq
─── Autopůjčovna ───
Vozy             → /kellycars/vozy
```
