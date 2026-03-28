# CzechSkills 2026 — CMS budoucnosti (SEO/GEO 2026)

Multi-tenant CMS s integrovaným frontendem pro správu blogu, FAQ a dalšího obsahu. Systém je navržen jako headless CMS schopné obsluhovat více nezávislých klientských projektů současně.

**Live URL (Admin):** [czechskills-2026-web.vercel.app](https://czechskills-2026-web.vercel.app)
**Live URL (Web):** [czechskills-2026-web-lzan.vercel.app](https://czechskills-2026-web-lzan.vercel.app)

## Technologický stack

| Vrstva | Technologie |
|--------|-------------|
| Framework | Next.js 16.2.1 (App Router, Turbopack, SSR) |
| Runtime | Bun (scripty), Node.js (Next.js) |
| Jazyk | TypeScript (strict mode) |
| ORM | Prisma 7.5.0 s driver adapter (`@prisma/adapter-pg`) |
| Databáze | PostgreSQL (NeonDB) |
| Autentizace | NextAuth v5 (JWT strategie, Credentials provider) |
| UI komponenty | shadcn (Base UI) + Tailwind CSS 4 |
| Rich text editor | Tiptap 3 |
| Úložiště médií | Cloudflare R2 (S3-kompatibilní) |
| Notifikace | Sonner |
| Ikony | Lucide React |
| Deployment | Vercel |

## Architektura

```
czechskills-2026-web/
├── admin/          # CMS administrace (Next.js 16)
├── web/            # Frontendový web pro klienta (Next.js)
└── docs/           # Dokumentace projektu
```

### Multi-tenancy

CMS funguje jako multi-tenant řešení. Veškerá data (články, FAQ, média, přesměrování) jsou striktně izolována pomocí `tenantId`. Každý tenant má vlastní:

- Zabezpečený API endpoint s unikátním API klíčem
- Správu obsahu (blog, FAQ, média)
- Specifické moduly (např. KellyCars má správu vozidel a rezervací)

### Datový model

```
User ──┬── UserTenant ──┬── Tenant
       │                │
       │                ├── Category ── BlogPost ── BlogPostFaq
       │                ├── Tag ──────── (M:N) ──── BlogPost
       │                ├── FaqCategory ── FaqItem
       │                ├── Media
       │                ├── Redirect
       │                ├── KellyCarsVehicle ── KellyCarsReservation
       │                └── ...
       │
       └── BlogPost (author)
```

**Klíčové modely:**

- **User / Tenant / UserTenant** — Autentizace a multi-tenancy s M:N vazbou
- **BlogPost** — Články se statusy DRAFT/PUBLISHED/ARCHIVED, SEO metadata, cover image, voice-over, inline FAQ
- **Category / Tag** — Kategorizace a štítkování článků (unique per tenant + slug)
- **FaqCategory / FaqItem** — Samostatný FAQ systém s kategoriemi, řazením a publish flagy
- **Media** — Centrální správa médií (R2 úložiště) s povinným alt textem
- **Redirect** — Zero 404 policy — automatické 301/302 přesměrování při změně/smazání obsahu
- **KellyCarsVehicle / KellyCarsReservation** — Ukázkový tenant-specifický modul (autopůjčovna)

### Zero 404 Policy

Systém automaticky vytváří přesměrování:
- **Změna slug článku** → 301 (PERMANENT) z původního URL na nový
- **Smazání článku** → 301 přesměrování na `/blog`
- **Skrytí článku** (unpublish) → Článek vrácen do stavu DRAFT

Frontend konzumuje endpoint `/api/v1/{tenant}/redirects` a implementuje přesměrování na své straně.

## Spuštění projektu lokálně

### Prerekvizity

- [Bun](https://bun.sh/) (>= 1.3)
- PostgreSQL databáze (doporučujeme [NeonDB](https://neon.tech/) — free tier)
- Cloudflare R2 bucket pro média (volitelné pro základní fungování)

### 1. Klonování repozitáře

```bash
git clone https://github.com/mladejovskyy/czechskills-2026-web.git
cd czechskills-2026-web/admin
```

### 2. Instalace závislostí

```bash
bun install
```

### 3. Nastavení environment proměnných

Vytvořte soubor `.env` v adresáři `admin/`:

```env
# Databáze (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=verify-full"

# NextAuth
AUTH_SECRET="vygenerujte-nahodny-retezec"

# Cloudflare R2 (pro nahrávání médií)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="czechskills"
R2_PUBLIC_URL="https://your-r2-public-url.r2.dev"
```

`AUTH_SECRET` vygenerujete příkazem:
```bash
openssl rand -base64 32
```

### 4. Inicializace databáze

```bash
# Vygenerování Prisma klienta
bunx prisma generate

# Aplikování schématu na databázi
bunx prisma db push

# Seed — vytvoření tenanta a uživatele
bun run scripts/seed-tenants.ts
bun run scripts/seed-users.ts
```

Výchozí přihlašovací údaje:
- **Uživatel:** `mladejovsky`
- **Heslo:** `adminpass`

### 5. Spuštění dev serveru

```bash
bun run dev
```

Administrace běží na [http://localhost:3000](http://localhost:3000).

## Struktura administrace

```
src/
├── actions/              # Server actions (mutace dat)
│   ├── blog-posts.ts     # CRUD blog článků, publish/unpublish
│   ├── categories.ts     # CRUD kategorií článků
│   ├── tags.ts           # CRUD štítků + findOrCreateTag
│   ├── faq.ts            # CRUD FAQ kategorií a položek
│   ├── upload.ts         # Upload/delete médií do R2
│   └── kellycars/        # Tenant-specifické akce
├── app/
│   ├── (auth)/           # Login, registrace (veřejné)
│   ├── api/
│   │   ├── auth/         # NextAuth handler
│   │   └── v1/           # Veřejné API (Bearer token)
│   └── kellycars/        # Tenant "KellyCars"
│       ├── blog/         # Správa článků
│       ├── faq/          # Správa FAQ
│       └── vozy/         # Správa vozidel
├── components/
│   ├── ui/               # shadcn primitiva (button, dialog, table...)
│   ├── blog/             # Sdílené blog komponenty
│   ├── Faq/              # Sdílené FAQ komponenty
│   └── Menu/             # Navigační sidebar
├── lib/
│   ├── auth.ts           # NextAuth konfigurace
│   ├── prisma.ts         # Prisma singleton s driver adapterem
│   ├── r2.ts             # Cloudflare R2 helpers
│   ├── api-auth.ts       # Validace API klíčů
│   └── utils.ts          # Utility (cn pro Tailwind)
└── types/
    └── next-auth.d.ts    # Rozšíření session typů
```

## API dokumentace

Kompletní API dokumentace je v souboru [`docs/api.md`](./api.md).

Všechny API endpointy jsou přístupné na:
```
/api/v1/{tenantSlug}/{resource}
```

Autentizace probíhá pomocí Bearer tokenu (API klíč tenanta):
```
Authorization: Bearer <apiKey>
```

### Dostupné endpointy

| Endpoint | Popis |
|----------|-------|
| `GET /api/v1/{tenant}/blog` | Seznam publikovaných článků (stránkování, filtrování) |
| `GET /api/v1/{tenant}/blog/{slug}` | Detail článku |
| `GET /api/v1/{tenant}/categories` | Seznam kategorií |
| `GET /api/v1/{tenant}/tags` | Seznam štítků |
| `GET /api/v1/{tenant}/faq` | FAQ kategorie s položkami |
| `GET /api/v1/{tenant}/faq/{slug}` | Detail FAQ kategorie |
| `GET /api/v1/{tenant}/vehicles` | Seznam vozidel (KellyCars) |
| `GET /api/v1/{tenant}/vehicles/{slug}` | Detail vozidla |
| `GET /api/v1/{tenant}/redirects` | Seznam přesměrování |

## SEO/GEO 2026 strategie

### Strukturovaná data (Schema.org JSON-LD)

Frontend generuje validní strukturovaná data pro:
- `Article` / `BlogPosting` — pro každý článek s autorem, datem, obrázkem
- `FAQPage` — pro FAQ stránky i inline FAQ v článcích
- `BreadcrumbList` — hierarchická navigace pro každou stránku

### GEO optimalizace

- **LLM-friendly formátování** — obsah strukturován pomocí H2/H3 nadpisů, seznamů a FAQ sekcí, které AI modely snadno parsují
- **Voice-over podpora** — každý článek může mít hlasovou nahrávku pro lepší přístupnost
- **Povinné alt texty** — CMS vynucuje vyplnění alt textu u všech obrázků (kritické pro AI pochopení kontextu)
- **Entity-rich obsah** — FAQ přímo v těle článku zvyšuje hustotu entit pro generativní enginy

### Technické SEO

- **SSR rendering** — všechny stránky renderovány na serveru pro zaručenou indexovatelnost
- **Automatická sitemap** — generována při publikaci/aktualizaci obsahu
- **Zero 404 policy** — automatické 301/302 přesměrování při manipulaci s obsahem
- **IndexNow API** — okamžitá notifikace vyhledávačů při publikaci
- **Meta data** — každý článek, kategorie a FAQ položka má vlastní meta title a description
- **Next-gen formáty obrázků** — média servírována přes Cloudflare R2 s WebP/AVIF podporou
- **Interní prolinkování** — související články na základě sdílených kategorií/štítků

### URL struktura

```
/blog                              # Hlavní hub článků
/blog/{category-slug}              # Výpis článků v kategorii
/blog/{category-slug}/{post-slug}  # Detail článku
/faq                               # FAQ rozcestník
/faq/{category-slug}               # FAQ kategorie
/faq/{category-slug}/{item-slug}   # Detail FAQ odpovědi
```

## Build a deployment

```bash
# Produkční build
bun run build

# Spuštění produkce
bun run start
```

Projekt je nakonfigurován pro deployment na **Vercel**. Build příkaz automaticky generuje Prisma klienta před Next.js buildem.
