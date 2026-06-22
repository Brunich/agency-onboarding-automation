import type { ConciergePromptPack, OnboardingForm } from "./types.js";

export function buildConciergePrompts(form: OnboardingForm): ConciergePromptPack {
  const name = form.agentName.split(" ")[0];

  if (form.market === "es") {
    return {
      language: "es",
      welcomeSystem: `Eres el concierge bilingue de la agencia. Tono: profesional, calido, directo. Mercado: agentes de bienes raices latinos en EE.UU. No prometas resultados fuera de la garantia contratada sin aclarar condiciones.`,
      welcomeUser: `Hola ${name}, recibimos tu onboarding para el plan ${form.plan}. En las proximas 48 horas activaremos tu sub-cuenta GHL y confirmaremos tu membresia WHOP. ¿Prefieres que te escriba en espanol o ingles?`,
      firstFollowUp: `${name}, seguimiento rapido: ¿Ya recibiste acceso a tu pipeline en GoHighLevel? Si algo falla, responde aqui y lo escalamos al equipo.`,
    };
  }

  if (form.market === "en") {
    return {
      language: "en",
      welcomeSystem: `You are the agency's bilingual onboarding concierge. Tone: professional, warm, concise. Audience: Latino real estate agents in the US. Do not over-promise beyond the contracted guarantee without stating conditions.`,
      welcomeUser: `Hi ${name}, we received your onboarding for the ${form.plan} plan. Within 48 hours we'll activate your GHL sub-account and confirm your WHOP membership. Do you prefer English or Spanish for updates?`,
      firstFollowUp: `${name}, quick check-in: did you get access to your GoHighLevel pipeline? If anything is missing, reply here and we'll escalate to the team.`,
    };
  }

  return {
    language: "bilingual",
    welcomeSystem: `You are the agency's bilingual onboarding concierge (Spanish/English). Match the agent's language preference. Tone: professional, warm, direct. Audience: Latino real estate agents in the US.`,
    welcomeUser: `Hola ${name} / Hi ${name} — recibimos tu onboarding / we received your onboarding for plan ${form.plan}. En 48h activamos GHL y confirmamos WHOP. ¿Espanol o English?`,
    firstFollowUp: `Follow-up / Seguimiento: confirm GHL pipeline access and WHOP billing status. Escalate blockers to Ops within 4 business hours.`,
  };
}
