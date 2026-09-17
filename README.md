# Flowboard

Phase 1 MVP — Kanban project/task board for Joshua Battaglia.

**Preview only** — no custom domain / production go-live.

## Stack

- Vite + React + TypeScript
- `@dnd-kit` drag-and-drop
- Netlify Functions + Netlify Blobs persistence
- Pixel design system (Inter, blue accent, quiet neutrals)

## Features

- Default project **Personal** with columns Backlog / In progress / Review / Done (editable)
- Tasks: title, description, assignee, priority, due date, subtasks, labels
- Drag cards between columns; Board ↔ List toggle
- Task drawer: threaded comments + URL / local file attachments
- Email intake API (authenticated) creates tasks tagged `source=email`

## Local development

```bash
npm install
cp .env.example .env   # set FLOWBOARD_INTAKE_TOKEN
netlify dev            # Vite + functions + Blobs sandbox
```

Without Netlify, `npm run dev` serves the UI with a localStorage fallback (banner shown).

## Environment

| Variable | Purpose |
|----------|---------|
| `FLOWBOARD_INTAKE_TOKEN` | Shared secret for `POST` email intake. Send as `Authorization: Bearer <token>` or `X-Flowboard-Token`. |

See `.env.example`. Set the real value with `netlify env:set FLOWBOARD_INTAKE_TOKEN …` (do not commit secrets).

## Dispatch — email intake

```
POST /.netlify/functions/email-intake
# also: POST /api/email-intake (redirect)
```

Headers:

- `Authorization: Bearer <FLOWBOARD_INTAKE_TOKEN>`
- `Content-Type: application/json`

Body:

```json
{
  "subject": "Task title",
  "body": "Description…",
  "from": "sender@example.com",
  "receivedAt": "2026-09-17T01:00:00Z",
  "messageId": "<unique-message-id>"
}
```

Responses: `201` created · `200` idempotent replay (same `messageId`) · `401` unauthorized · `400` bad body.

Example:

```bash
curl -sS -X POST "https://YOUR-SITE.netlify.app/.netlify/functions/email-intake" \
  -H "Authorization: Bearer $FLOWBOARD_INTAKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Hello from Dispatch","body":"Email body","from":"dispatch@example.com","receivedAt":"2026-09-17T01:00:00Z","messageId":"msg-001"}'
```

## Other APIs

- `GET/PUT /.netlify/functions/board` — full board state
- `GET/POST/PATCH/DELETE /.netlify/functions/tasks` — task CRUD

## Design

UI direction from Pixel — see `DESIGN.md` and `html/phase1-*.html`.
