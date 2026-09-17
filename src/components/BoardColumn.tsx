import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column, Task } from "../types";
import { columnColor } from "../lib/format";
import { TaskCard } from "./TaskCard";

interface Props {
  column: Column;
  tasks: Task[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

export function BoardColumn({
  column,
  tasks,
  selectedId,
  onOpen,
  onRename,
  onRemove,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  return (
    <section className="col">
      <div className="col-head">
        <div className="col-title">
          <span className="dot" style={{ background: columnColor(column) }} />
          <input
            value={column.name}
            aria-label="Column name"
            onChange={(e) => onRename(column.id, e.target.value)}
          />
          <span className="count">{tasks.length}</span>
        </div>
        <div className="col-actions">
          <button
            type="button"
            className="btn ghost"
            title="Remove column"
            onClick={() => onRemove(column.id)}
          >
            ✕
          </button>
        </div>
      </div>
      <div ref={setNodeRef} className={`stack${isOver ? " over" : ""}`}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              active={selectedId === t.id}
              onOpen={onOpen}
            />
          ))}
        </SortableContext>
        {!tasks.length ? <div className="empty">Drop tasks here</div> : null}
      </div>
    </section>
  );
}
