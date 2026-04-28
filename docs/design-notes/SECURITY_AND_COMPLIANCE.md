# The City 2.0 — Security and Compliance

**Security and compliance are non-negotiable in The City 2.0.**

This document defines the security and compliance standards that the AI Council must enforce on every project — even when the Sponsor does not explicitly request them.

---

## Core Principle

**The system must protect user data, prevent harm, and meet legal obligations — even when doing so is inconvenient or slows delivery.**

Quality includes security. The Constitutional Principle "Quality is Non-Negotiable" applies directly here.

---

## Security Standards (Mandatory)

### 1. Secrets Management

- **Never commit secrets** to version control
- All secrets must be stored in environment variables or a secrets manager (e.g., Vercel Environment Variables, Doppler, AWS Secrets Manager)
- `.env.example` must list all required environment variables with descriptions (no actual values)
- The AI Council must scan for accidental secret commits before any push

### 2. Authentication & Authorization

- Prefer established, audited libraries (NextAuth.js, Clerk, Supabase Auth, Auth0, Firebase Auth)
- **Never build custom authentication from scratch** unless explicitly approved by Sponsor with security review
- Always validate permissions on the **server side** — never trust client-side checks alone
- Use short-lived access tokens + refresh tokens (not long-lived sessions)
- Implement proper session invalidation on logout and password change

### 3. Input Validation & Sanitization

- All user input must be validated and sanitized before processing
- Use schema validation libraries (Zod, Yup, Joi) for all API inputs
- Never use string concatenation for SQL queries — always use parameterized queries or an ORM
- Sanitize HTML output when rendering user-generated content (use DOMPurify or equivalent)

### 4. API Security

- All public API endpoints must have rate limiting
- CORS must be properly configured (never `*` in production)
- Implement proper error handling — do not leak stack traces or internal details in production responses
- Use HTTPS only (enforce in production via redirects or hosting config)

### 5. Content Security Policy (CSP)

- Implement a strict Content Security Policy on all pages
- Use nonces or hashes for inline scripts when necessary
- Regularly audit and tighten CSP rules

### 6. Dependency Security

- Run dependency vulnerability scans on every CI build (npm audit, Snyk, GitHub Dependabot)
- Critical and high-severity vulnerabilities must be addressed before deployment
- The AI Council must justify any decision to ignore a vulnerability

### 7. Data Protection

- Minimize data collection — only collect what is strictly necessary
- Implement data retention policies (automatically delete or anonymize old data)
- Provide users with data export and deletion capabilities (GDPR "Right to Access" and "Right to be Forgotten")
- Encrypt sensitive data at rest when required by compliance needs

---

## Compliance Requirements

### GDPR (General Data Protection Regulation)

If the project handles EU user data:

- Implement consent management for non-essential cookies/tracking
- Provide clear privacy policy and terms of service
- Enable data export and deletion APIs
- Document data processing activities
- Appoint a Data Protection Officer if required by scale

### CCPA / CPRA (California Consumer Privacy Act)

If the project handles California user data:

- Provide "Do Not Sell My Personal Information" opt-out
- Enable data access and deletion requests
- Maintain records of data processing

### WCAG 2.2 AA Accessibility

**All user-facing interfaces must meet WCAG 2.2 AA standards** (this is both a quality and compliance requirement).

See `CONVENTIONS.md` for detailed accessibility checklist.

### Industry-Specific Compliance

For projects in regulated industries (healthcare, finance, education, etc.):

- The Sponsor must explicitly declare compliance requirements at project kickoff
- The AI Council must escalate if it cannot meet declared requirements with available resources
- Additional security reviews and documentation are mandatory

---

## Security Review Process

### Pre-Deployment Security Checklist

Before any production deployment, the AI Council must verify:

- [ ] No secrets in code or git history
- [ ] All dependencies pass vulnerability scan (no critical/high issues)
- [ ] Authentication and authorization properly implemented and tested
- [ ] Input validation and sanitization in place for all user inputs
- [ ] Rate limiting on all public endpoints
- [ ] CSP implemented and tested
- [ ] HTTPS enforced in production
- [ ] Error handling does not leak sensitive information
- [ ] Data protection measures implemented (encryption, retention, export/deletion)
- [ ] Accessibility audit passed (WCAG 2.2 AA)

### Security Escalation Triggers

The AI Council **must escalate** to the Sponsor if:

- A security vulnerability cannot be fixed without significant scope or timeline impact
- Compliance requirements conflict with project constraints
- The project requires handling of highly sensitive data (medical, financial, biometric) without clear compliance path
- Third-party service (auth provider, payment processor, etc.) has known security issues

---

## Privacy by Design

The AI Council must follow these privacy principles on every project:

1. **Data Minimization** — Collect only what is necessary
2. **Purpose Limitation** — Use data only for the stated purpose
3. **Storage Limitation** — Delete or anonymize data when no longer needed
4. **Transparency** — Clearly communicate what data is collected and why
5. **User Control** — Give users control over their data (export, deletion, opt-out)
6. **Security** — Protect data with appropriate technical and organizational measures

---

## Incident Response

If a security incident is discovered (data breach, unauthorized access, vulnerability exploitation):

1. **Stop the affected system** immediately if user data is at risk
2. **Escalate to Sponsor** within 1 hour with:
   - What happened
   - What data was affected
   - Current containment status
   - Recommended next steps
3. **Document everything** in `.ai/INCIDENTS.md`
4. **Conduct a full post-mortem** within 7 days
5. **Update security practices** based on learnings

---

## Continuous Improvement

After every project, the AI Council must ask:

- Did we introduce any new security risks?
- Were there any compliance gaps we should address in future projects?
- Should any security or compliance rules be added to `CONVENTIONS.md` or this document?

Proposed improvements go through the standard Living Codex update process.

---

**Security and compliance are not optional features.** They are foundational requirements of The City 2.0 Operating System. The AI Council is responsible for enforcing them even when it is inconvenient.