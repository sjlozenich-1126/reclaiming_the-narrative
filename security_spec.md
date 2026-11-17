# Firestore Security Specification — Reclaiming the Narrative

## 1. Data Invariants
1. **Admin Authority**: Only verified admin accounts (`request.auth.token.email_verified == true` and matching bootstrapped admin email `jscthebrand@gmail.com` or an existing `/admins/{uid}` record) may create, update, or delete articles, tags, or admin records, or read newsletter subscriber PII.
2. **Public Publication Visibility**: Unauthenticated visitors may only `get` or `list` articles where `published == true`. Draft articles (`published == false`) are strictly restricted to admins.
3. **PII Isolation**: `/subscribers/{subscriberId}` accepts strictly validated `create` operations for newsletter sign-up, while `get`, `list`, `update`, and `delete` are strictly locked to admins.
4. **Temporal Integrity**: `createdAt` and `updatedAt` must equal `request.time` on creation, `createdAt` is immutable on update, and `updatedAt` must equal `request.time` on update.
5. **Identity Integrity**: `authorUid` on Article and `createdByUid` on Tag must match `request.auth.uid` on creation and remain immutable on update.
6. **Path & Size Boundaries**: All document IDs match `^[a-zA-Z0-9_\\-]+$` with max length 128; all strings and arrays (`tags.size() <= 10`) have strict length bounds.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Article Creation**: Anonymous client attempts `create` on `/articles/hacked-article` -> `PERMISSION_DENIED`.
2. **Non-Admin Verified User Article Creation**: Authenticated non-admin user attempts `create` on `/articles/spoof` -> `PERMISSION_DENIED`.
3. **Unverified Admin Email Spoof**: User with `email_verified: false` and spoofed email claim attempts `create` on `/articles/spoof` -> `PERMISSION_DENIED`.
4. **Draft Leakage via Direct Get**: Unauthenticated user attempts `get` on `/articles/unpublished-draft` (`published == false`) -> `PERMISSION_DENIED`.
5. **Draft Leakage via Blanket List**: Unauthenticated user queries `/articles` without `where('published', '==', true)` -> `PERMISSION_DENIED`.
6. **Shadow Field Injection on Article Update**: Client attempts `update` adding an undeclared `isPromoted: true` key -> `PERMISSION_DENIED`.
7. **Author UID Spoofing**: Admin attempts `create` on `/articles/test` with `authorUid: "other-uid"` -> `PERMISSION_DENIED`.
8. **Client-Spoofed Timestamp**: Client attempts `create` on `/articles/test` with backdated `createdAt` instead of `serverTimestamp()` -> `PERMISSION_DENIED`.
9. **Path ID Poisoning**: Client attempts `create` on `/articles/` with 500-char invalid ID containing slashes/spaces -> `PERMISSION_DENIED`.
10. **Unbounded Tag Array Poisoning**: Client submits `tags` array with 25 elements (`> 10`) -> `PERMISSION_DENIED`.
11. **Newsletter PII Scraping**: Unauthenticated or non-admin authenticated user attempts `list` or `get` on `/subscribers` -> `PERMISSION_DENIED`.
12. **Self-Privilege Escalation**: Non-admin authenticated user attempts `create` on `/admins/{uid}` -> `PERMISSION_DENIED`.
