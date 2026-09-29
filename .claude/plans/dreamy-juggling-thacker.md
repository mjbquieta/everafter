# Hero Banner Upload — Local Storage with S3-Ready Abstraction

## Context
Users need to upload hero banner images in the website builder. No file upload infrastructure exists yet. We use local filesystem storage now (works in dev and on EC2 with a docker volume), behind an interface that can be swapped to S3 with a one-line provider change.

## How It Works
1. User picks an image in the website builder
2. Frontend `POST`s the file to `/api/v1/weddings/:weddingId/upload`
3. API saves to `./uploads/{weddingId}/{uuid}.ext`, returns the public URL
4. Frontend sets the URL as `heroBanner` in local state
5. User clicks "Save Changes" → existing PATCH endpoint persists the URL to DB
6. Hero section already renders `heroBanner` as `background-image` — no changes needed there

## Changes

### 1. Install multer types
```
pnpm add -D @types/multer --filter @everafter/api
```

### 2. Create storage abstraction
**New:** `apps/api/src/modules/upload/storage.interface.ts`
- `StorageService` interface with `upload(file, subPath) → string`, `delete(path)`, `getPublicUrl(path) → string`
- `STORAGE_SERVICE` injection token

### 3. Create local filesystem implementation
**New:** `apps/api/src/modules/upload/local-storage.service.ts`
- Reads `UPLOAD_DIR` (default `./uploads`) and `API_URL` (default `http://localhost:3001`) from config
- `upload()`: writes `file.buffer` to `{UPLOAD_DIR}/{subPath}/{uuid}{ext}`
- `getPublicUrl()`: returns `{API_URL}/uploads/{path}`
- To swap to S3 later: create `S3StorageService` with same interface, change provider in module

### 4. Create upload controller + module
**New:** `apps/api/src/modules/upload/upload.controller.ts`
- `POST /weddings/:weddingId/upload` with `FileInterceptor('file')` (memory storage)
- Guards: `JwtAuthGuard`, `WeddingTenantGuard`, `RolesGuard` (ADMIN, COUPLE, PLANNER) — same as website-settings controller
- Validates: max 5MB, image/jpeg|png|webp only
- Returns `{ url }` (wrapped as `{ data: { url } }` by ResponseInterceptor)

**New:** `apps/api/src/modules/upload/upload.module.ts`
- Provides `STORAGE_SERVICE` → `LocalStorageService`

### 5. Serve uploaded files + register module
**Modify:** `apps/api/src/main.ts`
- Change `NestFactory.create` to use `NestExpressApplication` type
- Add `app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })`
- This serves files at `/uploads/...` (not affected by `api/v1` global prefix)

**Modify:** `apps/api/src/app.module.ts`
- Add `UploadModule` to imports

### 6. Frontend upload component
**New:** `apps/web/features/website-builder/hero-upload.tsx`
- Props: `weddingId`, `value` (current URL or null), `onChange` (callback)
- Shows: dashed upload area when empty, image preview + remove button when set
- Uses raw `fetch` (not `apiFetch`) because multipart needs browser-set Content-Type
- Calls `getAccessToken()` from `@/lib/api-client` for auth header

### 7. Wire into website builder
**Modify:** `apps/web/features/website-builder/index.ts`
- Export `HeroUpload`

**Modify:** `apps/web/app/(dashboard)/dashboard/[weddingId]/website/page.tsx`
- Import `HeroUpload`
- Add `handleHeroBannerChange` callback (sets `heroBanner` in `localSettings`)
- Render `<HeroUpload>` in the left panel after `<ThemePresets>`

### 8. Gitignore
**Modify:** `.gitignore`
- Add `uploads/` entry

### 9. Environment variables
Add to `.env`:
```
UPLOAD_DIR=./uploads
API_URL=http://localhost:3001
```
Production on EC2: set `API_URL` to actual domain.

### 10. Docker (for future EC2 deployment)
When the API is containerized, add to `docker-compose.yml`:
```yaml
api:
  volumes:
    - ./uploads:/app/uploads
```
No changes needed now — uploads persist on local filesystem.

## Files Summary
| Action | File |
|--------|------|
| Create | `apps/api/src/modules/upload/storage.interface.ts` |
| Create | `apps/api/src/modules/upload/local-storage.service.ts` |
| Create | `apps/api/src/modules/upload/upload.controller.ts` |
| Create | `apps/api/src/modules/upload/upload.module.ts` |
| Modify | `apps/api/src/main.ts` |
| Modify | `apps/api/src/app.module.ts` |
| Create | `apps/web/features/website-builder/hero-upload.tsx` |
| Modify | `apps/web/features/website-builder/index.ts` |
| Modify | `apps/web/app/(dashboard)/dashboard/[weddingId]/website/page.tsx` |
| Modify | `.gitignore` |

## Verification
1. `pnpm add -D @types/multer --filter @everafter/api`
2. Start API (`pnpm dev`) — confirm no errors
3. Go to dashboard > website settings > see upload area
4. Upload a JPEG — confirm preview shows
5. Click Save — confirm heroBanner URL persisted
6. Visit public wedding page — confirm hero banner displays
7. Remove banner — confirm clears to null on save
