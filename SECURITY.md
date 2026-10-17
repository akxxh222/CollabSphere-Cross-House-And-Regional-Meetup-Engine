# Security policy

Do not open public issues containing credentials, medical reasons, student records, provider logs, or database URLs. Report suspected vulnerabilities privately to the repository owner.

Before deployment:

- Generate independent high-entropy `NEXTAUTH_SECRET` and `CRON_SECRET` values.
- Rotate demo passwords and restrict database permissions.
- Keep providers in mock mode until recipients, consent, templates, and callbacks are ready.
- Define retention for reasons, phone numbers, notifications, and audits.
- Review advisories and deploy supported framework versions.
- Treat provider `SENT` as API acceptance until a signed callback confirms delivery.
