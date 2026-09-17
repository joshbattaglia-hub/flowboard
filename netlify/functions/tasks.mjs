import { loadState, saveState, json, newId } from "./lib/store.mjs";

export async function handler(event) {
  const origin = event.headers.origin || event.headers.Origin || "*";

  if (event.httpMethod === "OPTIONS") {
    return json(204, {}, origin);
  }

  try {
    if (event.httpMethod === "GET") {
      const state = await loadState();
      const params = event.queryStringParameters || {};
      let tasks = state.tasks;
      if (params.projectId) {
        tasks = tasks.filter((t) => t.projectId === params.projectId);
      }
      return json(200, { tasks, updatedAt: state.updatedAt }, origin);
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      const state = await loadState();
      const projectId =
        payload.projectId || state.activeProjectId || state.projects[0]?.id;
      const columnId =
        payload.columnId ||
        state.columns.find((c) => c.projectId === projectId)?.id;
      const now = new Date().toISOString();
      const task = {
        id: newId("task"),
        projectId,
        columnId,
        title: payload.title || "Untitled",
        description: payload.description || "",
        assignee: payload.assignee || "",
        priority: payload.priority || "medium",
        dueDate: payload.dueDate || null,
        subtasks: payload.subtasks || [],
        tags: payload.tags || [],
        order:
          typeof payload.order === "number"
            ? payload.order
            : state.tasks.filter((t) => t.columnId === columnId).length,
        comments: [],
        attachments: [],
        emailMeta: null,
        createdAt: now,
        updatedAt: now,
      };
      state.tasks.push(task);
      await saveState(state);
      return json(201, { task }, origin);
    }

    if (event.httpMethod === "PATCH" || event.httpMethod === "PUT") {
      const payload = JSON.parse(event.body || "{}");
      const id = payload.id || event.queryStringParameters?.id;
      if (!id) return json(400, { error: "id required" }, origin);
      const state = await loadState();
      const idx = state.tasks.findIndex((t) => t.id === id);
      if (idx < 0) return json(404, { error: "Not found" }, origin);
      const { id: _omit, createdAt, ...rest } = payload;
      state.tasks[idx] = {
        ...state.tasks[idx],
        ...rest,
        id: state.tasks[idx].id,
        createdAt: state.tasks[idx].createdAt,
        updatedAt: new Date().toISOString(),
      };
      await saveState(state);
      return json(200, { task: state.tasks[idx] }, origin);
    }

    if (event.httpMethod === "DELETE") {
      const id =
        event.queryStringParameters?.id ||
        JSON.parse(event.body || "{}").id;
      if (!id) return json(400, { error: "id required" }, origin);
      const state = await loadState();
      state.tasks = state.tasks.filter((t) => t.id !== id);
      await saveState(state);
      return json(200, { ok: true }, origin);
    }

    return json(405, { error: "Method not allowed" }, origin);
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message || "Server error" }, origin);
  }
}
