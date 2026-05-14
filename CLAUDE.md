# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                        # Dev server (ng serve)
npm run build                    # Production build
npm run watch                    # Build with watch mode
npm test                         # Run unit tests (Vitest)
npm run serve:ssr:edutest        # Run SSR server (after build)
```

Single test: `npx vitest run --testPathPattern=<filename>`

Note: `--legacy-peer-deps` may be needed for installs due to Angular Material peer dependency conflicts.

## Architecture Overview

Angular 21 SSR education platform ("edutest") with four distinct user roles (Admin, Tutor, Student, Parent), each with its own layout shell and protected routes.

### Routing & Role-Based Access

[src/app/app.routes.ts](src/app/app.routes.ts) defines four role-gated layout groups:
- `/backoffice` — AdminLayout (18 child routes, ADMIN role)
- `/tutor` — TutorLayout (7 child routes, TUTOR role)
- `/student` — StudentLayout (9 child routes, STUDENT role)
- `/parent` — ParentLayout (5 child routes, PARENT role)

Route protection uses two guards in [src/app/core/guards/](src/app/core/guards/):
- `auth.guard.ts` — validates JWT expiry, redirects to `/signin`
- `role.guard.ts` — checks role from JWT payload against `data.roles`, redirects to role-specific dashboard

### Auth & HTTP

- [src/app/core/services/auth.service.ts](src/app/core/services/auth.service.ts) — JWT auth with `jwtDecode`, localStorage for token storage (SSR-guarded with `isPlatformBrowser`). Handles login, register, 2FA enable/verify, email verification, password reset.
- [src/app/core/interceptors/auth.interceptor.ts](src/app/core/interceptors/auth.interceptor.ts) — functional interceptor that injects `Authorization: Bearer <token>`. SSR-safe: skips if no token.
- Interceptor is registered in [src/app/app.config.ts](src/app/app.config.ts) via `withInterceptors([authInterceptor])`.

### Services

Two service directories exist:
- [src/app/core/services/](src/app/core/services/) — auth, user (core infrastructure)
- [src/app/services/](src/app/services/) — domain services (courses, enrollment, attendance, schedule, assessment, payment, certificate, report, planning, student, toast)

All HTTP services call the base API URL from [src/environments/environment.ts](src/environments/environment.ts):
- Dev: `http://localhost:8080`
- Prod: `__API_URL__` — replaced at Docker build time via `ARG API_URL`

### SSR Considerations

The app runs with Angular SSR. Platform-sensitive code (localStorage, window, document) must be guarded with `isPlatformBrowser(PLATFORM_ID)`. The server entry is [src/server.ts](src/server.ts) (Express, port 4000).

### Styling

Tailwind CSS 4.x + Angular Material 21. Global tokens and base styles are in [src/styles.css](src/styles.css).

### Key Libraries

| Library | Use |
|---|---|
| `jwt-decode` | Decode JWT payload for role/user info |
| `jspdf` | PDF generation (certificates, reports) |
| `plotly.js` | Charts in analytics/dashboard pages |
| `qrcode` | QR code generation |
| `gsap` | Animations |

## Deployment

Jenkins CI builds a Docker image (Node 20-Alpine, multi-stage), pushes to Docker Hub, then triggers Coolify deployment via webhook. The `API_URL` build arg must be set in Jenkins credentials (`API_URL`).
