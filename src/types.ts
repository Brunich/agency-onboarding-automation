import { z } from "zod";

export const OnboardingFormSchema = z.object({
  clientId: z.string().min(1),
  agentName: z.string().min(1),
  agentEmail: z.string().email(),
  agentPhone: z.string().min(8),
  market: z.enum(["en", "es", "bilingual"]).default("bilingual"),
  plan: z.enum(["growth", "premium"]).default("growth"),
  ghlLocationId: z.string().optional(),
  whopMemberId: z.string().optional(),
  notes: z.string().optional(),
  submittedAt: z.string().datetime().optional(),
});

export type OnboardingForm = z.infer<typeof OnboardingFormSchema>;

export type ClickUpTask = {
  id: string;
  name: string;
  list: string;
  status: "to do" | "in progress" | "complete";
  assignee: string;
  dueDaysFromStart: number;
  tags: string[];
  description: string;
};

export type ConciergePromptPack = {
  language: "en" | "es" | "bilingual";
  welcomeSystem: string;
  welcomeUser: string;
  firstFollowUp: string;
};

export type OnboardingResult = {
  clientId: string;
  processedAt: string;
  clickUpTasks: ClickUpTask[];
  conciergePrompts: ConciergePromptPack;
  auditLog: string[];
};
