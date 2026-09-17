import {
  loadState,
  saveState,
  findTaskByMessageId,
  indexMessageId,
  json,
  newId,
} from "./lib/store.mjs";

function getToken(event) {
  const auth = event.headers.authorization || event.headers.Authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return (
    event.headers["x-flowboard-token"] ||
    event.headers["X-Flowboard-Token"] ||
    ""
  );
}

export async function handler(event) {
  const origin = event.headers.origin || event.headers.Origin || "*";

  if (event.httpMethod === "OPTIONS") {
    return json(204, {}, origin);
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" }, origin);
  }

  const expected = process.env.FLOWBOARD_INTAKE_TOKEN;
  if (!expected) {
    return json(500, { error: "FLOWBOARD_INTAKE_TOKEN not configured" }, origin);
  }

  const provided = getToken(event);
  if (!provided || provided !== expected) {
    return json(401, { error: "Unauthorized" }, origin);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" }, origin);
  }

  const { subject, body: emailBody, from, receivedAt, messageId } = body;

  if (!subject && !emailBody) {
    return json(400, { error: "subject or body required" }, origin);
  }

  if (messageId) {
    const existing = await findTaskByMessageId(messageId);
    if (existing) {
      return json(200, { ok: true, idempotent: true, task: existing }, origin);
    }
  }

  const state = await loadState();
  const projectId = state.activeProjectId || state.projects[0]?.id;
  const backlog =
    state.columns
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => a.order - b.order)[0] || state.columns[0];

  const now = new Date().toISOString();
  const task = {
    id: newId("task"),
    projectId,
    columnId: backlog.id,
    title: (subject || "(no subject)").slice(0, 500),
    description: emailBody || "",
    assignee: from || "",
    priority: "medium",
    dueDate: null,
    subtasks: [],
    tags: ["source=email"],
    order: state.tasks.filter((t) => t.columnId === backlog.id).length,
    comments: [],
    attachments: [],
    emailMeta: {
      from: from || null,
      receivedAt: receivedAt || now,
      messageId: messageId || null,
    },
    createdAt: now,
    updatedAt: now,
  };

  state.tasks.push(task);
  await saveState(state);
  if (messageId) {
    await indexMessageId(messageId, task.id);
  }

  return json(201, { ok: true, created: true, task }, origin);
}
