import type { ClickUpTask, OnboardingForm } from "./types.js";

const BASE_TASKS: Omit<ClickUpTask, "id">[] = [
  {
    name: "Verify onboarding form & MCL entry",
    list: "Admin & Data",
    status: "to do",
    assignee: "Ops",
    dueDaysFromStart: 0,
    tags: ["mcl", "onboarding"],
    description: "Create or update Master Client List row with agent name, email, phone, plan, and market.",
  },
  {
    name: "Provision GHL sub-account snapshot",
    list: "GHL Setup",
    status: "to do",
    assignee: "Automation",
    dueDaysFromStart: 1,
    tags: ["ghl", "snapshot"],
    description: "Deploy agency snapshot, connect pipelines, and confirm Spanish/English automations.",
  },
  {
    name: "WHOP billing link & membership check",
    list: "Billing",
    status: "to do",
    assignee: "Ops",
    dueDaysFromStart: 1,
    tags: ["whop", "billing"],
    description: "Confirm WHOP member ID, payment status, and reconcile against MCL billing column.",
  },
  {
    name: "Configure AI concierge onboarding prompts",
    list: "AI / Concierge",
    status: "to do",
    assignee: "AI Builder",
    dueDaysFromStart: 2,
    tags: ["concierge", "prompts", "bilingual"],
    description: "Load welcome + follow-up prompts for agent's market (ES/EN/bilingual).",
  },
  {
    name: "ClickUp recruiting pipeline hygiene",
    list: "ClickUp",
    status: "to do",
    assignee: "Ops",
    dueDaysFromStart: 2,
    tags: ["clickup"],
    description: "Add client folder, link meeting notes if applicable, set weekly check-in task.",
  },
  {
    name: "Kickoff call scheduled",
    list: "Client Success",
    status: "to do",
    assignee: "CS",
    dueDaysFromStart: 3,
    tags: ["kickoff"],
    description: "Book kickoff with agent; confirm guarantee expectations and ad spend access.",
  },
];

export function buildClickUpTasks(form: OnboardingForm): ClickUpTask[] {
  const prefix = form.clientId.slice(0, 8).toUpperCase();
  return BASE_TASKS.map((task, index) => ({
    ...task,
    id: `${prefix}-${index + 1}`,
    description: [
      task.description,
      "",
      `Agent: ${form.agentName}`,
      `Email: ${form.agentEmail}`,
      `Market: ${form.market}`,
      `Plan: ${form.plan}`,
      form.ghlLocationId ? `GHL Location: ${form.ghlLocationId}` : "",
      form.whopMemberId ? `WHOP Member: ${form.whopMemberId}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    tags: [...task.tags, form.market, form.plan],
  }));
}
