import { useMemo, useState } from "react";
import axios from "axios";
import { Activity, AlertTriangle, GitBranch, Gauge, Loader, MessageCircleWarning, Search, Star } from "lucide-react";
import AnalysisSections from "./components/AnalysisSections";
import ContextSections from "./components/ContextSections";
import NumberStat from "./components/NumberStat";
import { PAGE_BACKGROUND_CLASS, PANEL_CLASS } from "./config/ui";
import { formatStatValue } from "./utils/formatters";
import { normalizePayload } from "./utils/normalizePayload";
import { sentimentLabel } from "./utils/sentiment";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
const ANALYZE_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/analyze` : "/api/analyze";

export default function App() {
  const [repoInput, setRepoInput] = useState("facebook/react");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keeps label calculation in one obvious place for the UI.
  const sentiment = useMemo(() => {
    if (!data) return "N/A";
    return sentimentLabel(data.vibe.score);
  }, [data]);

  async function analyzeRepo(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: payload } = await axios.post(ANALYZE_ENDPOINT, { repo: repoInput });
      setData(normalizePayload(payload, repoInput));
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || "Request failed";
      setError(`Backend error${status ? ` (${status})` : ""}: ${message}. URL: ${ANALYZE_ENDPOINT}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={PAGE_BACKGROUND_CLASS}>
      <div className="mx-auto max-w-6xl">
        <section className={`${PANEL_CLASS} p-6 sm:p-8`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">AI Repo Health Radar</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Git-Pulse</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-700 sm:text-base">
                Read the project pulse from community sentiment, doc clarity, and active risk clusters.
              </p>
            </div>
          </div>

          <form onSubmit={analyzeRepo} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="owner/repo (e.g. vercel/next.js)"
                className="w-full rounded-lg border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none ring-slate-400 transition placeholder:text-slate-500 focus:ring-2"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
              {loading ? "Reading pulse..." : "Analyze Repo"}
            </button>
          </form>

          {error ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 text-xs text-rose-800">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          ) : null}
        </section>

        {!data ? (
          <section className={`${PANEL_CLASS} mt-6 p-6 text-sm text-slate-700`}>
            Submit a repo to generate its health report.
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberStat label="Stars" value={formatStatValue(data.stars)} icon={Star} />
              <NumberStat label="Forks" value={formatStatValue(data.forks)} icon={GitBranch} />
              <NumberStat label="Open Issues" value={formatStatValue(data.openIssues)} icon={MessageCircleWarning} />
              <NumberStat label="Analyzed Repo" value={data.repository} icon={Gauge} />
            </section>

            <AnalysisSections data={data} sentiment={sentiment} />
            <ContextSections data={data} />
          </>
        )}
      </div>
    </main>
  );
}
