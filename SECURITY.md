# SECURITY

## Purpose
Outlines front-end and back-end security practices for City App Framework.

## FE Security
- Input Sanitization: Use `utils/sanitize/sanitize.ts` (e.g., `sanitizeInput`) to prevent XSS, DOMPurify if needed.
- Secure State: Avoid localStorage, use HTTP-only cookies/Context in Store.
- CSP: Meta tags in `index.html` to restrict sources.
- Secure Event Handling: Validate events in components (e.g., Button).
- Dependencies: Minimal, audit with `npm audit`.

## BE Security
- API Sanitization: Sanitize inputs/responses with `utils/sanitize/`.
- Authentication: Secure endpoints with middleware in `server/routes/`.
- HTTPS: Enforce for all API calls.
- Error Handling: Avoid leaking sensitive info in responses.

## Utilities
- `utils/sanitize/`: `sanitizeInput`, `sanitizeApiResponse`.
- `utils/validation/`: `validateEmail`, `validateInputLength`.
- `utils/security/`: `setSecureCookie`, CSP helpers.

## Best Practices
- Audit dependencies regularly.
- Use feature flagging for secure rollouts.
- Document in `COMPLIANCE.md`.

- **Future**: Expand for advanced practices (e.g., CSRF).