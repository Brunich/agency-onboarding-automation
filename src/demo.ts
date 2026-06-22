import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { processOnboarding } from "./pipeline.js";

const here = dirname(fileURLToPath(import.meta.url));
const samplePath = join(here, "..", "sample-payload.json");
const payload = JSON.parse(readFileSync(samplePath, "utf8"));

const result = await processOnboarding(payload);

console.log("\n=== Agency Onboarding Automation Demo ===\n");
console.log("Client:", result.clientId);
console.log("Processed:", result.processedAt);
console.log("\n--- ClickUp tasks ---");
for (const t of result.clickUpTasks) {
  console.log(`• [${t.list}] ${t.name} (due +${t.dueDaysFromStart}d) → ${t.assignee}`);
}
console.log("\n--- Concierge prompts ---");
console.log("System:", result.conciergePrompts.welcomeSystem.slice(0, 120) + "...");
console.log("Welcome:", result.conciergePrompts.welcomeUser);
console.log("\n--- Audit log ---");
result.auditLog.forEach(line => console.log(line));
console.log("\nDone. Run `npm run dev` for webhook server.\n");
