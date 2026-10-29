export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const emotionColors = {
  happy: { color: "#F59E0B", bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500" },
  sad: { color: "#3B82F6", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500" },
  fear: { color: "#CBD5E1", bg: "bg-slate-300/10", text: "text-slate-300", border: "border-slate-300" },
  anger: { color: "#EF4444", bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500" },
  neutral: { color: "#9CA3AF", bg: "bg-gray-400/10", text: "text-gray-400", border: "border-gray-400" }
};
