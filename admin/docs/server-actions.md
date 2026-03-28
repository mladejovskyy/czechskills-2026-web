# Server Actions

All backend logic lives in `src/actions/` as Next.js server actions (`"use server"`). No REST API routes are used for CRUD — everything goes through server actions called directly from client components.

## Blog Posts — `actions/blog-posts.ts`

| Action | Description |
|--------|-------------|
| `createBlogPost(data)` | Creates post with tags (connect) and FAQs (create) |
| `updateBlogPost(id, data)` | Updates post. **Auto-creates 301 redirect** if slug changes |
| `deleteBlogPost(id)` | Deletes post. **Auto-creates 301 redirect** from `/blog/{slug}` → `/blog` |
| `getBlogPost(id)` | Fetches single post with all relations |
| `getBlogPostsByTenant(tenantId, opts?)` | Lists posts, optionally filtered by status/category |
| `publishBlogPost(id)` | Sets status=PUBLISHED, sets publishedAt |
| `unpublishBlogPost(id)` | Sets status=DRAFT, clears publishedAt |

### Redirect Behavior

When a blog post slug changes during update, a `Redirect` record is upserted:
- `fromPath`: `/blog/{oldSlug}`
- `toPath`: `/blog/{newSlug}`
- `type`: PERMANENT (301)

When a blog post is deleted, a redirect is created from `/blog/{slug}` → `/blog`.

## Categories — `actions/categories.ts`

| Action | Description |
|--------|-------------|
| `getCategoriesByTenant(tenantId)` | List all categories |
| `getCategoryWithPostCount(tenantId)` | List with `_count.blogPosts` |
| `createCategory(data)` | Create category (name, slug) |
| `updateCategory(id, data)` | Update name/slug |
| `deleteCategory(id)` | Delete (will fail if posts reference it) |

## Tags — `actions/tags.ts`

| Action | Description |
|--------|-------------|
| `getTagsByTenant(tenantId)` | List all tags |
| `createTag(data)` | Create tag (name, slug) |
| `findOrCreateTag(tenantId, name)` | Finds by auto-generated slug, creates if missing |

Tags are created on-the-fly when saving a blog post. The `BlogPostForm` resolves tag names to IDs via `findOrCreateTag` before submitting.

## FAQ — `actions/faq.ts`

| Action | Description |
|--------|-------------|
| `getFaqCategoriesByTenant(tenantId)` | List categories with items |
| `getFaqCategory(id)` | Single category by ID |
| `getFaqCategoryBySlug(tenantId, slug)` | Single category by slug (used in route) |
| `createFaqCategory(data)` | Create category |
| `updateFaqCategory(id, data)` | Update category |
| `deleteFaqCategory(id)` | Delete category (cascades to items) |
| `createFaqItem(data)` | Create FAQ item |
| `updateFaqItem(id, data)` | Update FAQ item |
| `deleteFaqItem(id)` | Delete FAQ item |

## Vehicles — `actions/kellycars/vehicles.ts`

| Action | Description |
|--------|-------------|
| `createVehicle(data)` | Add vehicle |
| `updateVehicle(id, data)` | Update vehicle fields/availability |
| `deleteVehicle(id)` | Remove vehicle |
| `getVehicle(id)` | Single vehicle with image |
| `getVehiclesByTenant(tenantId)` | List all with images |

**Note:** `pricePerDay` is a Prisma Decimal. Pages must convert to `Number()` before passing to client components.

## Reservations — `actions/kellycars/reservations.ts`

| Action | Description |
|--------|-------------|
| `createReservation(data)` | Create booking |
| `updateReservation(id, data)` | Update booking |
| `deleteReservation(id)` | Delete booking |
| `getReservation(id)` | Single reservation with vehicle |
| `getReservationsByTenant(tenantId)` | List all |

No admin UI for reservations yet.

## Media Upload — `actions/upload.ts`

| Action | Description |
|--------|-------------|
| `uploadImage(formData)` | Uploads to R2, creates Media record |
| `updateMediaAlt(mediaId, alt)` | Updates alt text on existing media |
| `deleteImage(mediaId)` | Deletes from R2 and database |

Upload accepts FormData with: `file`, `tenantSlug`, `folder`, `alt`, `tenantId`. Files are stored at `{tenantSlug}/{folder}/{timestamp}-{random}.{ext}` in R2.
