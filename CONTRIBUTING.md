# Contributing

Use Node.js 20+ and a feature branch. Never commit `.env.local`, credentials, real student data, or production exports.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`; run `node scripts/setup-secrets.cjs`.
3. Configure isolated PostgreSQL, then run `npm run db:migrate` and `npm run db:seed`.
4. Start `npm run dev` and `npm run worker` in separate terminals.

## Before a pull request

Run checks sequentially:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Schema changes require a migration. Do not use `db push` for shared databases. Keep role checks and record scopes in the service/query layer even when middleware protects the page.

Use focused commits such as `feat(student): add visit submission` so a new engineer can follow project history.
