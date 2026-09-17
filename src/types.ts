export type Priority = "low" | "medium" | "high" | "urgent";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  parentId?: string | null;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface EmailMeta {
  from: string | null;
  receivedAt: string | null;
  messageId: string | null;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  dueDate: string | null;
  subtasks: Subtask[];
  tags: string[];
  order: number;
  comments: Comment[];
  attachments: Attachment[];
  emailMeta: EmailMeta | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface BoardState {
  version: number;
  updatedAt: string;
  projects: Project[];
  activeProjectId: string;
  columns: Column[];
  tasks: Task[];
}

export type ViewMode = "board" | "list";
