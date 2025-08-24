# API

## Purpose
Details FE/BE API usage and format for City App Framework.

## FE APIs
- **useAuthContext**: Login/logout via HTTPS, returns user/error.
  - Example Call: `fetch('/api/login', { method: 'POST', body: JSON.stringify({ userId }) })`.
  - Response: `{ id: string, name: string }` (sanitized with utils/sanitize).

## BE APIs
- **/api/auth/login** (POST): Authenticate user.
  - Request: `{ userId: string }`.
  - Response: `{ id: string, name: string }` (200 OK) or error (401 Unauthorized).
  - Middleware: Validate, sanitize input.

- **/api/settings/update** (PUT): Update settings.
  - Request: `{ key: string, value: string }`.
  - Response: `{ success: boolean }`.

## Conventions
- HTTPS for all calls.
- Sanitize responses with `utils/sanitize/sanitizeApiResponse` in FE.
- Feature flagging for API variants (e.g., `NEW_FEATURE_A:T1`).
- Error Handling: Standard HTTP codes, log via useAnalytics (FE) or server logs (BE).

- **Future**: Add more APIs as needed.