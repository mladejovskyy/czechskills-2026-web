# Environment Variables

Required variables in `.env`:

## Database

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

## Auth

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | NextAuth.js secret for JWT signing |

## Cloudflare R2 (Image Storage)

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | S3-compatible access key |
| `R2_SECRET_ACCESS_KEY` | S3-compatible secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public URL base for serving images |

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (Turbopack) |
| `bun run build` | Generate Prisma client + Next.js production build |
| `bun start` | Start production server |
| `bunx prisma generate` | Regenerate Prisma client after schema changes |
| `bunx prisma db push` | Push schema to database |
| `bunx prisma studio` | Open Prisma database GUI |
