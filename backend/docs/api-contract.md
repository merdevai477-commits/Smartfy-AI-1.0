# SmartfyAI API Contract (current)

Base behavior in `backend/src/main.ts`:

- **Health**: `GET /health` (excluded from global prefix)
- **Versioned API**: `/{prefix}/{version}/...` where:
  - **prefix**: `/api`
  - **version**: `/v1` (URI versioning, defaultVersion = `1`)

## Users

- **Get current user profile**
  - `GET /api/v1/users/me`
  - Auth: **Clerk Bearer token**

- **Update current user profile**
  - `PATCH /api/v1/users/me`
  - Auth: **Clerk Bearer token**

## Conversations

- **Create conversation**
  - `POST /api/v1/conversations`
  - Body: `{ title?: string }`
  - Auth: **Clerk Bearer token**

- **List conversations**
  - `GET /api/v1/conversations`
  - Auth: **Clerk Bearer token**

- **Get conversation + messages**
  - `GET /api/v1/conversations/:id`
  - Auth: **Clerk Bearer token**

- **Stream assistant response (SSE)**
  - `POST /api/v1/conversations/:id/messages`
  - Auth: **Clerk Bearer token**
  - Response: `text/event-stream` streaming `data: {"text": "..."}\n\n` chunks and then `data: [DONE]\n\n`

