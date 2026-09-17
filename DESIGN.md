# Flowboard Phase 1 — visual direction

Internal PM tool for Joshua. **Not** Liberty retail branding.

## Principles
- Modern, minimal, high clarity
- Dense but breathable — scan tasks fast
- One accent (blue) + quiet neutrals
- Board ↔ List toggle in header
- Task drawer for details + comments

## Tokens
- Font: Inter (or system UI) 400/500/600
- BG `#F4F5F7` · Surface `#FFFFFF` · Border `#E5E7EB`
- Text `#111827` · Muted `#6B7280`
- Accent `#2563EB` (primary buttons, selected card, In progress)
- Radius 8–12px · Light shadow on cards

## Components
1. **Header** — mark + product name, project switcher, Board/List toggle, Filter, + Task, avatar
2. **Board columns** — Backlog / In progress / Review / Done; count; + add
3. **Task card** — title, labels, assignee avatar, due
4. **Task drawer** — status, assignee, due, labels, description, comments + composer
5. **List view** — compact table: Task / Status / Assignee / Due

## Files
- `html/phase1-board.html` — board + open drawer
- `html/phase1-list.html` — list toggle state
- `concepts/*.png` — screenshots

Draft only — Bob builds.
