import { Flame } from "lucide-react";
import { PANEL_CLASS } from "../config/ui";
import { sentimentColor } from "../utils/sentiment";

// Primary analysis panels (vibe, clarity, current concerns).
export default function AnalysisSections({ data, sentiment }) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-12">
      <article className={`${PANEL_CLASS} p-6 lg:col-span-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Vibe Meter</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{sentiment}</span>
        </div>
        <div className="mt-5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full ${sentimentColor(data.vibe.score)} transition-all`} style={{ width: `${data.vibe.score}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-700">
            <span className="text-2xl font-bold text-slate-900">{data.vibe.score}</span>/100 sentiment confidence
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">{data.vibe.note}</p>
        </div>
      </article>

      <article className={`${PANEL_CLASS} p-6 lg:col-span-3`}>
        <h2 className="text-lg font-semibold text-slate-900">Complexity vs Clarity</h2>
        <div className="mt-4 flex items-end gap-2">
          <p className="text-4xl font-bold text-slate-900">{data.clarity.score}</p>
          <p className="pb-1 text-sm text-slate-600">/100</p>
        </div>
        <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-700">
          {data.clarity.verdict.replaceAll("-", " ")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">{data.clarity.note}</p>
      </article>

      <article className={`${PANEL_CLASS} p-6 lg:col-span-4`}>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Flame className="h-5 w-5 text-amber-600" />
          Current Fires
        </h2>
        <ul className="mt-4 space-y-3">
          {(data.fires.length ? data.fires : ["No active fires were returned."]).map((fire) => (
            <li key={fire} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {fire}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
