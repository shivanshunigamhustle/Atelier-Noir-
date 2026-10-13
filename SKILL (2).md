---
description: Design, build, and refine a premium editorial fashion
  e-commerce website with polished responsive UI, reusable React
  components, and a design-first workflow. Use when creating or
  improving a clothing brand storefront, especially Atelier Noir.
name: premium-fashion-store
---

# Premium Fashion Store Skill

## Purpose

Create a premium fashion storefront with strong art direction and
high-quality UI/UX. Prioritise the visual experience before adding
commerce infrastructure. Use this skill when building or improving the
Atelier Noir clothing brand website.

## Operating principles

1.  **Inspect before editing.** Review repository structure, package
    configuration, routes, components, and assets. Preserve existing
    working functionality.
2.  **Design first.** Establish a visual system and build the homepage
    before secondary pages or backend features.
3.  **Be intentional.** Every section, interaction, image, and animation
    must support fashion discovery and brand identity.
4.  **Use real project context.** Prefer existing assets, dependencies,
    and conventions. Do not invent successful build/test results.
5.  **Finish the loop.** Implement, run available checks, inspect
    responsive states where possible, fix defects, and report remaining
    limitations.

## Brand direction

-   Working brand name: **Atelier Noir**.
-   Positioning: contemporary premium fashion with editorial,
    understated luxury.
-   Palette: warm ivory `#F7F4EE`, charcoal `#242420`, sand `#E8E0D4`,
    muted olive `#59624B`, soft gold `#B69A62`; sale red only where
    necessary.
-   Type: expressive serif display typography paired with a readable
    modern sans-serif.
-   Composition: generous whitespace, strong grid, refined dividers,
    carefully controlled contrast, and clear hierarchy.
-   Images: cohesive editorial fashion photography and clean product
    imagery with consistent aspect ratios and crops.
-   Avoid generic templates, excessive gradients, clutter, heavy
    shadows, gratuitous rounded cards, emoji product imagery, and
    unnecessary motion.

## Recommended workflow

### 1. Inspect and plan

-   Inspect the existing codebase and identify the framework, scripts,
    styling setup, routes, and available assets.
-   Summarise the plan briefly before major changes.
-   If the project is empty and no constraints conflict, use React +
    Vite + Tailwind CSS.
-   Do not replace project configuration without a clear reason.

### 2. Establish design tokens

Create reusable tokens for colours, typography, spacing, container
widths, borders, focus rings, transitions, and breakpoints. Avoid
scattered, inconsistent one-off values.

### 3. Build the homepage in this order

1.  Announcement bar.
2.  Main header with centered brand wordmark, search, account, wishlist,
    and bag/cart.
3.  Category navigation.
4.  Editorial hero with campaign photography, headline, supporting copy,
    and CTA.
5.  Four category tiles.
6.  Featured product collection.
7.  Campaign/story section.
8.  Newsletter signup.
9.  Footer with customer-care and policy links.

### 4. Build reusable components

Suggested components, adapted to the existing project as appropriate:

-   `AnnouncementBar`
-   `SiteHeader`
-   `CategoryNavigation`
-   `HeroCampaign`
-   `CategoryTile`
-   `ProductCard`
-   `ProductGrid`
-   `EditorialBanner`
-   `NewsletterForm`
-   `SiteFooter`
-   `MobileMenu`

Keep product information in a clear data module. Avoid creating
unnecessary abstractions for a small page.

### 5. Interactions

Implement meaningful states for:

-   Mobile navigation open/close.
-   Navigation and category links.
-   Search input and empty/no-results UI if search is implemented.
-   Wishlist toggles.
-   Quick-add or size selection where appropriate.
-   Cart count and basic demo cart behaviour where in scope.
-   Newsletter form validation and visible feedback.

Clearly identify mock functionality. Never claim payment, account,
inventory, order placement, or email delivery is real without backend
integration.

### 6. Responsive and accessible implementation

-   Support mobile, tablet, laptop, and desktop widths.
-   Prevent horizontal overflow.
-   Use semantic HTML and logical heading order.
-   Provide accessible names, alt text, keyboard operation, and visible
    focus styles.
-   Maintain readable contrast and comfortable touch targets.
-   Keep layouts usable when text wraps or images fail.

### 7. Performance and polish

-   Use appropriately sized images and modern formats when available.
-   Lazy-load below-the-fold imagery where appropriate.
-   Reserve image dimensions/aspect ratios to reduce layout shift.
-   Keep animation subtle and respect reduced-motion preferences.
-   Avoid unnecessary dependencies and oversized client-side bundles.

### 8. Verification

-   Run available development, build, lint, and type-check commands.
-   Fix implementation-related errors.
-   If browser inspection is available, review desktop and mobile.
-   Check the header, hero, grid, footer, overflow, image loading, focus
    states, and interactions.
-   Report exactly which checks were run and any checks that could not
    be performed.

## Definition of done for the first milestone

-   A cohesive premium homepage exists and runs in the project.
-   The announcement bar, header, hero, category tiles, product
    collection, story section, newsletter, and footer are implemented.
-   The visual system is consistent and responsive.
-   Reusable components and sample product data are organised sensibly.
-   Key UI interactions work or are explicitly labelled as demo-only.
-   No known implementation-caused build errors remain.
-   The final response summarises changed files, run commands, and
    remaining limitations.

## Scope guardrails

The first milestone is the homepage UI and reusable design system. Do
not build a full backend, database, authentication system, payment
integration, or order-management system unless explicitly requested.
After the homepage is reviewed and approved, extend the design system to
collection, product-detail, cart, and checkout pages.
