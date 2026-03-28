# Database Schema

PostgreSQL database managed with Prisma ORM. Schema file: `prisma/schema.prisma`.

## Models

### Auth & Multi-Tenancy

**User**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| username | String | Unique |
| name | String? | |
| password | String | bcryptjs hash |

**Tenant**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| slug | String | Unique, used in routes |
| name | String | |
| domain | String? | |
| apiKey | String? | For API auth |

**UserTenant** — junction table, unique on `(userId, tenantId)`

### Blog

**Category**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| name | String | |
| slug | String | Unique per tenant |
| description | String? | |
| metaTitle | String? | SEO |
| metaDesc | String? | SEO |

**Tag**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| name | String | |
| slug | String | Unique per tenant |

Tags have a M:N relation with BlogPost via implicit `_BlogPostTags` table.

**BlogPost**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| authorId | String | FK → User |
| categoryId | String | FK → Category |
| status | Enum | DRAFT / PUBLISHED / ARCHIVED |
| title | String | |
| slug | String | Unique per tenant |
| excerpt | String? | |
| content | String | HTML from TipTap |
| coverImageId | String? | FK → Media |
| voiceOverUrl | String? | |
| metaTitle | String? | SEO |
| metaDesc | String? | SEO |
| seoGeoScore | Int? | |
| publishedAt | DateTime? | Set on publish |

**BlogPostFaq** — embedded FAQ items within a blog post (question, answer, sortOrder). Cascade deletes with parent.

### FAQ

**FaqCategory**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| name | String | |
| slug | String | Unique per tenant |
| description | String? | |
| sortOrder | Int | Default 0 |
| metaTitle | String? | SEO |
| metaDesc | String? | SEO |

**FaqItem**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| faqCategoryId | String | FK → FaqCategory |
| question | String | |
| slug | String | Unique per tenant |
| answer | String | |
| sortOrder | Int | Default 0 |
| published | Boolean | Default true |

FaqItem cascade deletes when its FaqCategory is deleted.

### KellyCars Vehicles

**KellyCarsVehicle**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| brand | String | e.g. "BMW" |
| model | String | e.g. "X5" |
| year | Int | |
| slug | String | Unique per tenant |
| category | String | e.g. "SUV" |
| seats | Int | |
| fuelType | String | Benzin/Diesel/Elektro/Hybrid/LPG |
| transmission | Enum | MANUAL / AUTOMATIC |
| pricePerDay | Decimal | |
| description | String? | |
| imageId | String? | FK → Media |
| available | Boolean | Default true |

**KellyCarsReservation** — booking records with customer info, dates, status, totalPrice. Schema exists but no admin UI yet.

### Shared

**Media**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| url | String | R2 public URL |
| alt | String | Editable alt text |

**Redirect**
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| tenantId | String | FK → Tenant |
| fromPath | String | Unique per tenant |
| toPath | String | |
| type | Enum | PERMANENT (301) / TEMPORARY (302) |

## Cascade Deletes

- Tenant → all child records
- FaqCategory → FaqItems
- BlogPost → BlogPostFaqs
- Media deletion from BlogPost/Vehicle → sets FK to null (SetNull)

## Key Constraints

All slug fields are unique per tenant: `@@unique([tenantId, slug])`
