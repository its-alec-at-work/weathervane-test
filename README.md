# Weathervane Test Site

This is a test site for [Weathervane](https://github.com/its-alec-at-work/weathervane) — behavioral analytics without a vendor.

Weathervane watches what users actually do in your application and emits structured events directly in the browser. No backend, no dashboards, no network requests, no vendor lock-in. You forward the data anywhere—or nowhere.

Think of it as the analytics collection layer that modern web applications are missing. It captures behavioral signals (content exposure, engagement time, clicks, form intent, navigation patterns) and lets you route them to your own pipeline: a data warehouse, Segment, PostHog, GA4, or a custom API.

## What's in This Test Site

This site simulates a fictional "PhotoPrint 3D" e-commerce store to demonstrate Weathervane's tracking capabilities:

### Pages
- **Home** (`/`) — Hero section, features, featured products, testimonials, newsletter signup
- **Products** (`/products`) — Product listing with filter controls
- **Product Detail** (`/products/[slug]`) — Individual product pages
- **Contact** (`/contact`) — Contact form
- **Demo** (`/demo`) — Interactive testing page for advanced features

### Tracked Features

**Content Tracking**
- `data-vane-content` attributes on sections and cards
- Automatic visibility detection and exposure timing

**Click Tracking**
- `data-vane-content-click` on CTAs and navigation elements

**Form Tracking**
- `data-vane-form-*` attributes on newsletter signup, contact form, and chat

**Analytics Integration**
- Google Analytics 4 event bridge
- Cookie consent management with consent-aware tracking

**Advanced (Demo Page)**
- Web Vitals (FCP, LCP, CLS, FID)
- Error tracking (uncaught errors, promise rejections)
- Rage click detection
- Shadow DOM content tracking
- Dynamic content / DOM mutation detection
- Personalization segment testing

## Weathervane Configuration

The Weathervane config is set in `components/analytics/AnalyticsProvider.tsx`. Debug mode is enabled by default, so all tracked events are logged to the browser console.
