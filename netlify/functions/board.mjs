import { loadState, saveState, json, newId, defaultState } from "./lib/store.mjs";

export async function handler(event) {
  const origin = event.headers.origin || event.headers.Origin || "*";

  if (event.httpMethod === "OPTIONS") {
    return json(204, {}, origin);
  }

  try {
    if (event.httpMethod === "GET") {
      const state = await loadState();
      return json(200, state, origin);
    }

    if (event.httpMethod === "PUT" || event.httpMethod === "PATCH") {
      const payload = JSON.parse(event.body || "{}");
      const current = await loadState();
      const next = {
        ...current,
        ...payload,
        version: current.version || 1,
        updatedAt: new Date().toISOString(),
      };
      next.projects = payload.projects ?? current.projects;
      next.columns = payload.columns ?? current.columns;
      next.tasks = payload.tasks ?? current.tasks;
      if (payload.activeProjectId) next.activeProjectId = payload.activeProjectId;
      await saveState(next);
      return json(200, next, origin);
    }

    if (event.httpMethod === "POST") {
      const action = JSON.parse(event.body || "{}").action;
      if (action === "reset") {
        const initial = defaultState();
        await saveState(initial);
        return json(200, initial, origin);
      }
      if (action === "add-column") {
        const { name, projectId } = JSON.parse(event.body || "{}");
        const state = await loadState();
        const pid = projectId || state.activeProjectId;
        const col = {
          id: newId("col"),
          projectId: pid,
          name: name || "New column",
          order: state.columns.filter((c) => c.projectId === pid).length,
        };
        state.columns.push(col);
        await saveState(state);
        return json(201, { column: col, state }, origin);
      }
      return json(400, { error: "Unknown action" }, origin);
    }

    return json(405, { error: "Method not allowed" }, origin);
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message || "Server error" }, origin);
  }
}
