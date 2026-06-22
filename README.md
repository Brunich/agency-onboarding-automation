# Client onboarding webhook

Turns a new-agent onboarding form into ClickUp tasks, bilingual concierge bot prompts, and an audit log row for ops.

Built with TypeScript and Zod. ClickUp calls are optional (dry-run without a token).

## Flow

```
POST /webhook/onboarding
  → Zod validation
  → 6 ClickUp tasks (MCL, GHL, WHOP, bot prompts, ClickUp cleanup, kickoff)
  → prompt pack (ES / EN / mixed)
  → audit log
```

## Quick start

```bash
npm install
npm run demo          # runs sample-payload.json through the pipeline
npm run typecheck
```

Local server:

```bash
npm run dev
```

```bash
curl -X POST http://localhost:8787/webhook/onboarding \
  -H "Content-Type: application/json" \
  -d @sample-payload.json
```

`GET /health` for a ping.

## Form fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `clientId` | string | yes | Internal id, e.g. `AGT-20481` |
| `agentName` | string | yes | Full name |
| `agentEmail` | string | yes | Valid email |
| `agentPhone` | string | yes | Min 8 chars |
| `market` | `en` \| `es` \| `bilingual` | no | Default `bilingual` |
| `plan` | `growth` \| `premium` | no | Default `growth` |
| `ghlLocationId` | string | no | GoHighLevel sub-account id |
| `whopMemberId` | string | no | WHOP member id for billing |
| `notes` | string | no | Free text from the form |
| `submittedAt` | ISO datetime | no | Submission time |

See [`sample-payload.json`](./sample-payload.json) for a full example.

## Response shape

```json
{
  "ok": true,
  "result": {
    "clientId": "AGT-20481",
    "processedAt": "2026-06-21T...",
    "clickUpTasks": [],
    "conciergePrompts": {
      "language": "bilingual",
      "welcomeSystem": "...",
      "welcomeUser": "...",
      "firstFollowUp": "..."
    },
    "auditLog": []
  }
}
```

Bad input → `400` with `{ "ok": false, "error": "..." }`.

## Layout

```
src/
  types.ts
  checklist-template.ts
  concierge-prompt.ts
  clickup.ts
  pipeline.ts
  demo.ts
  server.ts
```

## Env

Copy `.env.example` → `.env`.

| Variable | What it does |
|----------|----------------|
| `CLICKUP_API_TOKEN` | Real ClickUp task creation. Omit for dry-run. |
| `PORT` | Webhook port (default `8787`) |

## Still manual / TODO

- Map checklist `list` names to real ClickUp `list_id`s
- Hook up the form source (Typeform, GHL, custom)
- Push audit rows to MCL (Sheets or Airtable)

## Stack

TypeScript · Zod · Node HTTP

---

**Español:** Webhook de onboarding: valida el formulario, genera tareas de ClickUp, prompts bilingües para el bot y un log de auditoría. Sin token de ClickUp corre en modo simulación.
