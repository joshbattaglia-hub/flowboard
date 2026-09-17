import type { Column, Task } from "../types";
import { columnColor, formatDue, initials } from "../lib/format";

interface Props {
  tasks: Task[];
  columns: Column[];
  selectedId: string | null;
  onOpen: (id: string) => void;
}

export function ListView({ tasks, columns, selectedId, onOpen }: Props) {
  const colMap = Object.fromEntries(columns.map((c) => [c.id, c]));
  const sorted = [...tasks].sort((a, b) => {
    const ao = colMap[a.columnId]?.order ?? 0;
    const bo = colMap[b.columnId]?.order ?? 0;
    if (ao !== bo) return ao - bo;
    return a.order - b.order;
  });

  return (
    <div className="list-wrap">
      <table className="list-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const col = colMap[t.columnId];
            return (
              <tr
                key={t.id}
                className={selectedId === t.id ? "active" : ""}
                onClick={() => onOpen(t.id)}
              >
                <td>
                  <strong>{t.title}</strong>
                </td>
                <td>
                  <span className="status">
                    <span
                      className="dot"
                      style={{
                        background: col ? columnColor(col) : "#9CA3AF",
                        width: 7,
                        height: 7,
                      }}
                    />
                    {col?.name || "—"}
                  </span>
                </td>
                <td>
                  {t.assignee ? (
                    <span className="assignee-cell">
                      <span className="avatar sm">{initials(t.assignee)}</span>
                      {t.assignee.split(" ")[0]}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{t.dueDate ? formatDue(t.dueDate) : "—"}</td>
              </tr>
            );
          })}
          {!sorted.length ? (
            <tr>
              <td colSpan={4} className="empty">
                No tasks yet
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
