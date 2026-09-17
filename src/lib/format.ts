export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (sameDay) return "Today";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const TAG_COLORS = ["blue", "green", "amber", "violet"] as const;

export function tagClass(tag: string): string {
  const t = tag.toLowerCase();
  if (t.includes("block") || t.includes("qa") || t.includes("urgent")) return "amber";
  if (t.includes("done") || t.includes("build") || t.includes("ship")) return "green";
  if (t.includes("content") || t.includes("email")) return "violet";
  if (t.includes("design") || t.includes("priority")) return "blue";
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash + tag.charCodeAt(i)) % TAG_COLORS.length;
  return TAG_COLORS[hash];
}

export const COLUMN_COLORS = ["#9CA3AF", "#2563EB", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function columnColor(col: { color?: string; order: number }): string {
  return col.color || COLUMN_COLORS[col.order % COLUMN_COLORS.length];
}
