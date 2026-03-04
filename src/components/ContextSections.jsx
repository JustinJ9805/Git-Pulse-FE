import { PANEL_CLASS } from "../config/ui";
import { formatBoolean, formatMaybeNumber } from "../utils/formatters";
import { safeNumber } from "../utils/normalizePayload";

// Metadata and operational details shown below the main analysis panels.
export default function ContextSections({ data }) {
  return (
    <>
      <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-700">
        <p>
          Last analyzed: {data.analyzedAt ? new Date(data.analyzedAt).toLocaleString() : "N/A"} | README chars:{" "}
          {safeNumber(data.inputStats?.readmeChars).toLocaleString()} | Issue snippets:{" "}
          {safeNumber(data.inputStats?.issueSnippets).toLocaleString()}
        </p>
        <p className="mt-2">
          API: {data.apiVersion} | Model: {data.modelVersion} | Rules: {data.rulesVersion}
        </p>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className={`${PANEL_CLASS} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Health Signals</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
            <p>Days Since Release: {formatMaybeNumber(data.healthSignals.daysSinceLastRelease)}</p>
            <p>Commits (30d): {formatMaybeNumber(data.healthSignals.commitsLast30Days)}</p>
            <p>Bus Factor: {formatMaybeNumber(data.healthSignals.busFactorEstimate)}</p>
            <p>First Response (hrs): {formatMaybeNumber(data.healthSignals.medianIssueFirstResponseHours)}</p>
            <p>Issue Close (days): {formatMaybeNumber(data.healthSignals.medianIssueCloseDays)}</p>
            <p>Stale Issues: {formatMaybeNumber(data.healthSignals.staleIssueCount)}</p>
            <p>Critical Bugs: {formatMaybeNumber(data.healthSignals.openCriticalBugCount)}</p>
          </div>
        </article>

        <article className={`${PANEL_CLASS} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Security & Compliance</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>License: {data.securityCompliance.licenseSpdx || "N/A"}</p>
            <p>Branch Protection: {formatBoolean(data.securityCompliance.branchProtectionEnabled)}</p>
            <p>Status Checks Required: {formatBoolean(data.securityCompliance.requiredStatusChecksEnabled)}</p>
            <p>Dependabot Alerts: {formatMaybeNumber(data.securityCompliance.dependabotOpenAlerts)}</p>
            <p>Code Scanning Alerts: {formatMaybeNumber(data.securityCompliance.codeScanningOpenAlerts)}</p>
            <p>Secret Scanning Alerts: {formatMaybeNumber(data.securityCompliance.secretScanningOpenAlerts)}</p>
          </div>
        </article>
      </section>

      <section className="mt-4">
        <article className={`${PANEL_CLASS} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Production Decision</h2>
          <p className="mt-3 text-sm text-slate-700">
            Decision: <span className="font-semibold text-slate-900">{data.productionDecision.decision}</span> | Risk:{" "}
            <span className="font-semibold text-slate-900">{data.productionDecision.riskLevel}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Confidence: {formatMaybeNumber(data.productionDecision.confidence)} | Minimum required:{" "}
            {formatMaybeNumber(data.productionDecision.minConfidenceRequired)}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Blockers</h3>
              <ul className="mt-2 space-y-2">
                {(data.productionDecision.blockers.length
                  ? data.productionDecision.blockers
                  : ["No blockers provided."]).map((item) => (
                  <li key={item} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Reasons</h3>
              <ul className="mt-2 space-y-2">
                {(data.productionDecision.reasons.length
                  ? data.productionDecision.reasons
                  : ["No reasons provided."]).map((item) => (
                  <li key={item} className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
