# API dokumentace — CzechSkills 2026 CMS

Všechny API endpointy jsou přístupné na cestě `/api/v1/{tenantSlug}/`. Každý tenant má vlastní API klíč vygenerovaný při vytvoření.

## Autentizace

Všechny endpointy vyžadují Bearer token autentizaci:

```
Authorization: Bearer <apiKey>
```

API klíč je unikátní pro každého tenanta a je automaticky vygenerován při vytvoření tenanta (CUID). Klíč se validuje proti poli `Tenant.apiKey` v databázi.

**Chybové odpovědi autentizace:**

| Status | Popis |
|--------|-------|
| `401` | Chybějící nebo neplatný Authorization header |
| `401` | Neplatný API klíč |
| `401` | Tenant slug v URL neodpovídá API klíči |

---

## Blog

### Seznam článků

```
GET /api/v1/{tenantSlug}/blog
```

Vrací seznam publikovaných článků s podporou stránkování a filtrování.

**Query parametry:**

| Parametr | Typ | Výchozí | Popis |
|----------|-----|---------|-------|
| `category` | string | — | Filtrování podle slug kategorie |
| `tag` | string | — | Filtrování podle slug štítku |
| `page` | number | `1` | Číslo stránky (min: 1) |
| `limit` | number | `10` | Počet výsledků na stránku (max: 100) |

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "tenantId": "clx...",
      "title": "Název článku",
      "slug": "nazev-clanku",
      "excerpt": "Krátké shrnutí...",
      "content": "<p>HTML obsah článku...</p>",
      "status": "PUBLISHED",
      "voiceOverUrl": "https://...",
      "metaTitle": "SEO title",
      "metaDesc": "SEO description",
      "seoGeoScore": 85,
      "publishedAt": "2026-03-28T10:00:00.000Z",
      "createdAt": "2026-03-28T09:00:00.000Z",
      "updatedAt": "2026-03-28T10:00:00.000Z",
      "category": {
        "id": "clx...",
        "name": "Název kategorie",
        "slug": "nazev-kategorie"
      },
      "tags": [
        {
          "id": "clx...",
          "name": "Štítek",
          "slug": "stitek"
        }
      ],
      "author": {
        "id": "clx...",
        "name": "Autor",
        "username": "autor"
      },
      "coverImage": {
        "id": "clx...",
        "url": "https://r2.dev/...",
        "alt": "Popis obrázku"
      },
      "faqs": [
        {
          "id": "clx...",
          "question": "Otázka?",
          "answer": "Odpověď.",
          "sortOrder": 0
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

**Poznámky:**
- Vrací pouze články se statusem `PUBLISHED`
- Seřazeno podle `publishedAt` sestupně (nejnovější první)
- FAQ položky seřazeny podle `sortOrder` vzestupně

---

### Detail článku

```
GET /api/v1/{tenantSlug}/blog/{slug}
```

Vrací kompletní detail jednoho publikovaného článku.

**Odpověď `200 OK`:**

Stejná struktura jako položka v seznamu, rozšířená o plné detaily kategorie:

```json
{
  "data": {
    "...": "stejné jako v seznamu",
    "category": {
      "id": "clx...",
      "name": "Název kategorie",
      "slug": "nazev-kategorie",
      "description": "Popis kategorie",
      "metaTitle": "SEO title kategorie",
      "metaDesc": "SEO description kategorie"
    }
  }
}
```

**Chybové odpovědi:**

| Status | Popis |
|--------|-------|
| `404` | Článek nenalezen nebo není publikován |
| `500` | Interní chyba serveru |

---

## Kategorie

### Seznam kategorií

```
GET /api/v1/{tenantSlug}/categories
```

Vrací seznam všech kategorií článků pro daného tenanta.

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Název kategorie",
      "slug": "nazev-kategorie",
      "description": "Popis kategorie",
      "metaTitle": "SEO title",
      "metaDesc": "SEO description"
    }
  ]
}
```

**Poznámky:**
- Seřazeno podle `name` vzestupně (A–Z)

---

## Štítky (Tags)

### Seznam štítků

```
GET /api/v1/{tenantSlug}/tags
```

Vrací seznam všech štítků pro daného tenanta.

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Štítek",
      "slug": "stitek"
    }
  ]
}
```

**Poznámky:**
- Seřazeno podle `name` vzestupně (A–Z)

---

## FAQ

### Seznam FAQ kategorií

```
GET /api/v1/{tenantSlug}/faq
```

Vrací seznam všech FAQ kategorií včetně jejich publikovaných položek.

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Doprava a platba",
      "slug": "doprava-a-platba",
      "description": "Otázky ohledně dopravy a platebních metod",
      "metaTitle": "SEO title",
      "metaDesc": "SEO description",
      "sortOrder": 0,
      "items": [
        {
          "id": "clx...",
          "question": "Jaké jsou způsoby platby?",
          "slug": "jake-jsou-zpusoby-platby",
          "answer": "Přijímáme platby kartou...",
          "metaTitle": "SEO title",
          "metaDesc": "SEO description",
          "sortOrder": 0
        }
      ]
    }
  ]
}
```

**Poznámky:**
- Kategorie seřazeny podle `sortOrder` vzestupně
- Vrací pouze položky s `published: true`
- Položky seřazeny podle `sortOrder` vzestupně

---

### Detail FAQ kategorie

```
GET /api/v1/{tenantSlug}/faq/{slug}
```

Vrací detail jedné FAQ kategorie včetně jejích publikovaných položek.

**Odpověď `200 OK`:**

```json
{
  "data": {
    "id": "clx...",
    "name": "Doprava a platba",
    "slug": "doprava-a-platba",
    "description": "...",
    "metaTitle": "...",
    "metaDesc": "...",
    "sortOrder": 0,
    "items": [...]
  }
}
```

**Chybové odpovědi:**

| Status | Popis |
|--------|-------|
| `404` | FAQ kategorie nenalezena |
| `500` | Interní chyba serveru |

---

## Vozidla (KellyCars)

Endpointy specifické pro tenanta KellyCars (autopůjčovna).

### Seznam vozidel

```
GET /api/v1/{tenantSlug}/vehicles
```

Vrací seznam dostupných vozidel.

**Query parametry:**

| Parametr | Typ | Popis |
|----------|-----|-------|
| `category` | string | Filtrování podle kategorie vozidla (SUV, Sedan, Kombi...) |
| `transmission` | string | Filtrování podle převodovky (`MANUAL` nebo `AUTOMATIC`, case-insensitive) |

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "tenantId": "clx...",
      "brand": "Škoda",
      "model": "Octavia",
      "year": 2024,
      "slug": "skoda-octavia-2024",
      "category": "Kombi",
      "seats": 5,
      "fuelType": "Benzín",
      "transmission": "MANUAL",
      "pricePerDay": "1200.00",
      "description": "Prostorný vůz pro rodinu...",
      "available": true,
      "image": {
        "id": "clx...",
        "url": "https://r2.dev/...",
        "alt": "Škoda Octavia Kombi"
      }
    }
  ]
}
```

**Poznámky:**
- Vrací pouze vozidla s `available: true`
- Seřazeno podle `createdAt` sestupně

---

### Detail vozidla

```
GET /api/v1/{tenantSlug}/vehicles/{slug}
```

Vrací kompletní detail jednoho vozidla.

**Odpověď `200 OK`:**

```json
{
  "data": {
    "...": "stejná struktura jako v seznamu"
  }
}
```

**Chybové odpovědi:**

| Status | Popis |
|--------|-------|
| `404` | Vozidlo nenalezeno |
| `500` | Interní chyba serveru |

---

## Přesměrování (Redirects)

### Seznam přesměrování

```
GET /api/v1/{tenantSlug}/redirects
```

Vrací seznam všech aktivních přesměrování pro daného tenanta. Frontend by měl tento endpoint konzumovat a implementovat přesměrování na své straně.

**Odpověď `200 OK`:**

```json
{
  "data": [
    {
      "id": "clx...",
      "fromPath": "/blog/stary-clanek",
      "toPath": "/blog",
      "type": "PERMANENT"
    }
  ]
}
```

**Typy přesměrování:**

| Typ | HTTP status | Použití |
|-----|-------------|---------|
| `PERMANENT` | 301 | Smazaný obsah, změna slug |
| `TEMPORARY` | 302 | Dočasně skrytý obsah |

**Poznámky:**
- Seřazeno podle `createdAt` sestupně (nejnovější první)

---

## Společné chybové odpovědi

Všechny endpointy mohou vrátit:

| Status | Tělo odpovědi | Popis |
|--------|---------------|-------|
| `401` | `{ "error": "Missing authorization header" }` | Chybějící Authorization header |
| `401` | `{ "error": "Missing API key" }` | Chybějící Bearer token |
| `401` | `{ "error": "Invalid API key" }` | Neplatný token nebo neodpovídající tenant |
| `500` | `{ "error": "Failed to fetch {resource}" }` | Interní chyba serveru |

## Příklad použití (fetch)

```typescript
const API_BASE = "https://admin.example.com/api/v1/kellycars";
const API_KEY = "your-api-key";

// Získání článků s filtrováním
const res = await fetch(
  `${API_BASE}/blog?category=novinky&page=1&limit=5`,
  {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }
);

const { data, pagination } = await res.json();
```

```typescript
// Získání přesměrování pro middleware
const res = await fetch(`${API_BASE}/redirects`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});

const { data: redirects } = await res.json();

// Implementace v Next.js middleware
for (const r of redirects) {
  if (pathname === r.fromPath) {
    return NextResponse.redirect(
      new URL(r.toPath, request.url),
      r.type === "PERMANENT" ? 301 : 302
    );
  }
}
```
