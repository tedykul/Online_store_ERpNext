# Plan B: NextAuth.js Migration Plan

> **Status**: Not yet started. Trigger conditions documented below.
> **Current state**: Skenario C (password gate + audit log + rate limit) — Sprint 6 complete.
> **Estimated effort**: 1.5 sprint (6-8 days) when triggered.

---

## 📋 When to Trigger This Migration

Upgrade to NextAuth.js when **ANY** of these conditions are met:

| # | Trigger Condition | Why |
|---|-------------------|-----|
| 1 | Karyawan admin > 15 orang | Password shared becomes unmanageable |
| 2 | Ada karyawan resign (turnover) | Perlu disable access individual, bukan ganti password semua |
| 3 | Compliance audit required (ISO 27001, SOC2, GDPR) | Butuh user-specific audit trail |
| 4 | Admin diakses dari internet umum (bukan WiFi kantor) | Password gate kurang aman untuk public access |
| 5 | Butuh roles berbeda (admin vs editor vs viewer) | Password gate tidak support permissions |
| 6 | Multiple stores/tenants | NextAuth support multi-tenant, password gate tidak |

**If none of these conditions are met, Skenario C is sufficient.**

---

## 🏗️ Migration Steps (6-8 days)

### Sprint A: Core Auth (3-4 days)

#### Day 1: Foundation
- [ ] Install `next-auth@4` + `@auth/prisma-adapter`
- [ ] Add Prisma models: `User`, `Account`, `Session`, `VerificationToken`
  ```prisma
  model User {
    id            String    @id @default(cuid())
    email         String    @unique
    name          String
    passwordHash  String    // bcrypt hash
    role          String    @default("editor") // "admin" | "editor" | "viewer"
    active        Boolean   @default(true)
    lastLoginAt   DateTime?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
  }
  // + Account, Session, VerificationToken (NextAuth standard)
  ```
- [ ] Create `lib/auth.ts`: NextAuth config with Credentials provider
  - bcrypt password verify
  - JWT session strategy (7-day expiry)
  - Callbacks: inject `role` + `active` to session
- [ ] Create `app/api/auth/[...nextauth]/route.ts`: NextAuth route handler
- [ ] Seed first admin user from env vars (`ADMIN_EMAIL` + `ADMIN_PASSWORD`)

#### Day 2: Login UI + User Management
- [ ] Replace `LoginGate` component: email + password form (replaces single password)
- [ ] Create `app/api/admin/users` CRUD routes (admin-only):
  - GET: list users
  - POST: create user (with initial password)
  - PUT: update user (role, active status)
  - DELETE: soft-delete user (keep audit trail)
- [ ] Add "👥 Users" tab in admin sidebar
- [ ] User management UI: list, create, disable/enable, delete

#### Day 3: Roles & Permissions
- [ ] Create `lib/permissions.ts`:
  ```typescript
  export const PERMISSIONS = {
    admin: ["*"],
    editor: ["faq:*", "testimonial:*", "content:hero", "content:promo"],
    viewer: [],
  };
  export async function checkPermission(userId: string, action: string): Promise<boolean>;
  ```
- [ ] Update `verifyAdmin()` → `verifyAuth()` that returns userId + role
- [ ] Apply permission checks to all admin API routes (per editor)
- [ ] Update audit log: add `userId` + `userEmail` fields to `AdminAuditLog`

#### Day 4: Password Reset + Email
- [ ] Choose email service: Resend.com (recommended, free tier 100 emails/day)
- [ ] Add `PasswordResetToken` Prisma model
- [ ] Create `app/api/auth/forgot-password` route: generate token, send email
- [ ] Create `app/api/auth/reset-password` route: verify token, update password
- [ ] Add "Lupa password?" link in login form
- [ ] Add reset password page (token verification + new password form)
- [ ] Configure DKIM/SPF records for domain

### Sprint B: Migration & Polish (3-4 days)

#### Day 5: Migrate Existing Auth
- [ ] Keep password gate as fallback (env var `ADMIN_FALLBACK_PASSWORD`)
- [ ] Update `admin-client.ts`: try NextAuth session first, fallback to password gate
- [ ] Migrate `AdminAuditLog`: add `userId` column (nullable for old entries)
- [ ] Update all admin API routes: use `verifyAuth()` instead of `verifyAdmin()`
- [ ] Test: existing sessionStorage token → NextAuth session migration

#### Day 6: Security Hardening
- [ ] Rate limit: keep existing, add per-user rate limit (not just per-IP)
- [ ] Session management: force re-login on password change
- [ ] Account lockout: 5 failed attempts → lock 30 min
- [ ] Password policy: min 8 chars, 1 uppercase, 1 number
- [ ] CSRF protection: verify Origin header

#### Day 7: Testing & Migration Script
- [ ] Create migration script: `scripts/migrate-to-nextauth.ts`
  - Create users from CSV (name, email, initial password)
  - Set roles based on CSV
- [ ] End-to-end test: login → edit content → audit log → logout
- [ ] Test: disabled user cannot login
- [ ] Test: password reset flow end-to-end
- [ ] Test: roles enforcement (editor cannot access users tab)

#### Day 8: Documentation & Cleanup
- [ ] Update this document with actual implementation notes
- [ ] Remove password gate fallback (after 1 week stable)
- [ ] Remove `ADMIN_PASSWORD` env var
- [ ] Update admin UI: remove password gate LoginGate
- [ ] Final test + commit

---

## 📦 Dependencies to Install

```bash
bun add next-auth@4 @auth/prisma-adapter bcryptjs
bun add -d @types/bcryptjs
```

## 📧 Email Service Options

| Service | Free Tier | Cost | Setup |
|---------|-----------|------|-------|
| **Resend.com** (recommended) | 100 emails/day | $20/mo for 50K | API key, no DKIM needed |
| SendGrid | 100 emails/day | $15/mo for 50K | API key + DKIM |
| AWS SES | 62K free (first year) | $0.10 per 1K | DKIM + SPF required |
| Self-hosted (Postfix) | Unlimited | Server cost | Complex setup |

**Recommendation**: Resend.com — easiest setup, generous free tier.

---

## 🔄 What Stays the Same (from Skenario C)

These components built in Sprint 6 are **reusable** in NextAuth migration:

- ✅ `AdminAuditLog` table — just add `userId` column
- ✅ `lib/audit.ts` — add `userId` parameter to `logAdminAction()`
- ✅ `lib/rate-limit.ts` — keep as-is, add per-user limit
- ✅ `AuditLogViewer` component — add user column
- ✅ All 8 admin API routes — just swap `verifyAdmin()` → `verifyAuth()`
- ✅ All 6 content editors — no changes needed
- ✅ AdminOverlay shell — just replace LoginGate

**This means ~60% of NextAuth work is already done by Skenario C.**

---

## ⚠️ Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Migration breaks admin access | Keep password gate fallback for 1 week |
| Email service downtime | Password reset has 1-hour token expiry, retry |
| User can't login after migration | Emergency admin bypass via env var |
| Data loss during migration | Backup DB before migration script |
| Roles misconfigured | Start with all users = admin, then restrict |

---

## 📊 Cost Comparison

| Item | Skenario C (Now) | Plan B (NextAuth) |
|------|------------------|-------------------|
| Email service | $0 | ~$20/month (Resend) |
| Development | 2 days (done) | 6-8 days |
| Maintenance | Minimal | Medium (user management) |
| Per-user cost | $0 | $0 (flat rate) |

---

## 🎯 Decision Framework

```
Is any trigger condition met?
├── NO → Stay on Skenario C (current state is sufficient)
└── YES → Start Plan B migration
    ├── Urgent (compliance deadline)? → Sprint A + B back-to-back (8 days)
    └── Not urgent? → Sprint A first (4 days), Sprint B later (4 days)
```

---

## 📝 Notes

- This document should be updated when migration starts (mark steps as done)
- Keep Skenario C running during migration (fallback)
- After migration stable for 1 week, remove password gate code
- Consider OAuth (Google Workspace) as Phase 2 after NextAuth — not required for initial migration
