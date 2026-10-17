// Generate local secrets without ever writing them to stdout or version control.
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const target = path.join(process.cwd(), ".env.local");
let content = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
for (const key of ["NEXTAUTH_SECRET", "CRON_SECRET"]) {
  const pattern = new RegExp(`^${key}=(.*)$`, "m");
  const current = content.match(pattern)?.[1]?.replace(/["']/g, "").trim();
  if (current && current.length >= 32 && !/your-|change|secret-here/i.test(current)) continue;
  const line = `${key}="${crypto.randomBytes(48).toString("base64url")}"`;
  content = pattern.test(content)
    ? content.replace(pattern, line)
    : `${content.trimEnd()}\n${line}\n`;
  console.log(`${key}: secure local value generated`);
}
fs.writeFileSync(target, content, { mode: 0o600 });
