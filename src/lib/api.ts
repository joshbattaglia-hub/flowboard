import type { BoardState, Task } from "../types";

const API = "/.netlify/functions";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchBoard(): Promise<BoardState> {
  return request<BoardState>("/board");
}

export async function saveBoard(state: BoardState): Promise<BoardState> {
  return request<BoardState>("/board", {
    method: "PUT",
    body: JSON.stringify(state),
  });
}

export async function createTask(
  partial: Partial<Task> & { title: string }
): Promise<Task> {
  const data = await request<{ task: Task }>("/tasks", {
    method: "POST",
    body: JSON.stringify(partial),
  });
  return data.task;
}

export async function updateTask(task: Task): Promise<Task> {
  const data = await request<{ task: Task }>("/tasks", {
    method: "PATCH",
    body: JSON.stringify(task),
  });
  return data.task;
}

export async function deleteTask(id: string): Promise<void> {
  await request(`/tasks?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

const LS_KEY = "flowboard-local-cache";

export function cacheLocal(state: BoardState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function readLocalCache(): BoardState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as BoardState) : null;
  } catch {
    return null;
  }
}
