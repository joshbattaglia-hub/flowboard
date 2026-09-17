import { getStore } from "@netlify/blobs";

const STORE_NAME = "flowboard";
const STATE_KEY = "board-state";
const MESSAGE_PREFIX = "msgid:";

export function getFlowStore() {
  const siteID =
    process.env.BLOBS_SITE_ID ||
    process.env.NETLIFY_SITE_ID ||
    process.env.SITE_ID;
  const token = process.env.BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

  if (siteID && token) {
    return getStore({
      name: STORE_NAME,
      siteID,
      token,
      consistency: "strong",
    });
  }

  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function defaultState() {
  const now = new Date().toISOString();
  const projectId = "proj-personal";
  return {
    version: 1,
    updatedAt: now,
    projects: [{ id: projectId, name: "Personal", createdAt: now }],
    activeProjectId: projectId,
    columns: [
      { id: "col-backlog", projectId, name: "Backlog", order: 0, color: "#9CA3AF" },
      { id: "col-doing", projectId, name: "In progress", order: 1, color: "#2563EB" },
      { id: "col-review", projectId, name: "Review", order: 2, color: "#D97706" },
      { id: "col-done", projectId, name: "Done", order: 3, color: "#059669" },
    ],
    tasks: [],
  };
}

export async function loadState() {
  const store = getFlowStore();
  const data = await store.get(STATE_KEY, { type: "json" });
  if (!data) {
    const initial = defaultState();
    await store.setJSON(STATE_KEY, initial);
    return initial;
  }
  return data;
}

export async function saveState(state) {
  const store = getFlowStore();
  state.updatedAt = new Date().toISOString();
  await store.setJSON(STATE_KEY, state);
  return state;
}

export async function findTaskByMessageId(messageId) {
  if (!messageId) return null;
  const store = getFlowStore();
  const taskId = await store.get(`${MESSAGE_PREFIX}${messageId}`);
  if (!taskId) return null;
  const state = await loadState();
  return state.tasks.find((t) => t.id === taskId) || null;
}

export async function indexMessageId(messageId, taskId) {
  if (!messageId) return;
  const store = getFlowStore();
  await store.set(`${MESSAGE_PREFIX}${messageId}`, taskId);
}

export function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Flowboard-Token",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };
}

export function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: corsHeaders(origin),
    body: statusCode === 204 ? "" : JSON.stringify(body),
  };
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
