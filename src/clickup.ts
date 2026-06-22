import type { ClickUpTask, OnboardingForm } from "./types.js";
import { buildClickUpTasks } from "./checklist-template.js";

export type ClickUpClientOptions = {
  apiToken?: string;
  teamId?: string;
  dryRun?: boolean;
};

/**
 * Mock ClickUp client. Set CLICKUP_API_TOKEN to push real tasks later.
 */
export class ClickUpClient {
  constructor(private opts: ClickUpClientOptions = {}) {}

  async createOnboardingTasks(form: OnboardingForm): Promise<ClickUpTask[]> {
    const tasks = buildClickUpTasks(form);

    if (this.opts.dryRun || !this.opts.apiToken) {
      return tasks;
    }

    // Real API integration stub — wire when credentials are available.
    // POST https://api.clickup.com/api/v2/list/{list_id}/task
    for (const task of tasks) {
      await fetch(`https://api.clickup.com/api/v2/task`, {
        method: "POST",
        headers: {
          Authorization: this.opts.apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: task.name,
          description: task.description,
          tags: task.tags,
          status: task.status,
        }),
      });
    }

    return tasks;
  }
}
