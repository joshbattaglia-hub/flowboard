import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import { formatDue, initials, tagClass } from "../lib/format";

interface Props {
  task: Task;
  active: boolean;
  onOpen: (id: string) => void;
}

export function TaskCard({ task, active, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`card${active ? " active" : ""}${isDragging ? " dragging" : ""}`}
      onClick={() => onOpen(task.id)}
      {...attributes}
      {...listeners}
    >
      <h3>{task.title}</h3>
      <div className="meta">
        <div className="tags">
          {task.tags.slice(0, 3).map((t) => (
            <span key={t} className={`tag ${tagClass(t)}`}>
              {t.replace(/^source=/, "")}
            </span>
          ))}
        </div>
        <div className="foot">
          {task.assignee ? (
            <span className="avatar sm" title={task.assignee}>
              {initials(task.assignee)}
            </span>
          ) : null}
          {task.dueDate ? <span>{formatDue(task.dueDate)}</span> : null}
        </div>
      </div>
    </button>
  );
}
