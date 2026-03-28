# Components

## UI Primitives — `components/ui/`

shadcn/ui based components. Standard usage, no custom modifications worth noting except:

### `image-upload.tsx`
Reusable image upload with R2 integration.

**Props:**
- `tenantId`, `tenantSlug`, `folder` — determines R2 path
- `label` — form label text
- `value` — current `{ id, url, alt }` or null
- `onChange` — callback with media object or null

**Behavior:**
- No image: shows alt text input + upload button
- Has image: shows preview with remove button + editable alt text below
- Alt text saved to database on blur via `updateMediaAlt`

### `rich-text-editor.tsx`
TipTap-based rich text editor.

**Props:**
- `content` — initial HTML string
- `onChange` — callback with HTML string

**Toolbar:** Bold, Italic, Underline, H2, H3, Bullet List, Ordered List, Blockquote, Code Block, Link, Horizontal Rule, Undo, Redo

## Blog — `components/blog/`

### `BlogPostForm.tsx`
Large form for creating/editing blog posts. Handles both modes via `initial` prop.

**Key sections:**
1. Cover image (ImageUpload)
2. Title (auto-generates slug), Slug, Category (select), Excerpt
3. Content (RichTextEditor)
4. Tags — free-form comma-separated input, chips with X to remove
5. Voice-over URL
6. SEO (meta title, meta description)
7. FAQ items (add/remove/edit inline)

**Tag handling:** On submit, tag names are resolved to IDs via `findOrCreateTag`. New tags are auto-created.

### `CreateCategoryDialog.tsx`
Category management dialog (despite the name, handles full CRUD).

**Features:**
- Lists all categories with post count
- Inline edit (pencil icon → name/slug inputs with confirm/cancel)
- Delete (trash icon, blocked if category has posts)
- Create new category form at bottom

### `BlogPostActions.tsx`
Dropdown menu (three-dot icon) for blog post rows.

**Actions:** Edit (navigates), Publish/Unpublish (toggles), Delete

## FAQ — `components/Faq/`

### `CreateCategoryDialog.tsx`
Simple dialog to create a new FAQ category (name, slug, description).

### `CreateItemDialog.tsx`
Dialog to create a new FAQ item (question, slug, answer).

### `FaqItemActions.tsx`
Dropdown menu for FAQ items.

**Actions:** Edit (dialog with question/slug/answer), Publish/Hide (toggles boolean), Delete

### `DeleteCategoryButton.tsx`
Trash icon button on FAQ category cards. Opens confirmation dialog showing category name and item count. Cascade deletes all items.

## Menu — `components/Menu/`

### `Menu.tsx`
Sidebar navigation component.

**Props:**
- `tenantSlug` — base path prefix
- `tenantName` — displayed in header
- `sections` — array of `{ title?, items: { label, href }[] }`

Active state determined by pathname matching. Links are prefixed with `/kellycars`.

## Vehicle Components — `app/kellycars/vozy/_components/`

Co-located with the vozy route (not in global components).

### `VehicleForm.tsx`
Create/edit form for vehicles. Image upload, brand/model/year, category/fuel/transmission selects, seats/price, description, availability checkbox (edit only).

### `VehicleTable.tsx`
HTML table of vehicles with edit/delete actions per row. Delete uses `confirm()`.

### `VehicleFilters.tsx`
Client component that reads/writes URL search params for filtering (search, category, fuel type, transmission, availability).
