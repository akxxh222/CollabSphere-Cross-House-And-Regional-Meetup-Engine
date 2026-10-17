const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET || '';
console.log('NEXTAUTH_SECRET:', secret.length >= 32 && !/your-|change|secret-here/i.test(secret) ? 'length check passed (entropy cannot be verified)' : 'replace with a securely generated value of at least 32 characters');
db.$queryRaw`SELECT 1`.then(() => console.log('Database connection: OK')).catch((error) => {
  console.error('Database connection failed:', error.code || error.name);
  console.error(String(error.message).replace(/postgres(?:ql)?:\/\/[^\s"']+/g, '[database URL redacted]').replace(/`[^`]+`/g, '[redacted]'));
  process.exitCode = 1;
}).finally(() => db.$disconnect());
