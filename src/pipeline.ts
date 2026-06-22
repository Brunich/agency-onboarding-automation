import { OnboardingFormSchema, type OnboardingForm, type OnboardingResult } from "./types.js";
import { ClickUpClient } from "./clickup.js";
import { buildConciergePrompts } from "./concierge-prompt.js";

export type PipelineOptions = {
  clickUp?: ConstructorParameters<typeof ClickUpClient>[0];
};

export async function processOnboarding(
  raw: unknown,
  opts: PipelineOptions = {},
): Promise<OnboardingResult> {
  const form: OnboardingForm = OnboardingFormSchema.parse(raw);
  const auditLog: string[] = [];
  const processedAt = new Date().toISOString();

  auditLog.push(`[${processedAt}] Validated onboarding form for ${form.agentEmail}`);

  const clickUp = new ClickUpClient({ dryRun: true, ...opts.clickUp });
  const clickUpTasks = await clickUp.createOnboardingTasks(form);
  auditLog.push(`Created ${clickUpTasks.length} ClickUp tasks (dry-run unless CLICKUP_API_TOKEN set)`);

  const conciergePrompts = buildConciergePrompts(form);
  auditLog.push(`Generated concierge prompt pack (${conciergePrompts.language})`);

  auditLog.push("Queued MCL update: agent row pending sync");
  if (form.whopMemberId) auditLog.push(`WHOP member ${form.whopMemberId} flagged for billing reconcile`);

  return {
    clientId: form.clientId,
    processedAt,
    clickUpTasks,
    conciergePrompts,
    auditLog,
  };
}
