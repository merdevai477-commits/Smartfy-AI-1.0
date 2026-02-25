# SmartfyAI Frontend (Next.js)

This is the SmartfyAI frontend built with **Next.js (App Router)** + **Tailwind** + **shadcn/ui** + **framer-motion** + **Clerk**.

## Local development

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

Create `frontend/.env.local` (see `frontend/.env.example`):

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Build

```bash
cd frontend
npm run build
npm run start
```

## Notes

- Protected routes are enforced by Clerk middleware (`frontend/middleware.ts`) for `/chat` and `/onboarding`.
