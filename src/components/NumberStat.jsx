import { PANEL_CLASS } from "../config/ui";

// Small reusable stat card used in the top grid.
export default function NumberStat({ label, value, icon: Icon }) {
  return (
    <div className={`${PANEL_CLASS} p-4`}>
      <p className="text-xs uppercase tracking-widest text-slate-600">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-700" />
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
