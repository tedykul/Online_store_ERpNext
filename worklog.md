---
Task ID: grocery-store-001
Agent: main (Z.ai Code)
Task: Build grocery online store (sayuran & buah) with Next.js frontend + ERPNext integration

Work Log:
- Created types/grocery.ts — TypeScript interfaces matching ERPNext Item DocType
- Created lib/mock-data.ts — 23 mock products (Sayuran, Buah, Herbal, Paket) + 4 categories + formatIDR helper
- Created lib/erpnext.ts — ERPNext REST API client with 5s timeout, auto-fallback to mock when ERPNEXT_URL not set or unreachable. Implements: fetchProducts, fetchCategories, createSalesOrder, ensureCustomer
- Created lib/store/cart.ts — Zustand cart store with localStorage persistence, qty clamp to stock
- Created API routes: /api/products, /api/categories, /api/checkout (all force-dynamic)
- Updated globals.css theme to grocery green (oklch primary green) for light & dark mode
- Updated layout.tsx metadata (SayurBox), lang="id", SonnerToaster added
- Built components/grocery/header.tsx — sticky header with logo, search, cart button + badge
- Built components/grocery/hero.tsx — animated hero with floating emoji collage (Framer Motion)
- Built components/grocery/category-tabs.tsx — pill-style category filter
- Built components/grocery/product-card.tsx — card with emoji, badges (sale/organic), qty stepper
- Built components/grocery/product-grid.tsx — responsive grid (2-5 cols) + skeleton loader + source indicator (Live ERPNext vs Mock)
- Built components/grocery/cart-sheet.tsx — slide-in cart with free-shipping progress, qty edit, remove
- Built components/grocery/checkout-dialog.tsx — 3-step flow (form → loading → success) with delivery & payment method selection
- Built components/grocery/footer.tsx — 4-column footer with sticky behavior
- Built app/page.tsx — main page combining all components, client-side search + sort
- Created .env.local with ERPNEXT_URL=http://192.168.1.14:8001 (API key/secret empty → mock mode active)
- Verified with Agent Browser: page renders, 23 products load, add-to-cart opens sheet, checkout form validates & creates order, category filter works (8 buah products), search works ("tomat" → 1 result), no runtime errors, mobile responsive (390x844), footer sticky behavior correct

Stage Summary:
- Toko online grocery "SayurBox" lengkap & functional dengan 23 produk mock (siap connect ke ERPNext)
- Mode mock aktif otomatis karena ERPNext di 192.168.1.14:8001 tidak reachable dari sandbox
- API routes siap connect ke ERPNext — tinggal set ERPNEXT_API_KEY & ERPNEXT_API_SECRET di .env.local
- Checkout flow: form validation → POST /api/checkout → createSalesOrder → (mock) fake SO name / (erpnext) real Sales Order
- Semua interaktivitas ter-verify via Agent Browser (golden path: add cart → checkout → success)
- Lint clean, no runtime errors, responsive mobile & desktop

---
Task ID: sprint1-phase1-to-7
Agent: main (Z.ai Code)
Task: Sprint 1 - Add nav, dark mode, About/FAQ/Contact sections, fix dead links

Work Log:
- Phase 0: Audited existing modules (Header, Footer, Hero, page.tsx, Prisma schema, db.ts). Confirmed git repo exists, ERPNext still in mock mode.
- Phase 1: Added dark mode toggle. Created theme-provider.tsx (next-themes wrapper, class strategy, system default). Created theme-toggle.tsx (hydration-safe with skeleton placeholder). Wrapped app layout in ThemeProvider. Added toggle button in header between search and cart. Committed.
- Phase 2: Added responsive nav menu. Created main-nav.tsx with MainNav (desktop inline, hidden mobile) + MobileNav (hamburger button + Sheet drawer). 5 anchor items: Beranda, Belanja, Tentang, FAQ, Kontak. Smooth scroll via scrollIntoView + scroll-mt-24 offset. Mobile menu has cart + theme quick actions. Added id='beranda' to hero, id='belanja' to product section. Committed.
- Phase 3: Created about-section.tsx. Brand story (misi menghubungkan petani-konsumen), visual emoji collage, 4 statistik (5000+ pelanggan, 120+ petani, 15 kota, 4.9 rating), 4 nilai (Segar, Harga Adil, Organik, Antar 2 Jam). Framer Motion whileInView animations. Semantic h2>h3>h4 headings. Committed.
- Phase 4: Created faq-section.tsx. 8 FAQ items (cara pesan, pengiriman, min order, pembayaran, kesegaran, organik, refund, jadwal). shadcn Accordion single-collapsible. CTA card linking to #kontak. Bug fix: MessageSquareQuestion not in lucide-react, replaced with MessageCircleQuestion (found via dev.log). Committed.
- Phase 5: Added ContactMessage model to Prisma schema (with @@index on status & createdAt). Pushed to SQLite via bun run db:push. Created /api/contact POST route with zod validation (name/email/phone/subject/message). Returns 201+ticketId on success, 422+errors on invalid. Created contact-section.tsx with 4 info cards + 5-field form (idle->loading->success states, char counter, aria-invalid, role=alert). Verified via curl + Agent Browser. Committed.
- Phase 6: Rewrote footer.tsx — all dead # links replaced with anchor navigation (#beranda, #belanja, #tentang, #faq, #kontak). Social media links now preventDefault + cursor-not-allowed + title='segera hadir'. Added back-to-top button (ArrowUp). Added id='promo' to promo banner + scroll-mt-24. Hero 'Lihat Promo' button now scrolls to #promo (was dead link). Hero accepts optional onViewPromo prop (backward compatible). Committed.
- Phase 7: Fixed accessibility warnings (Radix DialogContent missing Description). Added sr-only SheetDescription to CartSheet, sr-only DialogDescription to CheckoutDialog (always present, not just form step). Final verification: all 4 API routes return 200/201 via curl, all 5 nav anchors scroll correctly, mobile hamburger + dark mode work, full golden path (add cart -> checkout -> success) runs with ZERO console errors/warnings, sticky footer verified on short content. Committed.

Stage Summary:
- 8 commits total (1 per phase + audit). All commits atomic and backward compatible.
- Sprint 1 scope complete: nav menu, dark mode toggle, 3 new sections (About, FAQ, Contact), all dead links fixed.
- Backward compatibility maintained: Header props unchanged (searchQuery, onSearchChange), Hero onShopNow unchanged (onViewPromo added as optional), all existing API routes untouched, Prisma schema only added (not modified) ContactMessage model.
- Code quality: ESLint clean (one justified eslint-disable for next-themes official pattern), zero console errors, zero console warnings.
- New API route: POST /api/contact with zod validation + Prisma persistence.
- New Prisma model: ContactMessage (id, name, email, phone, subject, message, status, timestamps).
- New components: theme-provider, theme-toggle, main-nav, about-section, faq-section, contact-section.
- Accessibility improvements: aria-labels on nav/cart/buttons, aria-expanded on hamburger, aria-invalid on form fields, role=alert on errors, sr-only descriptions on dialogs, semantic nav/section/headings.
- Verified via Agent Browser (desktop 1440x900 + mobile 390x844): all interactions work end-to-end.

---
Task ID: sprint2-phase1-to-5
Agent: main (Z.ai Code)
Task: Sprint 2 - Product detail modal, advanced filter, testimonials, trust badges

Work Log:
- Phase 0: Audited product-card.tsx, checkout-dialog.tsx, page.tsx, types/grocery.ts, mock-data.ts. Confirmed Product type already has organic/onSale/tags fields. Planned backward-compatible extensions.
- Phase 1: Product detail modal. Extended Product type with optional fields (rating, reviewCount, longDescription, benefits, storageTip, origin). Added enrichment layer in mock-data.ts (derive rating 4.2-4.9 + reviewCount 24-480 deterministically from itemCode hash; derive benefits/storageTip/origin from category & tags). Exported MOCK_PRODUCTS_ENRICHED (kept raw MOCK_PRODUCTS for backward compat). Updated erpnext.ts to return enriched products in mock fallback. Created ProductDetailDialog component: split-pane layout (visual + info), rating stars, price with discount, tags, long description, benefits list, info grid (asal/kategori/penyimpanan), trust badges, qty stepper, add-to-cart with toast. Wrapper uses keyed inner component to auto-reset qty on product change (no useEffect needed — clean React pattern). Updated ProductCard with optional onOpenDetail prop (backward compatible): card body & image clickable, action buttons stop propagation, card shows compact rating. Updated ProductGrid to forward onOpenDetail. Wired in page.tsx. Committed.
- Phase 2: Advanced filter. Created AdvancedFilter component with Popover trigger. Filter state: priceRange [min,max], organicOnly, onSaleOnly, tags[]. Price range uses shadcn Slider (dual thumb) with bounds derived from product list. Toggle chips for organic & on-sale (aria-pressed). Tag chips with AND logic. Active filter count badge on trigger. Reset button. Exported pure applyFilter() function. DEFAULT_FILTER constant. Wired in page.tsx: filter state + applyFilter in filteredProducts memo. Verified: organic filter 23->4, tag 'impor' 23->2, price max 101000 23->21, reset back to 23. Committed.
- Phase 3: Testimonials section. Created TestimonialsSection with id='testimoni' anchor. 4 platform stats (4.9/5 rating, 98% puas, 120+ petani, 15K+ pesanan/bulan). 6 testimonials with diverse personas from various cities. Each: emoji avatar, star rating (4.5-5), quote, name+role+location, 'Verified' badge. Trust strip at bottom with CTA to #belanja. Framer Motion scroll-reveal. Placed between About and FAQ. Committed.
- Phase 4: Trust badges. Created reusable TrustBadges component with 2 variants (compact: 4 icon badges + payment chips; grid: 2x2 with title+desc). 4 trust signals: Pembayaran Aman (SSL), Garansi Segar (refund 100%), Refund Mudah (24h), Antar Cepat (2 jam). 6 payment methods: COD, BCA, Mandiri, GoPay, OVO, DANA. Integrated into CheckoutDialog (compact, below submit button) and CartSheet (mini trust strip below Checkout button). Committed.
- Phase 5: Full verification. API test via curl: all 4 routes return 200/201 with correct data, contact validation returns 422 with 4 errors. Browser test via Agent Browser: all 6 sections render, advanced filter works (23->4 organic, 23->2 impor, 23->21 price max), product detail modal opens with full content, add to cart from modal works, checkout form fill + submit + success state, trust badges (4) confirmed in checkout, mobile responsive (390x844), dark mode toggle works. Zero console errors/warnings. Committed.

Stage Summary:
- 6 commits total (1 per phase + 1 chore for accidental screenshot removal + 1 docs).
- Sprint 2 scope complete: product detail modal, advanced filter, testimonials section, trust badges in checkout.
- Backward compatibility maintained: ProductCard props unchanged (onOpenDetail optional), ProductGrid props unchanged (onOpenDetail optional), AdvancedFilter optional, applyFilter pure function, Product type only added optional fields, ProductDetailDialog wrapper handles null product gracefully.
- Code quality: ESLint clean (used keyed component pattern instead of useEffect for qty reset), zero console errors, zero console warnings.
- New components: product-detail-dialog, advanced-filter, testimonials-section, trust-badges.
- New exports: MOCK_PRODUCTS_ENRICHED, DEFAULT_FILTER, applyFilter, FilterState type.
- API unchanged (no new routes needed — enrichment happens in mock-data layer).
- Accessibility: aria-label on clickable cards, aria-pressed on toggle chips, aria-label on sliders, sr-only DialogDescription, semantic headings.
- Verified via Agent Browser (desktop 1440x900 + mobile 390x844): all interactions work end-to-end including golden path (add cart -> checkout -> success) with all Sprint 2 features active.

---
Task ID: sprint3-phase1-to-5
Agent: main (Z.ai Code)
Task: Sprint 3 - Back-to-top, dismissible promo banner, checkout step indicator, ETA

Work Log:
- Phase 0: Audited page.tsx (promo banner inline, no back-to-top), checkout-dialog.tsx (3 steps but no visual indicator, no ETA), cart-sheet.tsx (no ETA), footer.tsx (has static ArrowUp but not floating). Planned 4 backward-compatible features.
- Phase 1: Back-to-top button. Created BackToTop component: floating fixed position bottom-right, appears after scroll >500px, smooth scroll on click. requestAnimationFrame + ticking flag for scroll perf (passive listener). Framer Motion enter/exit animations. h-11 w-11 (≥44px touch target). aria-label, focus-visible ring. Configurable props (threshold, bottom, right). Mounted in page.tsx floating UI section. Verified: hidden at top, visible after scroll, click → smooth scroll to top + auto-hide. Mobile 390x844 works. Committed.
- Phase 2: Dismissible promo banner. Created PromoBanner component: extract inline banner to reusable. Dismiss X button (top-right, aria-label='Tutup promo'). Persist dismiss in localStorage (key: promo-dismissed-{promoId}). Cross-tab sync via storage event listener. Framer Motion height+opacity animation on enter/exit. Lazy useState initializer reads localStorage (no useEffect setState — passes lint). Configurable: promoId (change to reset campaign), title, description, icon. Replace inline banner in page.tsx with <PromoBanner />. Verified: visible by default, dismiss hides, reload stays hidden (localStorage='1'). Committed.
- Phase 3: Checkout step indicator. Created CheckoutSteps component: 3 steps (Data Pengiriman, Memproses, Selesai). Visual states: current (primary fill + ring), completed (checkmark), future (muted). Animated connector lines (Framer Motion width transition). In loading state: step 2 shows Loader2 spinner. In success state: all 3 steps show checkmarks, all connectors 100% filled. aria-current='step' on active step. Pure presentational driven by 'current' prop. Integrated into CheckoutDialog above conditional rendering. Verified: step 1 active in form, all 3 checkmarks in success. Committed.
- Phase 4: Estimated delivery time. Created lib/delivery.ts with estimateDelivery() pure function: business hours 08-21 WIB (skip Sunday), same-day cutoff 19:00, delivery 2-hour window, pickup 30-min ready. Returns methodLabel, earliestDate, dateLabel (Hari ini/Besok/Senin 12 Mei), timeWindow (15:00-17:00 WIB), durationHours, sameDay, icon. Created DeliveryEstimateDisplay component: 2 variants (compact pill, card with icon). Integrated into CartSheet (card in footer summary), CheckoutDialog (card below delivery RadioGroup, real-time updates on method switch), SuccessView (shows ETA for confirmed method). Verified: cart ETA 'Estimasi Antar SAME DAY 11:00-13:00 WIB', pickup ETA '10:28-10:58 WIB', real-time switch works. Committed.
- Phase 5: Full verification. API regression: all 4 routes return 200/201 with correct data. Browser golden path: promo banner visible/dismissible/persists, back-to-top appears on scroll, cart shows ETA, checkout step indicator (step 1 active, 3 checkmarks in success), checkout ETA updates on method switch, success view shows ETA, zero console errors. Mobile 390x844 verified. Committed.

Stage Summary:
- 6 commits total (1 per phase + 1 docs).
- Sprint 3 scope complete: back-to-top, dismissible promo banner, checkout step indicator, specific estimated delivery time.
- Backward compatibility maintained: BackToTop optional (no existing components changed), PromoBanner replaces inline with same default content, CheckoutSteps added above existing content (no logic changes), DeliveryEstimateDisplay optional (no existing props changed), estimateDelivery pure function, no API contract changes.
- Code quality: ESLint clean (used lazy useState initializer for localStorage read — no useEffect setState needed), zero console errors, zero console warnings.
- New components: back-to-top, promo-banner, checkout-steps, delivery-estimate.
- New utility: lib/delivery.ts (estimateDelivery pure function, DeliveryEstimate interface).
- Accessibility: aria-label on back-to-top & dismiss button, aria-current='step' on active step, aria-label on step list, focus-visible ring on interactive elements.
- Verified via Agent Browser (desktop 1440x900 + mobile 390x844): all 4 Sprint 3 features work end-to-end in golden path.

---
Task ID: sprint4-phase1-to-5
Agent: main (Z.ai Code)
Task: Sprint 4 - Wishlist, recently viewed, newsletter signup, cookie consent

Work Log:
- Phase 0: Audited product-card.tsx (image button, hover hint), cart.ts (zustand persist pattern), footer.tsx (4-col grid), prisma/schema.prisma (ContactMessage model). Planned 4 backward-compatible features.
- Phase 1: Wishlist. Created lib/store/wishlist.ts (zustand + persist, cap 50 items). Created WishlistButton component (2 variants: overlay for cards, inline for detail; 3 sizes; spring animation; stopPropagation). Created WishlistSheet component (drawer with items list, move to cart, remove, clear). Integrated heart button into ProductCard (replaced Eye hover hint). Fixed nested-button bug: changed image area from <button> to <div role='button'> so heart <button> inside is valid HTML. Added heart icon + count badge in Header. Added wishlist quick action in MobileNav. Mounted WishlistSheet in page.tsx. Verified: 23 hearts render, click adds to wishlist, header count updates, drawer shows items, move to cart works. Committed.
- Phase 2: Recently viewed. Created lib/store/recently-viewed.ts (zustand + persist, cap 8 items, most recent first). Created useRecentlyViewed hook (wrapper around store). Created RecentlyViewedSection component (horizontal scroll mobile, 6-col grid desktop, clear button). Wired addRecentlyViewed in handleOpenDetail. Bug fix: initially used excludeIds prop to filter products in main grid — but ALL products are in grid by default, so recently viewed was always empty. Removed excludeIds. Bug fix: initially used local useState hook — 2 instances (page + section) had separate state. Converted to zustand store for single source of truth. Verified: section hidden initially, appears after opening details, most recent first, persists across reload, click reopens detail, clear works. Committed.
- Phase 3: Newsletter signup. Added NewsletterSubscriber model to Prisma (email unique, status, source, timestamps). Pushed schema + regenerated client. Created /api/newsletter POST route (zod validation, idempotent — re-subscribe returns 'already subscribed', reactivate unsubscribed users) + DELETE route (unsubscribe by email). Created NewsletterForm component (email input + Langganan button, idle→loading→success states, aria-invalid + role=alert, toast). Integrated into Footer as newsletter strip above main grid (2-col: heading + form). Bug fix: Prisma Client not regenerated after schema push — had to run bun run db:generate + restart dev server. Verified via curl: new/duplicate/invalid/unsubscribe/reactivate all work. Verified via Agent Browser: form renders, valid submit → success, invalid → error. Committed.
- Phase 4: Cookie consent. Created CookieConsent component: fixed bottom banner with Cookie icon, text, Accept/Decline buttons. Persists in localStorage (cookie-consent-v1). Framer Motion slide-up animation. Mounted in root layout. SSR-safe: starts hidden, reads localStorage via useEffect after mount (standard SSR pattern, block eslint-disable for set-state-in-effect). Bug fix: initially used lazy useState init — but SSR returns null and hydration doesn't re-read localStorage, so banner reappeared on reload. Fixed by using useEffect to sync state after mount. Verified: first visit shows banner, accept/decline hides + persists, reload stays hidden. Committed.
- Phase 5: Full verification. API test: all 5 routes return 200/201 with correct data. Browser golden path: cookie banner appears → accept, 23 wishlist hearts → click 2 → header count=2, open detail → recently viewed section appears, newsletter form in footer → subscribe → success. Zero console errors. Committed.

Stage Summary:
- 7 commits total (1 per phase + 1 chore for upload dir cleanup + 1 docs).
- Sprint 4 scope complete: wishlist, recently viewed, newsletter signup, cookie consent.
- Backward compatibility maintained: wishlist purely additive (no existing props changed), recently viewed purely additive, newsletter only added new Prisma model + API route, cookie consent mounted in layout (no existing changed).
- Code quality: ESLint clean (used block eslint-disable for cookie consent useEffect — legitimate SSR localStorage sync pattern), zero console errors, zero console warnings.
- New components: wishlist-button, wishlist-sheet, recently-viewed-section, newsletter-form, cookie-consent.
- New stores: lib/store/wishlist.ts, lib/store/recently-viewed.ts.
- New API: /api/newsletter (POST subscribe + DELETE unsubscribe).
- New Prisma model: NewsletterSubscriber (email unique, status, source).
- New hook: use-recently-viewed.ts (wrapper around zustand store).
- Accessibility: aria-label on heart buttons, aria-pressed state, role=dialog on cookie banner, aria-live=polite, role=alert on newsletter errors.
- Verified via Agent Browser (desktop 1440x900): all 4 Sprint 4 features work end-to-end in golden path.

---
Task ID: sprint5-phase0-to-9
Agent: main (Z.ai Code)
Task: Sprint 5 - Admin dashboard for content management (owner + non-technical staff)

Work Log:
- Phase 0: Added 4 Prisma models (SiteSetting singleton with 30+ optional fields, FAQ, Testimonial, CategorySetting). Pushed schema + regenerated client. Created scripts/seed-content.ts with upsert pattern (idempotent) — seeded SiteSetting + 8 FAQs + 6 testimonials + 4 categories with existing hardcoded values. Added 'db:seed' script. Committed.
- Phase 1: Added ADMIN_PASSWORD env var. Created lib/admin-auth.ts (verifyAdmin reads Bearer token, constant-time compare). Created lib/content.ts (DB fetchers with null fallback). Created 8 API routes: /api/admin/login (POST), /api/admin/content (GET+POST with auth), /api/admin/faqs (GET+POST) + [id] (PUT+DELETE), /api/admin/testimonials (GET+POST) + [id] (PUT+DELETE), /api/admin/categories (GET+POST) + [id] (PUT+DELETE). Bug fix: Next.js 16 dynamic route params are async Promise — applied `await params` to all [id] routes. Verified via curl: login, auth gate, CRUD all work. Committed.
- Phase 2-7: Created lib/admin-client.ts (sessionStorage token, loginAdmin, adminFetch wrapper). Created components/admin/admin-ui.tsx (reusable primitives: AdminSectionHeading, AdminField, SaveButton with loading/success states, DeleteButton with arm-then-confirm, AdminCard, AdminEmptyState, useAdminFetch hook). Created admin-overlay.tsx (full-screen overlay, password gate LoginGate, 8 sidebar tabs, top bar with Preview/Logout/Close, keyboard shortcut Ctrl+Shift+A). Created 6 editor sections: hero-promo-contact-editor (shared SiteSetting form), faq-editor (CRUD + reorder + publish toggle), testimonial-editor (CRUD + emoji/star picker), about-editor (story + 4 stats + 4 values), category-editor (CRUD + emoji/gradient picker), footer-editor (brand text + tagline). Bug fix: lucide-react doesn't export 'Footer' icon, replaced with 'PanelBottom'. Committed.
- Phase 8: Created lib/page-content.ts (server-side getPageContent fetcher — reads all content in parallel with fallback). Restructured routing: page.tsx → server component fetches content → renders HomeClient (client component) with content prop. Migrated 7 section components to accept optional content props with fallback to hardcoded defaults (Hero, PromoBanner, AboutSection, TestimonialsSection, FaqSection, ContactSection, Footer). Added admin button (Settings icon) in footer. Verified end-to-end: edit Hero CTA via API → reload → frontend reflects change; edit FAQ via API → reload → frontend reflects update. Committed.
- Phase 9: Full verification. API test: all admin routes work (login auth gate, content GET/POST, FAQ CRUD, testimonial CRUD, category CRUD). Browser golden path: page loads with DB content, all 6 sections render, footer admin button works, Ctrl+Shift+A opens overlay, Escape closes, all 8 tabs render editors with DB data, zero console errors. Committed.

Stage Summary:
- 4 commits total (Phase 0, Phase 1, Phase 2-7 combined, Phase 8, Phase 9 docs).
- Sprint 5 scope complete: admin dashboard for 8 content types (Hero, Promo, Contact, FAQ, Testimonials, About, Categories, Footer).
- Backward compatibility maintained: all section content props optional with fallback to hardcoded defaults — site works identically if DB empty. No existing API routes changed. New admin routes purely additive.
- Code quality: ESLint clean (used lazy useState init + block eslint-disable for cookie-consent pattern), zero console errors, zero console warnings.
- New components: admin-overlay, admin-ui, 6 editor sections (hero-promo-contact, faq, testimonial, about, category, footer).
- New stores/lib: lib/admin-auth.ts, lib/admin-client.ts, lib/content.ts, lib/page-content.ts.
- New API routes: /api/admin/login, /api/admin/content, /api/admin/faqs + [id], /api/admin/testimonials + [id], /api/admin/categories + [id] (8 routes total).
- New Prisma models: SiteSetting, FAQ, Testimonial, CategorySetting.
- New script: scripts/seed-content.ts + 'db:seed' command.
- Auth: password gate (ADMIN_PASSWORD env var), sessionStorage token, Bearer auth header, constant-time compare.
- Accessibility: password gate form with aria-invalid + role=alert, sidebar tabs with aria-current, dialog role + aria-modal + aria-label.
- Non-technical staff friendly: tab navigation, form fields with Indonesian labels, emoji/gradient/star pickers, SaveButton with visual feedback, DeleteButton with arm-then-confirm (prevent accidental delete), toast notifications for all actions.
- Keyboard shortcuts: Ctrl+Shift+A to open admin, Escape to close.
- Verified via Agent Browser: all 8 editors load with DB data, content changes reflect on frontend after reload.

---
Task ID: sprint6-phase0-to-5
Agent: main (Z.ai Code)
Task: Sprint 6 - Skenario C (audit log + rate limit) + Plan B documentation

Work Log:
- Phase 0: Audited existing admin API (8 routes, verifyAdmin pattern, no rate limit, no audit). Planned audit log integration + rate limit approach.
- Phase 1: Added AdminAuditLog Prisma model (id, action, target, ip, userAgent, success, detail, createdAt with indexes). Created lib/audit.ts with logAdminAction() helper (fire-and-forget, non-blocking), getClientIp() (X-Forwarded-For aware), getAuditLogs() with filtering. Integrated audit logging into all 8 admin API routes: login (login_success/failed/rate_limited), content POST (update with field names), faqs/testimonials/categories CRUD (create/update/delete/publish_toggle/reorder). All unauthorized attempts logged. Added /api/admin/audit GET route (requires auth, filterable). Verified via curl: 7 audit entries logged correctly with action/target/ip/timestamp.
- Phase 2: Created lib/rate-limit.ts: in-memory sliding window per IP. Two-tier: soft limit (5 attempts per 15 min → block 15 min), hard limit (20 attempts per 24h → block 24h). Cleanup old entries every 10 min. Applied to /api/admin/login: returns 429 with Retry-After header. Verified via curl: 5 wrong attempts → 401, 6th → 429, correct password after block → 429 (still blocked).
- Phase 3: Created AuditLogViewer component: lists admin actions with filtering (action type, success status, search), stats summary (total/success/failed), color-coded badges per action type, relative time with full time tooltip, IP address display. Bug fix: initially used useAdminFetch hook which extracted first non-success key (entries array only) but component expected full { entries, total } object → client crash. Fixed by using custom fetch with useState. Added 'Audit Log' tab to admin overlay sidebar (ScrollText icon, 9 tabs total). Verified: tab renders, 15 log entries, stats show total=15, zero errors.
- Phase 4: Created docs/PLAN_B_NEXTAUTH_MIGRATION.md: comprehensive migration plan from Skenario C to NextAuth.js. Documents: 6 trigger conditions, 8-day migration plan (2 sprints), dependencies, email service options, what stays same from Skenario C (~60% reusable), risks & mitigations, cost comparison, decision framework. Key insight: audit log + rate limit from Skenario C are reusable in NextAuth (just add userId column).
- Phase 5: Full verification. API test: login (correct/wrong/rate-limited), content update (triggers audit), FAQ create (triggers audit), audit log entries verified with correct action/target/success. Browser golden path: page loads, admin opens, login works, 9 tabs render, Audit Log tab shows 15 entries with stats, zero console errors. Committed.

Stage Summary:
- 4 commits total (Phase 1+2 combined, Phase 3, Phase 4, Phase 5 docs).
- Sprint 6 scope complete: Skenario C (audit log + rate limit) + Plan B documentation.
- Backward compatible: audit logging is additive (no existing API contract changed), rate limit only adds 429 for abuse, audit viewer is new tab (no existing editors changed).
- Code quality: ESLint clean, zero console errors, zero console warnings.
- New components: audit-log-viewer.
- New lib: lib/audit.ts (logAdminAction, getClientIp, getUserAgent, getAuditLogs), lib/rate-limit.ts (checkRateLimit, resetRateLimit).
- New API: /api/admin/audit GET (list logs with filtering).
- New Prisma model: AdminAuditLog (id, action, target, ip, userAgent, success, detail, createdAt).
- New docs: docs/PLAN_B_NEXTAUTH_MIGRATION.md (NextAuth migration plan with trigger conditions).
- Security improvements: brute force protection (5/15min, 20/24h), audit trail (IP + timestamp + action), unauthorized attempt logging.
- Plan B readiness: ~60% of NextAuth work already done by Skenario C (audit log + rate limit reusable, just add userId column). Migration can be triggered when: karyawan > 15, turnover, compliance, public access, roles needed, multi-tenant.
