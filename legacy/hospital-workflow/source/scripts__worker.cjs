const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
if (!process.env.CRON_SECRET) {
  console.error("Set CRON_SECRET in .env.local first.");
  process.exit(1);
}
let stopped = false;
process.on("SIGINT", () => {
  stopped = true;
});
async function tick() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/jobs/escalate`,
      {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
        signal: AbortSignal.timeout(55_000),
      },
    );
    console.log(
      new Date().toISOString(),
      response.ok ? await response.json() : `Job failed (${response.status})`,
    );
  } catch {
    console.error("Job endpoint unavailable; retrying next tick.");
  }
  if (!stopped) setTimeout(tick, 15_000);
}
console.log("CampusCare worker active; checking every 15 seconds. Ctrl+C to stop.");
tick();
