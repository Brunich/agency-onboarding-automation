# Agency Onboarding Automation

Automatiza el arranque de un cliente nuevo cuando llega un formulario de onboarding. Pensado para agencias de marketing inmobiliario que usan **ClickUp**, **GoHighLevel (GHL)**, **WHOP** y un bot concierge bilingüe.

**Autor:** Bruno Salas Rodriguez

---

## Qué hace

Cuando un agente envía el formulario, el pipeline:

1. **Valida** el JSON con Zod (email, plan, idioma, IDs opcionales).
2. **Genera 6 tareas en ClickUp** con fechas relativas (+0 a +3 días): MCL, GHL, WHOP, prompts de concierge, higiene de ClickUp y kickoff.
3. **Construye prompts bilingües** (ES / EN / mixto) para el bot de onboarding.
4. **Registra auditoría** para sincronizar la Master Client List (MCL) y marcar el `whopMemberId` para reconciliación de pagos.

```
Formulario (webhook)
       │
       ▼
  Validación Zod
       │
       ├──► ClickUp checklist (6 tareas)
       ├──► Prompts concierge (ES/EN)
       └──► Audit log → MCL + WHOP reconcile
```

---

## Inicio rápido

```bash
npm install
npm run demo          # simula un onboarding con sample-payload.json
npm run typecheck     # verifica TypeScript
```

### Servidor webhook (local)

```bash
npm run dev
```

En otra terminal:

```bash
curl -X POST http://localhost:8787/webhook/onboarding \
  -H "Content-Type: application/json" \
  -d @sample-payload.json
```

Health check: `GET http://localhost:8787/health`

---

## Payload del formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `clientId` | string | sí | ID interno del cliente (ej. `AGT-20481`) |
| `agentName` | string | sí | Nombre completo |
| `agentEmail` | string | sí | Email válido |
| `agentPhone` | string | sí | Teléfono (mín. 8 caracteres) |
| `market` | `"en"` \| `"es"` \| `"bilingual"` | no | Idioma preferido (default: `bilingual`) |
| `plan` | `"growth"` \| `"premium"` | no | Plan contratado (default: `growth`) |
| `ghlLocationId` | string | no | ID de sub-cuenta GHL |
| `whopMemberId` | string | no | ID de miembro WHOP para billing |
| `notes` | string | no | Notas del onboarding |
| `submittedAt` | ISO datetime | no | Fecha de envío |

Ejemplo completo en [`sample-payload.json`](./sample-payload.json).

---

## Respuesta del webhook

```json
{
  "ok": true,
  "result": {
    "clientId": "AGT-20481",
    "processedAt": "2026-06-21T...",
    "clickUpTasks": [ /* 6 tareas con list, assignee, tags */ ],
    "conciergePrompts": {
      "language": "bilingual",
      "welcomeSystem": "...",
      "welcomeUser": "...",
      "firstFollowUp": "..."
    },
    "auditLog": [ "..." ]
  }
}
```

Errores de validación devuelven `400` con `{ "ok": false, "error": "..." }`.

---

## Estructura del proyecto

```
src/
  types.ts              # Esquema Zod + tipos
  checklist-template.ts # Plantilla de 6 tareas ClickUp
  concierge-prompt.ts   # Prompts ES/EN según market
  clickup.ts            # Cliente ClickUp (dry-run o API real)
  pipeline.ts           # Orquestador principal
  demo.ts               # CLI de demostración
  server.ts             # HTTP webhook
```

---

## Variables de entorno

Copia `.env.example` a `.env` si quieres credenciales locales.

| Variable | Propósito |
|----------|-----------|
| `CLICKUP_API_TOKEN` | Si está definido, intenta crear tareas reales en ClickUp. Sin token = dry-run. |
| `PORT` | Puerto del webhook (default `8787`) |

---

## Integraciones reales (próximo paso)

El cliente ClickUp ya tiene el stub de `POST /api/v2/task`. Para producción haría falta:

- Mapear cada `list` a un `list_id` de ClickUp
- Webhook desde Typeform / GHL / form propio
- Escribir fila en MCL (Google Sheets API o Airtable)
- Encolar job de reconciliación WHOP (ver proyecto hermano `whop-mcl-reconcile`)

---

## Stack

TypeScript · Zod · Node HTTP · ClickUp API-ready

---

## Relacionado

Este proyecto encaja con **[whop-mcl-reconcile](../silva-whop-reconcile)** (carpeta local; paquete `whop-mcl-reconcile`): el onboarding marca `whopMemberId` en el audit log; el dashboard detecta si ese pago coincide con la MCL.
